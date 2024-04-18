import { useCart } from "apps/vtex/hooks/useCart.ts";
import { DynamicStyle } from "deco-sites/simples/common/sdk/styles.ts";

import useShippingCalculator from "../sdk/useShippingCalculator.ts";
import {
  calculateShippingEstimateDate,
  formatMessage,
  shippingEstimateToString,
} from "../sdk/helpers.tsx";
import { maskPostalCode } from "../sdk/helpers.tsx";
import { DeliverySla } from "../sdk/Types.ts";

const anatomy = [
  "message",
  "defaultMessage",
  "dueDate",
  "estimate",
  "postalCode",
  "pickupOptionName",
] as const;

export type EstimateInfoStyle = Record<
  typeof anatomy[number],
  DynamicStyle
>;

export type SelectedShippingProps = {
  defaultMessage?: string;
  deliveryMessage?: string;
  pickupMessage?: string;
  deliveryOnTheSameDayMessage?: string;
  styles?: EstimateInfoStyle;
};

function SelectedShipping({
  defaultMessage = "Entrega",
  deliveryMessage = "Até {{dueDate}} para {{postalCode}}",
  pickupMessage = "Retirar em {{friendlyName}}",
  deliveryOnTheSameDayMessage = "No mesmo dia para {{postalCode}}",
  styles,
}: SelectedShippingProps) {
  const { cart } = useCart();
  const { selectedSlaSignal } = useShippingCalculator();

  const postalCode = cart.value?.shippingData?.address?.postalCode;

  const selectedSla = selectedSlaSignal.value;
  const isPickup = selectedSla?.selectedDeliveryChannel === "pickup-in-point";

  const formattedPickupMessage = isPickup
    ? formatMessage(pickupMessage, {
      "{{friendlyName}}": {
        value: (selectedSla as DeliverySla)?.friendlyName,
        classes: styles?.pickupOptionName?.classes ?? "",
      },
    })
    : null;

  const formattedDeliveryMessage = (function () {
    const estimate = selectedSla?.shippingEstimate;

    if (!estimate || !postalCode) {
      return null;
    }

    let dueDate = "";
    let estimateString = "";

    const deliveryToday = estimate === "0d" || estimate === "0bd" ||
      estimate.includes("h");

    const message = deliveryToday
      ? deliveryOnTheSameDayMessage
      : deliveryMessage;

    if (message.includes("{{dueDate}}")) {
      const { day, monthName } = calculateShippingEstimateDate(estimate);
      dueDate = `${day} de ${monthName}`;
    }

    if (message.includes("{{estimate}}")) {
      estimateString = shippingEstimateToString(estimate);
    }

    return formatMessage(message, {
      "{{dueDate}}": {
        value: dueDate,
        classes: styles?.dueDate?.classes ?? "",
      },

      "{{estimate}}": {
        value: estimateString,
        classes: styles?.estimate?.classes ?? "",
      },

      "{{postalCode}}": {
        value: maskPostalCode(postalCode),
        classes: styles?.postalCode?.classes ?? "",
      },
    });
  })();

  function renderValue() {
    if (isPickup) {
      return formattedPickupMessage;
    }

    return formattedDeliveryMessage;
  }

  return (
    <p
      class={`m-0 ${
        (selectedSla
          ? styles?.defaultMessage?.classes
          : styles?.message?.classes) ?? ""
      }`}
    >
      {selectedSla ? renderValue() : defaultMessage}
    </p>
  );
}

export default SelectedShipping;
