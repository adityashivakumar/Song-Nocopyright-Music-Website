# SONG – No Copyright Music (v1.1, YouTube theme)
## Setup
1. `npm install`
2. Copy `.env.example` to `.env.local` and fill in Supabase and Cloudflare R2 values.
3. Run `supabase/migrations/0001_init.sql` in the Supabase SQL editor (or `supabase db push`).
4. Create your admin user in Supabase Auth, then: `update profiles set role='admin' where id='<user id>';` (insert a profiles row first if missing).
5. In `site_settings` set key `youtube` to `{"handle":"@yourhandle","channel_id":"UC...","url":"https://youtube.com/@yourhandle"}`.
6. R2: enable the public domain, add a CORS rule allowing PUT from your site origin.
7. `npm run dev`; deploy to Vercel and add the same env vars.
