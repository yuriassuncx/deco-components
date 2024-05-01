import type { Product } from "apps/commerce/types.ts";
import { SpecificationsDictionary } from "../../loaders/ArCo/getListOfSpecifications.tsx";
import { relative } from "../../sdk/url.ts";
import { usePDP } from "../../sdk/usePDP.ts";
import {
  useVariantPossibilities,
} from "../../sdk/useVariantPossibilitiesClientSide.ts";
import Avatar from "../ui/Avatar.tsx";

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
