import { computed, Signal, signal } from "@preact/signals";
import { useCart } from "apps/vtex/hooks/useCart.ts";

import calculatePickupOptions from "./pickupOptions.ts";
import calculateCheapestAndFastestDeliveryOptions from "./deliveryOptions.ts";

import {
  DeliverySla,
  PickupSla,
  PostalCode,
  SelectedDeliveryChannel,
  SelectedSla,
} from "./Types.ts";
import {
  CHEAPEST_DELIVERY_ID,
  LOCAL_STORAGE_ACTIVE_DELIVERY_CHANNEL_KEY,
  LOCAL_STORAGE_ACTIVE_DELIVERY_OPTION_KEY,
} from "./constants.ts";

export type ShippingCalculatorContextState = {
  // Computed
  hasSelectedAddress: boolean;
  selectedSlaSignal: Signal<SelectedSla | null>;
  deliveryOptionsSignal: Signal<{
    deliveryOptions: DeliverySla[];
    fastestDeliveryOption: DeliverySla | null;
    cheapestDeliveryOption: DeliverySla | null;
    unavailableItemsForDelivery: number[];
  }>;
  pickupOptionsSignal: Signal<{
    pickupOptions: PickupSla[];
    unavailableItemsForPickup: number[];
  }>;
  // Form
  postalCodeSignal: Signal<PostalCode | null>;
  errorSignal: Signal<string | null>;
  loadingSignal: Signal<boolean>;
};

// Mutable signals must be declared outside the hook
const postalCodeSignal = signal<PostalCode | null>(null);
const errorSignal = signal<string | null>(null);
const loadingSignal = signal<boolean>(false);

export function useShippingCalculator() {
  const { cart } = useCart();

  const shippingData = cart.value?.shippingData;
  const logisticsInfo = shippingData?.logisticsInfo ?? [];

  const hasSelectedAddressSignal = computed(() => (
    Boolean(shippingData?.address?.postalCode)
  ));

  const pickupOptionsSignal = computed(() => (
    calculatePickupOptions(logisticsInfo)
  ));

  const deliveryOptionsSignal = computed(() => (
    calculateCheapestAndFastestDeliveryOptions(logisticsInfo)
  ));

  const selectedSlaSignal = computed(() => {
    const { pickupOptions = [] } = pickupOptionsSignal.value ?? {};
    const { deliveryOptions = [] } = deliveryOptionsSignal.value ?? {};

    // Returns string, so null coalescing operator does not work
    const activeDeliveryChannel =
      localStorage.getItem(LOCAL_STORAGE_ACTIVE_DELIVERY_CHANNEL_KEY) ||
      SelectedDeliveryChannel.Delivery;

    const activeDeliveryOption =
      localStorage.getItem(LOCAL_STORAGE_ACTIVE_DELIVERY_OPTION_KEY) ||
      CHEAPEST_DELIVERY_ID;

    if (activeDeliveryChannel === SelectedDeliveryChannel.PickupInPoint) {
      const pickupPointId = logisticsInfo?.find(
        (d) =>
          d.selectedDeliveryChannel === SelectedDeliveryChannel.PickupInPoint,
      )?.selectedSla ?? "";

      const pickupPoint = pickupOptions.find((d) => d.__id === pickupPointId);

      return pickupPoint ?? null;
    }

    const [cheapest, fastest] = deliveryOptions;

    return activeDeliveryOption === CHEAPEST_DELIVERY_ID
      ? cheapest ?? null
      : fastest ?? cheapest ?? null; // Sometimes the cheapest option is also the fastest
  });

  const state: ShippingCalculatorContextState = {
    // Computed
    selectedSlaSignal,
    pickupOptionsSignal,
    deliveryOptionsSignal,
    hasSelectedAddress: hasSelectedAddressSignal.value,

    // Form
    postalCodeSignal,
    errorSignal,
    loadingSignal,
  };

  return state;
}

export default useShippingCalculator;
