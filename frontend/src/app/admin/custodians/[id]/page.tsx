import { CustodianForm } from "../custodian-form";

export default function EditCustodianPage({ params }: { params: { id: string } }) {
  const custodianId = parseInt(params.id);
  return <CustodianForm custodianId={custodianId} />;
}
