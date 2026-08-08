-- taro108 스키마 + RLS + 샘플 상품
-- Supabase Studio → SQL Editor 에 통째로 붙여넣고 실행 (TRD §10-2).
-- 카드 22장은 앱의 data/cards.ts 가 단일 소스라 DB에 두지 않는다.
-- 주문에는 카드 번호(0~21)만 기록한다.

create table if not exists products (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  name        text not null,
  category    text not null check (category in ('bracelet108','hapjangju')),
  stone       text not null,
  price       int  not null check (price >= 0),
  sale_price  int  not null check (sale_price >= 0),
  stock       int  not null default 0 check (stock >= 0),
  images      text[] not null default '{}',
  description text not null default '',
  is_active   boolean not null default true,
  created_at  timestamptz not null default now()
);
create index if not exists products_stone_idx on products (stone) where is_active;

create table if not exists orders (
  id            uuid primary key default gen_random_uuid(),
  order_no      text unique not null,
  product_id    uuid not null references products(id),
  product_name  text not null,                 -- 상품명이 바뀌어도 주문서는 그대로 남게
  qty           int not null check (qty between 1 and 10),
  unit_price    int not null,
  shipping_fee  int not null,
  total         int not null,
  buyer_name    text not null,
  phone         text not null,
  address       text not null,
  memo          text,
  tarot_card_id smallint check (tarot_card_id between 0 and 21),
  status        text not null default 'pending'
                check (status in ('pending','paid','shipped','done','cancelled')),
  created_at    timestamptz not null default now()
);
create index if not exists orders_status_idx on orders (status, created_at desc);

-- ── RLS ────────────────────────────────────────────────────────────────
-- 하나라도 빠지면 anon key로 테이블이 통째로 열린다. 반드시 둘 다 적용할 것.
alter table products enable row level security;
alter table orders   enable row level security;

drop policy if exists "public read products" on products;
create policy "public read products" on products
  for select using (is_active);

-- 주문은 익명 INSERT만. select/update/delete 정책이 없으므로 anon은 조회 불가.
drop policy if exists "anon insert orders" on orders;
create policy "anon insert orders" on orders
  for insert with check (
    qty between 1 and 10
    and char_length(buyer_name) between 1 and 30
    and phone ~ '^01[0-9]{8,9}$'
    and char_length(address) between 5 and 200
    and char_length(coalesce(memo,'')) <= 300
  );

-- ── 샘플 상품 (운영자가 실제 상품으로 교체) ─────────────────────────────
-- images 를 비워두면 화면에서 원석 색 그라데이션으로 대체 렌더링된다.
insert into products (slug, name, category, stone, price, sale_price, stock, description) values
('br-clear-quartz','백수정 108염주 팔찌','bracelet108','clear-quartz',46000,40000,10,
 '맑은 백수정 108알을 한 줄로 엮은 손목 염주입니다. 어떤 기운에도 물들 수 있는 시작의 돌.'),
('br-citrine','시트린 108염주 팔찌','bracelet108','citrine',52000,45000,10,
 '햇살빛 시트린 108알. 풍요와 실행의 기운을 담았습니다.'),
('br-amethyst','자수정 108염주 팔찌','bracelet108','amethyst',49000,43000,10,
 '깊은 보랏빛 자수정 108알. 직관을 밝히고 마음을 가라앉힙니다.'),
('br-rose-quartz','로즈쿼츠 108염주 팔찌','bracelet108','rose-quartz',46000,40000,10,
 '따뜻한 분홍빛 로즈쿼츠 108알. 사랑과 관계의 돌.'),
('br-tiger-eye','호안석 108염주 팔찌','bracelet108','tiger-eye',48000,42000,10,
 '결이 살아 있는 호안석 108알. 중심을 잡아주는 결단의 돌.'),
('br-lapis','라피스라줄리 108염주 팔찌','bracelet108','lapis',58000,50000,8,
 '밤하늘빛 라피스라줄리 108알. 지혜와 판단의 돌.'),
('br-garnet','가넷 108염주 팔찌','bracelet108','garnet',54000,47000,8,
 '붉은 가넷 108알. 안에서부터 힘을 데워주는 돌.'),
('br-onyx','오닉스 108염주 팔찌','bracelet108','onyx',44000,38000,12,
 '단단한 흑요빛 오닉스 108알. 끊어내고 지켜주는 보호의 돌.'),
('br-amazonite','아마조나이트 108염주 팔찌','bracelet108','amazonite',47000,41000,10,
 '물빛 아마조나이트 108알. 치우침을 다스리는 조화의 돌.'),
('hj-amethyst','자수정 합장주','hapjangju','amethyst',69000,60000,5,
 '두 손을 모을 때 손안에 꼭 들어오는 자수정 합장주입니다.'),
('hj-clear-quartz','백수정 합장주','hapjangju','clear-quartz',65000,57000,5,
 '맑은 백수정으로 엮은 합장주. 기도와 명상에 곁에 두기 좋습니다.'),
('hj-onyx','오닉스 합장주','hapjangju','onyx',62000,54000,5,
 '차분한 오닉스 합장주. 마음이 어수선한 날에.')
on conflict (slug) do nothing;
