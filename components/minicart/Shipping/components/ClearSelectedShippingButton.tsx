import { ComponentChildren } from "preact";
import { AnatomyStyles } from "deco-sites/simples/common/sdk/styles.ts";
import Spinner from "deco-sites/simples/components/ui/Spinner.tsx";
import Icon, {
  Props as IconProps,
} from "deco-sites/simples/components/ui/Icon.tsx";

import { clearShippingOptions } from "../sdk/chooseShippingOption.ts";
import { useShippingCalculator } from "../sdk/useShippingCalculator.ts";

const anatomy = [
  "container",
] as const;

type Styles = AnatomyStyles<typeof anatomy[number]>;

export type ClearSelectedShippingButtonProps = {
  styles?: Styles;
  hideIfNoSelectedShipping?: boolean;
  children?: ComponentChildren;
  iconProps?: Partial<IconProps>;
};

function ClearSelectedShippingButton({
  styles,
  hideIfNoSelectedShipping = true,
  children,
  iconProps,
}: ClearSelectedShippingButtonProps) {
  const { selectedSlaSignal, loadingSignal } = useShippingCalculator();

  const hasSelectedSla = Boolean(selectedSlaSignal.value?.__id);
  const loading = loadingSignal.value;

  function handleClearShippingOptions(e: Event) {
    e.stopPropagation();
    clearShippingOptions();
  }

  if (!hasSelectedSla && hideIfNoSelectedShipping) {
    return null;
  }

  if (loading) {
    return (
      <div class={`p-2 ${styles?.container?.classes ?? ""}`}>
        <Spinner size={14} />
      </div>
    );
  }

  return (
    <div
      class={`cursor-pointer p-2 ${styles?.container?.classes ?? ""}`}
      onClick={handleClearShippingOptions}
    >
      {children ?? (
        <Icon
          id="XMark"
          width={16}
          height={16}
          strokeWidth={2}
          {...iconProps}
        />
      )}
    </div>
  );
}

export default ClearSelectedShippingButton;
