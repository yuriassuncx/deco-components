import Avatar from "deco-sites/simples/components/ui/Avatar.tsx";
import type { Product } from "apps/commerce/types.ts";
import { relative } from "deco-sites/simples/sdk/url.ts";
import {
  useVariantPossibilities,
} from "deco-sites/simples/common/sdk/useVariantPossibilitiesClientSide.ts";
import { usePDP } from "deco-sites/simples/common/sdk/usePDP.ts";
import { SpecificationsDictionary } from "deco-sites/simples/loaders/ArCo/getListOfSpecifications.tsx";

export interface Props {
  product: Product;
  listOfSizes?: SpecificationsDictionary;
}

function VariantSelector({ product }: Props) {
  const { productSelected, skuSelected } = usePDP();
  const { url, isVariantOf } = productSelected.value ?? product;
  const hasVariant = isVariantOf?.hasVariant ?? [];
  const possibilities = useVariantPossibilities(
    hasVariant,
  );
  return (
    <ul class="flex flex-col gap-4">
      {Object.keys(possibilities).map((name) => (
        <li class="flex flex-col gap-2">
          <span class="text-sm">{name}</span>
          <ul class="flex flex-row gap-3">
            {Object.entries(possibilities[name]).map(([value, sku]) => {
              const relativeUrl = relative(skuSelected.value?.url ?? url);
              const relativeLink = relative(sku?.url);
              return (
                <li>
                  <a
                    href={relativeLink}
                    onClick={(e) => {
                      e.preventDefault();
                      skuSelected.value = sku ?? null;
                      const obj = { Title: sku?.name!, Url: sku?.url };
                      history.pushState(obj, obj.Title, obj.Url);
                    }}
                  >
                    <button>
                      <Avatar
                        content={value}
                        variant={relativeLink === relativeUrl
                          ? "active"
                          : relativeLink &&
                              sku?.availability === "https://schema.org/InStock"
                          ? "default"
                          : "disabled"}
                      />
                    </button>
                  </a>
                </li>
              );
            })}
          </ul>
        </li>
      ))}
    </ul>
  );
}

export default VariantSelector;
