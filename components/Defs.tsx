export function Defs() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
      <symbol id="wedge" viewBox="0 0 128 120">
        <path fill="currentColor" d="M52.6 2.0L30.4 11.7L40.2 36.3L17.3 26.8L15.2 26.5L6.1 49.4L29.5 59.3L30.4 60.3L7.6 69.8L5.9 71.2L15.4 93.6L40.3 83.8L30.5 108.6L53.3 117.9L64.1 93.5L73.8 116.9L75.2 117.9L97.4 108.5L88.0 85.2L87.9 83.7L111.9 93.6L112.8 93.4L121.9 70.7L97.6 60.1L121.2 50.0L121.9 48.8L112.5 26.3L88.6 36.2L87.7 36.1L97.4 12.0L97.2 11.2L74.5 2.0L64.0 26.4L53.9 2.7Z" />
      </symbol>
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
