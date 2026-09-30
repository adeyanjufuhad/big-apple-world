-- Big Apple World — database hardening. Run after schema.sql.
-- The admin connects as the table owner (bypasses RLS). The storefront connects as
-- shop_web, a login role that is NOT in neon_superuser and gets only what's below.

-- Row-level security: shop_web sees and writes only what the shop needs.
alter table categories  enable row level security;
alter table products    enable row level security;
alter table orders      enable row level security;
alter table events      enable row level security;

drop policy if exists shop_read_categories on categories;
create policy shop_read_categories on categories for select to shop_web using (true);

-- Hidden (unpublished) products are invisible to the storefront role.
drop policy if exists shop_read_published on products;
create policy shop_read_published on products for select to shop_web using (published);

-- The shop may only create pending orders; it can never mark one paid.
drop policy if exists shop_insert_pending_orders on orders;
create policy shop_insert_pending_orders on orders for insert to shop_web
  with check (status = 'pending' and total >= 0);

drop policy if exists shop_insert_events on events;
create policy shop_insert_events on events for insert to shop_web with check (true);

-- Column-level grants block field tampering (status, timestamps, ids stay server-owned).
revoke all on categories, products, orders, events from shop_web;
grant select on categories, products to shop_web;
grant insert (ref, items, total, visitor_id) on orders to shop_web;
grant insert (type, visitor_id, path, product_slug, referrer, device, country) on events to shop_web;

-- Rate limiting: fixed-window counters keyed by a hashed identifier (no raw IPs stored).
create table if not exists rate_limits (
  key           text primary key,
  window_start  timestamptz not null,
  hits          int not null
);
alter table rate_limits enable row level security;  -- no policies: only the function below touches it
revoke all on rate_limits from shop_web;

create or replace function hit_rate_limit(p_key text, p_window_seconds int, p_max int)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  current_hits int;
begin
  insert into rate_limits as r (key, window_start, hits)
  values (p_key, now(), 1)
  on conflict (key) do update set
    hits = case when r.window_start < now() - make_interval(secs => p_window_seconds) then 1 else r.hits + 1 end,
    window_start = case when r.window_start < now() - make_interval(secs => p_window_seconds) then now() else r.window_start end
  returning hits into current_hits;

  if random() < 0.01 then
    delete from rate_limits where window_start < now() - interval '1 day';
  end if;

  return current_hits <= p_max;
end
$$;

revoke all on function hit_rate_limit(text, int, int) from public;
grant execute on function hit_rate_limit(text, int, int) to shop_web;
