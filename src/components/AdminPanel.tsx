import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { Guest } from '../types/index.ts';
import { getGuestInvitationUrl, isLocalUrl } from '../config/guestUrl.ts';
import {
  X,
  Lock,
  UserPlus,
  Copy,
  Check,
  Download,
  Trash2,
  RefreshCw,
  Search,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  Loader2,
  QrCode,
} from 'lucide-react';

interface GuestQrModalProps {
  guest: Guest;
  onClose: () => void;
}

const GuestQrModal: React.FC<GuestQrModalProps> = ({ guest, onClose }) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const destinationUrl = getGuestInvitationUrl(guest.linkId);
  const isLocal = isLocalUrl(destinationUrl);

  useEffect(() => {
    let isCurrent = true;
    setIsGenerating(true);

    QRCode.toDataURL(destinationUrl, {
      width: 280,
      margin: 2,
      color: {
        dark: '#15489D',
        light: '#FFFFFF',
      },
    })
      .then((url) => {
        if (isCurrent) {
          setQrDataUrl(url);
          setIsGenerating(false);
        }
      })
      .catch((err) => {
        console.error('Failed to generate QR code', err);
        if (isCurrent) setIsGenerating(false);
      });

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      isCurrent = false;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [destinationUrl, onClose]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(destinationUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleDownloadPng = async () => {
    try {
      setIsDownloading(true);
      // High resolution export (1000x1000px)
      const highResDataUrl = await QRCode.toDataURL(destinationUrl, {
        width: 1000,
        margin: 3,
        color: {
          dark: '#15489D',
          light: '#FFFFFF',
        },
      });

      const safeName = guest.guestName
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');

      const filename = `graduation-qr-${guest.linkId}-${safeName || 'guest'}.png`;

      const link = document.createElement('a');
      link.href = highResDataUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Failed to download QR code', err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl w-full max-w-sm sm:max-w-md shadow-2xl border border-[#D6B274]/40 overflow-hidden my-auto flex flex-col animate-fadeIn"
      >
        {/* Header */}
        <div className="px-5 py-4 bg-[#17243A] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <QrCode className="w-5 h-5 text-[#D6B274]" />
            <div>
              <h3 className="text-sm sm:text-base font-serif font-bold text-white leading-tight">
                Mã QR thiệp mời
              </h3>
              <p className="text-[11px] text-slate-300">
                Quét mã để mở thiệp mời cá nhân hóa
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-md transition-colors cursor-pointer"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 text-center space-y-4">
          {/* Guest Identity */}
          <div className="space-y-0.5">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
              Khách mời · Mã {guest.code}
            </span>
            <h4 className="text-lg sm:text-xl font-serif font-bold text-[#15489D]">
              {guest.salutation && guest.salutation !== 'Bạn' && (
                <span className="text-slate-600 font-normal italic text-sm mr-1">
                  {guest.salutation}
                </span>
              )}
              {guest.guestName}
            </h4>
          </div>

          {/* Inactive Notice */}
          {!guest.isActive && (
            <div className="p-2.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-start gap-2 text-left">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
              <span>
                <strong>Mã mời đang vô hiệu hóa (Disabled):</strong> Khách quét mã sẽ chưa thể xem thiệp nếu chưa được kích hoạt lại trong bảng quản trị.
              </span>
            </div>
          )}

          {/* Large QR Display Container */}
          <div className="relative mx-auto w-64 h-64 sm:w-72 sm:h-72 p-3 bg-white rounded-xl border border-[#D6B274]/40 shadow-xs flex items-center justify-center">
            {isGenerating ? (
              <div className="flex flex-col items-center justify-center text-slate-400 space-y-2">
                <Loader2 className="w-8 h-8 animate-spin text-[#15489D]" />
                <span className="text-xs font-mono">Đang tạo mã QR...</span>
              </div>
            ) : qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt={`Mã QR thiệp mời của ${guest.guestName}`}
                className="w-full h-full object-contain select-none"
              />
            ) : (
              <span className="text-xs text-red-500 font-mono">
                Không thể tạo mã QR.
              </span>
            )}
          </div>

          {/* Destination URL Display */}
          <div className="space-y-1 text-left">
            <div className="flex items-center justify-between text-[11px] text-slate-500">
              <span className="font-mono text-[#15489D] font-semibold">/home/{guest.linkId}</span>
              <span className="text-slate-400">Đích đến</span>
            </div>
            <div className="flex items-center gap-1.5 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-700 break-all select-all">
              <span className="truncate flex-1">{destinationUrl}</span>
            </div>
          </div>

          {/* Localhost Warning */}
          {isLocal && (
            <div className="p-2 bg-amber-50 border border-amber-200 rounded-lg text-[11px] text-amber-800 text-left">
              ⚠️ <strong>Lưu ý:</strong> Liên kết đang trỏ về <code className="font-mono font-bold">localhost</code>. Khách mời quét bằng điện thoại ngoài máy tính này sẽ không truy cập được. Để khách mời quét từ xa, hãy cấu hình <code className="font-mono font-bold">VITE_INVITE_BASE_URL</code> trong file <code className="font-mono font-bold">.env</code>.
            </div>
          )}

          {/* Actions */}
          <div className="grid grid-cols-2 gap-2.5 pt-2">
            <button
              onClick={handleDownloadPng}
              disabled={isDownloading || !qrDataUrl}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 bg-[#15489D] hover:bg-[#113A7E] text-white text-xs font-medium rounded-lg transition-colors cursor-pointer shadow-xs disabled:opacity-60"
            >
              {isDownloading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Đang tải...</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Tải QR PNG</span>
                </>
              )}
            </button>

            <button
              onClick={handleCopyLink}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 bg-white border border-slate-300 hover:border-[#15489D] text-slate-700 hover:text-[#15489D] text-xs font-medium rounded-lg transition-colors cursor-pointer shadow-xs"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Đã sao chép</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Sao chép liên kết</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCodeToTest?: (code: string) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  isOpen,
  onClose,
  onSelectCodeToTest,
}) => {
  const [token, setToken] = useState<string>(() => sessionStorage.getItem('admin_token') || '');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [guests, setGuests] = useState<Guest[]>([]);
  const [isLoadingGuests, setIsLoadingGuests] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Selected guest for QR Modal preview
  const [selectedQrGuest, setSelectedQrGuest] = useState<Guest | null>(null);

  // New guest form
  const [newGuestName, setNewGuestName] = useState('');
  const [newGuestSalutation, setNewGuestSalutation] = useState('Bạn');
  const [customCode, setCustomCode] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [addMessage, setAddMessage] = useState('');
  const [lastCreatedGuest, setLastCreatedGuest] = useState<Guest | null>(null);

  // Feedback states
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Fetch guests if authenticated
  const fetchGuests = async (authToken: string) => {
    setIsLoadingGuests(true);
    try {
      const res = await fetch('/api/admin/guests', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        setGuests(data.guests || []);
      } else if (res.status === 401) {
        setToken('');
        sessionStorage.removeItem('admin_token');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingGuests(false);
    }
  };

  useEffect(() => {
    if (isOpen && token) {
      fetchGuests(token);
    }
  }, [isOpen, token]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();

      if (res.ok && data.success && data.token) {
        setToken(data.token);
        sessionStorage.setItem('admin_token', data.token);
        setPassword('');
        fetchGuests(data.token);
      } else {
        setLoginError(data.message || 'Mật khẩu quản trị chưa đúng.');
      }
    } catch {
      setLoginError('Lỗi kết nối máy chủ.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    setToken('');
    sessionStorage.removeItem('admin_token');
    setGuests([]);
    setSelectedQrGuest(null);
  };

  const handleAddGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGuestName.trim()) return;

    setIsAdding(true);
    setAddMessage('');
    setLastCreatedGuest(null);

    try {
      const res = await fetch('/api/admin/guests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          guestName: newGuestName.trim(),
          salutation: newGuestSalutation,
          customCode: customCode.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setGuests((prev) => [data.guest, ...prev]);
        setNewGuestName('');
        setCustomCode('');
        setLastCreatedGuest(data.guest);
        setAddMessage(`Đã tạo link /home/${data.guest.linkId} cho ${data.guest.guestName}`);
        setTimeout(() => setAddMessage(''), 6000);
      } else {
        setAddMessage(data.error || 'Lỗi khi tạo mã.');
      }
    } catch {
      setAddMessage('Lỗi kết nối máy chủ.');
    } finally {
      setIsAdding(false);
    }
  };

  const handleToggleActive = async (guest: Guest) => {
    try {
      const res = await fetch(`/api/admin/guests/${guest.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isActive: !guest.isActive }),
      });
      if (res.ok) {
        setGuests((prev) =>
          prev.map((g) => (g.id === guest.id ? { ...g, isActive: !g.isActive } : g))
        );
        // Also update selected QR guest if currently opened
        setSelectedQrGuest((prev) =>
          prev && prev.id === guest.id ? { ...prev, isActive: !prev.isActive } : prev
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteGuest = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa mã mời này?')) return;
    try {
      const res = await fetch(`/api/admin/guests/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setGuests((prev) => prev.filter((g) => g.id !== id));
        if (selectedQrGuest?.id === id) setSelectedQrGuest(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const copyToClipboard = (text: string, identifier: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(identifier);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const exportCsv = () => {
    if (guests.length === 0) return;
    const headers = ['Link ID', 'Mã Mời', 'Xưng Hô', 'Tên Khách', 'Link Trực Tiếp', 'Trạng Thái', 'Lượt Mở', 'RSVP', 'Lời Chúc'];
    const rows = guests.map((g) => [
      g.linkId,
      g.code,
      g.salutation || '',
      `"${g.guestName.replace(/"/g, '""')}"`,
      getGuestInvitationUrl(g.linkId),
      g.isActive ? 'Kích hoạt' : 'Vô hiệu hóa',
      g.openedCount || 0,
      g.rsvpStatus || 'Chưa phản hồi',
      `"${(g.rsvpMessage || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `danh_sach_khach_moi_tot_nghiep_2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isOpen) return null;

  const filteredGuests = guests.filter(
    (g) =>
      g.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.linkId.includes(searchQuery)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-[#17243A] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-[#D6B274]" />
            <div>
              <h2 className="text-base font-serif font-bold text-white leading-tight">
                Quản Trị Thiệp Mời Tốt Nghiệp 2026
              </h2>
              <p className="text-[11px] font-mono text-slate-400">
                Đặng Công Minh · Ton Duc Thang University
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-md transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 text-slate-800">
          {!token ? (
            /* Login view */
            <div className="max-w-md mx-auto py-8 text-center">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-[#15489D]">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-serif font-bold text-[#17243A]">
                Đăng nhập quản trị viên
              </h3>
              <p className="text-xs text-slate-500 mt-1 mb-6">
                Nhập mã bảo vệ để quản lý danh sách khách mời và phát hành mã riêng.
              </p>

              <form onSubmit={handleLogin} className="space-y-4">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nhập mã PIN quản trị"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-md text-sm outline-none focus:border-[#15489D] focus:ring-2 focus:ring-[#15489D]/20 text-center"
                />

                {loginError && (
                  <div className="flex items-center justify-center gap-1.5 text-xs text-[#E44735]">
                    <AlertCircle className="w-4 h-4" />
                    <span>{loginError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-full py-2.5 bg-[#15489D] hover:bg-[#113A7E] text-white text-xs font-medium rounded-md transition-colors cursor-pointer disabled:opacity-60"
                >
                  {isLoggingIn ? 'Đang xác thực...' : 'Đăng nhập'}
                </button>
              </form>
            </div>
          ) : (
            /* Dashboard view */
            <div className="space-y-8">
              {/* Top stats & Actions */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
                <div className="flex items-center gap-4 text-xs">
                  <div>
                    <span className="text-slate-400">Tổng khách: </span>
                    <strong className="font-mono text-slate-800">{guests.length}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">Đã mở thiệp: </span>
                    <strong className="font-mono text-emerald-700">
                      {guests.filter((g) => (g.openedCount || 0) > 0).length}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400">Đã RSVP: </span>
                    <strong className="font-mono text-[#15489D]">
                      {guests.filter((g) => Boolean(g.rsvpStatus)).length}
                    </strong>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={exportCsv}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-md transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Xuất CSV</span>
                  </button>
                  <button
                    onClick={() => fetchGuests(token)}
                    className="p-1.5 text-slate-500 hover:text-slate-800 rounded-md transition-colors cursor-pointer"
                    title="Làm mới"
                  >
                    <RefreshCw className={`w-4 h-4 ${isLoadingGuests ? 'animate-spin' : ''}`} />
                  </button>
                  <button
                    onClick={handleLogout}
                    className="text-xs text-slate-400 hover:text-[#E44735] underline ml-2 cursor-pointer"
                  >
                    Đăng xuất
                  </button>
                </div>
              </div>

              {/* Form Add New Guest */}
              <div className="bg-slate-50 p-4 sm:p-5 rounded-xl border border-slate-200">
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-600 mb-3 flex items-center gap-1.5">
                  <UserPlus className="w-3.5 h-3.5 text-[#15489D]" />
                  <span>Thêm khách mời mới (Tạo mã CSPRNG ngẫu nhiên)</span>
                </h4>

                <form onSubmit={handleAddGuest} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                  <div className="sm:col-span-3">
                    <select
                      value={newGuestSalutation}
                      onChange={(e) => setNewGuestSalutation(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-xs outline-none focus:border-[#15489D]"
                    >
                      <option value="Bạn">Bạn</option>
                      <option value="Anh">Anh</option>
                      <option value="Chị">Chị</option>
                      <option value="Em">Em</option>
                      <option value="Gia đình">Gia đình</option>
                      <option value="Quý Thầy/Cô">Quý Thầy/Cô</option>
                    </select>
                  </div>

                  <div className="sm:col-span-5">
                    <input
                      type="text"
                      value={newGuestName}
                      onChange={(e) => setNewGuestName(e.target.value)}
                      placeholder="Họ và tên khách mời..."
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-xs outline-none focus:border-[#15489D]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      value={customCode}
                      onChange={(e) => setCustomCode(e.target.value.toUpperCase())}
                      placeholder="Tự chọn mã (hoặc để trống)"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-xs font-mono uppercase outline-none focus:border-[#15489D]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <button
                      type="submit"
                      disabled={isAdding || !newGuestName.trim()}
                      className="w-full py-2 bg-[#15489D] hover:bg-[#113A7E] text-white text-xs font-medium rounded-md transition-colors disabled:opacity-50 cursor-pointer shadow-2xs"
                    >
                      {isAdding ? 'Đang tạo...' : '+ Thêm khách'}
                    </button>
                  </div>
                </form>

                {addMessage && (
                  <div className="flex items-center gap-2 mt-2 text-xs">
                    <p className="text-emerald-700 font-medium">
                      {addMessage}
                    </p>
                    {lastCreatedGuest && (
                      <button
                        type="button"
                        onClick={() => setSelectedQrGuest(lastCreatedGuest)}
                        className="inline-flex items-center gap-1 text-[#15489D] font-semibold underline hover:text-[#113A7E] cursor-pointer"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                        <span>Xem mã QR</span>
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Guest List with Search */}
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-4">
                  <div className="relative flex-1 max-w-xs">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Tìm theo tên hoặc mã..."
                      className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs outline-none focus:border-[#15489D] focus:bg-white"
                    />
                  </div>
                  <span className="text-xs text-slate-400">
                    Hiển thị {filteredGuests.length}/{guests.length} khách
                  </span>
                </div>

                {/* Table */}
                <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
                        <tr>
                          <th className="py-2.5 px-3">LINK / MÃ MỜI</th>
                          <th className="py-2.5 px-3">XƯNG HÔ</th>
                          <th className="py-2.5 px-3">TÊN KHÁCH MỜI</th>
                          <th className="py-2.5 px-3">TRẠNG THÁI</th>
                          <th className="py-2.5 px-3">LƯỢT MỞ</th>
                          <th className="py-2.5 px-3">RSVP &amp; LỜI CHÚC</th>
                          <th className="py-2.5 px-3 text-right">THAO TÁC</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-normal">
                        {filteredGuests.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="py-8 text-center text-slate-400">
                              Không tìm thấy khách mời phù hợp.
                            </td>
                          </tr>
                        ) : (
                          filteredGuests.map((guest) => {
                            const directUrl = getGuestInvitationUrl(guest.linkId);

                            return (
                              <tr
                                key={guest.id}
                                className={`hover:bg-slate-50/80 transition-colors ${
                                  !guest.isActive ? 'opacity-50' : ''
                                }`}
                              >
                                <td className="py-2.5 px-3 font-mono font-semibold text-[#15489D]">
                                  <span className="block">/home/{guest.linkId}</span>
                                  <span className="block text-[10px] font-normal text-slate-400">{guest.code}</span>
                                </td>
                                <td className="py-2.5 px-3 text-slate-500">
                                  {guest.salutation || 'Bạn'}
                                </td>
                                <td className="py-2.5 px-3 font-medium text-slate-800">
                                  {guest.guestName}
                                </td>
                                <td className="py-2.5 px-3">
                                  <button
                                    onClick={() => handleToggleActive(guest)}
                                    className={`px-2 py-0.5 rounded text-[10px] font-mono cursor-pointer ${
                                      guest.isActive
                                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                        : 'bg-red-50 text-red-700 border border-red-200'
                                    }`}
                                  >
                                    {guest.isActive ? 'Active' : 'Disabled'}
                                  </button>
                                </td>
                                <td className="py-2.5 px-3 font-mono tabular-nums text-slate-600">
                                  {guest.openedCount || 0}
                                </td>
                                <td className="py-2.5 px-3 max-w-[200px]">
                                  {guest.rsvpStatus ? (
                                    <div>
                                      <span className="font-semibold text-slate-700">
                                        {guest.rsvpStatus === 'attending'
                                          ? '🎉 Chắc chắn đến'
                                          : guest.rsvpStatus === 'maybe'
                                          ? '⏳ Chưa chắc chắn'
                                          : guest.rsvpStatus === 'remote'
                                          ? '💌 Chúc mừng từ xa'
                                          : '💛 Đã gửi lời chúc'}
                                      </span>
                                      {guest.rsvpMessage && (
                                        <p className="text-[11px] text-slate-500 truncate" title={guest.rsvpMessage}>
                                          "{guest.rsvpMessage}"
                                        </p>
                                      )}
                                    </div>
                                  ) : (
                                    <span className="text-slate-400 text-[11px]">Chưa phản hồi</span>
                                  )}
                                </td>
                                <td className="py-2.5 px-3 text-right">
                                  <div className="inline-flex items-center gap-1.5">
                                    {/* 1. Test this card in app */}
                                    {onSelectCodeToTest && (
                                      <button
                                        onClick={() => {
                                          onSelectCodeToTest(guest.code);
                                          onClose();
                                        }}
                                        className="p-1 text-slate-400 hover:text-[#15489D] rounded cursor-pointer transition-colors"
                                        title="Xem thiệp này"
                                      >
                                        <ExternalLink className="w-3.5 h-3.5" />
                                      </button>
                                    )}

                                    {/* 2. Copy direct link */}
                                    <button
                                      onClick={() => copyToClipboard(directUrl, `url_${guest.id}`)}
                                      className="p-1 text-slate-400 hover:text-[#15489D] rounded cursor-pointer transition-colors"
                                      title="Sao chép link cá nhân hóa"
                                    >
                                      {copiedId === `url_${guest.id}` ? (
                                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                                      ) : (
                                        <Copy className="w-3.5 h-3.5" />
                                      )}
                                    </button>

                                    {/* 3. View QR Code */}
                                    <button
                                      onClick={() => setSelectedQrGuest(guest)}
                                      className="p-1 text-slate-400 hover:text-[#15489D] rounded cursor-pointer transition-colors"
                                      title="Mã QR thiệp mời"
                                    >
                                      <QrCode className="w-3.5 h-3.5" />
                                    </button>

                                    {/* 4. Delete guest */}
                                    <button
                                      onClick={() => handleDeleteGuest(guest.id)}
                                      className="p-1 text-slate-400 hover:text-[#E44735] rounded cursor-pointer transition-colors"
                                      title="Xóa"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Guest QR Code Preview Modal */}
      {selectedQrGuest && (
        <GuestQrModal
          guest={selectedQrGuest}
          onClose={() => setSelectedQrGuest(null)}
        />
      )}
    </div>
  );
};
