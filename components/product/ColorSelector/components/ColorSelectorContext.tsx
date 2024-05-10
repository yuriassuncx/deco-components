import React from "preact/compat";
import { VNode } from "preact";
import { useMemo } from "preact/hooks";
import useSimilarProducts from "../sdk/useSimilarProducts.ts";
import { useProduct } from "../../ProductContext.tsx";
import { Specification } from "deco-components/loaders/storeConfig.ts";

export interface Props {
  seller: string;
  colorsSpecification: Specification | undefined;
  specificColorsSpecification: Specification | undefined;
  colorThumbnailKey: string;
  bringCurrentColorToFront?: boolean,
  orderByColorSpecificationPosition?: boolean,
  showUnavailableColors?: boolean,
  children: VNode | VNode[]
}

function ColorSelectorContext(
  {
    seller,
    colorThumbnailKey,
    colorsSpecification,
    specificColorsSpecification,
    orderByColorSpecificationPosition = true,
    bringCurrentColorToFront = true,
    showUnavailableColors = false,
    children,
  }: Props,
) {
  const { productSignal } = useProduct();
  const product = productSignal.value;

  const {
    extendedProduct,
    similars: unorderedSimilarProducts,
  } = useSimilarProducts({
    product,
    seller,
    colorsSpecification,
    colorThumbnailKey,
    specificColorFieldName: specificColorsSpecification?.fieldName ?? "",
  });

  const similarProducts = useMemo(() => {
    if (!orderByColorSpecificationPosition) {
      return [extendedProduct, ...unorderedSimilarProducts];
    }

    const arrayToOrder = bringCurrentColorToFront
      ? unorderedSimilarProducts
      : [extendedProduct, ...unorderedSimilarProducts]

    const orderedList = arrayToOrder.sort(
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

    const similars = bringCurrentColorToFront
      ? [extendedProduct, ...orderedList]
      : orderedList;

    return showUnavailableColors
      ? similars.filter(({ isAvailable }) => isAvailable)
      : similars;
  }, [
    extendedProduct, 
    unorderedSimilarProducts, 
    bringCurrentColorToFront, 
    showUnavailableColors
  ]);

  const childrenProps = useMemo(() => ({
    options: similarProducts,
  }), [similarProducts])

  if (similarProducts.length === 0) {
    return null;
  }

  return (
    <>
      {Array.isArray(children)
          ? React.Children.map(children, (child) =>
            React.isValidElement(child)
              ? React.cloneElement(child, childrenProps)
              : child
          )
          : React.isValidElement(children)
            ? React.cloneElement(children, childrenProps)
            : null
      }
    </>
  )
}

export default ColorSelectorContext;
