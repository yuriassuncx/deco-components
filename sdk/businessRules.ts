import { SpecificationsDictionary } from "../loaders/ArCo/getListOfSpecifications.tsx";

export interface BusinessRules {
  listOfColors?: SpecificationsDictionary;
  listOfSizes?: SpecificationsDictionary;
  colorThumbnailAtrributeName?: "alternateName" | "name";
  colorThumbnailAttributeValue?: string;
  colorPropName?: string;
  colorSortName?: string;
}
