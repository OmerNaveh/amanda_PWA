export const hexToRgb = (hex: string): string => {
  hex = hex.replace(/^#/, "");

  let r: number = parseInt(hex.substring(0, 2), 16);
  let g: number = parseInt(hex.substring(2, 4), 16);
  let b: number = parseInt(hex.substring(4, 6), 16);

  return `${r},${g},${b}`;
};
