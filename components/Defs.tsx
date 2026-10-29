import { LOGO_PATH } from "@/lib/logoPath";

export function Defs() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
      <symbol id="wedge" viewBox="0 0 128 120">
        <path fill="currentColor" d="M0 58 L128 0 Q88 58 83 120 Q60 80 0 58Z" />
      </symbol>
      {/* White part of the logo as a vector, shared by the six pieces in the intro so it stays sharp at any size. */}
      <path id="logoShape" fill="#fff" fillRule="evenodd" d={LOGO_PATH} />
    </svg>
  );
}

export function Wedge({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style}>
      <use href="#wedge" />
    </svg>
  );
}
