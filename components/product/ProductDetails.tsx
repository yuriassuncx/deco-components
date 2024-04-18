import { BreadcrumbList, Product } from "apps/commerce/types.ts";
import { usePDP } from "../../sdk/usePDP.ts";
import { mapProductToSku } from "../../sdk/useVariantPossibilitiesClientSide.ts";
import { useOffer } from "../../../sdk/useOffer.ts";
import { formatPrice } from "../../../sdk/format.ts";
import { useEffect, useState } from "preact/hooks";
import ColorSelector from "deco-sites/simples/islands/ColorSelector.tsx";
import ProductSelector from "../../../islands/ProductVariantSelector.tsx";
import AddToCartButtonVTEX from "../../../islands/AddToCartButton/vtex.tsx";
import WishlistButtonVtex from "../../../islands/WishlistButton/vtex.tsx";
import OutOfStock from "../../../islands/OutOfStock.tsx";
import ShippingSimulation from "../../../islands/ShippingSimulationPDP.tsx";
import { mapProductToAnalyticsItem } from "apps/commerce/utils/productToAnalyticsItem.ts";
import Breadcrumb from "../ui/Breadcrumb.tsx";
import { ColorSelectorStyles } from "deco-sites/simples/common/components/product/ColorSelector/Types.ts";
import { BusinessRules } from "deco-sites/simples/common/sdk/businessRules.ts";

export interface Props {
  product: Product;
  layout?: {
    /**
     * @title Product Name
     * @description How product title will be displayed. Concat to concatenate product and sku names.
     * @default product
     */
    name?: "concat" | "productGroup" | "product";
  };
  businessRules: BusinessRules;
  similarSelectorStyle?: ColorSelectorStyles;
  breadcrumbList: BreadcrumbList;
  /**
   * @title Show Out of stock products
   * @description Should out of stock products appear in the similar or not
   * @default true
   */
  showUnavailableProductsInSimilarProductsSelector?: boolean;
}

export default function ProductDetails(
  {
    product,
    layout,
    breadcrumbList,
    businessRules,
    similarSelectorStyle,
    showUnavailableProductsInSimilarProductsSelector,
  }: Props,
) {
  const { productSelected, skuSelected } = usePDP();
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const selectedProduct = productSelected.value ?? product;
  const { gtin, name, isVariantOf, offers } = selectedProduct;
  const { productID } = skuSelected.value ?? product;
  const productGroupID = isVariantOf?.productGroupID ?? "";

  const description = productSelected.value?.description ||
    product.description || isVariantOf?.description;
  const breadcrumb = {
    ...breadcrumbList,
    itemListElement: breadcrumbList?.itemListElement.slice(0, -1),
    numberOfItems: breadcrumbList.numberOfItems - 1,
  };

  const {
    price = 0,
    listPrice,
    seller = "1",
    installments,
    availability,
  } = skuSelected.value?.offer ?? useOffer(offers);

  const eventItem = mapProductToAnalyticsItem({
    product: productSelected.value ?? product,
    breadcrumbList: breadcrumb,
    price,
    listPrice,
  });

  const colorName = productSelected.value?.isVariantOf?.additionalProperty
    ?.find((prop) => prop.name === businessRules.colorPropName)?.value;

  const productName = layout?.name === "concat"
    ? `${isVariantOf?.name} ${name}`
    : layout?.name === "productGroup"
    ? isVariantOf?.name
    : name;

  useEffect(() => {
    if (isFirstLoad) {
      productSelected.value = product;
      skuSelected.value = mapProductToSku(product);
      setIsFirstLoad(false);
    }
  });

  return (
    <>
      <Breadcrumb itemListElement={breadcrumb.itemListElement} />
      {/* Product Name */}
      <h1 class="mt-2 font-medium text-xl capitalize">
        {productName}
      </h1>
      {/* Price and Installments */}
      <div class="my-4">
        <div class="flex flex-row gap-2 items-center">
          {(listPrice ?? 0) > price && (
            <span class="line-through text-sm">
              {formatPrice(listPrice, offers?.priceCurrency)}
            </span>
          )}
          <h3 class="font-medium text-xl">
            {formatPrice(price, offers?.priceCurrency)}
          </h3>
        </div>
        <span class="text-xs">{installments}</span>
      </div>

      {/* Color Selector */}
      <div class="my-2">
        <span
          class={`text-sm py-2`}
        >
          Cor: {colorName}
        </span>
      </div>
      <div class="my-4">
        <ColorSelector
          product={product}
          showUnavailableProducts={showUnavailableProductsInSimilarProductsSelector}
          seller={seller}
          colorsSpecification={businessRules.listOfColors!}
          constants={{
            colorKey: businessRules.colorSortName!,
            specificColorKey: businessRules.colorPropName!,
            colorThumbnailLabel: businessRules.colorThumbnailAttributeValue!,
          }}
          styles={{
            container: {
              classes: "mt-3",
            },
            option: {
              classes:
                "lg:w-[1.5625rem] lg:h-[1.5625rem] h-[2.375rem] w-[2.375rem] rounded-full border border-transparent hover:border-base-300",
            },
            optionActive: {
              classes: "[&&]:border-primary",
            },
            optionImage: {
              classes:
                "rounded-[inherit] w-[2rem] h-[2rem] lg:w-[1.1875rem] lg:h-[1.1875rem]",
            },
          }}
        />
      </div>

      {/* Size Selector */}

      <div class="mt-4 sm:mt-6">
        <ProductSelector product={product} />
      </div>

      {/* Add to Cart and Favorites button */}
      <div class="mt-4 sm:mt-10 flex flex-col gap-2">
        {availability === "https://schema.org/InStock"
          ? (
            <>
              <AddToCartButtonVTEX
                eventParams={{ items: [eventItem] }}
                productID={productID}
                seller={seller}
              />
              <WishlistButtonVtex
                variant="full"
                productID={productID}
                productGroupID={productGroupID}
              />
            </>
          )
          : <OutOfStock productID={productID} />}
      </div>
      {/* Shipping Simulation */}
      <div class="mt-8">
        <ShippingSimulation
          items={[
            {
              id: Number(product.sku),
              quantity: 1,
              seller: seller,
            },
          ]}
        />
      </div>
      {/* Description card */}
      <div class="mt-4 sm:mt-6">
        <span class="text-sm">
          {description && (
            <details>
              <summary class="cursor-pointer">Descrição</summary>
              <div
                class="ml-2 mt-2"
                dangerouslySetInnerHTML={{ __html: description }}
              />
            </details>
          )}
        </span>
      </div>
    </>
  );
}
