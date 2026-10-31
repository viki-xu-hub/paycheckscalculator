import { StateDependentsPage, situationMetadata } from "../components/StateSituationPages";

export const metadata = situationMetadata("IL", "dependents");

export default function IllinoisPaycheckCalculatorWithDependents() {
  return <StateDependentsPage code="IL" />;
}
