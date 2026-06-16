/** Decorative botanical sprig echoing the brand logo. Pure SVG, no client JS. */
export function Leaf({
  className,
  flip = false,
  style,
}: {
  className?: string;
  flip?: boolean;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      viewBox="0 0 120 320"
      fill="none"
      className={className}
      style={{ ...(flip ? { transform: "scaleX(-1)" } : {}), ...style }}
      aria-hidden="true"
    >
      <path
        d="M60 318C60 318 58 220 58 170C58 110 64 40 70 4"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      {[
        { y: 40, s: 1 },
        { y: 78, s: -1 },
        { y: 116, s: 1 },
        { y: 154, s: -1 },
        { y: 192, s: 1 },
        { y: 230, s: -1 },
        { y: 268, s: 1 },
      ].map((l, i) => (
        <path
          key={i}
          d={`M60 ${l.y} C ${60 + l.s * 34} ${l.y - 26}, ${60 + l.s * 44} ${
            l.y + 2
          }, 60 ${l.y + 22} C ${60 + l.s * 22} ${l.y + 6}, ${60 + l.s * 24} ${
            l.y - 12
          }, 60 ${l.y}Z`}
          stroke="currentColor"
          strokeWidth="1.2"
        />
      ))}
    </svg>
  );
}
