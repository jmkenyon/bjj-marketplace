import { Currency } from "@prisma/client";

export interface ExploreGym {
  id: string;
  name: string;
  slug: string;
  about: string | null;
  address: string | null;
  currency: Currency;
  dropIn: {
    fee: number;
  } | null;
    classes: {
        isFree: boolean;
    }[];
}