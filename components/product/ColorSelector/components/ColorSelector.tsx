import type { Product } from "apps/commerce/types.ts";
import { useMemo } from "preact/hooks";
import { handleClasses } from "../../../../sdk/styles.ts";
import { mapProductToSku } from "../../../../sdk/useVariantPossibilitiesClientSide.ts";
import { ColorSelectorProps } from "../sdk/Types.ts";
import useSimilarProducts, {
  COLOR_FALLBACK_IMG,
} from "../sdk/useSimilarProducts.ts";
import { useProduct } from "../../ProductContext.tsx";

export type Props = ColorSelectorProps;

function ColorSelector(
  {
    seller,
    classes,
    constants,
    colorsSpecification,
    showUnavailableProducts,
    orderByColorSpecificationPosition = true,
  }: Props,
) {
  const { productSignal, skuSelectedSignal } = useProduct();

  const product = productSignal.value;
  const skuSelected = skuSelectedSignal.value;
  // console.log(product, product.isSimilarTo)

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
    productSignal.value = product;
    const obj = { Title: product?.name!, Url: product?.url };
    history.pushState(obj, obj.Title, obj.Url);
    skuSelectedSignal.value = mapProductToSku(product);
  }

  if (similarProducts.length === 0) {
    return null;
  }

  return (
    <ul class={handleClasses("flex gap-1 items-center", classes?.container)}>
      {similarProducts.map((similar) => {
        const { specificColor, colorImg, isAvailable } = similar;

        const isActive =
          similar.productID === product?.productID;

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
