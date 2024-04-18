import { ComponentChildren, JSX } from "preact";
import { AnatomyStyles } from "deco-sites/simples/common/sdk/styles.ts";
import Spinner from "deco-sites/simples/components/ui/Spinner.tsx";

import useShippingCalculator from "../../sdk/useShippingCalculator.ts";

const anatomy = ["button", "button-disabled"] as const;

export type ShippingCalculatorFormSubmitStyles = AnatomyStyles<
  typeof anatomy[number]
>;

export type ShippingCalculatorFormSubmitProps =
  & Partial<JSX.HTMLAttributes<HTMLButtonElement>>
  & {
    children?: ComponentChildren;
    styles?: ShippingCalculatorFormSubmitStyles;
  };

function ShippingCalculatorFormSubmit({
  children = "Enviar",
  styles,
  ...props
}: ShippingCalculatorFormSubmitProps) {
  const { loadingSignal } = useShippingCalculator();
  const loading = loadingSignal.value;

  return (
    <button
      {...props}
      type="submit"
      class={`inline-block h-fit py-2 px-6 bg-primary disabled:bg-gray-300
        ${styles?.button?.classes ?? ""}
      `}
      disabled={loading}
    >
      {loading ? <Spinner size={16} /> : children}
    </button>
  );
}

export default ShippingCalculatorFormSubmit;
