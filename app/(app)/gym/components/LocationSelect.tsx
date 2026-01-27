"use client";

import AsyncSelect from "react-select/async";
import axios from "axios";
import { useCallback } from "react";

export type CountrySelectValue = {
  label: string;
  value: string;
  latlng: [number, number];
  country: string;
};

interface MapboxContext {
  id: string;
  short_code?: string;
}

interface MapboxFeature {
  place_name: string;
  center: [number, number];
  context?: MapboxContext[];
}

interface LocationSelectProps {
  value?: CountrySelectValue;
  onChange: (value: CountrySelectValue | null) => void;
  placeholder?: string;
}

const LocationSelect = ({
  value,
  onChange,
  placeholder,
}: LocationSelectProps) => {
  const fetchOptions = useCallback(
    async (input: string): Promise<CountrySelectValue[]> => {
      if (!input || input.length < 3) return [];

      const res = await axios.get<{ features: MapboxFeature[] }>(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          input
        )}.json`,
        {
          params: {
            access_token: process.env.NEXT_PUBLIC_MAPBOX_API_KEY,
            limit: 5,
          },
        }
      );

      return res.data.features.map((f) => {
        const country = f.context
          ?.find((c) => c.id.startsWith("country"))
          ?.short_code?.toUpperCase();

        return {
          label: f.place_name,
          value: f.place_name,
          latlng: [f.center[1], f.center[0]] as [number, number], 
          country: country ?? "",
        };
      });
    },
    []
  );

  return (
    <AsyncSelect
      value={value}
      loadOptions={fetchOptions}
      onChange={(val) => onChange(val as CountrySelectValue)}
      placeholder={placeholder ?? "Enter address"}
      isClearable
    />
  );
};

export default LocationSelect;
