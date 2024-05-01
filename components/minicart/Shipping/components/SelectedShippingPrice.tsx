import { formatPrice } from "../../../../sdk/format.ts";
import { AnatomyClasses, handleClasses } from "../../../../sdk/styles.ts";
import useShippingCalculator from "../sdk/useShippingCalculator.ts";

const anatomy = [
  "message",
  "defaultMessage",
  "freeMessage",
] as const;

type SelectedShippingPriceStyle = AnatomyClasses<typeof anatomy[number]>;

export type SelectedShippingPriceProps = {
  defaultMessage?: string;
  freeMessage?: string;
  classes?: SelectedShippingPriceStyle;
};

function SelectedShippingPrice({
  freeMessage = "Grátis",
  defaultMessage = "Inserir CEP",
  classes,
}: SelectedShippingPriceProps) {
  const { selectedSlaSignal } = useShippingCalculator();

  const selectedSla = selectedSlaSignal.value;

  function getFormattedPrice(price: number) {
    if (price === 0) {
      return (
        <span class={classes?.freeMessage ?? ""}>
          {freeMessage}
        </span>
      );
    }

    return formatPrice(price);
  }

  return (
    <p
      class={handleClasses(
        "m-0",
        selectedSla ? classes?.message : classes?.defaultMessage,
      )}
    >
      {selectedSla ? getFormattedPrice(selectedSla.price) : defaultMessage}
    </p>
  );
}

export default SelectedShippingPrice;
