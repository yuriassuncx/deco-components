export interface Sla {
  id: string;
  name: string;
  price: number;
  listPrice: number;
  deliveryWindow: string | null;
  deliveryChannel: "delivery" | "pickup-in-point";
  shippingEstimate: string;
  transitTime: string;
  pickupStoreInfo: {
    friendlyName: string;
  };
}
