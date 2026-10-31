import { StateChildSupportPage, situationMetadata } from "../components/StateSituationPages";

export const metadata = situationMetadata("IL", "child-support");

export default function IllinoisPaycheckCalculatorWithChildSupport() {
  return <StateChildSupportPage code="IL" />;
}
