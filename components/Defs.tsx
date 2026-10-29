import { LOGO_PIECES } from "@/lib/logoPath";

/**
 * Shared SVG definitions. The liquid glass uses them like this: each logo letter (and each arrow) is a div with a
 * backdrop blur, clipped to the letter's shape by one of the clipPaths below, with an SVG on top that adds the lit
 * bevel (a lighting filter) and a bright rim.
 */
export function Defs() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
      <symbol id="wedge" viewBox="0 0 128 120">
        <path fill="currentColor" d="M0 58 L128 0 Q88 58 83 120 Q60 80 0 58Z" />
      </symbol>
      <defs>
        {LOGO_PIECES.map((pc) => (
          <clipPath key={pc.id} id={`lgc-${pc.id}`} clipPathUnits="objectBoundingBox">
            <path clipRule="evenodd" transform={`scale(${1 / pc.w} ${1 / pc.h}) translate(${-pc.x} ${-pc.y})`} d={pc.d} />
          </clipPath>
        ))}
        <clipPath id="lgc-wedge" clipPathUnits="objectBoundingBox">
          <path transform="scale(0.0078125 0.0083333)" d="M0 58 L128 0 Q88 58 83 120 Q60 80 0 58Z" />
        </clipPath>

        {/* Lit bevel for the big letters: a strong highlight on the top left edges, a softer one bounced back on the bottom right. */}
        <filter id="lg-bevel" x="-6%" y="-6%" width="112%" height="112%" colorInterpolationFilters="sRGB">
          <feGaussianBlur in="SourceAlpha" stdDeviation="6" result="blur" />
          <feSpecularLighting in="blur" surfaceScale="8" specularConstant="1.3" specularExponent="22" lightingColor="#ffffff" result="s1">
            <feDistantLight azimuth="225" elevation="42" />
          </feSpecularLighting>
          <feSpecularLighting in="blur" surfaceScale="8" specularConstant="0.75" specularExponent="18" lightingColor="#ffffff" result="s2">
            <feDistantLight azimuth="45" elevation="36" />
          </feSpecularLighting>
          <feComposite in="s1" in2="SourceAlpha" operator="in" result="s1in" />
          <feComposite in="s2" in2="SourceAlpha" operator="in" result="s2in" />
          <feMerge><feMergeNode in="s1in" /><feMergeNode in="s2in" /></feMerge>
        </filter>
        {/* Same idea for the small arrows (their viewBox is 128 wide, so everything is scaled down). */}
        <filter id="lg-bevel-s" x="-10%" y="-10%" width="120%" height="120%" colorInterpolationFilters="sRGB">
          <feGaussianBlur in="SourceAlpha" stdDeviation="2.6" result="blur" />
          <feSpecularLighting in="blur" surfaceScale="5" specularConstant="1.3" specularExponent="20" lightingColor="#ffffff" result="s1">
            <feDistantLight azimuth="225" elevation="42" />
          </feSpecularLighting>
          <feSpecularLighting in="blur" surfaceScale="5" specularConstant="0.7" specularExponent="16" lightingColor="#ffe3cf" result="s2">
            <feDistantLight azimuth="45" elevation="36" />
          </feSpecularLighting>
          <feComposite in="s1" in2="SourceAlpha" operator="in" result="s1in" />
          <feComposite in="s2" in2="SourceAlpha" operator="in" result="s2in" />
          <feMerge><feMergeNode in="s1in" /><feMergeNode in="s2in" /></feMerge>
        </filter>
        {/* The logo's orange wedge: a glossy gem, so the graphic itself is kept and a highlight is merged on top. */}
        <filter id="lg-gem-filter" x="-10%" y="-10%" width="120%" height="120%" colorInterpolationFilters="sRGB">
          <feGaussianBlur in="SourceAlpha" stdDeviation="9" result="blur" />
          <feSpecularLighting in="blur" surfaceScale="10" specularConstant="1.15" specularExponent="24" lightingColor="#ffffff" result="sp">
            <feDistantLight azimuth="225" elevation="48" />
          </feSpecularLighting>
          <feComposite in="sp" in2="SourceAlpha" operator="in" result="spin" />
          <feMerge><feMergeNode in="SourceGraphic" /><feMergeNode in="spin" /></feMerge>
        </filter>
        <linearGradient id="lg-gem" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFB878" /><stop offset="0.5" stopColor="#E66A2C" /><stop offset="1" stopColor="#B8470F" />
        </linearGradient>
        <linearGradient id="lg-rim" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.95" />
          <stop offset="0.45" stopColor="#fff" stopOpacity="0.14" />
          <stop offset="0.6" stopColor="#fff" stopOpacity="0.14" />
          <stop offset="1" stopColor="#fff" stopOpacity="0.6" />
        </linearGradient>
      </defs>
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
