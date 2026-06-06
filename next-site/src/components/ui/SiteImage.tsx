import Image, { type ImageProps } from "next/image";

type SiteImageProps = Omit<ImageProps, "fill" | "width" | "height"> & {
  fill?: boolean;
  width?: number;
  height?: number;
};

export function SiteImage({
  fill,
  width,
  height,
  alt,
  className,
  sizes,
  ...rest
}: SiteImageProps) {
  if (fill) {
    return (
      <Image
        alt={alt}
        fill
        className={className}
        sizes={sizes ?? "(max-width: 768px) 100vw, 50vw"}
        {...rest}
      />
    );
  }

  return (
    <Image
      alt={alt}
      width={width ?? 800}
      height={height ?? 600}
      className={className}
      sizes={sizes}
      {...rest}
    />
  );
}
