import type { Product } from "apps/commerce/types.ts";
import { useEffect, useMemo } from "preact/hooks";
import { handleClasses } from "../../../../sdk/styles.ts";
import { usePDP } from "../../../../sdk/usePDP.ts";
import { mapProductToSku } from "../../../../sdk/useVariantPossibilitiesClientSide.ts";
import { ColorSelectorProps } from "../sdk/Types.ts";
import useSimilarProducts, {
  COLOR_FALLBACK_IMG,
} from "../sdk/useSimilarProducts.ts";

export type Props = ColorSelectorProps;

function ColorSelector(
  {
    product,
    seller,
    classes,
    constants,
    colorsSpecification,
    showUnavailableProducts,
    orderByColorSpecificationPosition = true,
  }: Props,
) {
  const { productSelected, skuSelected } = usePDP();

  const unorderedSimilarProducts = useSimilarProducts({
    product,
    seller,
    constants,
    colorsSpecification,
  });

  const similarProducts = useMemo(() => {
    if (!orderByColorSpecificationPosition) {
      return unorderedSimilarProducts;
    }

    return unorderedSimilarProducts.sort(
      (
        { productID: currentId, position: currentPosition },
        { productID: nextId, position: nextPosition },
      ) => {
        // Order by position first, then by productID
        if (currentPosition > nextPosition) return 1;
        if (currentPosition < nextPosition) return -1;

        return Number(currentId) - Number(nextId);
      },
    );
  }, [unorderedSimilarProducts]);

  function onSelectProduct(product: Product) {
    productSelected.value = product;
    const obj = { Title: product?.name!, Url: product?.url };
    history.pushState(obj, obj.Title, obj.Url);
    skuSelected.value = mapProductToSku(product);
  }

  useEffect(() => {
    productSelected.value = product;
    skuSelected.value = mapProductToSku(product);
  }, []);

  if (similarProducts.length === 0) {
    return null;
  }

  return (
    <ul class={handleClasses("flex gap-1 items-center", classes?.container)}>
      {similarProducts.map((similar) => {
        const { specificColor, colorImg, isAvailable } = similar;

        const isActive =
          similar.productID === productSelected?.value?.productID;

        if (!showUnavailableProducts && !isAvailable) {
          return null;
        }

        return (
          <li>
            <a
              href={similar.url}
              class={handleClasses(
                "flex justify-center items-center cursor-pointer tooltip tooltip-primary transition-colors ease-in-out duration-125",
                classes?.option,
                isActive && classes?.optionActive,
              )}
              data-tip={specificColor}
              onClick={(e) => {
                e.preventDefault();
                onSelectProduct(similar);
              }}
            >
              <img
                class={classes?.optionImage ?? ""}
                src={colorImg ?? COLOR_FALLBACK_IMG} // Won't happen but just in case
                loading="lazy"
                alt={specificColor}
              />
            </a>
          </li>
        );
      })}
    </ul>
  );
}

export default ColorSelector;
