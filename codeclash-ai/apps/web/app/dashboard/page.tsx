import TopNav from "@/components/TopNav";

export default function DashboardPage() {
  return (
    <div>
      <TopNav />
      <div className="grid gap-4 md:grid-cols-2">
        <a href="/create-room" className="rounded bg-panel p-6">Create a battle room</a>
        <a href="/join-room" className="rounded bg-panel p-6">Join with room code</a>
      </div>
    </div>
  );
}
