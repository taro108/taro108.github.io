import type { Metadata } from 'next'
import Doc from '@/components/Doc'
import { BUSINESS } from '@/lib/constants'
import { won, SHIPPING_FEE, FREE_SHIPPING_OVER, DEPOSIT_DEADLINE_HOURS } from '@/lib/order'

export const metadata: Metadata = { title: '배송·교환·환불 안내' }

export default function PolicyPage() {
  return (
    <Doc title="배송 · 교환 · 환불 안내">
      <section>
        <h2>결제</h2>
        <ul>
          <li>무통장입금만 가능합니다.</li>
          <li>주문 후 {DEPOSIT_DEADLINE_HOURS}시간 내 미입금 시 주문이 자동 취소됩니다.</li>
          <li>입금자명이 주문자명과 다르면 카카오톡 채널로 알려 주세요.</li>
        </ul>
      </section>

      <section>
        <h2>배송</h2>
        <ul>
          <li>배송비 {won(SHIPPING_FEE)} · {won(FREE_SHIPPING_OVER)} 이상 무료</li>
          <li>입금 확인 후 2~3일 내 발송 (주말·공휴일 제외)</li>
          <li>제작 상황에 따라 발송이 늦어질 경우 개별 안내드립니다.</li>
        </ul>
      </section>

      <section>
        <h2>교환 · 반품</h2>
        <ul>
          <li>상품 수령 후 7일 이내에 신청할 수 있습니다.</li>
          <li>
            단순 변심의 경우 왕복 배송비는 이용자가 부담합니다. 상품 하자·오배송의 경우 회사가
            부담합니다.
          </li>
          <li>
            아래의 경우 교환·반품이 어렵습니다: 사용·착용 흔적이 있는 경우, 이용자의 요청으로
            사이즈를 조정한 주문 제작 상품, 포장을 훼손해 상품 가치가 뚜렷하게 감소한 경우.
          </li>
          <li>
            천연석 특성상 알마다 색과 무늬가 조금씩 다른 점은 하자에 해당하지 않습니다.
          </li>
        </ul>
      </section>

      <section>
        <h2>환불</h2>
        <ul>
          <li>반품 상품 회수 및 확인 후 3영업일 이내에 입금 계좌로 환불합니다.</li>
          <li>부분 취소 시 무료배송 기준에 미달하면 배송비가 차감될 수 있습니다.</li>
        </ul>
      </section>

      <section>
        <h2>문의</h2>
        <p className="mt-1.5">
          카카오톡 채널 또는 {BUSINESS.email} · {BUSINESS.tel}
        </p>
      </section>
    </Doc>
  )
}
