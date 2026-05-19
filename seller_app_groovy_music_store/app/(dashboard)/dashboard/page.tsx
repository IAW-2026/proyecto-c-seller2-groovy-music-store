import { auth, currentUser } from "@clerk/nextjs/server";

export default async function DashboardPage() {
  const { userId } = await auth();
  const user = await currentUser();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">
        Bienvenido, {user?.firstName}
      </h1>
      <p className="text-gray-600">
        ID de vendedor: {userId}
      </p>
    </div>
  );
}