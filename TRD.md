# TRD — 타로 X 108염주 · 합장주 스토어 (taro108)

문서 버전: v1.0 (2026-07-24) · 짝 문서: PRD.md
원칙: **무료 티어, 최소 구성, 관리자 UI 없음.** 필요해질 때까지 만들지 않는다.

---

## 1. 스택 결정

| 레이어 | 선택 | 근거 |
|---|---|---|
| 프론트엔드 | **Next.js (App Router) + Tailwind CSS** | 정적 생성 위주, OG 이미지 생성(P1)에 유리 |
| 호스팅 | **Vercel** (단일 호스팅) | GitHub 연동 자동 배포. GitHub Pages는 사용하지 않음 (아래 주의 참조) |
| DB/스토리지 | **Supabase Free** | Postgres + RLS + Storage + Studio(관리자 UI 대체) |
| 결제 | 무통장입금 (v1) | PG 없음. TRD 범위 밖 — 안내 화면만 구현 |
| 관리자 | Supabase Studio | 별도 개발 0 |
| 상태관리/기타 라이브러리 | 추가하지 않음 | `@supabase/supabase-js` 하나면 충분. 폼도 네이티브 `<form>` |

### ⚠️ 무료 티어 약관 주의 (요청 스택에 대한 검토 의견)

- **GitHub Pages**: 약관상 상업 거래 목적 스토어프론트 운영을 금지. 판매 사이트 호스팅에 부적합 → **제외 권장**. (Vercel과 역할도 중복됨)
- **Vercel Hobby**: 약관상 비상업 용도 한정. 소규모 운영은 현실적으로 문제 되는 일이 드물지만 리스크는 존재.
  - **안전한 무료 대안: Cloudflare Pages** (무료 티어 상업 이용 허용, Next.js 지원). 본 문서는 Vercel 기준으로 작성하되, 배포 대상만 바꾸면 그대로 이전 가능하도록 Vercel 전용 기능 의존을 최소화한다 (Vercel Analytics, `next/og`만 해당 — 대체 가능).
- **Supabase Free**: **7일간 요청이 없으면 프로젝트 일시정지**. §11 런북의 keep-alive로 방지.

## 2. 아키텍처

```mermaid
flowchart TB
    subgraph Client["브라우저 (모바일 퍼스트)"]
        UI[Next.js 정적 페이지]
    end
    subgraph Vercel["Vercel (Free)"]
        SSG[정적 생성 페이지<br>/ /tarot /result/[card] /products ...]
        OG["/api/og — OG 이미지 (P1)"]
    end
    subgraph Supabase["Supabase (Free)"]
        PG[(Postgres<br>products / tarot_cards / orders)]
        ST[Storage: 상품·카드 이미지]
        RLS[RLS 정책]
        Studio[Supabase Studio = 관리자 화면]
    end
    GH[GitHub repo] -->|push → 자동 배포| Vercel
    UI -->|supabase-js + anon key| RLS --> PG
    UI --> ST
    Admin[운영자] --> Studio
    Cron[GitHub Actions cron<br>keep-alive ping] --> PG
```

- 서버 코드 없음이 기본. 클라이언트가 anon key로 Supabase에 직접 접근하고, 보안은 전부 **RLS로 강제**한다.
- anon key는 공개되어도 되는 키다. 단 RLS가 꺼진 테이블이 하나라도 있으면 안 됨 (§6).

## 3. 라우트 구성

| 경로 | 렌더링 | 내용 |
|---|---|---|
| `/` | SSG | 랜딩 + "오늘의 타로 뽑기" CTA |
| `/tarot` | SSG | 카드 22장 뒷면 배열, 탭하여 선택 |
| `/result/[cardSlug]` | SSG (22페이지 정적 생성) | 카드 해석 + 추천 상품 + 한정세일 블록 |
| `/products` | 서버 컴포넌트 + ISR 60초 | 카탈로그 (카테고리별 섹션) |
| `/products/[slug]` | 서버 컴포넌트 (동적) | 상품 상세, `?card=`로 특가 문맥 전달 |
| `/order/[productSlug]` | 서버 셸 + 클라이언트 폼 | 주문서 폼 |
| `/order/complete/[orderNo]` | 클라이언트 | 입금 안내 (계좌/금액/기한) |
| `/about`, `/terms`, `/privacy`, `/policy` | SSG | 정적 고지 페이지 |
| `/sitemap.xml`, `/robots.txt` | SSG | 기본 SEO |
| `/api/og` | Edge (P1) | 결과 공유용 OG 이미지 |

- 상품 데이터는 서버 컴포넌트에서 Supabase를 직접 읽는다. supabase-js에 `fetch(..., { next: { revalidate: 60 } })`를 물려 60초 ISR로 캐시 → **상품/재고 수정은 최대 1분 뒤 자동 반영되며 재배포가 필요 없다.** (TRD 초안의 Deploy Hook 절차는 폐기)
- 카드 결과 페이지 22장은 빌드 시 정적 생성. 공유 링크로 들어와도 같은 결과가 보인다.

## 4. 데이터 모델

**적용 DDL의 원본은 [`data/seed.sql`](data/seed.sql)** — Supabase SQL Editor에 그대로 붙여 실행한다. 테이블은 `products`, `orders` 둘뿐이다.

- **`tarot_cards` 테이블은 만들지 않는다.** 카드 22장은 [`data/cards.ts`](data/cards.ts)가 단일 소스이고 앱이 빌드 시점에 굽는다. DB가 카드 텍스트를 알 필요가 없고, 두 곳을 손으로 맞추는 문제도 사라진다. 주문에는 카드 번호(`tarot_card_id smallint`, 0~21, FK 없음)만 남긴다.
- 카드 하나에 원석 하나(`stone`)를 매핑한다 (배열 아님). 추천은 "그 원석 상품을 앞으로, 품절을 뒤로" 정렬해 상위 3개 — SKU가 수십 개 규모라 상품 전체를 한 번 읽고 화면에서 정렬한다.
- `orders.product_name`을 함께 저장한다. 상품명을 바꿔도 과거 주문서는 그대로 남아야 하므로.
- `unit_price`는 클라이언트가 보낸 값을 그대로 저장한다. 입금 확인 시 운영자가 금액을 대조하므로 서버 검증은 생략 — `-- ponytail: 가격 검증은 입금 대조로 갈음, PG 도입 시 Edge Function 검증으로 승격`.
- 재고 차감은 자동화하지 않는다. 입금 확인 시 운영자가 Studio에서 수동 차감 (주문량이 적은 동안은 이게 더 안전 — 미입금 주문이 재고를 잠그지 않음).

## 5. 시드 데이터 — 카드 ↔ 원석 매핑 초안

원석 9종으로 22장을 커버 (SKU 수를 원석 종류와 맞춰 최소화). 구현본은 [`data/cards.ts`](data/cards.ts). **문구·매핑은 운영자 감수 필요 (PRD §8-3).**

| # | 카드 | 원석 | 매칭 한 줄 |
|---|---|---|---|
| 0 | 바보 The Fool | 백수정 clear-quartz | 어떤 색도 물들 수 있는 순수한 시작의 돌 |
| 1 | 마법사 The Magician | 시트린 citrine | 의지를 현실로 끌어내는 풍요와 실행의 돌 |
| 2 | 여사제 The High Priestess | 자수정 amethyst | 직관과 내면의 소리를 밝히는 돌 |
| 3 | 여황제 The Empress | 로즈쿼츠 rose-quartz | 사랑과 돌봄의 기운을 품는 돌 |
| 4 | 황제 The Emperor | 호안석 tiger-eye | 중심을 잡고 밀고 나가는 결단의 돌 |
| 5 | 교황 The Hierophant | 라피스라줄리 lapis | 지혜와 가르침을 상징하는 돌 |
| 6 | 연인 The Lovers | 로즈쿼츠 rose-quartz | 관계와 선택에 온기를 더하는 돌 |
| 7 | 전차 The Chariot | 호안석 tiger-eye | 목표를 향해 직진하는 추진의 돌 |
| 8 | 힘 Strength | 가넷 garnet | 흔들리지 않는 내면의 힘을 데우는 돌 |
| 9 | 은둔자 The Hermit | 자수정 amethyst | 고요한 성찰을 지켜주는 돌 |
| 10 | 운명의 수레바퀴 | 시트린 citrine | 흐름을 기회로 바꾸는 행운의 돌 |
| 11 | 정의 Justice | 라피스라줄리 lapis | 명료한 판단과 균형의 돌 |
| 12 | 매달린 사람 | 백수정 clear-quartz | 관점을 비우고 다시 보게 하는 돌 |
| 13 | 죽음 Death | 오닉스 onyx | 끝맺음과 새 국면을 지키는 보호의 돌 |
| 14 | 절제 Temperance | 아마조나이트 amazonite | 치우침을 다스리는 조화의 돌 |
| 15 | 악마 The Devil | 오닉스 onyx | 집착을 끊어내는 정화·보호의 돌 |
| 16 | 탑 The Tower | 오닉스 onyx | 격변 속에서 나를 지키는 돌 |
| 17 | 별 The Star | 아마조나이트 amazonite | 희망의 물빛을 닮은 치유의 돌 |
| 18 | 달 The Moon | 자수정 amethyst | 불안을 가라앉히고 직관을 밝히는 돌 |
| 19 | 태양 The Sun | 시트린 citrine | 햇살의 활력과 긍정을 담은 돌 |
| 20 | 심판 Judgement | 라피스라줄리 lapis | 부름에 답하는 각성의 돌 |
| 21 | 세계 The World | 백수정 clear-quartz | 완성과 통합, 모든 기운을 아우르는 돌 |

- 추천 로직: 활성 상품을 한 번 읽어(`getProducts`) `recommend(products, card.stone)`로 "해당 원석 우선 → 재고 있는 것 우선" 정렬 후 상위 3개.
- 카드 이미지: 스캔본을 쓰지 않고 CSS로 그렸다(`components/CardFace.tsx` — 원석 색 글로우 + 로마숫자 + 심볼). 자산 0개, 라이선스 리스크 0. 자체 일러스트가 생기면 `<img>`로 교체(P1).

## 6. 보안 — RLS 정책 (필수, 빠뜨리면 안 됨)

적용본은 [`data/seed.sql`](data/seed.sql) 하단. 요지:

```sql
alter table products enable row level security;
alter table orders   enable row level security;

create policy "public read products" on products for select using (is_active);

-- 주문: 익명 INSERT만 허용. SELECT/UPDATE/DELETE 정책 없음 → 전부 차단
create policy "anon insert orders" on orders for insert
  with check (
    qty between 1 and 10
    and char_length(buyer_name) between 1 and 30
    and phone ~ '^01[0-9]{8,9}$'
    and char_length(address) between 5 and 200
    and char_length(coalesce(memo,'')) <= 300
  );
```

- 같은 조건을 클라이언트 `validateOrder()`(`lib/order.ts`)에도 두어 서버가 거절하기 전에 사용자에게 먼저 알린다. **두 곳이 어긋나면 RLS 쪽이 정답** — 정책을 바꾸면 `lib/order.ts`와 테스트도 같이 고칠 것.
- **orders는 select 정책이 없다** → anon key로는 타인 주문 조회 불가. 주문 완료 화면 정보는 insert 응답이 아니라 제출한 폼 값으로 렌더링한다 (insert 시 `returning` 없이 호출).
- 주문 조회 기능(P1) 구현 시: `order_no + phone 뒤 4자리`를 받는 **Edge Function**(service role)으로만 조회. anon select는 계속 금지.
- 스팸 방어: 폼에 honeypot 필드 1개 + 제출 버튼 3초 지연. `-- ponytail: 이 정도로 시작, 스팸 발생하면 Cloudflare Turnstile(무료) 추가`

## 7. 타로 · 한정세일 로직

```
뽑기:  crypto.getRandomValues 로 0~21 선택 → router.push(/result/[slug])
특가:  결과 페이지 진입 시 localStorage.setItem('taro_sale_' + cardId, Date.now())
       만료시각 = 저장시각 + 24h. 카운트다운 표시, 만료 시 정가로 전환
주문:  특가 유효하면 unit_price = sale_price, 아니면 price
       tarot_card_id 를 주문에 기록 (전환 추적용)
```

- 서버 측 쿠폰 검증 없음. localStorage 조작으로 할인받는 사용자는 "그래도 고객"으로 간주 — 할인폭 10~15%는 어뷰징 방어 비용보다 싸다. PG 도입 시점에 서버 검증으로 승격.

## 8. 프로젝트 구조 (구현본)

```
taro108/
├── PRD.md / TRD.md / README.md
├── app/
│   ├── page.tsx  tarot/  result/[cardSlug]/  products/  products/[slug]/
│   ├── order/[productSlug]/  order/complete/[orderNo]/
│   ├── about/  terms/  privacy/  policy/  not-found.tsx
│   ├── sitemap.ts  robots.ts  globals.css  layout.tsx
├── components/
│   ├── CardFace.tsx     # CSS로 그린 타로 카드
│   ├── ProductCard.tsx  Doc.tsx  ShareButton.tsx
│   ├── SaleBlock.tsx    # 결과 페이지 추천 + 카운트다운 (특가 타이머 시작 지점)
│   ├── BuyBlock.tsx     # 상세 가격 + 주문 버튼
│   └── OrderForm.tsx  OrderComplete.tsx
├── lib/
│   ├── supabase.ts      # 클라이언트 1개 + 상품 조회 + recommend()
│   ├── order.ts         # 금액·특가·검증 순수 함수 (import 없음)
│   ├── order.test.mts   # npm test — node --test
│   ├── sale.ts          # localStorage 읽기/쓰기
│   ├── useSale.ts       # 특가 남은 시간 훅
│   ├── stones.ts        # 원석 9종 이름·색
│   └── constants.ts     # 사이트/계좌/사업자 정보
├── data/  cards.ts  seed.sql
└── .github/workflows/keepalive.yml
```

- 자산 파일 없음 (`public/`은 favicon만). 카드도 상품 대체 이미지도 CSS 그라데이션.

## 9. 환경 변수

| 키 | 비고 |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | 공개 가능 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 공개 가능 (RLS가 방어선) |

service role key는 v1에서 **어디에도 넣지 않는다** (사용처 없음. P1 주문조회 Edge Function에서만 Supabase 측 환경변수로 사용).

## 10. 배포 파이프라인

1. GitHub repo 생성 → Vercel 연결 (`main` push = 프로덕션 배포).
2. Supabase 프로젝트 생성 → SQL Editor에서 `data/seed.sql` 실행 → Storage 버킷 `product-images` (public) 생성.
3. Vercel에 환경변수 2개 등록 (`.env.example` 참고).
4. GitHub repo Secrets에 `SUPABASE_URL`, `SUPABASE_ANON_KEY` 등록 (keep-alive 워크플로용).
5. 상품 갱신 플로우: Studio에서 행 수정 → **최대 60초 뒤 사이트에 자동 반영** (재배포 불필요).

## 11. 운영 런북

| 상황 | 절차 |
|---|---|
| 신규 주문 확인 | 하루 1~2회 Studio → orders → `status = pending` 필터 |
| 입금 확인 | 은행앱 대조 → status `paid` 변경 → products.stock 수동 차감 |
| 발송 | 송장 등록 후 status `shipped`, 고객에겐 카카오톡 채널/문자로 송장 안내 |
| 48시간 미입금 | status `cancelled` |
| 상품 추가·가격 변경 | Studio → products 행 편집. 60초 뒤 사이트 반영 |
| **Supabase 일시정지 방지** | `.github/workflows/keepalive.yml` (주 2회 REST 1회 호출). repo Secrets 2개 필요 |
| 백업 | 월 1회 Studio에서 orders CSV 내보내기 |

## 12. 비용

| 항목 | 비용 |
|---|---|
| Vercel / Supabase / GitHub | 0원 (무료 티어) |
| 도메인 (선택) | 연 1.5~2만원 |
| **월 고정비 합계** | **0원** |

무료 티어 한도 대비 예상 사용량: DB 500MB 중 <1%, Storage 1GB 중 사진 수십 장, 대역폭 100GB 중 소규모 트래픽 — 전 항목 여유. 한도 초과가 걱정되는 시점 = 이미 유료 전환할 매출이 나는 시점.

## 13. 진행 상태

M1~M3(뼈대 · 타로 · 커머스)와 M4의 코드 부분은 구현 완료. 남은 것은 **실 계정 연결 후에만 할 수 있는 검증**이다.

- [x] 22장 뽑기 → 결과 → 추천 → 주문서 → 입금 안내 전체 흐름
- [x] 고지 페이지 4종 (초안 — 운영자 검토 필요)
- [x] sitemap / robots / keep-alive 워크플로
- [x] `npm test` (금액·특가·주문번호·검증), `tsc --noEmit`, `eslint`, `next build` 통과
- [ ] **anon key로 orders select 시 0건 차단 확인** — Supabase 프로젝트 연결 후
- [ ] **RLS 미적용 테이블 0개** (Studio Security Advisor 경고 0)
- [ ] 실제 브라우저에서 주문 1건 넣어보기 (입금 안내 화면 금액 확인)
- [ ] Lighthouse 모바일 성능 80+ / 접근성 90+
- [ ] PRD §8의 미확정 값 5종 입력 (계좌·상품·문구감수·사업자정보·도메인)

**P1 이후**: OG 이미지 생성, 주문 조회, 카카오 공유, 신규 주문 알림 자동화

## 14. 구현하면서 초안에서 바꾼 것

| 초안 | 구현 | 이유 |
|---|---|---|
| `tarot_cards` 테이블 + `data/cards.ts` 이중 관리 | 테이블 삭제, `data/cards.ts` 단일 소스 | DB가 카드 텍스트를 쓸 일이 없다. 손으로 동기화하는 문제 자체를 없앰 |
| 카드당 원석 배열(`stones[]`) | 단일 `stone` | 한 카드 = 한 원석. 부족분은 다른 상품으로 채워 3개 노출 |
| 상품 페이지 SSG + 클라이언트 fetch | 서버 컴포넌트 + 60초 ISR | 코드량 같고 SEO·최신성 모두 이득. Deploy Hook 수동 조작이 사라짐 |
| 라이더-웨이트 스캔 이미지 22장 | CSS로 그린 카드 | 자산·라이선스·용량 0 |
| `next/image` | 일반 `<img loading="lazy">` | Vercel 무료 티어 이미지 최적화 쿼터를 쓰지 않음 |
| — | `orders.product_name` 추가 | 상품명이 바뀌어도 과거 주문서 보존 |
| 웹폰트 | 시스템 한글 폰트 스택 | 다운로드 0, 레이아웃 시프트 없음 |
