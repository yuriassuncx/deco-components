import { clx } from "./clx.ts";

export type AnatomyClasses<T extends string> = {
  [key in T]?: string;
};

// Concat classes or replace classes if override matches "!{}!"
export function handleClasses(
  base: string = "",
  override: string = "",
  ...rest: Array<string | null | undefined | false>
) {
  const isReplace = override.startsWith("!{") && override.endsWith("}!");
  const styleValue = isReplace ? override.slice(2, -2) : override;

  return isReplace ? styleValue : clx(base, styleValue, ...rest);
}
