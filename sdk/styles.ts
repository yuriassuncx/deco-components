export interface DynamicStyle {
  classes?: string;
  inline?: InlineStyle;
}

/* @titleBy key */
export interface InlineStyle {
  [key: string]: string;
}

export type AnatomyStyles<T extends string> = {
  [key in T]?: DynamicStyle;
};

export interface GenericStyle {
  [key: string]: DynamicStyle | undefined;
}

export function applyStyle(style: GenericStyle, element: string) {
  return {
    classes: style?.[element]?.classes ?? "",
    inline: style?.[element]?.inline ?? {},
  };
}
