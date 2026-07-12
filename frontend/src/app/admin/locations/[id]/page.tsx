import { LocationForm } from "../location-form";

export default async function EditLocationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <LocationForm locationId={parseInt(id)} />;
}
