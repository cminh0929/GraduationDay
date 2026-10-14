import React from 'react';

interface GraduationHeroIllustrationProps {
  className?: string;
}

export const GraduationHeroIllustration: React.FC<GraduationHeroIllustrationProps> = ({
  className = 'w-full max-w-[420px] aspect-[4/3]',
}) => {
  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      <svg
        viewBox="0 0 520 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-sm"
      >
        <defs>
          {/* Gradients for mortarboard */}
          <linearGradient id="capTopGrad" x1="170" y1="120" x2="350" y2="210" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#1E3A6E" />
            <stop offset="50%" stopColor="#152D56" />
            <stop offset="100%" stopColor="#0E1E3C" />
          </linearGradient>

          <linearGradient id="capUnderGrad" x1="220" y1="180" x2="290" y2="230" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#102040" />
            <stop offset="100%" stopColor="#081020" />
          </linearGradient>

          {/* Gradients for bottom book (Navy with IT spine) */}
          <linearGradient id="navyBookGrad" x1="130" y1="260" x2="390" y2="330" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#1B3360" />
            <stop offset="40%" stopColor="#15284C" />
            <stop offset="100%" stopColor="#0F1C36" />
          </linearGradient>

          {/* Gold tassel & accents */}
          <linearGradient id="goldGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#F9DF98" />
            <stop offset="50%" stopColor="#D6B274" />
            <stop offset="100%" stopColor="#B38942" />
          </linearGradient>

          {/* Book pages gradient */}
          <linearGradient id="pagesGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FAF7F0" />
            <stop offset="100%" stopColor="#EDE5D4" />
          </linearGradient>
        </defs>

        {/* ========================================================= */}
        {/* BACKGROUND: Classical Campus Arch & Line-Art Motif         */}
        {/* ========================================================= */}
        <g stroke="#D6B274" strokeOpacity="0.4" strokeWidth="1" fill="none">
          {/* Main decorative arch */}
          <path d="M120 310 V170 A140 140 0 0 1 400 170 V310" />
          <path d="M130 310 V170 A130 130 0 0 1 390 170 V310" strokeDasharray="3 3" />
          <path d="M145 310 V180 A115 115 0 0 1 375 180 V310" strokeOpacity="0.25" />

          {/* Keystone at arch top */}
          <polygon points="255,24 265,24 268,44 252,44" fill="#FCFAF6" stroke="#D6B274" strokeWidth="1" />
          <line x1="260" y1="16" x2="260" y2="24" stroke="#D6B274" />

          {/* Architectural background pillars / pediment hint */}
          <g strokeOpacity="0.2" strokeWidth="0.8">
            <line x1="165" y1="190" x2="165" y2="300" />
            <line x1="185" y1="200" x2="185" y2="300" />
            <line x1="335" y1="200" x2="335" y2="300" />
            <line x1="355" y1="190" x2="355" y2="300" />
            {/* Campus building horizontal moldings */}
            <line x1="150" y1="195" x2="370" y2="195" />
            <line x1="160" y1="210" x2="360" y2="210" />
          </g>
        </g>

        {/* Motto on the right side */}
        <g opacity="0.85">
          <text
            x="440"
            y="90"
            fontFamily="ui-serif, Georgia, Cambria, serif"
            fontSize="10"
            fontWeight="600"
            letterSpacing="0.22em"
            fill="#947229"
            textAnchor="middle"
          >
            TRI THỨC
          </text>
          <text
            x="440"
            y="108"
            fontFamily="ui-serif, Georgia, Cambria, serif"
            fontSize="10"
            fontWeight="600"
            letterSpacing="0.22em"
            fill="#947229"
            textAnchor="middle"
          >
            KIẾN TẠO
          </text>
          <text
            x="440"
            y="126"
            fontFamily="ui-serif, Georgia, Cambria, serif"
            fontSize="10"
            fontWeight="600"
            letterSpacing="0.22em"
            fill="#947229"
            textAnchor="middle"
          >
            TƯƠNG LAI
          </text>
          <line x1="420" y1="138" x2="460" y2="138" stroke="#D6B274" strokeWidth="0.8" opacity="0.6" />
        </g>

        {/* ========================================================= */}
        {/* STACK OF BOOKS                                            */}
        {/* ========================================================= */}

        {/* --- BOOK 1 (BOTTOM): Deep Navy Leather with "IT" Spine --- */}
        <g id="bookBottom">
          {/* Base shadow */}
          <ellipse cx="260" cy="336" rx="145" ry="12" fill="#000000" opacity="0.08" />

          {/* Book Spine */}
          <path
            d="M130 292 C130 286 138 282 150 282 L340 282 C345 282 350 284 350 288 L350 326 C350 330 345 332 340 332 L150 332 C138 332 130 328 130 322 Z"
            fill="url(#navyBookGrad)"
            stroke="#0C162B"
            strokeWidth="1.2"
          />

          {/* Gold bands on spine */}
          <line x1="140" y1="284" x2="140" y2="330" stroke="url(#goldGrad)" strokeWidth="2.5" />
          <line x1="146" y1="284" x2="146" y2="330" stroke="url(#goldGrad)" strokeWidth="1" strokeOpacity="0.7" />
          <line x1="334" y1="284" x2="334" y2="330" stroke="url(#goldGrad)" strokeWidth="1" strokeOpacity="0.7" />
          <line x1="340" y1="284" x2="340" y2="330" stroke="url(#goldGrad)" strokeWidth="2.5" />

          {/* Spine Title: IT */}
          <text
            x="240"
            y="312"
            fontFamily="ui-serif, Georgia, Cambria, serif"
            fontSize="15"
            fontWeight="bold"
            letterSpacing="0.25em"
            fill="#F6E7B8"
            stroke="#D6B274"
            strokeWidth="0.3"
            textAnchor="middle"
          >
            IT
          </text>

          {/* Pages block on the right */}
          <path
            d="M346 287 L385 272 L385 308 L346 324 Z"
            fill="url(#pagesGrad)"
            stroke="#D6C4A5"
            strokeWidth="0.8"
          />
          {/* Subtle page lines */}
          <line x1="352" y1="290" x2="380" y2="279" stroke="#CAB390" strokeWidth="0.6" strokeOpacity="0.6" />
          <line x1="352" y1="298" x2="380" y2="287" stroke="#CAB390" strokeWidth="0.6" strokeOpacity="0.6" />
          <line x1="352" y1="306" x2="380" y2="295" stroke="#CAB390" strokeWidth="0.6" strokeOpacity="0.6" />
          <line x1="352" y1="314" x2="380" y2="303" stroke="#CAB390" strokeWidth="0.6" strokeOpacity="0.6" />

          {/* Top cover trim */}
          <polygon
            points="145,282 342,282 385,272 188,272"
            fill="#1E386B"
            stroke="#0C162B"
            strokeWidth="0.8"
          />
        </g>

        {/* --- BOOK 2 (TOP): Warm Ivory / Gold Edged Volume --- */}
        <g id="bookTop">
          {/* Top book shadow */}
          <polygon points="146,270 340,270 380,258 186,258" fill="#000000" opacity="0.12" />

          {/* Spine of top book */}
          <path
            d="M142 248 C142 243 148 240 158 240 L345 240 C350 240 354 242 354 245 L354 274 C354 277 350 279 345 279 L158 279 C148 279 142 276 142 271 Z"
            fill="#FDFCF8"
            stroke="#D6B274"
            strokeWidth="1.2"
          />
          {/* Gold spine decorative line */}
          <line x1="152" y1="242" x2="152" y2="277" stroke="#D6B274" strokeWidth="1.5" />
          <line x1="336" y1="242" x2="336" y2="277" stroke="#D6B274" strokeWidth="1.5" />

          {/* Pages of top book */}
          <path
            d="M352 244 L378 232 L378 262 L352 274 Z"
            fill="url(#pagesGrad)"
            stroke="#D6C4A5"
            strokeWidth="0.8"
          />
          <line x1="356" y1="248" x2="374" y2="239" stroke="#CAB390" strokeWidth="0.5" strokeOpacity="0.7" />
          <line x1="356" y1="255" x2="374" y2="246" stroke="#CAB390" strokeWidth="0.5" strokeOpacity="0.7" />
          <line x1="356" y1="262" x2="374" y2="253" stroke="#CAB390" strokeWidth="0.5" strokeOpacity="0.7" />

          {/* Top book upper cover */}
          <polygon
            points="155,240 348,240 378,232 185,232"
            fill="#FFFFFF"
            stroke="#D6B274"
            strokeWidth="1"
          />

          {/* Bookmark ribbon sticking out */}
          <path
            d="M200 278 Q202 292 208 300 L204 302 L212 301 L214 294 Q208 288 206 278 Z"
            fill="#8B1E22"
            stroke="#681216"
            strokeWidth="0.5"
          />
        </g>

        {/* ========================================================= */}
        {/* GRADUATION MORTARBOARD (CAP)                               */}
        {/* ========================================================= */}
        <g id="graduationCap">
          {/* Cap drop shadow on top book */}
          <ellipse cx="265" cy="225" rx="85" ry="18" fill="#000000" opacity="0.16" />

          {/* Skull cap (under cap headband) */}
          <path
            d="M228 195 C228 212 242 226 265 226 C288 226 302 212 302 195 Z"
            fill="url(#capUnderGrad)"
            stroke="#0C162A"
            strokeWidth="1"
          />
          {/* Skull cap gold rim */}
          <path
            d="M232 200 C240 215 252 222 265 222 C278 222 290 215 298 200"
            stroke="#D6B274"
            strokeWidth="1"
            strokeOpacity="0.6"
            fill="none"
          />

          {/* Mortarboard Diamond Top */}
          <polygon
            points="265,116 385,166 265,206 145,156"
            fill="url(#capTopGrad)"
            stroke="#101D38"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />

          {/* Mortarboard Thickness / 3D Bevel edge */}
          <polygon
            points="145,156 265,206 265,212 145,162"
            fill="#0A1428"
            stroke="#081020"
            strokeWidth="1"
          />
          <polygon
            points="385,166 265,206 265,212 385,172"
            fill="#122240"
            stroke="#081020"
            strokeWidth="1"
          />

          {/* Central Gold Button */}
          <ellipse cx="265" cy="161" rx="5" ry="3.5" fill="url(#goldGrad)" stroke="#8C6E2E" strokeWidth="0.8" />

          {/* Golden Tassel: draping off right edge and resting over books */}
          <path
            d="M265 162 C295 168 335 185 348 202 C355 212 354 235 352 260"
            stroke="url(#goldGrad)"
            strokeWidth="3.2"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M265 162 C295 168 335 185 348 202 C355 212 354 235 352 260"
            stroke="#B58D43"
            strokeWidth="1"
            strokeDasharray="2 2"
            strokeLinecap="round"
            fill="none"
          />

          {/* Tassel Ring / Binding */}
          <rect x="348" y="248" width="8" height="4" rx="1.5" fill="#F8E5A7" stroke="#A67B2A" strokeWidth="0.6" />

          {/* Tassel Fringe / Brush */}
          <path
            d="M348 252 L345 288 C345 292 359 292 359 288 L356 252 Z"
            fill="url(#goldGrad)"
            stroke="#A67B2A"
            strokeWidth="0.8"
          />
          {/* Detailed tassel threads */}
          <line x1="349" y1="254" x2="348" y2="288" stroke="#8A631E" strokeWidth="0.7" />
          <line x1="352" y1="254" x2="352" y2="289" stroke="#FFE9A8" strokeWidth="0.7" />
          <line x1="355" y1="254" x2="356" y2="288" stroke="#8A631E" strokeWidth="0.7" />
        </g>

        {/* ========================================================= */}
        {/* BOTANICAL ACCENTS: Elegant Golden Ginkgo & Laurel Leaves */}
        {/* ========================================================= */}
        <g id="floralLeaves" fill="#D6B274" stroke="#B89047" strokeWidth="0.6">
          {/* Cluster on the right flank */}
          {/* Leaf 1: Ginkgo fan */}
          <path
            d="M380 270 C388 255 402 248 412 254 C418 258 418 266 414 274 C410 282 398 285 388 280 L380 270 Z"
            fill="#E5C17D"
            fillOpacity="0.85"
          />
          <path d="M382 272 Q398 266 414 260" stroke="#9E762E" strokeWidth="0.7" fill="none" />

          {/* Leaf 2 */}
          <path
            d="M405 235 C415 224 430 220 436 228 C440 234 438 242 430 248 C424 252 414 250 408 244 L405 235 Z"
            fill="#D6B274"
            fillOpacity="0.9"
          />

          {/* Leaf 3: Lower ground accent */}
          <path
            d="M370 318 C382 312 396 316 400 324 C402 330 398 336 388 338 C380 340 372 334 370 326 Z"
            fill="#ECCB89"
            fillOpacity="0.8"
          />

          {/* Floating celebratory gold sparkles / petals */}
          <circle cx="395" cy="215" r="2.5" fill="#D6B274" />
          <circle cx="430" cy="275" r="3" fill="#E5C17D" />
          <circle cx="340" cy="140" r="2" fill="#D6B274" opacity="0.7" />
          <circle cx="170" cy="245" r="2.5" fill="#D6B274" opacity="0.6" />
          <path d="M425 180 L428 185 L433 188 L428 191 L425 196 L422 191 L417 188 L422 185 Z" fill="#E5C17D" opacity="0.75" />
          <path d="M140 180 L142 184 L146 186 L142 188 L140 192 L138 188 L134 186 L138 184 Z" fill="#D6B274" opacity="0.6" />
        </g>
      </svg>
    </div>
  );
};
