/**
 * The bending glass sheet behind the Services section (components/ServiceGlass.tsx).
 *
 * The bend (arc-length-conserving paper curl), the physical glass material, the Fresnel rim and the procedural
 * environment are from ThreeUI Pro's "3D Paper" effect (https://threeui.com), used under our ThreeUI Pro licence.
 * What is ours: the card artwork (one card per service, in brand colours) and the card switching.
 * Runs on three.js r149 (MIT), the version the effect was written for: it uses the r149 colour API (sRGBEncoding).
 */
import * as T from "three";

export type GlassService = { n: string; d: string; c: string[] };

const TW = 1400, TH = 1932; // texture size, the 3D Paper proportion
const SW = 2.30, SH = 2.72; // sheet size in scene units

/* ---------------------------------------------------------------- the card artwork */
function rr(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath(); ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
}
function wrap(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxW: number, lh: number) {
  let line = "", yy = y;
  for (const w of text.split(" ")) {
    const t = line ? line + " " + w : w;
    if (ctx.measureText(t).width > maxW && line) { ctx.fillText(line, x, yy); line = w; yy += lh; } else line = t;
  }
  if (line) ctx.fillText(line, x, yy);
  return yy + lh;
}
function asterisk(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, col: string) {
  ctx.save(); ctx.translate(cx, cy); ctx.fillStyle = col;
  for (let k = 0; k < 8; k++) { ctx.rotate(Math.PI / 4); rr(ctx, -r * 0.16, -r, r * 0.32, r, r * 0.16); ctx.fill(); }
  ctx.beginPath(); ctx.arc(0, 0, r * 0.3, 0, 7); ctx.fill(); ctx.restore();
}
function drawCard(ctx: CanvasRenderingContext2D, s: GlassService, i: number, total: number, display: string, body: string) {
  ctx.scale(TW / 1200, TH / 1656); // laid out on a 1200 x 1656 grid
  ctx.fillStyle = "rgba(255,255,255,.035)"; ctx.fillRect(0, 0, 1200, 1656);
  const fr = ctx.createLinearGradient(0, 260, 0, 980);
  fr.addColorStop(0, "rgba(255,255,255,0)"); fr.addColorStop(0.3, "rgba(255,255,255,.06)");
  fr.addColorStop(0.7, "rgba(255,255,255,.06)"); fr.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = fr; ctx.fillRect(40, 260, 1120, 720);
  ctx.strokeStyle = "rgba(255,255,255,.34)"; ctx.lineWidth = 2; rr(ctx, 20, 20, 1160, 1616, 14); ctx.stroke();
  ctx.strokeStyle = "rgba(255,255,255,.12)"; ctx.lineWidth = 1; rr(ctx, 36, 36, 1128, 1584, 10); ctx.stroke();
  const M = 78;
  ctx.font = `700 40px ${display}`; ctx.fillStyle = "#FA9470"; ctx.fillText(String(i + 1).padStart(2, "0"), M, 150);
  ctx.textAlign = "right"; ctx.fillStyle = "rgba(255,255,255,.55)"; ctx.fillText(`/ ${total}`, 1200 - M, 150); ctx.textAlign = "left";
  ctx.font = `700 34px ${body}`; ctx.fillStyle = "rgba(255,255,255,.5)"; ctx.fillText("WHAT WE DO", M, 330);
  ctx.font = `800 128px ${display}`; ctx.fillStyle = "#ffffff";
  const after = wrap(ctx, s.n + ".", M, 480, 1200 - 2 * M, 138);
  ctx.font = `500 40px ${body}`; ctx.fillStyle = "rgba(255,255,255,.76)";
  const ay = wrap(ctx, s.d, M, after + 40, 800, 58);
  let cx = M, cy = ay + 60; ctx.font = `600 32px ${body}`;
  for (const c of s.c) {
    const w = ctx.measureText(c).width + 56;
    if (cx + w > 1200 - M) { cx = M; cy += 86; }
    ctx.strokeStyle = "rgba(255,255,255,.4)"; ctx.lineWidth = 2; rr(ctx, cx, cy, w, 66, 33); ctx.stroke();
    ctx.fillStyle = "rgba(255,255,255,.88)"; ctx.fillText(c, cx + 28, cy + 44); cx += w + 18;
  }
  asterisk(ctx, 1200 - M - 60, 1480, 56, "#E77249");
  ctx.font = `800 46px ${display}`; ctx.fillStyle = "#ffffff"; ctx.fillText("wacko studios", M, 1520);
  const ww = ctx.measureText("wacko studios").width; ctx.fillStyle = "#E77249"; ctx.fillText(".", M + ww, 1520);
}

/* ---------------------------------------------------------------- the bend (3D Paper) */
const WAVE = `
uniform float uTime, uAmp, uFlutter, uPhase, uFreq, uTwist;
uniform vec2  uSize;
float sAmp(float u, float v){ return uAmp*(0.10 + pow(u,1.35))*(0.50 + 0.64*v); }
float sAmpV(float u){ return uAmp*(0.10 + pow(u,1.35))*0.64; }
float sTheta(float u, float v){
  float a = sAmp(u,v); float ph = uFreq*u + uTwist*v + uTime*0.40 + uPhase;
  return a*sin(ph) + uFlutter*a*0.60*sin(ph*2.35 + uTime*2.0);
}
float sThetaV(float u, float v){
  float a = sAmp(u,v), da = sAmpV(u); float ph = uFreq*u + uTwist*v + uTime*0.40 + uPhase; float f = ph*2.35 + uTime*2.0;
  return da*sin(ph) + a*cos(ph)*uTwist + uFlutter*0.60*(da*sin(f) + a*cos(f)*uTwist*2.35);
}
float sYoff(float u, float v){ float w = 1.0 - 0.55*v;
  return 0.021*uSize.y*sin(2.05*u + uTime*0.47 + uPhase) + 0.013*uSize.y*sin(3.35*u - 1.55*v + uTime*0.63 + uPhase)*w; }
float sYdU(float u, float v){ float w = 1.0 - 0.55*v;
  return 0.0431*uSize.y*cos(2.05*u + uTime*0.47 + uPhase) + 0.0436*uSize.y*cos(3.35*u - 1.55*v + uTime*0.63 + uPhase)*w; }
float sYdV(float u, float v){ float ph = 3.35*u - 1.55*v + uTime*0.63 + uPhase;
  return 0.013*uSize.y*(-1.55*cos(ph)*(1.0-0.55*v) - 0.55*sin(ph)); }
void sheetPoint(vec2 q, out vec3 P, out vec3 NN){
  float u = q.x, v = q.y;
  float x=0.0, z=0.0, xe=0.0, ze=0.0, dxv=0.0, dzv=0.0, dxe=0.0, dze=0.0;
  const int NS = 20; float h = 1.0/float(NS);
  for(int i=0;i<NS;i++){
    float uu = (float(i)+0.5)*h; float w = clamp((u-(uu-0.5*h))/h, 0.0, 1.0);
    float th = sTheta(uu,v); float dt = sThetaV(uu,v); float c = cos(th), sn = sin(th);
    xe += c*h; ze += sn*h; dxe += -sn*dt*h; dze += c*dt*h;
    x += c*h*w; z += sn*h*w; dxv += -sn*dt*h*w; dzv += c*dt*h*w;
  }
  float W = uSize.x, H = uSize.y; float th0 = sTheta(u,v);
  P = vec3((x - xe*0.5)*W, (v-0.5)*H + sYoff(u,v), (z - ze*0.5)*W);
  vec3 Tu = vec3(W*cos(th0), sYdU(u,v), W*sin(th0));
  vec3 Tv = vec3((dxv - dxe*0.5)*W, H + sYdV(u,v), (dzv - dze*0.5)*W);
  NN = normalize(cross(Tu, Tv));
}`;

function envTexture() {
  const w = 1024, h = 512, c = document.createElement("canvas"); c.width = w; c.height = h;
  const x = c.getContext("2d")!;
  const g = x.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, "#3a4f78"); g.addColorStop(0.46, "#142a52"); g.addColorStop(1, "#08152c");
  x.fillStyle = g; x.fillRect(0, 0, w, h);
  const blob = (cx: number, cy: number, rx: number, ry: number, col: string) => {
    const rg = x.createRadialGradient(cx, cy, 0, cx, cy, Math.max(rx, ry));
    rg.addColorStop(0, col); rg.addColorStop(1, "rgba(0,0,0,0)");
    x.save(); x.translate(cx, cy); x.scale(1, ry / rx); x.translate(-cx, -cy);
    x.fillStyle = rg; x.beginPath(); x.arc(cx, cy, rx, 0, 7); x.fill(); x.restore();
  };
  blob(w * 0.30, h * 0.24, 330, 240, "rgba(255,252,246,1)");
  blob(w * 0.74, h * 0.34, 240, 200, "rgba(150,175,235,.42)");
  blob(w * 0.52, h * 0.86, 420, 190, "rgba(231,114,73,.28)");
  const t = new T.CanvasTexture(c); t.mapping = T.EquirectangularReflectionMapping; t.encoding = T.sRGBEncoding;
  return t;
}

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

/**
 * Builds the scene on `canvas` and returns a small controller. Nothing animates until `start()`; `show(i)` turns the sheet to
 * service i. Throws if WebGL is unavailable (the caller falls back to plain cards).
 */
export function createGlassSheet(canvas: HTMLCanvasElement, services: GlassService[], fonts: { display: string; body: string }) {
  const renderer = new T.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.outputEncoding = T.sRGBEncoding; renderer.toneMapping = T.NoToneMapping;
  const scene = new T.Scene();
  const camera = new T.PerspectiveCamera(24, 1, 0.1, 100); camera.position.set(0, 0, 8.2);

  const envSrc = envTexture();
  const pmrem = new T.PMREMGenerator(renderer); pmrem.compileEquirectangularShader();
  const envRT = pmrem.fromEquirectangular(envSrc); scene.environment = envRT.texture;

  const key = new T.DirectionalLight(0xfff6ec, 1.42); key.position.set(-3.3, 2.1, 2.0);
  const fill = new T.DirectionalLight(0x9fb6ff, 0.13); fill.position.set(3.6, -1.8, 1.6);
  const rim = new T.DirectionalLight(0xffffff, 0.10); rim.position.set(1.6, 1.2, -2.6);
  scene.add(key, fill, rim, new T.AmbientLight(0xffffff, 0.16));
  const touchLight = new T.PointLight(0xffd8c8, 0, 7.5, 1.35); touchLight.position.set(0, 0, 1.7); scene.add(touchLight);

  // card textures, drawn once each with the site's own fonts
  const textures = services.map((s, i) => {
    const c = document.createElement("canvas"); c.width = TW; c.height = TH;
    const ctx = c.getContext("2d")!;
    ctx.save(); rr(ctx, 0, 0, TW, TH, 30); ctx.clip(); drawCard(ctx, s, i, services.length, fonts.display, fonts.body); ctx.restore();
    const t = new T.CanvasTexture(c); t.encoding = T.sRGBEncoding; t.anisotropy = 8; return t;
  });

  const geo = new T.PlaneGeometry(SW, SH, 72, 96);
  const uni = {
    uTime: { value: 0 }, uAmp: { value: 1.18 }, uFreq: { value: 4.70 }, uTwist: { value: 1.30 },
    uSize: { value: new T.Vector2(SW, SH) }, uFlutter: { value: 0 }, uPhase: { value: 0 },
    uRim: { value: 0.62 }, uRimA: { value: 0.88 }, uSpecA: { value: 0.14 }, uRimCol: { value: new T.Color(0xffe2d6) },
  };
  const mat = new T.MeshPhysicalMaterial({
    map: textures[0], color: new T.Color(0xd6dff0), side: T.DoubleSide, metalness: 0, roughness: 0.06,
    clearcoat: 1, clearcoatRoughness: 0.03,
    envMapIntensity: 1.15, specularIntensity: 1, ior: 1.5, transparent: true, alphaTest: 0.012, opacity: 0,
  });
  // iridescence exists in r149 but is missing from its type definitions
  Object.assign(mat, { iridescence: 0.10, iridescenceIOR: 1.35, iridescenceThicknessRange: [120, 420] });
  mat.onBeforeCompile = (sh) => {
    Object.assign(sh.uniforms, uni);
    sh.vertexShader = sh.vertexShader
      .replace("#include <common>", "#include <common>\n" + WAVE)
      .replace("#include <beginnormal_vertex>", `vec3 sheetP; vec3 objectNormal; sheetPoint(uv, sheetP, objectNormal);
        #ifdef USE_TANGENT
          vec3 objectTangent = vec3( tangent.xyz );
        #endif`)
      .replace("#include <begin_vertex>", "vec3 transformed = sheetP;");
    sh.fragmentShader = sh.fragmentShader
      .replace("#include <common>", "#include <common>\nuniform float uRim, uRimA, uSpecA;\nuniform vec3 uRimCol;")
      .replace("#include <alphatest_fragment>", "if ( diffuseColor.a / max(opacity,1e-4) < alphaTest ) discard;")
      .replace("#include <output_fragment>", `
        float fres = pow(1.0 - clamp(abs(dot(geometry.normal, geometry.viewDir)),0.0,1.0), 3.2);
        outgoingLight += fres * uRim * uRimCol;
        float baseA = diffuseColor.a / max(opacity, 1e-4);
        float outA  = clamp(baseA + fres*uRimA + uSpecA*dot(outgoingLight, vec3(0.3333)), 0.0, 1.0) * opacity;
        gl_FragColor = vec4( outgoingLight, outA );`);
  };
  const mesh = new T.Mesh(geo, mat);
  const group = new T.Group(); group.add(mesh); scene.add(group);

  // a soft dark cloud so the sheet stands off the background
  const hc = document.createElement("canvas"); hc.width = hc.height = 256;
  const hx = hc.getContext("2d")!; const hg = hx.createRadialGradient(128, 128, 0, 128, 128, 128);
  hg.addColorStop(0, "rgba(0,0,0,.55)"); hg.addColorStop(0.45, "rgba(0,0,0,.28)"); hg.addColorStop(1, "rgba(0,0,0,0)");
  hx.fillStyle = hg; hx.fillRect(0, 0, 256, 256);
  const haloTex = new T.CanvasTexture(hc); haloTex.encoding = T.sRGBEncoding;
  const haloGeo = new T.PlaneGeometry(3.9, 4.9);
  const haloMat = new T.MeshBasicMaterial({ map: haloTex, transparent: true, depthWrite: false, opacity: 0 });
  const halo = new T.Mesh(haloGeo, haloMat); halo.position.z = -0.62; group.add(halo);

  /* ---- state ---- */
  let shown = 0, target = 0;
  let flip: { t: number; dir: number; to: number; swapped: boolean } | null = null;
  let intro = 0, raf = 0, last = 0, running = false;
  let dragging = false, dragYaw = 0, dragPitch = 0, lastX = 0, lastY = 0;
  let hover = 0, hoverT = 0;
  const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
  const lightPos = new T.Vector3();
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  const resize = () => {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
    renderer.setSize(w, h, false);
    camera.aspect = w / h; camera.updateProjectionMatrix();
    const visH = 2 * camera.position.z * Math.tan(T.MathUtils.degToRad(camera.fov) / 2), visW = visH * camera.aspect;
    group.scale.setScalar(Math.min((visH * 0.86) / SH, (visW * 0.86) / SW));
  };

  const frame = (now: number) => {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(last ? (now - last) / 1000 : 0.016, 0.05); last = now;
    const t = now / 1000;
    uni.uTime.value = reduced ? 2.4 : t;
    intro += (1 - intro) * Math.min(1, dt * 1.9);
    mat.opacity = intro; haloMat.opacity = intro * 0.3;

    // turn to the requested service: one full spin, the new artwork swapped in while the sheet is edge-on
    if (!flip && target !== shown) flip = { t: 0, dir: target > shown ? 1 : -1, to: target, swapped: false };
    let flipYaw = 0;
    if (flip) {
      flip.t = Math.min(1, flip.t + dt / 0.85);
      const e = ease(flip.t);
      flipYaw = flip.dir * e * Math.PI * 2;
      uni.uFlutter.value = Math.sin(flip.t * Math.PI) * 0.9;
      if (!flip.swapped && e >= 0.25) { flip.swapped = true; flip.to = target; shown = target; mat.map = textures[shown]; }
      if (flip.t >= 1) { flip = null; uni.uFlutter.value = 0; }
    }
    if (!dragging) {
      dragYaw += (Math.round(dragYaw / (Math.PI * 2)) * Math.PI * 2 - dragYaw) * Math.min(1, dt * 2);
      dragPitch -= dragPitch * Math.min(1, dt * 2);
    }
    mouse.x += (mouse.tx - mouse.x) * Math.min(1, dt * 3); mouse.y += (mouse.ty - mouse.y) * Math.min(1, dt * 3);
    const idle = reduced ? 0 : 1, rise = 1 - intro;
    group.rotation.y = dragYaw + flipYaw + mouse.x * 0.16 + Math.sin(t * 0.23) * 0.045 * idle;
    group.rotation.x = dragPitch - mouse.y * 0.11 + Math.sin(t * 0.19) * 0.026 * idle + rise * 0.28;
    group.rotation.z = Math.sin(t * 0.27) * 0.018 * idle;
    group.position.y = Math.sin(t * 0.36) * 0.06 * idle - rise * 0.7;
    group.position.x = Math.sin(t * 0.21) * 0.05 * idle + mouse.x * 0.08;

    hover += (hoverT - hover) * Math.min(1, dt * 4.5);
    touchLight.intensity = hover * 2.6 * intro;
    if (hover > 0.002) {
      lightPos.set(mouse.tx, -mouse.ty, 0.5).unproject(camera).sub(camera.position).normalize();
      touchLight.position.copy(camera.position).addScaledVector(lightPos, (1.75 - camera.position.z) / lightPos.z);
    }
    renderer.render(scene, camera);
  };

  /* ---- pointer (mouse only: on touch the page must keep scrolling) ---- */
  const onMove = (e: PointerEvent) => {
    const r = canvas.getBoundingClientRect();
    mouse.tx = clamp(((e.clientX - r.left) / r.width - 0.5) * 2, -1, 1);
    mouse.ty = clamp(((e.clientY - r.top) / r.height - 0.5) * 2, -1, 1);
    if (e.pointerType !== "mouse") return;
    hoverT = Math.abs(mouse.tx) < 0.5 && Math.abs(mouse.ty) < 0.7 ? 1 : 0;
    if (dragging) {
      dragYaw += (e.clientX - lastX) * 0.006; dragPitch = clamp(dragPitch - (e.clientY - lastY) * 0.0045, -0.6, 0.6);
      lastX = e.clientX; lastY = e.clientY;
    }
  };
  const onDown = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    dragging = true; lastX = e.clientX; lastY = e.clientY; canvas.setPointerCapture(e.pointerId);
  };
  const onUp = () => { dragging = false; };
  const onLeave = () => { hoverT = 0; mouse.tx = mouse.ty = 0; };
  canvas.addEventListener("pointermove", onMove); canvas.addEventListener("pointerdown", onDown);
  canvas.addEventListener("pointerup", onUp); canvas.addEventListener("pointercancel", onUp); canvas.addEventListener("pointerleave", onLeave);

  resize();
  renderer.compile(scene, camera);

  return {
    resize,
    show(i: number) { target = clamp(i, 0, services.length - 1); },
    start() { if (!running) { running = true; last = 0; raf = requestAnimationFrame(frame); } },
    stop() { running = false; cancelAnimationFrame(raf); },
    dispose() {
      cancelAnimationFrame(raf);
      canvas.removeEventListener("pointermove", onMove); canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointerup", onUp); canvas.removeEventListener("pointercancel", onUp); canvas.removeEventListener("pointerleave", onLeave);
      textures.forEach((t) => t.dispose()); geo.dispose(); mat.dispose(); haloGeo.dispose(); haloMat.dispose(); haloTex.dispose();
      envSrc.dispose(); envRT.dispose(); pmrem.dispose(); renderer.dispose();
    },
  };
}
