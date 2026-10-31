import { StateChildSupportPage, situationMetadata } from "../components/StateSituationPages";

export const metadata = situationMetadata("FL", "child-support");

export default function FloridaPaycheckCalculatorWithChildSupport() {
  return <StateChildSupportPage code="FL" />;
}
