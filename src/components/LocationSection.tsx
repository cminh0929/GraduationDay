import React from 'react';
import { EVENT_CONFIG } from '../config/event.ts';
import { MapPin, Navigation, Compass, Car, Clock, ExternalLink } from 'lucide-react';

export const LocationSection: React.FC = () => {
  return (
    <section id="location" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <div className="card-academic-gold-border rounded-2xl p-6 sm:p-10 shadow-md">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono tracking-widest text-[#15489D] uppercase mb-2">
            <Compass className="w-3.5 h-3.5 text-[#D6B274]" />
            <span>ĐỊA ĐIỂM TỔ CHỨC</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#17243A]">
            {EVENT_CONFIG.location.venueName}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2 flex items-center justify-center gap-1.5 flex-wrap">
            <MapPin className="w-4 h-4 text-[#E44735] shrink-0" />
            <span>{EVENT_CONFIG.location.address}</span>
          </p>
        </div>

        {/* Map & Guide Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Map Embed Frame (7 cols) */}
          <div className="lg:col-span-7 rounded-xl overflow-hidden border border-[#D6B274]/40 bg-slate-100 min-h-[320px] relative shadow-inner">
            <iframe
              title="Google Map TDTU Campus"
              width="100%"
              height="100%"
              className="min-h-[320px] w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://maps.google.com/maps?q=${encodeURIComponent(
                EVENT_CONFIG.location.googleMapsEmbedQuery
              )}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
            />

            {/* Quick floating action */}
            <div className="absolute bottom-3 right-3 z-10">
              <a
                href={EVENT_CONFIG.location.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-white/95 backdrop-blur-xs text-[#15489D] hover:bg-[#15489D] hover:text-white text-xs font-medium rounded-md shadow-md transition-colors cursor-pointer border border-[#D6B274]/40"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Mở Google Maps</span>
              </a>
            </div>
          </div>

          {/* Guide Tips (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-5 bg-[#FAF7F0] p-6 rounded-xl border border-[#D6B274]/30">
            <div>
              <h3 className="text-base font-serif font-bold text-[#15489D] mb-3">
                Chỉ dẫn dành cho khách mời
              </h3>
              <ul className="space-y-3 text-xs sm:text-sm text-slate-700">
                <li className="flex items-start gap-2.5">
                  <Car className="w-4 h-4 text-[#D6B274] shrink-0 mt-0.5" />
                  <span>
                    <strong>Khu vực gửi xe:</strong> Vào theo cổng chính 19 Nguyễn Hữu Thọ, hoặc cổng đường Lê Văn Lương (dành cho cả xe máy và ô tô).
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Clock className="w-4 h-4 text-[#D6B274] shrink-0 mt-0.5" />
                  <span>
                    <strong>Khung giờ khuyên nghị:</strong> Nên có mặt trước 08:30 sáng để thuận tiện gửi xe và chụp ảnh lưu niệm cùng tân cử nhân.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#E44735] shrink-0 mt-0.5" />
                  <span>
                    <strong>Khuôn viên trường:</strong> Khu vực sảnh chính và quảng trường trung tâm là nơi lý tưởng để lưu giữ những bức ảnh kỷ niệm.
                  </span>
                </li>
              </ul>
            </div>

            <div className="pt-4 border-t border-[#D6B274]/30">
              <a
                href={EVENT_CONFIG.location.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-[#15489D] hover:bg-[#113A7E] text-white text-xs sm:text-sm font-medium rounded-md shadow-2xs transition-colors cursor-pointer"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Xem đường đi trên Google Maps</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
