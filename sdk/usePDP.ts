import { Product } from "apps/commerce/types.ts";
import { signal } from "@preact/signals";

const productSelected = signal(<Product | null> null);

const state = {
  productSelected,
};

export const usePDP = () => state;
