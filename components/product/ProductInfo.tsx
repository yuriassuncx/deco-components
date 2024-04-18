import { SendEventOnView } from "deco-sites/simples/components/Analytics.tsx";
import { useId } from "deco-sites/simples/sdk/useId.ts";
import { useOffer } from "deco-sites/simples/sdk/useOffer.ts";
import { ProductDetailsPage } from "apps/commerce/types.ts";
import { mapProductToAnalyticsItem } from "apps/commerce/utils/productToAnalyticsItem.ts";
import ProductDetails from "deco-sites/simples/islands/ProductDetails.tsx";
import { ColorSelectorStyles } from "deco-sites/simples/common/components/product/ColorSelector/Types.ts";
import { BusinessRules } from "deco-sites/simples/common/sdk/businessRules.ts";

export interface Props {
  page: ProductDetailsPage | null;
  businessRules: BusinessRules;
  similarSelectorStyle?: ColorSelectorStyles;
  layout?: {
    /**
     * @title Product Name
     * @description How product title will be displayed. Concat to concatenate product and sku names.
     * @default productGroup
     */
    name?: "concat" | "productGroup" | "product";
  };
  /**
   * @title Show Out of stock products
   * @description Should out of stock products appear in the similar or not
   * @default true
   */
  showUnavailableProductsInSimilarProductsSelector?: boolean;
}

function ProductInfo(
  {
    page,
    layout,
    showUnavailableProductsInSimilarProductsSelector = true,
    businessRules,
    similarSelectorStyle,
  }: Props,
) {
  if (page === null) {
    throw new Error("Missing Product Details Page Info");
  }
  const { breadcrumbList, product } = page;
  const id = useId();
  const breadcrumb = {
    ...breadcrumbList,
    itemListElement: breadcrumbList?.itemListElement.slice(0, -1),
    numberOfItems: breadcrumbList.numberOfItems - 1,
  };

  const {
    price = 0,
    listPrice,
  } = useOffer(product.offers);

  const eventItem = mapProductToAnalyticsItem({
    product: product,
    breadcrumbList: breadcrumb,
    price,
    listPrice,
  });

  return (
    <div class="flex flex-col px-4" id={id}>
      <ProductDetails
        product={product}
        breadcrumbList={breadcrumbList}
        layout={layout}
        businessRules={businessRules}
        similarSelectorStyle={similarSelectorStyle}
        showUnavailableProductsInSimilarProductsSelector={showUnavailableProductsInSimilarProductsSelector}
      />
      {/* Analytics Event */}
      <SendEventOnView
        id={id}
        event={{
          name: "view_item",
          params: {
            item_list_id: "product",
            item_list_name: "Product",
            items: [eventItem],
          },
        }}
      />
    </div>
  );
}

export default ProductInfo;
