import { StateBonusPage, situationMetadata } from "../components/StateSituationPages";

export const metadata = situationMetadata("FL", "bonus");

export default function FloridaPaycheckCalculatorWithBonus() {
  return <StateBonusPage code="FL" />;
}
