import { StateBonusPage, situationMetadata } from "../components/StateSituationPages";

export const metadata = situationMetadata("OH", "bonus");

export default function OhioPaycheckCalculatorWithBonus() {
  return <StateBonusPage code="OH" />;
}
