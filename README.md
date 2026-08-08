# taro108

타로 한 장을 뽑으면 그 기운에 맞는 **108염주 팔찌 · 합장주**를 추천하고 24시간 한정 특가로 파는 사이트.

- 기획: [PRD.md](PRD.md) · 설계: [TRD.md](TRD.md)
- Next.js 16 (App Router) + Tailwind v4 + Supabase + Vercel. **월 고정비 0원**, 관리자 페이지 없음(Supabase Studio로 운영).

## 로컬 실행

```bash
npm install
cp .env.example .env.local     # Supabase URL / anon key 채우기
npm run dev
```

환경변수가 없어도 빌드·실행은 된다. Supabase 키가 없으면 [`data/products.sample.ts`](data/products.sample.ts)
의 샘플 상품 18개(원석 9종 × 2카테고리)가 대신 뜨므로 화면은 전부 확인할 수 있다.
키를 채우는 순간 DB만 본다.

```bash
npm test        # 금액·특가·주문번호·검증 로직 (node --test, 프레임워크 없음)
npm run lint
npm run build
```

## 처음 붙일 때 (30분)

1. **Supabase** 프로젝트 생성 → SQL Editor에 [`data/seed.sql`](data/seed.sql) 통째로 붙여넣고 실행.
   샘플 상품 12개가 함께 들어간다.
2. Studio → Table Editor에서 상품을 실제 상품으로 교체. 사진은 Storage에 공개 버킷을 만들어
   올리고 URL을 `images` 배열에 넣는다. **비워두면 원석 색 그라데이션으로 대체 렌더링된다.**
3. **Vercel**에 GitHub repo 연결 + 환경변수 2개 등록 → `main` push하면 배포.
   카카오톡 공유를 켜려면 `NEXT_PUBLIC_KAKAO_JS_KEY` 도 같이 등록한다 (아래 참고).
4. GitHub repo Secrets에 `SUPABASE_URL`, `SUPABASE_ANON_KEY` 등록
   (`.github/workflows/keepalive.yml`이 주 2회 찔러서 무료 프로젝트 일시정지를 막는다).
5. **RLS 확인 (필수)** — Studio → Advisors에 경고가 0인지, anon key로 `orders` select가
   막히는지 확인:
   ```bash
   curl "$SUPABASE_URL/rest/v1/orders?select=*" -H "apikey: $SUPABASE_ANON_KEY"
   # → [] 가 나와야 정상. 주문 내용이 보이면 정책이 잘못된 것.
   ```

## 카카오톡 공유 켜기

결과 페이지의 공유 버튼은 **키가 없으면 카카오 버튼도, SDK 다운로드도 없다.** 켜려면:

1. [Kakao Developers](https://developers.kakao.com) → 내 애플리케이션 → 앱 키 → **JavaScript 키**를
   `.env.local` 의 `NEXT_PUBLIC_KAKAO_JS_KEY` 에 넣는다.
2. 같은 앱의 **플랫폼 → Web → 사이트 도메인**에 주소를 등록한다.
   로컬에서 눌러보려면 `http://localhost:3000` 도 등록해야 한다. 미등록 도메인에서는 공유창이
   안 뜨고 링크 복사로 떨어진다.

공유 카드에 들어가는 제목·설명·이미지는 따로 넘기지 않고 `Share.sendScrap` 이 페이지의 og 태그를
긁어간다. 그래서 문구는 `app/result/[cardSlug]/page.tsx` 의 `generateMetadata` 한 곳에서만 고치면 되고,
카드 이미지는 같은 폴더의 `opengraph-image.tsx` 가 22장 전부 빌드 타임에 굽는다(원석 색 링 + 로마숫자 +
카드 영문명). **og 이미지 글자가 전부 로마자인 건 의도된 것** — `next/og` 기본 폰트에 한글 글리프가 없어
한글을 넣으면 네모로 나오고, 넣으려면 한글 TTF를 레포에 올려야 한다.

SDK 는 CDN 에서 SRI(`integrity`)로 고정해 받는다. 버전을 올리면 해시도 같이 바꿔야 한다 —
계산법은 `components/ShareButton.tsx` 주석에 있다.

## 판매 개시 전에 반드시 채울 값

전부 [`lib/constants.ts`](lib/constants.ts)에 `TODO(운영자)`로 표시돼 있다.

| 값 | 위치 | 비고 |
|---|---|---|
| 입금 계좌 (은행/번호/예금주) | `BANK` | 이게 비면 주문을 받아도 입금받을 수 없다 |
| 사업자 정보·통신판매업 신고번호 | `BUSINESS` | 법적 필수. 미기재 상태로 판매 금지 |
| 카카오톡 채널 주소 | `BUSINESS.kakao` | 유일한 고객 문의 창구 |
| 약관·개인정보처리방침 시행일 | `app/terms`, `app/privacy` | 초안이므로 운영 조건에 맞게 검토 |
| 22장 해석 문구 감수 | [`data/cards.ts`](data/cards.ts) | 브랜드 톤에 맞게 |

## 코드 지도

| 알고 싶은 것 | 파일 |
|---|---|
| 카드 22장 텍스트·원석 매핑 | `data/cards.ts` (단일 소스, DB에 없음) |
| DB 스키마 · RLS · 샘플 상품 | `data/seed.sql` |
| 키 없을 때 뜨는 샘플 상품 18개 | `data/products.sample.ts` (seed.sql 과 같은 목록) |
| 공유 버튼 · 카카오 SDK | `components/ShareButton.tsx` |
| 공유 카드 이미지 22장 | `app/result/[cardSlug]/opengraph-image.tsx` |
| 금액 계산 · 특가 판정 · 주문 검증 | `lib/order.ts` (+ `lib/order.test.mts`) |
| 상품 조회 · 추천 정렬 | `lib/supabase.ts` |
| 특가 24시간 타이머 | `lib/sale.ts`(localStorage) → `lib/useSale.ts` |
| 주문 저장 | `components/OrderForm.tsx` |

## 알아둘 것

- **특가는 서버에서 검증하지 않는다.** localStorage 조작으로 할인받는 경우가 생기지만, 할인폭
  10~15%는 방어 비용보다 싸다는 판단 (TRD §7). PG 결제를 붙이는 시점에 서버 검증으로 올린다.
- **재고는 자동 차감되지 않는다.** 입금 확인 시 운영자가 Studio에서 직접 줄인다. 미입금 주문이
  재고를 잠그지 않아 소량 운영에서는 이쪽이 안전하다.
- **주문 조회 화면이 없다.** `orders`에 select 정책이 없어 anon으로는 조회가 불가능하기 때문.
  완료 화면 금액은 제출 당시 sessionStorage 값으로 그린다. 문의는 카카오톡 채널로 받는다.
- Vercel Hobby 플랜은 약관상 비상업 용도다. 신경 쓰인다면 **Cloudflare Pages**(무료, 상업 이용
  허용)로 옮길 수 있게 Vercel 전용 기능은 쓰지 않았다 (TRD §1).
