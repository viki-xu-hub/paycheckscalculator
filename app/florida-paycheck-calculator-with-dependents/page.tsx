import { StateDependentsPage, situationMetadata } from "../components/StateSituationPages";

export const metadata = situationMetadata("FL", "dependents");

export default function FloridaPaycheckCalculatorWithDependents() {
  return <StateDependentsPage code="FL" />;
}
