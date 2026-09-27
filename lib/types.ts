export type Status = "pagado" | "pendiente";

export type ReservationCategory =
  | "vuelo"
  | "hotel"
  | "entrada"
  | "seguro"
  | "actividad";

export type PlaceCategory =
  | "Parques"
  | "Compras"
  | "Playas"
  | "Paseos"
  | "Alojamiento";

export type Priority = "imperdible" | "si" | "opcional" | "paso";

export type Code = { label: string; value: string };

export type Fact = { label: string; value: string };

export type CheckItem = { id: string; label: string; done: boolean };

export type Highlight = {
  title: string;
  detail?: string;
  priority?: Priority;
};

export type Reservation = {
  id: string;
  category: ReservationCategory;
  title: string;
  provider: string;
  status: Status;
  costUsd?: number;
  start: string;
  end?: string;
  summary: string;
  codes: Code[];
  facts: Fact[];
  notes?: string[];
  checklist?: CheckItem[];
  placeId?: string;
};

export type Place = {
  id: string;
  category: PlaceCategory;
  name: string;
  area: string;
  address: string;
  lat: number;
  lon: number;
  blurb: string;
  hours?: string;
  highlights: Highlight[];
  tips: string[];
  link?: { label: string; href: string };
  phone?: string;
};

export type ItineraryItem = {
  id: string;
  date: string;
  time: string;
  endTime?: string;
  instant: string;
  clock: "Buenos Aires" | "Orlando" | "Miami";
  title: string;
  summary: string;
  placeId?: string;
  reservationId?: string;
  plan?: string[];
};

export type VisaInfo = {
  number: string;
  type: string;
  issued: string;
  expires: string;
  entries: string;
};

export type Traveler = {
  id: string;
  name: string;
  role: string;
  facts: Fact[];
  visa: VisaInfo;
};

export type PackGroup = {
  id: string;
  title: string;
  items: CheckItem[];
};
