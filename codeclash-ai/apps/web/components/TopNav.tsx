import Link from "next/link";

export default function TopNav() {
  return (
    <nav className="mb-8 flex items-center justify-between border-b border-slate-700 pb-4">
      <Link href="/dashboard" className="text-xl font-bold text-blue-400">
        CodeClash AI
      </Link>
      <div className="flex gap-4 text-sm">
        <Link href="/create-room">Create Room</Link>
        <Link href="/join-room">Join Room</Link>
        <Link href="/leaderboard">Leaderboard</Link>
      </div>
    </nav>
  );
}
