"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Profile photo picker with a built-in square cropper.
 *
 * Lets the admin pick an image, then pan (drag) + zoom to frame the profile.
 * The cropped result is rendered to a 512×512 canvas and pushed into a hidden
 * <input type="file" name={name}> via DataTransfer — so the existing
 * `saveProfile` server action (which reads fd.get("photo") as File) keeps
 * working unchanged. No external dependency.
 */

const OUT = 512; // exported crop size (px, square)

export function PhotoCropField({
  name,
  label = "Foto (upload)",
  hint = "Pilih gambar lalu geser & zoom untuk fokus ke profil.",
}: {
  name: string;
  label?: string;
  hint?: string;
}) {
  const boxRef = useRef<HTMLDivElement | null>(null);
  const imgElRef = useRef<HTMLImageElement | null>(null);
  const hiddenRef = useRef<HTMLInputElement | null>(null);

  const [src, setSrc] = useState<string | null>(null);
  const [nat, setNat] = useState({ w: 0, h: 0 });
  const [viewport, setViewport] = useState(256);
  const [zoom, setZoom] = useState(1); // user zoom multiplier ≥ 1
  const [offset, setOffset] = useState({ x: 0, y: 0 }); // image top-left, CSS px
  const [preview, setPreview] = useState<string | null>(null);

  const baseScale =
    nat.w && nat.h ? Math.max(viewport / nat.w, viewport / nat.h) : 1;
  const effScale = baseScale * zoom;
  const dispW = nat.w * effScale;
  const dispH = nat.h * effScale;

  // Keep the image fully covering the viewport (no empty gaps).
  const clamp = useCallback(
    (o: { x: number; y: number }) => ({
      x: Math.min(0, Math.max(viewport - dispW, o.x)),
      y: Math.min(0, Math.max(viewport - dispH, o.y)),
    }),
    [viewport, dispW, dispH],
  );

  // Measure the box so the crop math matches what is shown (responsive).
  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    // ResizeObserver fires once on observe, so it sets the initial width too.
    const ro = new ResizeObserver(() => setViewport(el.clientWidth));
    ro.observe(el);
    return () => ro.disconnect();
  }, [src]);

  // Render the current frame to a canvas and store it as the submitted File.
  const syncCrop = useCallback(async () => {
    const img = imgElRef.current;
    if (!img || !nat.w) return;
    const sWidth = viewport / effScale;
    const sHeight = viewport / effScale;
    const sx = -offset.x / effScale;
    const sy = -offset.y / effScale;

    const canvas = document.createElement("canvas");
    canvas.width = OUT;
    canvas.height = OUT;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, OUT, OUT);

    const blob: Blob | null = await new Promise((res) =>
      canvas.toBlob(res, "image/jpeg", 0.9),
    );
    if (!blob) return;

    const file = new File([blob], "profil.jpg", { type: "image/jpeg" });
    const dt = new DataTransfer();
    dt.items.add(file);
    if (hiddenRef.current) hiddenRef.current.files = dt.files;

    setPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(blob);
    });
  }, [nat.w, viewport, effScale, offset.x, offset.y]);

  function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (src) URL.revokeObjectURL(src);
    setSrc(URL.createObjectURL(f));
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  }

  // Center the image once it has loaded (and its natural size is known).
  function onImgLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const el = e.currentTarget;
    const w = el.naturalWidth;
    const h = el.naturalHeight;
    setNat({ w, h });
    const base = Math.max(viewport / w, viewport / h);
    setOffset({ x: (viewport - w * base) / 2, y: (viewport - h * base) / 2 });
  }

  // Re-sync the crop when framing settles (debounced so dragging/zooming
  // doesn't fire canvas.toBlob on every pointer move).
  useEffect(() => {
    if (!src || !nat.w) return;
    const t = setTimeout(() => void syncCrop(), 120);
    return () => clearTimeout(t);
  }, [src, nat.w, syncCrop]);

  // Pointer drag to pan.
  const drag = useRef<{ x: number; y: number; ox: number; oy: number } | null>(
    null,
  );
  function onPointerDown(e: React.PointerEvent) {
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { x: e.clientX, y: e.clientY, ox: offset.x, oy: offset.y };
  }
  function onPointerMove(e: React.PointerEvent) {
    if (!drag.current) return;
    const next = clamp({
      x: drag.current.ox + (e.clientX - drag.current.x),
      y: drag.current.oy + (e.clientY - drag.current.y),
    });
    setOffset(next);
  }
  function onPointerUp() {
    drag.current = null;
  }

  function onZoom(e: React.ChangeEvent<HTMLInputElement>) {
    const z = Number(e.target.value);
    // Keep the viewport centre stable while zooming.
    const cx = viewport / 2;
    const cy = viewport / 2;
    const imgCx = (cx - offset.x) / effScale;
    const imgCy = (cy - offset.y) / effScale;
    const nextEff = baseScale * z;
    setZoom(z);
    setOffset(clamp({ x: cx - imgCx * nextEff, y: cy - imgCy * nextEff }));
  }

  function clear() {
    if (src) URL.revokeObjectURL(src);
    if (preview) URL.revokeObjectURL(preview);
    setSrc(null);
    setPreview(null);
    setNat({ w: 0, h: 0 });
    if (hiddenRef.current) hiddenRef.current.value = "";
  }

  return (
    <div className="space-y-2">
      <span className="text-xs font-bold uppercase text-zinc-600">{label}</span>

      {/* Hidden field actually submitted with the form. */}
      <input ref={hiddenRef} type="file" name={name} className="hidden" />

      {/* Visible picker (not submitted — only feeds the cropper). */}
      <input
        type="file"
        accept="image/*"
        onChange={onPick}
        className="w-full border-2 border-nb-ink bg-white px-2 py-1.5 text-sm file:mr-3 file:border-2 file:border-nb-ink file:bg-nb-yellow file:px-2 file:py-1 file:text-xs file:font-bold"
      />

      {src && (
        <div className="flex flex-wrap items-start gap-4">
          {/* Crop viewport (square). */}
          <div className="space-y-1">
            <div
              ref={boxRef}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
              className="relative aspect-square w-56 max-w-full cursor-grab touch-none select-none overflow-hidden border-2 border-nb-ink bg-zinc-100 active:cursor-grabbing"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                ref={imgElRef}
                src={src}
                alt="Atur posisi foto"
                onLoad={onImgLoad}
                draggable={false}
                style={{
                  position: "absolute",
                  width: dispW || undefined,
                  height: dispH || undefined,
                  left: offset.x,
                  top: offset.y,
                  maxWidth: "none",
                }}
              />
              {/* Centre guide so the user frames the profile. */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-4 rounded-full border-2 border-dashed border-white/80"
              />
            </div>

            <input
              type="range"
              min={1}
              max={4}
              step={0.01}
              value={zoom}
              onChange={onZoom}
              className="w-56 max-w-full accent-nb-ink"
              aria-label="Zoom foto"
            />
          </div>

          {/* Live avatar-style preview + reset. */}
          <div className="space-y-2">
            <span className="block text-xs font-bold uppercase text-zinc-600">
              Hasil
            </span>
            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={preview}
                alt="Pratinjau hasil crop"
                className="size-24 border-2 border-nb-ink object-cover"
              />
            ) : (
              <div className="size-24 border-2 border-nb-ink bg-zinc-100" />
            )}
            <button
              type="button"
              onClick={clear}
              className="nb-btn bg-nb-pink px-3 py-1 text-xs"
            >
              Hapus
            </button>
          </div>
        </div>
      )}

      <span className="block text-xs text-zinc-500">{hint}</span>
    </div>
  );
}
