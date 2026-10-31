import { StateChildSupportPage, situationMetadata } from "../components/StateSituationPages";

export const metadata = situationMetadata("OH", "child-support");

export default function OhioPaycheckCalculatorWithChildSupport() {
  return <StateChildSupportPage code="OH" />;
}
