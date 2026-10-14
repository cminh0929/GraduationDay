import express, { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

function getGuestsFilePath(): string {
  const candidates = [
    path.resolve(process.cwd(), 'data', 'guests.json'),
    path.resolve(__dirname, 'data', 'guests.json'),
    path.resolve(__dirname, '..', 'data', 'guests.json'),
  ];
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }
  return path.resolve(process.cwd(), 'data', 'guests.json');
}

// Ensure data directory exists if writable
try {
  const defaultDir = path.resolve(process.cwd(), 'data');
  if (!fs.existsSync(defaultDir)) {
    fs.mkdirSync(defaultDir, { recursive: true });
  }
} catch {
  // Read-only filesystem on serverless environments
}

interface GuestRecord {
  id: string;
  linkId: string;
  code: string;
  guestName: string;
  salutation?: string;
  isActive: boolean;
  createdAt: string;
  openedCount: number;
  lastOpenedAt?: string;
  rsvpStatus?: 'attending' | 'maybe' | 'remote' | 'wish';
  rsvpMessage?: string;
  rsvpUpdatedAt?: string;
}

function loadGuests(): GuestRecord[] {
  try {
    const dataFile = getGuestsFilePath();
    if (fs.existsSync(dataFile)) {
      const content = fs.readFileSync(dataFile, 'utf-8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.error('Failed reading guests file:', err);
  }
  return [];
}

function saveGuests(guests: GuestRecord[]): void {
  try {
    const dataFile = getGuestsFilePath();
    const dir = path.dirname(dataFile);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(dataFile, JSON.stringify(guests, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Filesystem write not persistent on serverless/read-only environment:', err);
  }
}

// Memory rate limit tracker for resolve endpoint
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || entry.resetAt < now) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 3 * 60 * 1000 }); // 3 min window
    return true;
  }
  if (entry.count >= 25) {
    return false; // exceeded rate limit
  }
  entry.count += 1;
  return true;
}

// Clean up stale rate limits every 10 mins
const cleanupTimer = setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of rateLimitMap.entries()) {
    if (entry.resetAt < now) {
      rateLimitMap.delete(ip);
    }
  }
}, 10 * 60 * 1000);
if (cleanupTimer.unref) {
  cleanupTimer.unref();
}

// CSPRNG code generator (CM-XXXXXX)
function generateGuestCode(): string {
  // Use un-ambiguous uppercase characters
  const alphabet = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  const bytes = crypto.randomBytes(6);
  let result = 'CM-';
  for (let i = 0; i < 6; i++) {
    result += alphabet[bytes[i] % alphabet.length];
  }
  return result;
}

function generateNextLinkId(guests: GuestRecord[]): string {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let id = '';
  let attempts = 0;
  do {
    const bytes = crypto.randomBytes(4);
    id = '';
    for (let i = 0; i < 4; i++) {
      id += chars[bytes[i] % chars.length];
    }
    attempts++;
  } while (guests.some((g) => g.linkId.toLowerCase() === id.toLowerCase()) && attempts < 50);

  return id;
}

function toPublicGuest(guest: GuestRecord) {
  return {
    id: guest.id,
    linkId: guest.linkId,
    code: guest.code,
    guestName: guest.guestName,
    salutation: guest.salutation || 'Bạn',
    rsvpStatus: guest.rsvpStatus,
    rsvpMessage: guest.rsvpMessage,
  };
}

function recordInvitationOpen(guest: GuestRecord, guests: GuestRecord[]) {
  guest.openedCount = (guest.openedCount || 0) + 1;
  guest.lastOpenedAt = new Date().toISOString();
  saveGuests(guests);
}

// Admin secret token must be supplied outside source control.
const ADMIN_PASSWORD = process.env.ADMIN_PIN?.trim();
const ACTIVE_ADMIN_TOKENS = new Set<string>();

function isValidAdminToken(token: string): boolean {
  if (!token) return false;
  if (ACTIVE_ADMIN_TOKENS.has(token)) return true;
  if (!ADMIN_PASSWORD) return false;
  try {
    const [payload, signature] = token.split('.');
    if (!payload || !signature) return false;
    const expectedSig = crypto.createHmac('sha256', ADMIN_PASSWORD).update(payload).digest('hex');
    if (signature === expectedSig) {
      const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf-8'));
      if (data.exp && data.exp > Date.now()) {
        return true;
      }
    }
  } catch {
    return false;
  }
  return false;
}

// Middleware to authenticate admin
function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace(/^Bearer\s+/i, '').trim();
  if (!isValidAdminToken(token)) {
    return res.status(401).json({ error: 'Phiên quản trị không hợp lệ hoặc đã hết hạn.' });
  }
  next();
}

/* ==========================================================================
   PUBLIC API ENDPOINTS
   ========================================================================== */

// 1. Resolve invitation code
app.post('/api/invitations/resolve', (req: Request, res: Response) => {
  const clientIp = req.headers['x-forwarded-for']?.toString() || req.socket.remoteAddress || 'unknown';
  const rawCode = (req.body?.code || '').toString().trim();
  if (!rawCode) {
    return res.status(400).json({
      valid: false,
      message: 'Vui lòng nhập mã thiệp mời của bạn.',
    });
  }

  // Normalize code
  const normalizedCode = rawCode.toUpperCase();
  const guests = loadGuests();

  const matched = guests.find((g) => g.code.toUpperCase() === normalizedCode && g.isActive);

  if (!matched) {
    if (!checkRateLimit(clientIp)) {
      return res.status(429).json({
        valid: false,
        message: 'Bạn đã thử quá nhiều lần. Vui lòng đợi 3 phút rồi thử lại nhé.',
      });
    }
    return res.json({
      valid: false,
      message: 'Mã thiệp mời chưa chính xác hoặc chưa được kích hoạt. Bạn vui lòng kiểm tra lại nhé.',
    });
  }

  // Update open count and timestamp
  recordInvitationOpen(matched, guests);

  return res.json({
    valid: true,
    guest: toPublicGuest(matched),
  });
});

// Resolve a personalized home URL such as /home/0001 or /home/9k2m.
app.get('/api/invitations/home/:linkId', (req: Request, res: Response) => {
  const clientIp = req.headers['x-forwarded-for']?.toString() || req.socket.remoteAddress || 'unknown';
  const linkId = (req.params.linkId || '').trim();
  if (!/^[a-zA-Z0-9]{4,12}$/.test(linkId)) {
    return res.status(404).json({
      valid: false,
      message: 'Liên kết thiệp mời chưa chính xác.',
    });
  }

  const guests = loadGuests();
  const matched = guests.find(
    (guest) => guest.linkId.toLowerCase() === linkId.toLowerCase() && guest.isActive
  );

  if (!matched) {
    if (!checkRateLimit(clientIp)) {
      return res.status(429).json({
        valid: false,
        message: 'Bạn đã thử quá nhiều liên kết. Vui lòng đợi 3 phút rồi thử lại nhé.',
      });
    }
    return res.status(404).json({
      valid: false,
      message: 'Liên kết thiệp mời chưa chính xác hoặc chưa được kích hoạt.',
    });
  }

  recordInvitationOpen(matched, guests);
  return res.json({ valid: true, guest: toPublicGuest(matched) });
});

// 2. Guest RSVP / Wishes
app.post('/api/invitations/rsvp', (req: Request, res: Response) => {
  const { code, status, message } = req.body || {};
  if (!code || !['attending', 'maybe', 'remote', 'wish'].includes(status)) {
    return res.status(400).json({ error: 'Dữ liệu phản hồi chưa hợp lệ.' });
  }

  const guests = loadGuests();
  const normalizedCode = code.toString().trim().toUpperCase();
  const matched = guests.find((g) => g.code.toUpperCase() === normalizedCode && g.isActive);

  if (!matched) {
    return res.status(404).json({ error: 'Không tìm thấy thiệp mời này.' });
  }

  matched.rsvpStatus = status;
  matched.rsvpMessage = (message || '').toString().slice(0, 1000);
  matched.rsvpUpdatedAt = new Date().toISOString();
  saveGuests(guests);

  return res.json({
    success: true,
    message: 'Cảm ơn bạn đã phản hồi! Minh rất trân trọng tình cảm của bạn.',
    guest: {
      id: matched.id,
      code: matched.code,
      guestName: matched.guestName,
      salutation: matched.salutation,
      rsvpStatus: matched.rsvpStatus,
      rsvpMessage: matched.rsvpMessage,
    },
  });
});

/* ==========================================================================
   ADMIN API ENDPOINTS
   ========================================================================== */

// Admin login
app.post('/api/admin/login', (req: Request, res: Response) => {
  const { password } = req.body || {};
  if (!ADMIN_PASSWORD) {
    return res.status(503).json({
      success: false,
      message: 'Chưa cấu hình ADMIN_PIN trên máy chủ.',
    });
  }
  if (password === ADMIN_PASSWORD) {
    const payload = Buffer.from(
      JSON.stringify({ admin: true, exp: Date.now() + 7 * 24 * 60 * 60 * 1000 })
    ).toString('base64url');
    const signature = crypto.createHmac('sha256', ADMIN_PASSWORD).update(payload).digest('hex');
    const token = `${payload}.${signature}`;
    ACTIVE_ADMIN_TOKENS.add(token);
    return res.json({ success: true, token });
  }
  return res.status(401).json({ success: false, message: 'Mật khẩu quản trị chưa đúng.' });
});

// Get all guests (Admin only)
app.get('/api/admin/guests', requireAdmin, (req: Request, res: Response) => {
  const guests = loadGuests();
  return res.json({ guests });
});

// Create single guest
app.post('/api/admin/guests', requireAdmin, (req: Request, res: Response) => {
  const { guestName, salutation, customCode } = req.body || {};
  if (!guestName || !guestName.trim()) {
    return res.status(400).json({ error: 'Tên khách mời không được để trống.' });
  }

  const guests = loadGuests();
  let code = (customCode || '').trim().toUpperCase();

  if (!code) {
    // Generate unique CSPRNG code
    let tries = 0;
    do {
      code = generateGuestCode();
      tries++;
    } while (guests.some((g) => g.code.toUpperCase() === code) && tries < 20);
  } else {
    // Validate uniqueness
    if (guests.some((g) => g.code.toUpperCase() === code)) {
      return res.status(400).json({ error: 'Mã mời này đã tồn tại trong hệ thống.' });
    }
  }

  const newGuest: GuestRecord = {
    id: `guest_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    linkId: generateNextLinkId(guests),
    code,
    guestName: guestName.trim(),
    salutation: (salutation || 'Bạn').trim(),
    isActive: true,
    createdAt: new Date().toISOString(),
    openedCount: 0,
  };

  guests.unshift(newGuest);
  saveGuests(guests);

  return res.json({ success: true, guest: newGuest });
});

// Toggle or update guest
app.patch('/api/admin/guests/:id', requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const { guestName, salutation, isActive, code } = req.body || {};

  const guests = loadGuests();
  const guest = guests.find((g) => g.id === id);
  if (!guest) {
    return res.status(404).json({ error: 'Không tìm thấy khách mời.' });
  }

  if (typeof guestName === 'string' && guestName.trim()) {
    guest.guestName = guestName.trim();
  }
  if (typeof salutation === 'string') {
    guest.salutation = salutation.trim();
  }
  if (typeof isActive === 'boolean') {
    guest.isActive = isActive;
  }
  if (typeof code === 'string' && code.trim()) {
    const newCode = code.trim().toUpperCase();
    if (guests.some((g) => g.id !== id && g.code.toUpperCase() === newCode)) {
      return res.status(400).json({ error: 'Mã mới đã trùng với khách mời khác.' });
    }
    guest.code = newCode;
  }

  saveGuests(guests);
  return res.json({ success: true, guest });
});

// Delete guest
app.delete('/api/admin/guests/:id', requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  let guests = loadGuests();
  const exists = guests.some((g) => g.id === id);
  if (!exists) {
    return res.status(404).json({ error: 'Không tìm thấy khách mời.' });
  }

  guests = guests.filter((g) => g.id !== id);
  saveGuests(guests);
  return res.json({ success: true, message: 'Đã xóa khách mời.' });
});

// Bulk import guests
app.post('/api/admin/bulk-import', requireAdmin, (req: Request, res: Response) => {
  const { items } = req.body || {};
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Danh sách nhập trống.' });
  }

  const guests = loadGuests();
  const added: GuestRecord[] = [];

  for (const item of items) {
    const name = (item.guestName || item.name || '').trim();
    if (!name) continue;

    let code = (item.code || '').trim().toUpperCase();
    if (!code || guests.some((g) => g.code.toUpperCase() === code)) {
      code = generateGuestCode();
    }

    const newGuest: GuestRecord = {
      id: `guest_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      linkId: generateNextLinkId(guests),
      code,
      guestName: name,
      salutation: (item.salutation || 'Bạn').trim(),
      isActive: true,
      createdAt: new Date().toISOString(),
      openedCount: 0,
    };

    guests.unshift(newGuest);
    added.push(newGuest);
  }

  saveGuests(guests);
  return res.json({ success: true, count: added.length, guests: added });
});

/* ==========================================================================
   VITE DEV MIDDLEWARE / STATIC PRODUCTION SERVING
   ========================================================================== */

async function startServer() {
  const PORT = Number(process.env.PORT) || 3000;

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Graduation 2026 App] Server running at http://0.0.0.0:${PORT}`);
  });
}

export { app, startServer };
export default app;

if (!process.env.VERCEL && !process.env.AWS_LAMBDA_FUNCTION_NAME) {
  startServer().catch((err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
  });
}
