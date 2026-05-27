import { useState, useEffect, useRef, useCallback } from "react";
import { useDisplay } from "../context/DisplayContext";

interface SkinPreviewProps {
  skin: string;
}

const MOUSE_THROTTLE_MS = 16;

export function SkinPreview({ skin }: SkinPreviewProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const { brightness, displayOn, hueShift, rotation } = useDisplay();

  useEffect(() => {
    setLoaded(false);
    setError(false);
  }, [skin]);

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastMouseSend = useRef(0);

  const postToIframe = useCallback((message: { type: string; x?: number; y?: number }) => {
    const iframe = iframeRef.current;
    if (!iframe?.contentWindow) return;
    iframe.contentWindow.postMessage(message, "*");
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const now = performance.now();
      if (now - lastMouseSend.current < MOUSE_THROTTLE_MS) return;
      lastMouseSend.current = now;
      const rect = e.currentTarget.getBoundingClientRect();
      const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
      postToIframe({ type: "mousemove", x, y });
    },
    [postToIframe],
  );

  const handleClick = useCallback(() => {
    postToIframe({ type: "click" });
  }, [postToIframe]);

  const src = `/skins/${skin}/index.html`;

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full"
      onMouseMove={handleMouseMove}
      onClick={handleClick}
    >
      {!loaded && !error && (
        <div className="absolute inset-0 flex items-center justify-center text-[11px] text-gray-600">
          Loading skin...
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center text-[11px] text-gray-600">
          Skin not available
        </div>
      )}
      <iframe
        ref={iframeRef}
        src={src}
        title={`${skin} skin preview`}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        className="w-full h-full border-0"
        style={{
          opacity: displayOn && loaded && !error ? 1 : 0,
          filter: `brightness(${brightness / 100})${hueShift ? " hue-rotate(180deg)" : ""}`,
          transform: `rotate(${rotation}deg)`,
          transition: "opacity 0.2s, filter 0.2s, transform 0.3s",
        }}
        sandbox="allow-scripts allow-same-origin"
      />
    </div>
  );
}
