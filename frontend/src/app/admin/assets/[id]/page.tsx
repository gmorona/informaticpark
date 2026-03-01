import { AssetForm } from "../asset-form";

export default function EditAssetPage({ params }: { params: { id: string } }) {
  const assetId = parseInt(params.id);
  return <AssetForm assetId={assetId} />;
}
