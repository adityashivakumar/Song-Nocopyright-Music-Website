# Status (nothing here has been run or tested yet; run `npm install && npm run build` first)
## Done (code written)
Schema + RLS, YouTube-style theme/layout, global audio player (pauses when YouTube plays), home, music list/detail, videos list/detail, R2 upload-URL, MP3 download, affiliate click redirect, YouTube URL resolve (oEmbed), channel RSS sync (drafts).
## Not built yet
Admin: login (/admin/login), dashboard, upload song, song list (publish/unpublish/delete), add video. Still missing: genres, playlists, products UI, banners, analytics, CSV import.
## Admin note
Until the admin UI exists, add content via Supabase Table Editor; API routes already enforce admin role.
