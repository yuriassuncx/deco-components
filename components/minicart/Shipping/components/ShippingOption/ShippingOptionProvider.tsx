import { createContext, JSX } from "preact";
import { useContext } from "preact/hooks";
import { AnatomyStyles } from "deco-sites/simples/common/sdk/styles.ts";

import { DeliverySla, PickupSla } from "../../sdk/Types.ts";
import useShippingCalculator from "../../sdk/useShippingCalculator.ts";

type ShippingOptionContextState = PickupSla | DeliverySla;

const ShippingOptionContext = createContext<ShippingOptionContextState>(
  null as never,
);

export function useShippingOption() {
  const context = useContext(ShippingOptionContext);

  if (!context) {
    throw new Error(
      "useShippingOption must be used within a ShippingOptionProvider",
    );
  }
  return context;
}

const anatomy = ["container", "container--active"] as const;

export type ShippingOptionProviderProps = {
  option: PickupSla | DeliverySla;
  children: JSX.Element | JSX.Element[];
  styles?: AnatomyStyles<typeof anatomy[number]>;
  onClick?: (_option: PickupSla | DeliverySla) => void;
};

function ShippingOptionProvider({
  option,
  children,
  styles,
  onClick,
}: ShippingOptionProviderProps) {
  const { selectedSlaSignal } = useShippingCalculator();
  const selectedSla = selectedSlaSignal.value;

  const isActive = selectedSla?.__id === option.__id;

  function handleClick() {
    onClick?.(option);
  }

  return (
    <ShippingOptionContext.Provider value={option}>
      <div
        class={`${styles?.container?.classes ?? ""} ${
          isActive ? styles?.["container--active"]?.classes ?? "" : ""
        }`}
        onClick={handleClick}
      >
        {children}
      </div>
    </ShippingOptionContext.Provider>
  );
}

export default ShippingOptionProvider;
