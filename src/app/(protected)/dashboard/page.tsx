import { SignOut } from "@/components/signout-button";

export default function Dashboard() {
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen bg-gray-100 gap-4">
      <h1 className="text-6xl font-bold">Dashboard</h1>
      <SignOut />
    </div>
  );
}
