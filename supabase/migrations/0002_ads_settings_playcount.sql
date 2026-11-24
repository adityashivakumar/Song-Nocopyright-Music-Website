-- Safe to run more than once.
alter table affiliate_products add column if not exists ad_placement text check (ad_placement in ('banner','side','strip'));
alter table affiliate_products add column if not exists ad_pages text[] not null default '{}';
drop policy if exists "public settings" on site_settings;
create policy "public settings" on site_settings for select using (setting_key in ('youtube','site','ads'));
insert into site_settings (setting_key, setting_value)
values ('ads', '{"enabled":true,"pages":{"home":true,"music":true,"song":true,"videos":true,"video":true,"genres":true,"playlists":true}}')
on conflict (setting_key) do nothing;
