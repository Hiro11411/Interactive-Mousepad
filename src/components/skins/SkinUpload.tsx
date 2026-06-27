import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import type { ChangeEvent, DragEvent } from "react";
import { message } from "@tauri-apps/plugin-dialog";
import { Button } from "../shared/Button";
import { useLogs } from "../../context/LogContext";
import { invoke } from "@tauri-apps/api/core"

const MAX_MB = 25;
const MAX_BYTES = MAX_MB * 1024 * 1024;

const ACCEPT_ATTR = ".png,.jpg,.jpeg,.webp,.mp4";

const IMAGE_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
]);
const VIDEO_TYPES = new Set(["video/mp4"]);

type MediaKind = "image" | "video";
type UploadStatus = "pending" | "saving" | "saved" | "failed";

interface MediaItem {
  id: string;
  file: File;
  url: string;
  kind: MediaKind;
  status: UploadStatus;
}

function classifyFile(file: File): MediaKind | null {
  if (IMAGE_TYPES.has(file.type)) return "image";
  if (VIDEO_TYPES.has(file.type)) return "video";
  return null;
}

function rejectionReason(file: File): string | null {
  if (file.type === "image/gif") {
    return `${file.name}: GIF not supported — please use MP4 for animated skins.`;
  }
  if (classifyFile(file) === null) {
    return `${file.name}: unsupported type (${file.type || "unknown"}) — allowed: PNG, JPG, WEBP, MP4.`;
  }
  if (file.size > MAX_BYTES) {
    return `${file.name}: too large (${formatSize(file.size)}) — max ${MAX_MB}MB.`;
  }
  return null;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

//encoding in base64 in order to decode
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result !== "string") {
        reject(new Error("Unexpected reader result"));
        return;
      }
      const comma = result.indexOf(",");
      resolve(comma >= 0 ? result.slice(comma + 1) : result);
    };
    reader.onerror = () => reject(reader.error ?? new Error("Read failed"));
    reader.readAsDataURL(file);
  });
}

export function SkinUpload() {
  const { addLog } = useLogs();
  const [items, setItems] = useState<MediaItem[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [saving, setSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keep a live ref to items so the unmount cleanup can revoke every blob URL
  // without re-running on each items change.
  const itemsRef = useRef<MediaItem[]>([]);
  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  useEffect(() => {
    return () => {
      itemsRef.current.forEach((item) => URL.revokeObjectURL(item.url));
    };
  }, []);

  const addFiles = useCallback(
    (fileList: FileList | null) => {
      if (!fileList || fileList.length === 0) return;

      const accepted: MediaItem[] = [];
      const rejected: string[] = [];

      for (const file of Array.from(fileList)) {
        const reason = rejectionReason(file);
        if (reason) {
          rejected.push(reason);
          continue;
        }
        const kind = classifyFile(file);
        if (kind === null) continue; // already covered by rejectionReason
        accepted.push({
          id: `${file.name}-${file.size}-${file.lastModified}`,
          file,
          url: URL.createObjectURL(file),
          kind,
          status: "pending",
        });
      }

      if (accepted.length > 0) {
        setItems((prev) => {
          const existing = new Set(prev.map((p) => p.id));
          const fresh = accepted.filter((a) => {
            if (existing.has(a.id)) {
              URL.revokeObjectURL(a.url); // duplicate — don't leak its blob
              return false;
            }
            return true;
          });
          fresh.forEach((f) => addLog(`Media added: ${f.file.name}`));
          return [...prev, ...fresh];
        });
      }

      setErrors(rejected);
      rejected.forEach((r) => addLog(`Media rejected: ${r}`));
    },
    [addLog],
  );

  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      addFiles(e.target.files);
      e.target.value = ""; // allow re-selecting the same file
    },
    [addFiles],
  );

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDragActive(false);
      addFiles(e.dataTransfer.files);
    },
    [addFiles],
  );

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
  }, []);

  const handleRemove = useCallback((id: string) => {
    setItems((prev) => {
      const target = prev.find((p) => p.id === id);
      if (target) URL.revokeObjectURL(target.url);
      return prev.filter((p) => p.id !== id);
    });
  }, []);

  const handleBrowse = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const handleSave = useCallback(async () => {
    const pending = items.filter(
      (i) => i.status === "pending" || i.status === "failed",
    );
    if (pending.length === 0) {
      addLog("No new media to save");
      return;
    }

    setSaving(true);
    for (const item of pending) {
      setItems((prev) =>
        prev.map((p) => (p.id === item.id ? { ...p, status: "saving" } : p)),
      );
      addLog(`Saving: ${item.file.name}`);
      try {
        //encoding the file to base64
        const base64 = await fileToBase64(item.file);
        //base64 encoding here then decode
        //payload shape for you to decide yourself
        const payload = {
          filename: item.file.name,
          data: base64,
        }
        const savedpath = await invoke<string>("save_skin_media", payload)
        addLog(`Saved to ${savedpath}`)
        // transport (base64 vs raw bytes vs temp path) is yours to finalize.
        // import { invoke } from "@tauri-apps/api/core" when wiring this up.
        void base64;
        // await invoke("save_skin_media", {
        //   filename: item.file.name,
        //   mimeType: item.file.type,
        //   kind: item.kind,
        //   data: base64,
        // });

        //on sucess mark as saved, on error mark as failed
        setItems((prev) =>
          prev.map((p) => (p.id === item.id ? { ...p, status: "saved" } : p)),
        );
        addLog(`Saved: ${item.file.name}`);
      } catch (err) {
        setItems((prev) =>
          prev.map((p) => (p.id === item.id ? { ...p, status: "failed" } : p)),
        );
        addLog(`Save failed: ${item.file.name} — ${err}`);
        await message(`${item.file.name}\n\n${err}`, {
          title: "Save failed",
          kind: "error",
        });
      }
    }
    setSaving(false);
  }, [items, addLog]);

  return (
    <section className="border border-[#222] bg-[#111]">
      <header className="px-5 py-3 border-b border-[#222] text-[10px] uppercase tracking-widest text-gray-600">
        Upload Media
      </header>

      <div className="px-5 py-5 space-y-5">
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`border border-dashed bg-[#0A0A0A] px-6 py-10
            flex flex-col items-center justify-center text-center gap-3
            transition-colors duration-150
            ${dragActive ? "border-rose-600" : "border-[#333]"}`}
        >
          <p className="text-xs text-gray-400">
            Drag and drop media here
          </p>
          <Button onClick={handleBrowse}>Browse Files</Button>
          <p className="text-[10px] uppercase tracking-widest text-gray-600">
            PNG · JPG · WEBP · MP4 — max {MAX_MB}MB each
          </p>
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPT_ATTR}
            multiple
            onChange={handleInputChange}
            className="hidden"
          />
        </div>

        {errors.length > 0 ? (
          <ul className="space-y-1">
            {errors.map((err) => (
              <li key={err} className="text-[11px] text-red-500">
                {err}
              </li>
            ))}
          </ul>
        ) : null}

        {items.length > 0 ? (
          <>
            <div
              className="grid gap-4"
              style={{
                gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
              }}
            >
              {items.map((item) => (
                <MediaPreviewCard
                  key={item.id}
                  item={item}
                  onRemove={handleRemove}
                />
              ))}
            </div>

            <div className="flex items-center gap-3 pt-2 border-t border-[#1A1A1A]">
              <Button
                variant="primary"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? "Saving…" : "Save to Library"}
              </Button>
              <span className="text-[10px] uppercase tracking-widest text-gray-600">
                {items.length} item{items.length === 1 ? "" : "s"}
              </span>
            </div>
          </>
        ) : null}
      </div>
    </section>
  );
}

interface MediaPreviewCardProps {
  item: MediaItem;
  onRemove: (id: string) => void;
}

function statusColor(status: UploadStatus): string {
  if (status === "saved") return "text-green-500";
  if (status === "failed") return "text-red-500";
  if (status === "saving") return "text-rose-600";
  return "text-gray-600";
}

function MediaPreviewCard({ item, onRemove }: MediaPreviewCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleEnter = useCallback(() => {
    void videoRef.current?.play();
  }, []);

  const handleLeave = useCallback(() => {
    const el = videoRef.current;
    if (el) {
      el.pause();
      el.currentTime = 0;
    }
  }, []);

  return (
    <div className="bg-[#0A0A0A] border border-[#222] overflow-hidden">
      <div
        className="relative w-full bg-black overflow-hidden"
        style={{ aspectRatio: "1 / 1" }}
        onMouseEnter={item.kind === "video" ? handleEnter : undefined}
        onMouseLeave={item.kind === "video" ? handleLeave : undefined}
      >
        {item.kind === "image" ? (
          <img
            src={item.url}
            alt={item.file.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <video
            ref={videoRef}
            src={item.url}
            muted
            loop
            playsInline
            preload="metadata"
            className="w-full h-full object-cover"
          />
        )}
        <button
          type="button"
          onClick={() => onRemove(item.id)}
          title="Remove"
          className="absolute top-1 right-1 w-6 h-6 flex items-center justify-center
            bg-black/70 text-gray-300 hover:text-white hover:bg-rose-600
            transition-colors duration-150 text-xs"
        >
          ×
        </button>
        {item.kind === "video" ? (
          <span className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-black/70 text-[9px] uppercase tracking-widest text-gray-300">
            MP4
          </span>
        ) : null}
      </div>
      <div className="px-3 py-2 space-y-1">
        <div className="text-[11px] text-gray-300 truncate" title={item.file.name}>
          {item.file.name}
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] text-gray-600 tabular-nums">
            {formatSize(item.file.size)}
          </span>
          <span
            className={`text-[10px] uppercase tracking-widest ${statusColor(item.status)}`}
          >
            {item.status}
          </span>
        </div>
      </div>
    </div>
  );
}
