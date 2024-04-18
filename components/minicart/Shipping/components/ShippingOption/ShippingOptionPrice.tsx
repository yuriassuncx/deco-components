import { formatPrice } from "deco-sites/simples/common/sdk/format.ts";
import { DynamicStyle } from "deco-sites/simples/common/sdk/styles.ts";

import { useShippingOption } from "./ShippingOptionProvider.tsx";

const anatomy = [
  "value",
  "freeValue",
] as const;

type ShippingOptionPriceStyle = Record<typeof anatomy[number], DynamicStyle>;

export type ShippingOptionPriceProps = {
  freeMessage?: string;
  styles?: ShippingOptionPriceStyle;
};

function ShippingOptionPrice({
  freeMessage = "Grátis",
  styles,
}: ShippingOptionPriceProps) {
  const option = useShippingOption();

  return (
    <p class={`m-0 ${styles?.value?.classes ?? ""}`}>
      {formatPrice(option.price) ?? (
        <span class={styles?.freeValue?.classes}>
          {freeMessage}
        </span>
      )}
    </p>
  );
}
export default ShippingOptionPrice;
