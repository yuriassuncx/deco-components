import { ComponentChildren } from "preact";
import { AnatomyStyles } from "deco-sites/simples/common/sdk/styles.ts";

import useShippingCalculator from "../../sdk/useShippingCalculator.ts";
import sendPostalCodeAttachment from "../../sdk/getAddressFromPostalCode.ts";

const anatomy = [
  "container",
] as const;

export type ShippingCalculatorFormStyles = AnatomyStyles<
  typeof anatomy[number]
>;

export type ShippingCalculatorFormProps = {
  children: ComponentChildren;
  errorMessage?: string;
  styles?: ShippingCalculatorFormStyles;
};

function ShippingCalculatorForm({
  children,
  errorMessage = "CEP inválido",
  styles,
}: ShippingCalculatorFormProps) {
  const { postalCodeSignal, errorSignal, loadingSignal } =
    useShippingCalculator();

  async function handleSubmit(e?: Event) {
    e?.preventDefault();
    loadingSignal.value = true;

    try {
      const postalCode = postalCodeSignal.value ?? "";
      await sendPostalCodeAttachment(postalCode);
    } catch (error) {
      errorSignal.value = errorMessage;
    } finally {
      loadingSignal.value = false;
    }
  }

  return (
    <form
      class={`block p- ${styles?.container?.classes ?? ""}`}
      onSubmit={handleSubmit}
    >
      {children}
    </form>
  );
}

export default ShippingCalculatorForm;
