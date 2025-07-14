export default function CarolineLogoLoading() {
  return (
    <svg width="768" height="768" viewBox="0 0 768 768" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="logo-gradient" x1="120" y1="100" x2="640" y2="700" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ffe17f"/>
          <stop offset="0.5" stopColor="#fb85c6"/>
          <stop offset="1" stopColor="#ffaf7f"/>
        </linearGradient>
        <style>
          {`
            .logo-text {
              font-family: 'Times New Roman', Times, serif;
              font-weight: normal;
              fill: url(#logo-gradient);
            }
            .logo-loading {
              font-family: Arial, Helvetica, sans-serif;
              font-weight: bold;
              fill: url(#logo-gradient);
              letter-spacing: 2px;
            }
          `}
        </style>
      </defs>
      {/* White background */}
      <rect width="768" height="768" fill="#fff"/>
      {/* Flower Loops */}
      <g stroke="url(#logo-gradient)" strokeWidth="14" fill="none">
        <ellipse cx="384" cy="220" rx="75" ry="185" transform="rotate(18 384 220)"/>
        <ellipse cx="384" cy="220" rx="75" ry="185" transform="rotate(63 384 220)"/>
        <ellipse cx="384" cy="220" rx="75" ry="185" transform="rotate(108 384 220)"/>
        <ellipse cx="384" cy="220" rx="75" ry="185" transform="rotate(153 384 220)"/>
        <ellipse cx="384" cy="220" rx="75" ry="185" transform="rotate(198 384 220)"/>
        <ellipse cx="384" cy="220" rx="75" ry="185" transform="rotate(243 384 220)"/>
        <ellipse cx="384" cy="220" rx="75" ry="185" transform="rotate(288 384 220)"/>
        <ellipse cx="384" cy="220" rx="75" ry="185" transform="rotate(333 384 220)"/>
        {/* Center spiral / circles */}
        <circle cx="384" cy="230" r="36" strokeWidth="5"/>
        <circle cx="384" cy="230" r="22" strokeWidth="2.5"/>
        <path d="M384,230 m-16,0 a16,16 0 1,0 32,0 a16,16 0 1,0 -32,0" strokeWidth="2"/>
      </g>
      {/* "CAROLINE" */}
      <text x="50%" y="500" fontSize="94" className="logo-text" textAnchor="middle" letterSpacing="6">
        CAROLINE
      </text>
      {/* "CLINIC" */}
      <text x="50%" y="567" fontSize="56" className="logo-text" textAnchor="middle" letterSpacing="6">
        CLINIC
      </text>
      {/* Loading text */}
      <text x="50%" y="650" fontSize="38" className="logo-loading" textAnchor="middle">
        Loading...
      </text>
    </svg>
  );
}
