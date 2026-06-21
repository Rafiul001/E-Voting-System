export const fontWeight = {
  bold: "bold",
  semiBold: "semibold",
  medium: "medium",
  regular: "regular",
} as const;

export type TFontWeight = (typeof fontWeight)[keyof typeof fontWeight];