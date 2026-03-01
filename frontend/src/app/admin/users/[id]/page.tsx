import { UserForm } from "../user-form";

export default function EditUserPage({ params }: { params: { id: string } }) {
  const userId = parseInt(params.id);
  return <UserForm userId={userId} />;
}
