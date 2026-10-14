# THE FINAL COMMIT — GRADUATION 2026
## Website Thiệp Mời Tốt Nghiệp Cá Nhân Hóa — Đặng Công Minh (TDTU)

Website thiệp mời tốt nghiệp cá nhân hóa cho **Đặng Công Minh**, sinh viên ngành Khoa học máy tính, Khoa Công nghệ thông tin tại **Trường Đại học Tôn Đức Thắng (TDTU)**.

Concept: **"THE FINAL COMMIT — GRADUATION 2026"**

---

## 1. Thông Tin Sự Kiện (Cố Định)

- **Họ tên sinh viên:** ĐẶNG CÔNG MINH
- **Trường:** TRƯỜNG ĐẠI HỌC TÔN ĐỨC THẮNG (Ton Duc Thang University - TDTU)
- **Khoa:** Khoa Công nghệ thông tin
- **Ngành:** Khoa học máy tính
- **Sự kiện:** Lễ tốt nghiệp 2026
- **Thời gian:** 09:00 AM — Thứ Bảy, 17/10/2026 (Múi giờ Asia/Ho_Chi_Minh UTC+07:00)
- **Địa chỉ:** 19 Nguyễn Hữu Thọ, Phường Tân Hưng, TP. Hồ Chí Minh
- **Google Maps:** [https://maps.app.goo.gl/beoX2ALAzJoedg4Z7](https://maps.app.goo.gl/beoX2ALAzJoedg4Z7)

---

## 2. Các Tính Năng Chính

1. **Invitation Entrance (Cổng Mở Thiệp):**
   - Phong bì phong cách hoàng gia/học thuật với dấu sáp niêm phong TDTU 2026.
   - Ô nhập mã thiệp mời (`CM-XXXXXX`) với tính năng chuẩn hóa dữ liệu tự động.
   - Xác thực server-side bảo mật cao, rate-limiting chống dò mã (brute force).
   - Animation mở phong bì mượt mà kèm pháo giấy vàng kim (confetti) tinh tế.

2. **Personalized Invitation Card (Thiệp Cá Nhân Hóa):**
   - Hiển thị trang trọng: **TRÂN TRỌNG KÍNH MỜI [TÊN KHÁCH MỜI]**.
   - Typography Cormorant Garamond / Playfair Display sắc sảo, hỗ trợ trọn vẹn tiếng Việt có dấu.
   - Điểm nhấn công nghệ: "The Final Commit" với commit hash `commit 2026a10f8f12`, branch `origin/main -> real_world` thể hiện chất sinh viên Khoa học máy tính.
   - Nút "Lưu vào Google Calendar" thiết lập sẵn thời gian 09:00 AM, 17/10/2026 và địa điểm TDTU.

3. **Personalized Deep Link (Link Riêng Cho Từng Khách):**
   - Hỗ trợ gửi link qua Zalo, Messenger, SMS: `https://your-domain.com/home/0001`
   - Trang gốc `/` là trang chủ thông tin chung; đường dẫn `/home/:linkId` tự mở lời chào và thiệp cá nhân hóa.
   - Link cũ dạng `?code=CM-7K4M9P` vẫn được hỗ trợ để tương thích.
   - Khách mở link là thiệp tự động giải mã và mở ra tên khách ngay lập tức.
   - Không để lộ tên khách trên URL hay Open Graph tags.

4. **Countdown Clock (Đếm Ngược Thời Gian Thực):**
   - Đếm ngược chính xác đến `2026-10-17T09:00:00+07:00`.
   - Hiển thị 4 đơn vị: Ngày, Giờ, Phút, Giây với Tabular Numerals.
   - Trạng thái ngày diễn ra: `🎓 Ngày tốt nghiệp đã đến!`.
   - Trạng thái sau ngày tốt nghiệp: `Graduation Day — A Moment to Remember`.

5. **Location & Bản Đồ TDTU:**
   - Tên trường, địa chỉ chính xác, Google Maps nhúng và nút dẫn đường trực tiếp.
   - Chỉ dẫn thực tế: Cổng gửi xe, thời gian nên có mặt trước 15-30 phút để chụp ảnh lưu niệm.

6. **RSVP & Lời Chúc (Wishes):**
   - Khách mời có thể xác nhận tham dự ("Chắc chắn đến", "Chưa chắc chắn", "Chúc mừng từ xa").
   - Gửi lời nhắn chúc mừng gửi riêng cho Đặng Công Minh, được lưu trữ an toàn trên server.

7. **Trang Quản Trị (/admin):**
   - Bảo vệ bằng mã PIN server-side cấu hình qua biến môi trường `ADMIN_PIN`.
   - Thêm khách mời mới, tự động tạo mã CSPRNG không trùng lặp (`CM-XXXXXX`).
   - Sao chép mã hoặc sao chép link cá nhân hóa 1 chạm.
   - Xem thống kê lượt mở thiệp, trạng thái RSVP và lời chúc của từng khách.
   - Xuất danh sách khách mời ra file CSV.

---

## 3. Cài Đặt Và Chạy Ứng Dụng

### Yêu cầu:
- Node.js >= 18 hoặc Bun.

### Khởi chạy môi trường phát triển:
```bash
npm install
npm run dev
```
Dev server chạy tại: `http://localhost:3000`

### Build Production:
```bash
npm run build
npm start
```

---

## 4. Hướng Dẫn Quản Trị & Tạo Link Mời Từng Người

### Bước 1: Vào trang quản trị
- Nhấp vào nút **"Quản Trị"** ở thanh điều hướng hoặc ở chân trang (hoặc truy cập `/?admin=true`).
- Tạo tệp `.env` từ `.env.example`, đặt một mã PIN riêng trong biến `ADMIN_PIN`, rồi dùng mã đó để đăng nhập.

### Bước 2: Thêm khách mời
- Chọn xưng hô: `Bạn`, `Anh`, `Chị`, `Em`, `Gia đình`, `Quý Thầy/Cô`.
- Nhập họ và tên: ví dụ `Nguyễn Văn A`.
- Mã mời: Để trống để hệ thống tự sinh mã CSPRNG ngẫu nhiên (ví dụ `CM-7K4M9P`), hoặc nhập mã mong muốn.
- Nhấn **"+ Thêm khách"**.

### Bước 3: Gửi thiệp
- Nhấn nút **Copy** bên cạnh khách mời để lấy link trực tiếp:
  ```text
  https://dia-chi-web-cua-ban.com/home/0001
  ```
- Gửi link này qua Zalo/Facebook cho người nhận. Người nhận bấm vào sẽ thấy ngay thiệp mời dành riêng cho mình!

---

## 5. Hướng Dẫn Bổ Sung Tài Nguyên Ảnh Thực Tế Của TDTU

Thư mục lưu trữ: `/public/assets/tdtu/`

Nếu bạn có ảnh chụp chất lượng cao, vui lòng đặt vào các đường dẫn sau:
- `logo.svg` hoặc `logo.png`: Logo chính thức TDTU (đã có sẵn vector chuẩn).
- `portrait.jpg`: Ảnh chân dung tốt nghiệp của Đặng Công Minh.
- `campus.jpg`: Ảnh kiến trúc khuôn viên trường Đại học Tôn Đức Thắng (19 Nguyễn Hữu Thọ).

---

## 6. Cấu Hình Supabase (Tùy Chọn Khi Muốn Dùng PostgreSQL Remote)

Nếu muốn đồng bộ dữ liệu khách mời lên Supabase PostgreSQL thay vì file JSON server:
1. Tạo project trên [Supabase](https://supabase.com).
2. Tạo bảng `guests`:
   ```sql
   create table guests (
     id text primary key,
     code text unique not null,
     guest_name text not null,
     salutation text default 'Bạn',
     is_active boolean default true,
     opened_count integer default 0,
     last_opened_at timestamptz,
     rsvp_status text,
     rsvp_message text,
     created_at timestamptz default now()
   );
   ```
3. Thêm `SUPABASE_URL` và `SUPABASE_SERVICE_ROLE_KEY` vào `.env`.
