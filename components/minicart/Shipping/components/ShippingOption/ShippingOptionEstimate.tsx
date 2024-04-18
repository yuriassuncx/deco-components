import {
  calculateShippingEstimateDate,
  formatMessage,
  shippingEstimateToString,
} from "../../sdk/helpers.tsx";
import { AnatomyStyles } from "deco-sites/simples/common/sdk/styles.ts";

import { useShippingOption } from "./ShippingOptionProvider.tsx";

const anatomy = [
  "value",
  "dueDate",
  "estimate",
] as const;

export type EstimateInfoStyle = AnatomyStyles<typeof anatomy[number]>;

export type ShippingOptionEstimateProps = {
  message?: string;
  sameDayEstimateMessage?: string;
  styles?: EstimateInfoStyle;
};

function ShippingOptionEstimate({
  message: messageProp = "Até {{dueDate}}",
  sameDayEstimateMessage = "No mesmo dia",
  styles,
}: ShippingOptionEstimateProps) {
  const option = useShippingOption();

  function renderMessage() {
    const estimate = option.shippingEstimate;

    let dueDate = "";
    let estimateString = "";

    const deliveryToday = estimate === "0d" || estimate === "0bd" ||
      estimate.includes("h");

    const message = deliveryToday ? sameDayEstimateMessage : messageProp;

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
    });
  }

  return (
    <p class={`m-0 ${styles?.value?.classes ?? ""}`}>
      {renderMessage()}
    </p>
  );
}

export default ShippingOptionEstimate;
