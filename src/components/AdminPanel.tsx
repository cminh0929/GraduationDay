import React, { useState, useEffect } from 'react';
import { Guest } from '../types/index.ts';
import {
  X,
  Lock,
  UserPlus,
  Copy,
  Check,
  Download,
  Trash2,
  Power,
  RefreshCw,
  Search,
  ExternalLink,
  MessageSquare,
  ShieldCheck,
  AlertCircle,
  Loader2,
} from 'lucide-react';

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

  // New guest form
  const [newGuestName, setNewGuestName] = useState('');
  const [newGuestSalutation, setNewGuestSalutation] = useState('Bạn');
  const [customCode, setCustomCode] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [addMessage, setAddMessage] = useState('');

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
  };

  const handleAddGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGuestName.trim()) return;

    setIsAdding(true);
    setAddMessage('');

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
        setAddMessage(`Đã tạo link /home/${data.guest.linkId} cho ${data.guest.guestName}`);
        setTimeout(() => setAddMessage(''), 4000);
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
    const origin = window.location.origin;
    const headers = ['Link ID', 'Mã Mời', 'Xưng Hô', 'Tên Khách', 'Link Trực Tiếp', 'Trạng Thái', 'Lượt Mở', 'RSVP', 'Lời Chúc'];
    const rows = guests.map((g) => [
      g.linkId,
      g.code,
      g.salutation || '',
      `"${g.guestName.replace(/"/g, '""')}"`,
      `${origin}/home/${g.linkId}`,
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
                  <p className="text-xs text-emerald-700 mt-2 font-medium">
                    {addMessage}
                  </p>
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
                            const origin = window.location.origin;
                            const directUrl = `${origin}/home/${guest.linkId}`;

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
                                    {/* Test this card in app */}
                                    {onSelectCodeToTest && (
                                      <button
                                        onClick={() => {
                                          onSelectCodeToTest(guest.code);
                                          onClose();
                                        }}
                                        className="p-1 text-slate-400 hover:text-[#15489D] rounded cursor-pointer"
                                        title="Xem thiệp này"
                                      >
                                        <ExternalLink className="w-3.5 h-3.5" />
                                      </button>
                                    )}

                                    {/* Copy direct link */}
                                    <button
                                      onClick={() => copyToClipboard(directUrl, `url_${guest.id}`)}
                                      className="p-1 text-slate-400 hover:text-[#15489D] rounded cursor-pointer"
                                      title="Sao chép link cá nhân hóa"
                                    >
                                      {copiedId === `url_${guest.id}` ? (
                                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                                      ) : (
                                        <Copy className="w-3.5 h-3.5" />
                                      )}
                                    </button>

                                    {/* Delete guest */}
                                    <button
                                      onClick={() => handleDeleteGuest(guest.id)}
                                      className="p-1 text-slate-400 hover:text-[#E44735] rounded cursor-pointer"
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
    </div>
  );
};
