import { JSX } from "preact";
import { useEffect } from "preact/hooks";
import { useCart } from "apps/vtex/hooks/useCart.ts";
import { ChangeEvent } from "preact/compat";
import { AnatomyStyles } from "deco-sites/simples/common/sdk/styles.ts";

import useShippingCalculator from "../../sdk/useShippingCalculator.ts";

import {
  maskPostalCode,
  stripNonNumericCharacters,
} from "../../sdk/helpers.tsx";

const anatomy = [
  "container",
  "input",
  "input--error",
  "errorMessage",
] as const;

export type ShippingCalculatorFormInputStyles = AnatomyStyles<
  typeof anatomy[number]
>;

export type ShippingCalculatorFormInputProps =
  & JSX.HTMLAttributes<HTMLInputElement>
  & {
    styles?: ShippingCalculatorFormInputStyles;
  };

function ShippingCalculatorFormInput({
  styles,
  ...props
}: ShippingCalculatorFormInputProps) {
  const { cart } = useCart();
  const { errorSignal, postalCodeSignal } = useShippingCalculator();

  const currentPostalCode = cart.value?.shippingData?.address?.postalCode;

  const error = errorSignal.value;
  const postalCode = postalCodeSignal.value ?? currentPostalCode ?? "";

  // blocks non numeric keys
  function handleKeypress(event: KeyboardEvent) {
    if (event.key !== "Enter" && !/[0-9]/.test(event.key)) {
      event.preventDefault();
    }
  }

  function handleOnChange(event: ChangeEvent) {
    errorSignal.value = null;

    postalCodeSignal.value =
      stripNonNumericCharacters((event.target as HTMLInputElement)?.value) ??
        "";
  }

  useEffect(() => {
  }, []);

  return (
    <div class={`inline-block ${styles?.container?.classes ?? ""}`}>
      <input
        {...props}
        class={`border border-transparent outline-none py-[calc(0.5rem-1px)] px-4 
          ${styles?.input?.classes ?? ""} 
          ${
          Boolean(error) &&
          `[&&]:border-red-500 ${styles?.["input--error"]?.classes ?? ""}`
        }
        `}
        name="postalCode"
        value={maskPostalCode(postalCode)}
        onChange={handleOnChange}
        onFocus={() => errorSignal.value = null}
        onKeyPress={handleKeypress}
        maxLength={9}
      />

      {Boolean(error) && (
        <span
          class={`block mt-0.5 text-sm text-red-500 ${
            styles?.errorMessage?.classes ?? ""
          }`}
        >
          {error}
        </span>
      )}
    </div>
  );
}

export default ShippingCalculatorFormInput;
