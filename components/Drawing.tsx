import { COLORS, type Config } from "@/lib/data";

/** Tehnička skica kućice/boksa sa kotama. Čisto SVG, bez stanja. */
export function Drawing({ cfg }: { cfg: Config }) {
  const { L, W, H, type } = cfg;
  const c = COLORS[cfg.color];
  const cage = type !== "kucica";

  const VW = 540, VH = 390, pl = 96, pr = 92, pt = 30, pb = 62, kx = 0.5, ky = 0.28;
  const s = Math.min((VW - pl - pr) / (L + W * kx), (VH - pt - pb) / (H + W * ky));
  const fw = L * s, fh = H * s, dx = W * kx * s, dy = W * ky * s;
  const x0 = pl + (VW - pl - pr - (fw + dx)) / 2;
  const y0 = pt + dy + (VH - pt - pb - (fh + dy)) / 2;
  const x1 = x0 + fw, y1 = y0 + fh;
  const trim = cage ? "#2a2e34" : "#b4bbc2";
  const o = cage ? 10 : 5;

  const side = `${x1},${y0} ${x1 + dx},${y0 - dy} ${x1 + dx},${y1 - dy} ${x1},${y1}`;
  const top = `${x0 - o},${y0} ${x0 + dx - o},${y0 - dy} ${x1 + dx + o},${y0 - dy} ${x1 + o},${y0}`;
  const fFill = cage ? "url(#ms)" : "url(#pn)";

  const DimLine = ({ a, b, c2, d }: { a: number; b: number; c2: number; d: number }) => (
    <path d={`M${a} ${b}L${c2} ${d}`} stroke="currentColor" strokeWidth={1.3} markerStart="url(#ar)" markerEnd="url(#ar)" fill="none" />
  );

  let door = null;
  if (type === "kucica") {
    const dw = Math.min(cfg.dw, L - 10) * s;
    const dh = Math.min(cfg.dh, H - 10) * s;
    const db = Math.min(15, H - cfg.dh - 5) * s;
    const dxx = x0 + Math.max(8, Math.min(fw * 0.14, fw - dw - 8));
    door = (
      <>
        <rect x={dxx} y={y1 - Math.max(db, 6) - dh} width={dw} height={dh} fill="#14171a" stroke={trim} strokeWidth={3.5} />
        {cfg.hall && (
          <path d={`M${x0 + fw * 0.42} ${y0}l${dx} ${-dy}`} stroke="currentColor" strokeWidth={1.5} strokeDasharray="5 4" fill="none" />
        )}
        {cfg.lid && (
          <rect
            x={x1 + dx * 0.5 - 7}
            y={y0 - dy * 0.5 - 4}
            width={14}
            height={8}
            fill="#c9a43a"
            stroke="#7d6417"
            strokeWidth={1}
            transform="skewX(-30)"
            style={{ transformBox: "fill-box", transformOrigin: "center" }}
          />
        )}
        <rect x={x0 + 8} y={y1 + 2} width={12} height={6} fill="#16181b" />
        <rect x={x1 - 20} y={y1 + 2} width={12} height={6} fill="#16181b" />
        <rect x={x1 + dx - 14} y={y1 - dy + 2} width={10} height={6} fill="#16181b" />
      </>
    );
  }

  const hw = fw * 0.42;

  return (
    <svg viewBox={`0 0 ${VW} ${VH}`} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <marker id="ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0 0L10 5L0 10z" fill="currentColor" />
        </marker>
        <pattern id="pn" width="9" height="9" patternUnits="userSpaceOnUse">
          <rect width="9" height="9" fill={c.fill} />
          <path d={c.horizontal ? "M0 4.5H9" : "M.5 0V9"} stroke={c.rib} strokeWidth={1} fill="none" />
        </pattern>
        <pattern id="ms" width="11" height="11" patternUnits="userSpaceOnUse">
          <path d="M0 .5H11M.5 0V11" stroke="#2a2e34" strokeWidth={1.2} fill="none" />
        </pattern>
      </defs>

      {cage && <polygon points={`${x0},${y1} ${x0 + dx},${y1 - dy} ${x1 + dx},${y1 - dy} ${x1},${y1}`} fill="#b08a5c" opacity={0.55} />}
      <polygon points={side} fill={fFill} stroke={trim} strokeWidth={4} strokeLinejoin="round" />
      {!cage && <polygon points={side} fill="#000" opacity={0.2} />}
      <rect x={x0} y={y0} width={fw} height={fh} fill={fFill} stroke={trim} strokeWidth={4} strokeLinejoin="round" />

      {type === "combo" && (
        <>
          <rect x={x0} y={y0} width={hw} height={fh} fill="url(#pn)" stroke={trim} strokeWidth={4} />
          <rect x={x0 + hw * 0.3} y={y1 - fh * 0.42} width={hw * 0.4} height={fh * 0.28} fill="#14171a" stroke={trim} strokeWidth={3} />
        </>
      )}
      {cage && <rect x={x0 + fw * 0.62} y={y0 + 7} width={fw * 0.32} height={fh - 14} fill="none" stroke={trim} strokeWidth={3.5} />}

      <polygon points={top} fill={cage ? "#3a4049" : c.fill} stroke={trim} strokeWidth={4} strokeLinejoin="round" />
      <polygon points={top} fill="#fff" opacity={0.1} />

      {door}

      <DimLine a={x0} b={y1 + 26} c2={x1} d={y1 + 26} />
      <text className="dimtxt" x={x0 + fw / 2} y={y1 + 44} textAnchor="middle">{L} cm</text>
      <text className="dimsub" x={x0 + fw / 2} y={y1 + 57} textAnchor="middle">dužina</text>

      <DimLine a={x0 - 24} b={y0} c2={x0 - 24} d={y1} />
      <text className="dimtxt" x={x0 - 32} y={y0 + fh / 2} textAnchor="end">{H} cm</text>
      <text className="dimsub" x={x0 - 32} y={y0 + fh / 2 + 13} textAnchor="end">visina</text>

      <DimLine a={x1 + 16} b={y1 + 10} c2={x1 + dx + 16} d={y1 - dy + 10} />
      <text className="dimtxt" x={x1 + dx / 2 + 26} y={y1 - dy / 2 + 22}>{W} cm</text>
      <text className="dimsub" x={x1 + dx / 2 + 26} y={y1 - dy / 2 + 35}>širina</text>
    </svg>
  );
}
