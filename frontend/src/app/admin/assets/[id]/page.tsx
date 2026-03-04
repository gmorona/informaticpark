import { AssetForm } from "../asset-form";

export default async function EditAssetPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const assetId = parseInt(id);
  return <AssetForm assetId={assetId} />;
}
