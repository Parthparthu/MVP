export type RoomStatus = "waiting" | "active" | "completed";

export interface Problem {
  id: number;
  title: string;
  description: string;
  function_signature: string;
  test_cases: { input: unknown[]; expected: unknown }[];
}

export interface Room {
  id: string;
  player1: string;
  player2: string | null;
  problem_id: number | null;
  status: RoomStatus;
  end_time: string | null;
  winner: string | null;
}
