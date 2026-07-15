export default function Logo({ className = "", size = 32 }: { className?: string; size?: number }) {
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="kcfcuGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#144079" />
          <stop offset="1" stopColor="#0a2247" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="60" height="60" rx="14" fill="url(#kcfcuGrad)" />
      <path
        d="M14 18 L14 46 L22 46 L22 34 L32 46 L44 46 L30 30 L44 18 L34 18 L22 30 L22 18 Z"
        fill="#ffffff"
      />
      <circle cx="49" cy="22" r="5" fill="#c8102e" />
      <path d="M46 44 L54 44 L58 52 L42 52 Z" fill="#c8102e" />
    </svg>
  );
}
