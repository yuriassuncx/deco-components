import type { Product } from "apps/commerce/types.ts";
import AvatarColor from "../ui/AvatarColor.tsx";
import { usePDP } from "../../sdk/usePDP.ts";
import { useEffect } from "preact/hooks";
export interface Props {
  product: Product;
  selected?: Product;
  seller: string;
  unavailableProducts?: boolean;
}

function SimilarSelector(
  { product, unavailableProducts, selected, seller }: Props,
) {
  const { isSimilarTo } = product;
  const { productSelected } = usePDP();

  useEffect(() => {
    productSelected.value = product;
  }, []);

  const onSelectProduct = (product: Product) => {
    productSelected.value = product;
  };

  const similarProducts =
    isSimilarTo?.map((similar: Product) => similar).concat([
      product,
    ]) || [];

  return (
    <ul class="flex flex-col gap-4">
      {similarProducts.length > 1
        ? (
          <div class="flex gap-2 ">
            {similarProducts.map((similar) => {
              const colorImg = similar.image?.find((img) =>
                img.name === "color-thumbnail"
              )?.url;

              const availability = (similar.offers?.offers.find((of) =>
                of.seller === seller
              )?.inventoryLevel.value!) > 0;
              console.log({ colorImg, unavailableProducts, availability });
              if (!colorImg) return null;
              if (!unavailableProducts && !availability) return null;
              return (
                <a
                  href={similar.url}
                  onClick={(e) => {
                    e.preventDefault();
                    onSelectProduct(similar);
                  }}
                >
                  <AvatarColor
                    onClick={(e) => {}}
                    variant={similar.productID ===
                        (productSelected.value?.productID || product.productID)
                      ? "active"
                      : "default"}
                    image={colorImg}
                  />
                </a>
              );
            })}
          </div>
        )
        : null}
    </ul>
  );
}

export default SimilarSelector;
