create extension if not exists "pgcrypto";

create table if not exists users (
  id uuid primary key,
  name text not null,
  email text unique not null,
  rating integer not null default 1200,
  total_matches integer not null default 0,
  total_wins integer not null default 0
);

create table if not exists problems (
  id bigserial primary key,
  title text not null,
  description text not null,
  function_signature text not null,
  test_cases jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists rooms (
  id text primary key,
  player1 uuid not null references users(id),
  player2 uuid references users(id),
  problem_id bigint references problems(id),
  status text not null check (status in ('waiting','active','completed')),
  end_time timestamptz,
  winner uuid references users(id)
);

create table if not exists submissions (
  id bigserial primary key,
  room_id text not null references rooms(id) on delete cascade,
  user_id uuid not null references users(id),
  score integer not null,
  execution_time double precision not null,
  error_message text,
  submitted_at timestamptz not null default now()
);

create index if not exists idx_rooms_status on rooms(status);
create index if not exists idx_submissions_room on submissions(room_id);
create index if not exists idx_users_rating on users(rating desc);



create or replace function increment_matches(user_ids uuid[])
returns void language sql as $$
  update users set total_matches = total_matches + 1 where id = any(user_ids);
$$;

create or replace function increment_wins(winner_id uuid)
returns void language sql as $$
  update users set total_wins = total_wins + 1 where id = winner_id;
$$;
insert into problems (title, description, function_signature, test_cases)
values (
  'Two Sum Indices',
  'Return indices of two numbers that add to target.',
  'def solve(nums, target)',
  '[{"input": [[2,7,11,15],9], "expected": [0,1]}, {"input": [[3,2,4],6], "expected": [1,2]}, {"input": [[3,3],6], "expected": [0,1]}, {"input": [[1,5,8,10],13], "expected": [1,2]}, {"input": [[0,4,3,0],0], "expected": [0,3]}]'
)
on conflict do nothing;
