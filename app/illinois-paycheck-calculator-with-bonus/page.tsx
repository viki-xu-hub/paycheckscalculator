import { StateBonusPage, situationMetadata } from "../components/StateSituationPages";

export const metadata = situationMetadata("IL", "bonus");

export default function IllinoisPaycheckCalculatorWithBonus() {
  return <StateBonusPage code="IL" />;
}
