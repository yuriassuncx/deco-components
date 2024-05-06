// ISLAND
import { useSignal, Signal } from "@preact/signals";
import { createContext, ComponentChildren } from 'preact'
import { useContext } from 'preact/hooks'
import { Product } from "apps/commerce/types.ts";
import { Sku } from "../../sdk/useVariantPossibilitiesClientSide.ts";

export type ProductContextState = {
  productSignal: Signal<Product>;
  skuSelectedSignal: Signal<Sku | null>;
}

const ProductContext = createContext<ProductContextState>({} as never)

export function useProduct() {
  const context = useContext(ProductContext);

  if (!context) {
    throw new Error('useProduct must be used within a ProductProvider');
  }

  return context;
}

export type ProductContextProps = {
  product: Product;
  skuSelected?: unknown | null | undefined;
  children: ComponentChildren
}

function ProductProvider({ product: productProp, children }: ProductContextProps) {
  const productSignal = useSignal(productProp);
  const skuSelectedSignal = useSignal(null);

  return (
    <ProductContext.Provider value={{
      productSignal,
      skuSelectedSignal,
    }}>
      {children}
    </ProductContext.Provider>
  )
}

export default ProductProvider