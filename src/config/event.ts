/**
 * Central event configuration for Graduation 2026
 * All event dates, locations, links and metadata are strictly defined here.
 */

export interface EventConfig {
  student: {
    fullName: string;
    displayName: string;
    englishName: string;
    phoneNumber?: string;
    displayPhone?: string;
    faculty: string;
    facultyEnglish: string;
    major: string;
    majorEnglish: string;
    classCohort: string;
    degreeTitle: string;
    gitUsername: string;
    commitHash: string;
    branchName: string;
  };
  institution: {
    nameVi: string;
    nameEn: string;
    abbreviation: string;
    officialWebsite: string;
    facultyWebsite: string;
    brandfetchUrl: string;
  };
  event: {
    title: string;
    concept: string;
    dateIso: string; // "2026-10-17T09:00:00+07:00"
    dayOfWeek: string;
    displayDate: string;
    displayTime: string;
    timeZone: string;
  };
  location: {
    venueName: string;
    address: string;
    city: string;
    googleMapsUrl: string;
    googleMapsEmbedQuery: string;
    arrivalTips: string[];
  };
  closing: {
    quote: string;
    signer: string;
    subline: string;
  };
  palette: {
    primaryNavy: string;
    accentRed: string;
    champagneGold: string;
    paperWhite: string;
    darkNavy: string;
  };
}

export const EVENT_CONFIG: EventConfig = {
  student: {
    fullName: 'ĐẶNG CÔNG MINH',
    displayName: 'Đặng Công Minh',
    englishName: 'Dang Cong Minh',
    phoneNumber: '0818864844',
    displayPhone: '0818 864 844',
    faculty: 'Khoa Công nghệ thông tin',
    facultyEnglish: 'Faculty of Information Technology',
    major: 'Khoa học máy tính',
    majorEnglish: 'Computer Science',
    classCohort: 'Graduation Class of 2026',
    degreeTitle: 'Cử nhân Khoa học máy tính (B.Sc. in Computer Science)',
    gitUsername: 'cminh',
    commitHash: '2026a10f8f12',
    branchName: 'origin/main -> real_world',
  },
  institution: {
    nameVi: 'TRƯỜNG ĐẠI HỌC TÔN ĐỨC THẮNG',
    nameEn: 'Ton Duc Thang University',
    abbreviation: 'TDTU',
    officialWebsite: 'https://tdtu.edu.vn',
    facultyWebsite: 'https://it.tdtu.edu.vn',
    brandfetchUrl: 'https://brandfetch.com/tdtu.edu.vn',
  },
  event: {
    title: 'Lễ tốt nghiệp 2026',
    concept: 'THE FINAL COMMIT — GRADUATION 2026',
    dateIso: '2026-10-17T09:00:00+07:00',
    dayOfWeek: 'Thứ Bảy',
    displayDate: '17.10.2026',
    displayTime: '09:00 AM',
    timeZone: 'Asia/Ho_Chi_Minh (UTC+07:00)',
  },
  location: {
    venueName: 'Trường Đại học Tôn Đức Thắng',
    address: '19 Nguyễn Hữu Thọ, Phường Tân Hưng, TP. Hồ Chí Minh',
    city: 'TP. Hồ Chí Minh',
    googleMapsUrl: 'https://maps.app.goo.gl/beoX2ALAzJoedg4Z7',
    googleMapsEmbedQuery: 'Trường Đại học Tôn Đức Thắng, 19 Nguyễn Hữu Thọ, Tân Hưng, Hồ Chí Minh',
    arrivalTips: [
      'Khu vực gửi xe: Vào theo cổng 7, hoặc đậu xe đối diện cổng 3 của trường (không biết cứ alo cho Minh đi).',
      'Nên đến trước 15–30 phút để chuẩn bị và chụp ảnh lưu niệm cùng tân cử nhân.',
      'Trang phục lịch sự, trang nhã để có những bức ảnh kỷ niệm đẹp nhất.',
    ],
  },
  closing: {
    quote: 'Thanh xuân là những ngày tháng không thể quay lại. Cảm ơn bạn vì đã là một phần trong hành trình đáng nhớ này. Sự hiện diện của bạn sẽ khiến ngày tốt nghiệp của mình thêm trọn vẹn.',
    signer: 'Đặng Công Minh',
    subline: 'Class of 2026 · Computer Science · TDTU',
  },
  palette: {
    primaryNavy: '#15489D',
    accentRed: '#E44735',
    champagneGold: '#D6B274',
    paperWhite: '#F8F5EF',
    darkNavy: '#17243A',
  },
};
