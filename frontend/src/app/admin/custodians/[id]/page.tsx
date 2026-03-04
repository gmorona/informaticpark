import { CustodianForm } from "../custodian-form";

export default async function EditCustodianPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const custodianId = parseInt(id);
  return <CustodianForm custodianId={custodianId} />;
}
