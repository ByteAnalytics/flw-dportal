import { useEffect, useRef, useState } from "react";

interface UseAvatarProps {
  imageSrc?: string;
  name?: string;
  textCount?: number;
}

export function useAvatar({
  imageSrc,
  name = "",
  textCount = 2,
}: UseAvatarProps) {
  const [validImageSrc, setValidImageSrc] = useState<string | null>(
    imageSrc ?? null
  );
  const usingValidImage = useRef(true);

  useEffect(() => {
    if (!imageSrc) {
      setValidImageSrc(null);
      return;
    }

    const img = new window.Image();
    img.onerror = () => {
      setValidImageSrc(null);
      usingValidImage.current = false;
    };
    img.onload = () => {
      setValidImageSrc(imageSrc);
      usingValidImage.current = true;
    };
    img.src = imageSrc;
  }, [imageSrc]);

  const getInitials = () =>
    name
      .trim()
      .split(" ")
      .slice(0, textCount)
      .map((part) => part[0]?.toUpperCase())
      .join("");

  return { validImageSrc, getInitials };
}
