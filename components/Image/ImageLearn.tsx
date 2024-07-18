import Image from "next/image";

interface ImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
}

const ImageComponent: React.FC<ImageProps> = ({ src, alt, width, height, priority = false }) => {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading={priority ? "eager" : "lazy"}
      className="" 
    />
  );
};

export default ImageComponent;