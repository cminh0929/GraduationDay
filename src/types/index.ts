export interface Guest {
  id: string;
  linkId: string;
  code: string;
  guestName: string;
  salutation?: string; // e.g. "Bạn", "Anh", "Chị", "Thầy/Cô", "Gia đình"
  isActive: boolean;
  createdAt: string;
  openedCount: number;
  lastOpenedAt?: string;
  rsvpStatus?: 'attending' | 'maybe' | 'remote' | 'wish';
  rsvpMessage?: string;
  rsvpUpdatedAt?: string;
}

export interface ResolveResponse {
  valid: boolean;
  message?: string;
  guest?: {
    id: string;
    linkId: string;
    code: string;
    guestName: string;
    salutation?: string;
    rsvpStatus?: 'attending' | 'maybe' | 'remote' | 'wish';
    rsvpMessage?: string;
  };
}

export interface AdminLoginResponse {
  success: boolean;
  token?: string;
  message?: string;
}

export interface RsvpPayload {
  code: string;
  status: 'attending' | 'maybe' | 'remote' | 'wish';
  message?: string;
}
