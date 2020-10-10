export interface GridPointProperty {
  uom: string;
  values: Array<{validTime: string, value: any}>;
}

export interface WeatherValues {
  date: Date;
  value: unknown;
}

export interface TimeDuration {
  date: Date;
  durationHours: number;
}