import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { EVENT_CONFIG } from '../config/event.ts';
import { MapPin, Navigation, Compass, Car, Phone, ExternalLink } from 'lucide-react';

export const LocationSection: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();
  const phone = EVENT_CONFIG.student.phoneNumber || '0818864844';
  const displayPhone = EVENT_CONFIG.student.displayPhone || '0818 864 844';

  return (
    <motion.section
      id="location"
      initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto"
    >
      <div className="card-academic-gold-border rounded-2xl p-6 sm:p-10 shadow-md">
        {/* Header */}
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="text-center max-w-2xl mx-auto mb-8 sm:mb-10"
        >
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
        </motion.div>

        {/* Map & Guide Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Map Embed Frame (7 cols) - Stagger 100ms */}
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: shouldReduceMotion ? 0 : 0.1, ease: 'easeOut' }}
            className="lg:col-span-7 rounded-xl overflow-hidden border border-[#D6B274]/40 bg-slate-100 min-h-[320px] relative shadow-inner"
          >
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

            {/* Quick floating action with micro-interaction */}
            <div className="absolute bottom-3 right-3 z-10">
              <motion.a
                whileHover={shouldReduceMotion ? undefined : { scale: 1.03 }}
                whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
                transition={{ duration: 0.15 }}
                href={EVENT_CONFIG.location.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-white/95 backdrop-blur-xs text-[#15489D] hover:bg-[#15489D] hover:text-white text-xs font-medium rounded-md shadow-md transition-colors cursor-pointer border border-[#D6B274]/40"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Mở Google Maps</span>
              </motion.a>
            </div>
          </motion.div>

          {/* Guide Tips (5 cols) - Stagger 200ms */}
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: shouldReduceMotion ? 0 : 0.2, ease: 'easeOut' }}
            className="lg:col-span-5 flex flex-col justify-between space-y-5 bg-[#FAF7F0] p-6 rounded-xl border border-[#D6B274]/30"
          >
            <div>
              <h3 className="text-base font-serif font-bold text-[#15489D] mb-3">
                Chỉ dẫn dành cho khách mời
              </h3>
              <ul className="space-y-4 text-xs sm:text-sm text-slate-700">
                <li className="flex items-start gap-2.5">
                  <Car className="w-4 h-4 text-[#D6B274] shrink-0 mt-0.5" />
                  <div>
                    <span className="leading-relaxed">
                      <strong className="text-[#17243A]">Khu vực gửi xe:</strong> Vào theo cổng 7, hoặc đậu xe đối diện cổng 3 của trường (không biết cứ alo cho Minh đi).
                    </span>
                    {/* Bong bóng số điện thoại trực tiếp */}
                    <div className="mt-2.5">
                      <a
                        href={`tel:${phone}`}
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#15489D] hover:bg-[#0E3574] text-white rounded-full text-xs font-semibold shadow-xs transition-all hover:scale-105 active:scale-95 cursor-pointer border border-[#D6B274]/50 group"
                      >
                        <Phone className="w-3.5 h-3.5 text-[#F6DF99] group-hover:rotate-12 transition-transform animate-pulse" />
                        <span>Alo cho Minh: {displayPhone}</span>
                      </a>
                    </div>
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#E44735] shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-[#17243A]">Chú ý:</strong> 11h30 Mình vào hội trường mất rồi:&lt;&lt;
                  </span>
                </li>
              </ul>
            </div>

            <div className="pt-4 border-t border-[#D6B274]/30">
              <motion.a
                whileHover={shouldReduceMotion ? undefined : { scale: 1.02 }}
                whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
                transition={{ duration: 0.15 }}
                href={EVENT_CONFIG.location.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-[#15489D] hover:bg-[#113A7E] text-white text-xs sm:text-sm font-medium rounded-md shadow-2xs transition-colors cursor-pointer"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Xem đường đi trên Google Maps</span>
              </motion.a>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};
