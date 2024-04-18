import { DynamicStyle } from "deco-sites/simples/common/sdk/styles.ts";
import { useShippingOption } from "deco-sites/simples/common/components/minicart/Shipping/components/ShippingOption/ShippingOptionProvider.tsx";

import { formatMessage } from "../../sdk/helpers.tsx";

const anatomy = [
  "value",
  "friendlyName",
] as const;

type ShippingOptionTitleStyle = Record<typeof anatomy[number], DynamicStyle>;

export type ShippingOptionTitleProps = {
  message?: string;
  styles?: ShippingOptionTitleStyle;
};

function ShippingOptionTitle({
  message = "{{friendlyName}}",
  styles,
}: ShippingOptionTitleProps) {
  const option = useShippingOption();

  return (
    <p class={`m-0 ${styles?.value?.classes ?? ""}`}>
      {formatMessage(message, {
        "{{friendlyName}}": {
          value: option.friendlyName ?? "",
          classes: styles?.friendlyName?.classes ?? "",
        },
      })}
    </p>
  );
}
export default ShippingOptionTitle;
