import { TextBaseProps } from "@/interfaces/components/text";

const textColorObj = {
  p: "text-base",
  span: "text-base",
  h1: "text-2xl",
  h2: "text-xl",
  h3: "text-lg",
  h4: "text-base",
  h5: "text-sm",
  h6: "text-xs",
  label: "text-sm",
  "": "text-orange-500",
};

// const variantObj: Record<VariantTypes, string> = {
//   "heading": "text-2xl font-bold",
//   "subheading": "text-xl font-semibold",
//   "body": "text-base font-medium",
//   "caption": "text-sm font-medium",
//   "label": "text-sm font-medium",
//    "span": "text-muted-foreground",
//    "p":"font-medium"
// }

const Text: React.FC<TextBaseProps> = ({
  as = "p",
  style = {},
  className = "",
  children = "...",
  weight = "font-medium",
  variant = "p",
  ...props
}) => {
  const Tag = as;

  return (
    <Tag
      {...props}
      style={style}
      className={`${textColorObj[as]} ${weight} ${className}`}
    >
      {children}
    </Tag>
  );
};

export default Text;
