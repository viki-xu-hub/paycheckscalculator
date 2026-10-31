import { StateDependentsPage, situationMetadata } from "../components/StateSituationPages";

export const metadata = situationMetadata("OH", "dependents");

export default function OhioPaycheckCalculatorWithDependents() {
  return <StateDependentsPage code="OH" />;
}
