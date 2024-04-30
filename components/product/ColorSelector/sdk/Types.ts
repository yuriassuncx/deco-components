import type { Product } from "apps/commerce/types.ts";
import { SpecificationsDictionary } from "../../../../loaders/ArCo/getListOfSpecifications.tsx";
import { AnatomyClasses } from "../../../../sdk/styles.ts";

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

export type ColorSelectorStyles = AnatomyClasses<typeof anatomy[number]>;

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
  classes?: ColorSelectorStyles;
  showUnavailableProducts?: boolean;
  orderByColorSpecificationPosition?: boolean;
}
