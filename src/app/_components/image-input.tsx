"use client";

import { env } from "@/env";
import { toast } from "@/components/ui/use-toast";
import { useRef } from "react";

export default function ImageInput({
  src,
  alt,
  onChange,
}: {
  src: string;
  alt: string;
  onChange: (e: string) => void;
  className?: string;
}) {
  const ref = useRef<HTMLInputElement>(null);

  const uploadToImgur = async (file: File) => {
    const clientId = env.NEXT_PUBLIC_IMGUR_CLIENT_ID;
    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch("https://api.imgur.com/3/image", {
      method: "POST",
      headers: {
        Authorization: `Client-ID ${clientId}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to upload image");
    }

    const data = (await response.json()) as {
      data: {
        link: string;
      };
    };
    return data.data.link;
  };

  const handleUploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files![0];
    if (file) {
      try {
        const url = await uploadToImgur(file);
        onChange(url);
      } catch (error) {
        toast({
          title: "Failed to upload image",
          description: "Please try again",
        });
      }
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div className="relative h-12 w-12 rounded-md">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          className="absolute inset-0 z-0 aspect-square h-12 w-auto cursor-pointer rounded-md object-cover transition-all hover:scale-110"
          onClick={() => ref.current?.click()}
        />
      </div>
      <input
        type="file"
        onChange={handleUploadFile}
        className="hidden"
        accept="image/*"
        ref={ref}
      />
    </div>
  );
}
