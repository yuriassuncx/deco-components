import type { Product } from "apps/commerce/types.ts";
import { SpecificationsDictionary } from "deco-sites/simples/loaders/ArCo/getListOfSpecifications.tsx";
import { DynamicStyle } from "deco-sites/simples/common/sdk/styles.ts";

export type { SpecificationsDictionary };

const anatomy = [
  "container",
  "optionsContainer",
  "optionAnchor",
  "option",
  "optionHover",
  "optionActive",
  "optionImage",
];

export type ColorSelectorStyles = Record<typeof anatomy[number], DynamicStyle>;

export type ColorSelectorConstants = {
  colorKey: string;
  specificColorKey: string;
  colorThumbnailLabel: string;
};

export interface ColorSelectorProps {
  product: Product;
  seller: string;
  colorsSpecification: SpecificationsDictionary;
  constants: ColorSelectorConstants;
  styles?: ColorSelectorStyles;
  showUnavailableProducts?: boolean;
  orderByColorSpecificationPosition?: boolean;
}
