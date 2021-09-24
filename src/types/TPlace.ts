export interface GooglePlace {
  result: Place;
  status: string;
}

export interface Place {
  address_components: AddressComponent[];
  formatted_address: string;
  geometry: Geometry;
}

export interface AddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

export interface Geometry {
  location: Location;
  viewport: Viewport;
}

export interface Location {
  lat: number;
  lng: number;
}

export interface Viewport {
  northeast: Location;
  southwest: Location;
}

export default GooglePlace;
