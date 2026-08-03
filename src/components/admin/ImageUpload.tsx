"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Upload, X, Loader2, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { uploadImage } from "@/lib/admin/actions/upload";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  value: string | null;
  onChange: (url: string | null) => void;
  label?: string;
  aspect?: string;
  className?: string;
}

// Drop an image onto Supabase Storage and emit its public URL. Reused by every
// admin form that needs an image (products, gallery, hero, settings).
export function ImageUpload({
  value,
  onChange,
  label = "Image",
  aspect = "aspect-[4/3]",
  className,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.set("file", file);
      const result = await uploadImage(formData);
      if (result?.error) {
        toast.error(result.error);
        return;
      }
      if (result.url) onChange(result.url);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={className}>
      {label && (
        <label className="mb-1.5 block text-xs font-medium text-zinc-400">{label}</label>
      )}
      <div className="flex items-center gap-4">
        <div
          className={cn(
            "flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]",
            aspect !== "aspect-square" && "w-24"
          )}
        >
          {value ? (
            <Image
              src={value}
              alt={label}
              width={96}
              height={96}
              unoptimized
              className="h-full w-full object-cover"
            />
          ) : (
            <ImageIcon className="h-7 w-7 text-zinc-600" />
          )}
        </div>
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm text-zinc-300 transition hover:border-brand/40 hover:text-brand disabled:opacity-60"
          >
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            {uploading ? "Uploading..." : value ? "Replace" : "Upload"}
          </button>
          {value && (
            <button
              type="button"
              onClick={() => onChange(null)}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm text-zinc-400 transition hover:border-red-500/40 hover:text-red-400"
            >
              <X className="h-4 w-4" />
              Remove
            </button>
          )}
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif,image/avif,image/svg+xml"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
    </div>
  );
}
