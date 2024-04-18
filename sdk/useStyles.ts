import { DynamicStyle } from "./styles.ts";

export function applyStyle(
  element: string,
  styles: Record<string, DynamicStyle> | undefined,
) {
  if (!styles) {
    return { classes: "", inline: {} };
  }

  return {
    classes: styles?.[element]?.classes ?? "",
    inline: styles?.[element]?.inline ?? {},
  };
}
