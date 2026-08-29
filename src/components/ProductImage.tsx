"use client";

import Image from "next/image";
import { useState } from "react";
import { ProductImageFallback } from "@/components/ProductActions";

// Renders a product image and gracefully falls back to a branded placeholder
// when the URL is missing or fails to load (e.g. a Storage object that no
// longer exists). This prevents blank/broken image areas in the UI.
export function ProductImage({
  src,
  alt,
  className,
  sizes,
  priority,
}: {
  src: string | null | undefined;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const [errored, setErrored] = useState(false);

  if (!src || errored) {
    return <ProductImageFallback />;
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className={className}
      onError={() => setErrored(true)}
    />
  );
}
