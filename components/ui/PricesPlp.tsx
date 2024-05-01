import { AggregateOffer } from "apps/commerce/types.ts";
import { formatPrice } from "../../sdk/format.ts";
import { AnatomyClasses, handleClasses } from "../../sdk/styles.ts";

const anatomy = [
  "afterPrice",
  "priceplpStyle",
  "installmentStyle",
] as const;

type PriceplpStyle = AnatomyClasses<typeof anatomy[number]>;

interface PriceplpProps {
  classes?: PriceplpStyle;
  listPrice: number;
  price: number;
  installments: string;
  offers: AggregateOffer | undefined;
}

function Priceplp(
  { classes, installments, price, listPrice, offers }: PriceplpProps,
) {
  return (
    <>
      <div class="flex flex-row gap-2 items-center">
        {(listPrice ?? 0) > price && (
          <span class={handleClasses(classes?.afterPrice)}>
            {formatPrice(listPrice, offers?.priceCurrency)}
          </span>
        )}
        <h3 class={handleClasses(classes?.priceplpStyle)}>
          {formatPrice(price, offers?.priceCurrency)}
        </h3>
      </div>
      <span class={handleClasses(classes?.installmentStyle)}>
        {installments}
      </span>
    </>
  );
}

export default Priceplp;
