export interface Props {
  fieldId: number;
}

export type SpecificationsDictionary = {
  [key: string]: FieldValue;
};

interface FieldValue {
  FieldValueId: number;
  Value: string;
  IsActive: boolean;
  Position: number;
}

const getListOfSpecifications = async (
  { fieldId }: Props,
  _req: Request,
): Promise<SpecificationsDictionary> => {
  try {
    const response = await fetch(
      "https://simplesreserva.vtexcommercestable.com.br/api/catalog_system/pub/specification/fieldvalue/" +
        fieldId,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    const res = await response.json();
    const dictionary = {} as SpecificationsDictionary;
    res.forEach((item: FieldValue) => {
      dictionary[item.Value] = item;
    });
    return dictionary;
  } catch (e) {
    return e;
  }
};

export default getListOfSpecifications;
