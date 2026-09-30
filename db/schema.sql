-- Big Apple World — Neon Postgres schema.
-- Shared by the storefront (reads catalog, writes events/orders) and the admin app.

create extension if not exists pgcrypto;

create table if not exists categories (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  name        text not null,
  image_url   text,
  sort_order  int  not null default 0,
  created_at  timestamptz not null default now()
);

create table if not exists products (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique,
  name         text not null,
  category_id  uuid not null references categories(id) on delete restrict,
  price        int  not null check (price >= 0),          -- Naira, whole units
  description  text not null default '',
  image_url    text,
  in_stock     boolean not null default true,
  best_seller  boolean not null default false,
  new_arrival  boolean not null default false,
  published    boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create index if not exists products_category_idx on products (category_id);

-- A WhatsApp checkout. Payment happens in the chat, so the owner marks it paid or cancelled.
create table if not exists orders (
  id          uuid primary key default gen_random_uuid(),
  ref         text not null unique,                        -- short code included in the WhatsApp message
  items       jsonb not null,                              -- [{slug, name, price, qty}]
  total       int  not null check (total >= 0),
  status      text not null default 'pending' check (status in ('pending', 'paid', 'cancelled')),
  visitor_id  text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists orders_created_idx on orders (created_at desc);
create index if not exists orders_status_idx on orders (status);

-- Anonymous storefront analytics. No names, emails or IP addresses are stored.
create table if not exists events (
  id            bigint generated always as identity primary key,
  type          text not null check (type in ('page_view', 'product_view', 'add_to_cart', 'checkout', 'whatsapp_click')),
  visitor_id    text not null,
  path          text,
  product_slug  text,
  referrer      text,                                      -- host only
  device        text check (device in ('mobile', 'tablet', 'desktop')),
  country       text,
  created_at    timestamptz not null default now()
);
create index if not exists events_created_idx on events (created_at desc);
create index if not exists events_type_created_idx on events (type, created_at desc);
