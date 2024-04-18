import type { Product } from "apps/commerce/types.ts";
import { useMemo } from "preact/hooks";

import type {
  ColorSelectorConstants,
  SpecificationsDictionary,
} from "../components/product/ColorSelector/Types.ts";

export const COLOR_FALLBACK_IMG = "/image/thumbnail-error.png";

function useSimilarProducts({
  product: baseProduct,
  colorsSpecification,
  constants,
  seller,
}: {
  product: Product;
  colorsSpecification: SpecificationsDictionary;
  constants: ColorSelectorConstants;
  seller: string;
}) {
  if (!baseProduct) {
    return [];
  }

  const similarProducts = useMemo(() => {
    return [...baseProduct.isSimilarTo ?? [], baseProduct]
      .map((product) => {
        const properties = product.isVariantOf?.additionalProperty ?? [];
        const colorPropertiesNames = { color: "", specificColor: "" };

        // Imperative, but just one iteration
        properties.forEach((prop) => {
          if (prop.name === constants.colorKey) {
            colorPropertiesNames.color = prop.value ?? "";
          } else if (prop.name === constants.specificColorKey) {
            colorPropertiesNames.specificColor = prop.value ?? "";
          }
        });

        const colorImg = product.image?.find((img) =>
          img.name === constants.colorThumbnailLabel
        )?.url ?? COLOR_FALLBACK_IMG;

        const position =
          colorsSpecification?.[colorPropertiesNames.color]?.Position ??
            999;

        const offer = product.offers?.offers.find((of) =>
          of.seller === seller
        );
        const isAvailable = (offer?.inventoryLevel.value ?? 0) > 0;

        return {
          ...product,
          ...colorPropertiesNames,
          isAvailable,
          colorImg,
          position,
        };
      });
  }, [baseProduct, colorsSpecification, constants]);

  return similarProducts;
}

export default useSimilarProducts;
