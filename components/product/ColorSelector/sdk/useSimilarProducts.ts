import type { Product } from "apps/commerce/types.ts";
import { useMemo } from "preact/hooks";
import { Specification } from "deco-components/loaders/storeConfig.ts";

export const COLOR_FALLBACK_IMG = "/image/thumbnail-error.png";

export interface ProductWithColorProperties extends Product {
  color: string;
  specificColor: string;
  isAvailable: boolean;
  thumbnail: string;
  position: number;
}

function useSimilarProducts({
  seller,
  product,
  colorsSpecification,
  colorThumbnailKey,
  specificColorFieldName,
}: {
  product: Product;
  colorsSpecification: Specification | undefined;
  colorThumbnailKey: string;
  specificColorFieldName: string;
  seller: string;
}) {
  if (!product || !colorsSpecification || !specificColorFieldName) {
    return {
      extendedProduct: product as ProductWithColorProperties,
      similars: [],
    };
  }

  const [extendedProduct, ...similars]: ProductWithColorProperties[] = useMemo(() => [product, ...product.isSimilarTo ?? []]
    .map((similar) => {
      const properties = similar.isVariantOf?.additionalProperty ?? [];
      let color = "";
      let specificColor = ""

      // Imperative, but just one iteration
      properties.forEach((prop) => {
        if (prop.name === colorsSpecification.fieldName) {
          color = prop.value ?? "";
        } else if (prop.name === specificColorFieldName) {
          specificColor = prop.value ?? "";
        }
      });

      const thumbnail = similar.image?.find((img) =>
        img.name === colorThumbnailKey
      )?.url ?? COLOR_FALLBACK_IMG;

      const position =
        colorsSpecification.values?.[color]?.Position ??
        999;

      const offer = similar.offers?.offers.find((of) =>
        of.seller === seller
      );
      const isAvailable = (offer?.inventoryLevel.value ?? 0) > 0;

      return {
        ...similar,
        color,
        specificColor,
        isAvailable,
        thumbnail,
        position,
      };
    }), [product, colorsSpecification, colorThumbnailKey, specificColorFieldName, seller]);

  return {
    extendedProduct,
    similars,
  };
}

export default useSimilarProducts;
