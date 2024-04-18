import { formatPrice } from "deco-sites/simples/common/sdk/format.ts";
import { DynamicStyle } from "deco-sites/simples/common/sdk/styles.ts";

import useShippingCalculator from "../sdk/useShippingCalculator.ts";

const anatomy = [
  "message",
  "defaultMessage",
  "freeMessage",
] as const;

type SelectedShippingPriceStyle = Record<typeof anatomy[number], DynamicStyle>;

export type SelectedShippingPriceProps = {
  defaultMessage?: string;
  freeMessage?: string;
  styles?: SelectedShippingPriceStyle;
};

function SelectedShippingPrice({
  freeMessage = "Grátis",
  defaultMessage = "Inserir CEP",
  styles,
}: SelectedShippingPriceProps) {
  const { selectedSlaSignal } = useShippingCalculator();

  const selectedSla = selectedSlaSignal.value;

  function getFormattedPrice(price: number) {
    if (price === 0) {
      return (
        <span class={styles?.freeMessage?.classes ?? ""}>
          {freeMessage}
        </span>
      );
    }

    return formatPrice(price);
  }

  return (
    <p
      class={`m-0 ${
        (selectedSla
          ? styles?.message?.classes
          : styles?.defaultMessage?.classes) ?? ""
      }`}
    >
      {selectedSla ? getFormattedPrice(selectedSla.price) : defaultMessage}
    </p>
  );
}

export default SelectedShippingPrice;
