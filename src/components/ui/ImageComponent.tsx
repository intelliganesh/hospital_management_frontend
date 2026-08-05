import View from "@/components/view";
import placeholder from "@/assets/placeholder.png";
import { useEffect, useRef, useState } from "react";
import { ImageComponentProps } from "@/interfaces/image";

const ImageComponent: React.FC<ImageComponentProps> = ({
  src = "",
  width = "100%",
  height = "100%",
  className = "",
  objectFit = "cover",
  alt = "Hospital Logo",
}) => {
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);

  useEffect(() => {
    let observer: IntersectionObserver | null = null;
    const imageRefData = imageRef.current;

    if (imageRefData) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const img = new Image();
              img.src = src;
              img.onload = () => {
                setImageLoaded(true);
              };
              observer?.disconnect();
            }
          });
        },
        {
          rootMargin: "0px 0px 20px 0px",
        }
      );

      observer.observe(imageRefData);
    }

    return () => {
      observer?.disconnect();
    };
  }, [src]);

  return (
    <View
      className={`relative`}
      style={{
        width: typeof width === "number" ? `${width}px` : width,
        height: typeof height === "number" ? `${height}px` : height,
      }}
    >
      {!imageLoaded && (
        <View className="absolute inset-0 animate-pulse bg-gray-200 rounded-lg">
          {null}
        </View>
      )}

      <img
        ref={imageRef}
        alt={alt}
        className={`${className} transition-opacity duration-300 ${
          imageLoaded ? "opacity-100" : "opacity-0"
        }`}
        src={src || placeholder}
        style={{ objectFit }}
        width={width}
        height={height}
      />
    </View>
  );
};

export default ImageComponent;
