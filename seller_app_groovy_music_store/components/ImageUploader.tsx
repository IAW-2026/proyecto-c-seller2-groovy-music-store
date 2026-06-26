"use client";

import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { useState } from "react";

interface Props {
  value: string[];
  onChange: (urls: string[]) => void;
}

export default function ImageUploader({ value, onChange }: Props) {
  const [imagenes, setImagenes] = useState<string[]>(value);

  function handleUpload(result: unknown) {
    const res = result as { info?: { secure_url?: string } };
    const url = res?.info?.secure_url;
    if (url) {
      const nuevas = [...imagenes, url];
      setImagenes(nuevas);
      onChange(nuevas);
    }
  }

  function handleEliminar(index: number) {
    const nuevas = imagenes.filter((_, i) => i !== index);
    setImagenes(nuevas);
    onChange(nuevas);
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-3">
        {imagenes.map((url, index) => (
          <div
            key={index}
            className="relative w-24 h-24 rounded-lg overflow-hidden border border-border group"
          >
            <Image
              src={url}
              alt={`Imagen ${index + 1}`}
              fill
              sizes="96px"
              className="object-cover"
            />
            <button
              type="button"
              onClick={() => handleEliminar(index)}
              className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center font-dm text-xs"
            >
              Eliminar
            </button>
          </div>
        ))}
      </div>

      <CldUploadWidget
        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
        onSuccess={handleUpload}
        options={{
          maxFiles: 5,
          resourceType: "image",
          clientAllowedFormats: ["jpg", "jpeg", "png", "webp"],
          maxFileSize: 5000000,
        }}
      >
        {({ open }) => (
          <button
            type="button"
            onClick={() => open()}
            className="font-dm text-sm border border-border px-4 py-2.5 rounded-lg hover:bg-background transition-colors text-medium"
          >
            + Agregar imagen
          </button>
        )}
      </CldUploadWidget>

      <input
        type="hidden"
        name="imagenes"
        value={JSON.stringify(imagenes)}
      />
    </div>
  );
}