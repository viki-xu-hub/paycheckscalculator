import statesRaw from "../../data/states.json";
import salaryRaw from "../../data/salary.json";
import hourlyRaw from "../../data/hourly-rates.json";
import frequenciesRaw from "../../data/frequencies.json";
import type { StateData, SalaryData, HourlyData, FrequencyData } from "./types";

const SITE = "https://www.paycheckscalculator.org";

export function stateUrls(): string[] {
  return (statesRaw as StateData[]).map(s => `${SITE}/states/${s.slug}`);
}

export function salaryUrls(): string[] {
  return (salaryRaw as SalaryData[]).map(s => `${SITE}/salary/${s.slug}`);
}

export function hourlyUrls(): string[] {
  return (hourlyRaw as HourlyData[]).map(h => `${SITE}/hourly/${h.slug}`);
}

export function frequencyUrls(): string[] {
  return (frequenciesRaw as FrequencyData[]).map(f => `${SITE}/${f.slug}`);
}

export function allProgrammaticUrls(): string[] {
  return [
    ...stateUrls(),
    ...salaryUrls(),
    ...hourlyUrls(),
    ...frequencyUrls(),
  ];
}
