import type { PropsWithChildren } from "react";
import { fontWeight, type TFontWeight } from "../utils/utils";
import type { JSX } from "react/jsx-runtime";

const Text: React.FC<
  PropsWithChildren & {
    size?: 1 | 2 | 3 | 4 | 5 | 6; // heading levels
    weight?: TFontWeight;
    color?: "primary" | "danger" | "success" | "blue";
    className?: string;
    onClick?: () => void;
  }
> = ({
  children,
  size = 6,
  weight = fontWeight.regular,
  color = "primary",
  className,
  onClick,
}) => {
  // map size → Tailwind text sizes
  const sizeClasses: Record<number, string> = {
    1: "text-4xl",
    2: "text-3xl",
    3: "text-2xl",
    4: "text-xl",
    5: "text-lg",
    6: "text-base",
  };

  // map weight → Tailwind font weights
  const weightClasses: Record<TFontWeight, string> = {
    bold: "font-bold",
    semibold: "font-semibold",
    medium: "font-medium",
    regular: "font-normal",
  };

  const colorClasses: Record<string, string> = {
    primary: "text-black",
    danger: "text-red-500",
    blue: "text-indigo-500",
    success: "text-teal-500",
  };

  const cn = `${sizeClasses[size]} ${weightClasses[weight]} ${colorClasses[color]} ${className}`;
  const Tag = `h${size}` as keyof JSX.IntrinsicElements;

  return (
    <Tag className={cn} onClick={onClick}>
      {children}
    </Tag>
  );
};

export default Text;
