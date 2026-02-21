# CodeClash AI MVP

## 1) Folder Structure

```text
/codeclash-ai
  /apps
    /web        # Next.js frontend + API routes
    /evaluator  # FastAPI evaluation microservice
  /packages
    /shared
  /scripts
    generate_problems.py
  schema.sql
```

## 2) Full code files
All code is included in this repository under the structure above.

## 3) SQL schema
Run `schema.sql` in Supabase SQL editor.

## 4) Environment variables
Copy `.env.example` to `.env.local` inside `apps/web` or root as needed.

Required:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `EVALUATOR_URL`

## 5) Deployment steps

### Web (Vercel)
1. Import repo to Vercel.
2. Set root directory to `codeclash-ai/apps/web`.
3. Add environment variables from `.env.example`.
4. Deploy.

### Evaluator (Render/Fly.io)
1. Deploy `codeclash-ai/apps/evaluator` as Python service.
2. Build command: `pip install -r requirements.txt`
3. Start command: `uvicorn apps.evaluator.main:app --host 0.0.0.0 --port 8000 --app-dir .`
4. Set `EVALUATOR_URL` in web deployment to evaluator public URL.

### Supabase
1. Create project.
2. Enable Google OAuth in Auth providers.
3. Add Google client credentials.
4. Run `schema.sql`.

## 6) Run instructions

```bash
cd codeclash-ai
npm install
npm run dev:web
```

In separate shell:

```bash
cd codeclash-ai
python -m venv .venv
source .venv/bin/activate
pip install -r apps/evaluator/requirements.txt
uvicorn apps.evaluator.main:app --reload --app-dir .
```

Then open `http://localhost:3000`.
