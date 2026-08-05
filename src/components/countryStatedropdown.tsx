import View from "./view";
import React, { useEffect } from "react";
import SearchSelect from "./SearchSelect";
import { useSelector } from "react-redux";
import { RootState } from "@/actions/store";
import { useGeography } from "@/actions/calls/geography";
import { City, Country, State } from "@/interfaces/slices/geography";

export interface CountryStateDropdownProps {
  cityName?: string;
  stateName?: string;
  countryName?: string;
  formType?: "add" | "edit";
  cityValue?: string;
  stateValue?: string;
  countryValue?: string;
  errorsCountry?: string;
  errorsState?: string;
  errorsCity?: string;
}

const CountryStateDropdown: React.FC<CountryStateDropdownProps> = ({
  cityValue,
  stateValue,
  countryValue,
  formType = "add",
  cityName = "city",
  stateName = "state",
  countryName = "country",
  errorsCity,
  errorsState,
  errorsCountry,
}) => {
  const { countriesArray, stateArray, citiesArray, cleanUp } = useGeography();


  
  const countriesData = useSelector(
    (state: RootState) => state.geography.countries
  );
  const stateData = useSelector((state: RootState) => state.geography.states);
  const citiesData = useSelector((state: RootState) => state.geography.cities);
  //ramya.parvam14@gmail.com

  useEffect(() => {
    if (formType === "edit") {
      if (countryValue) {
        countriesArray((success: boolean) => {
          if (success && stateValue) {
            stateArray(stateValue?.trim(), (success: boolean) => {
              if (success && cityValue) {
                citiesArray(cityValue?.trim(), () => {});
              }
            });
          }
        });
      }
    } else {
      countriesArray(() => {});
    }
    return () => {
      cleanUp();
    };
  }, [formType, countryValue, stateValue, cityValue]);

  const handleSelect = (option: {
    id: string;
    label: string;
    value: string;
    type?: "countries" | "states" | "cities";
  }) => {
    if (option.type === "countries") {
      stateArray(option.id, (success: boolean) => {
        if (success) {
        }
      });
    } else if (option.type === "states") {
      citiesArray(option.id, (success: boolean) => {
        if (success) {
        }
      });
    }
  };

  return (
    <>
      <View>
        <SearchSelect
          name={countryName}
          label="Select a country"
          onSelect={handleSelect}
          selected={countryValue || "India"}
          placeholder="Ex: India"
          options={countriesData?.map((country: Country) => ({
            id: country.id,
            type: "countries",
            label: country.name,
            value: country.id + "," + country.name,
          }))}
          error={errorsCountry}
        />
      </View>
      <View>
        <SearchSelect
          name={stateName}
          label="Select a state"
          selected={stateValue || "Karnataka"}
          onSelect={handleSelect}
          placeholder="Ex: Karnataka"
          options={stateData?.map((state: State) => ({
            id: state.id,
            type: "states",
            label: state.name,
            value: state.id + "," + state.name,
          }))}
          error={errorsState}
        />
      </View>
      <View>
        <SearchSelect
          name={cityName}
          label="Select a city"
          selected={cityValue || "Bangalore"}
          onSelect={handleSelect}
          placeholder="Ex: Bangalore"
          options={citiesData?.map((cities: City) => ({
            id: cities.id,
            type: "cities",
            label: cities.name,
            value: cities.id + "," + cities.name,
          }))}
          error={errorsCity}
        />
      </View>
    </>
  );
};

export default CountryStateDropdown;
