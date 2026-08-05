export interface ImageComponentProps {
  src?: string;
  width?: string | number;
  height?: string | number;
  className?: string;
  objectFit?: React.CSSProperties["objectFit"];
  alt?: string;
}

export interface UploadImageProps {
  id: string;
  modal_type: string;
  file_name: string;
  folder_name: string;
  image: File | string;
}
