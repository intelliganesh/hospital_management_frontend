export interface Country {
  id: string;
  name: string;
  code: string | number;
  phonecode: number | string;
}
export interface State {
  id: string;
  name: string;
  country_id: number | string;
}
export interface City {
  id: string;
  name: string;
  state_id: number | string;
}

export interface Geography {
  countries: Country[];
  states: State[];
  cities: City[];
}
