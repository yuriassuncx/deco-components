import { fetchAPI } from "deco/utils/fetchAPI.ts";
import type { Context } from "apps/vtex/hooks/context.ts";
import { Address } from "apps/vtex/utils/types.ts";

// error: { code: "CHK0040", message: 'O campo Complemento não aceita os caracteres: < > ? + " ; %', exception: null }
function sanitizeAddressComplement(complement: string) {
  const blackList = ["<", ">", "?", "+", '"', "%"];

  // regex to replace blacklist for empty string
  const lettersToReplace = new RegExp(
    String([blackList.map((char) => `\\${char}`).join("")]),
    "g",
  );

  const semicolonRegex = /;/g;

  const sanitized = complement
    ?.replace(lettersToReplace, "")
    ?.replace(semicolonRegex, ",");

  return sanitized;
}

export interface Props {
  postalCode: string;
  availableAddresses: Address[];
}

export const getAddressFromPostalCode = async (
  { postalCode, availableAddresses }: Props,
  _req: Request,
  _ctx: Context,
): Promise<Address> => {
  try {
    // check if user has address with same postal code
    const availableAddress = availableAddresses.find((addr) =>
      addr.postalCode === postalCode
    );

    // if this is true, we don't need to create a new address
    if (availableAddress) {
      return {
        ...availableAddress,
        complement: sanitizeAddressComplement(
          availableAddress.complement ?? "",
        ),
      };
    }

    // N~ao se sabe se essa rota esta proxyada
    // Trocar essa URL para outro endpoint
    // Olhar app exemplo de my account (vtex commerce stable)
    const url =
      `https://www.simplesreserva.com/api/checkout/pub/postal-code/BRA/${postalCode}`;

    const newAddress = await fetchAPI<Address>(
      url,
      {
        method: "GET",
        headers: {
          "content-type": "application/json",
          accept: "application/json",
        },
      },
    );

    // reuse the first addressId that was not created by the user or generate a new one
    const addressId = availableAddresses.find((d) =>
      !d.receiverName && Boolean(d.addressId)
    )
      ?.addressId ?? crypto.randomUUID();

    return {
      ...newAddress,
      isDisposable: false, // Create new address if customer finish the checkout
      addressId,
    };
  } catch (e) {
    return e;
  }
};

export default getAddressFromPostalCode;
