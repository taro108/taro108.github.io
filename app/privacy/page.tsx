import type { Metadata } from 'next'
import Doc from '@/components/Doc'
import { BUSINESS } from '@/lib/constants'

export const metadata: Metadata = { title: '개인정보처리방침' }

// TODO(운영자): 개인정보 보호책임자, 위탁 택배사명을 실제 값으로 채우고 개업 전 검토하세요.
export default function PrivacyPage() {
  return (
    <Doc title="개인정보처리방침" updated="0000년 00월 00일">
      <p>
        {BUSINESS.company}(이하 &lsquo;회사&rsquo;)는 이용자의 개인정보를 중요하게 생각하며,
        개인정보 보호법 등 관련 법령을 준수합니다.
      </p>

      <section>
        <h2>1. 수집하는 개인정보와 방법</h2>
        <ul>
          <li>주문 시 이용자가 직접 입력: 주문자명, 연락처, 배송지 주소, 요청사항</li>
          <li>자동 수집: 주문번호, 주문 일시, 주문 상품·금액</li>
        </ul>
        <p className="mt-1.5">
          회사는 회원가입을 받지 않으며, 별도의 로그인 정보나 결제 카드 정보를 수집하지 않습니다.
        </p>
      </section>

      <section>
        <h2>2. 이용 목적</h2>
        <ul>
          <li>주문 확인, 입금 확인, 상품 배송</li>
          <li>배송·교환·환불 등 고객 문의 응대</li>
        </ul>
      </section>

      <section>
        <h2>3. 보유 및 이용 기간</h2>
        <p className="mt-1.5">
          목적 달성 시 지체 없이 파기합니다. 다만 전자상거래 등에서의 소비자보호에 관한 법률에 따라
          아래 기간 동안 보관합니다.
        </p>
        <ul>
          <li>계약 또는 청약철회 등에 관한 기록: 5년</li>
          <li>대금결제 및 재화 등의 공급에 관한 기록: 5년</li>
          <li>소비자 불만 또는 분쟁처리에 관한 기록: 3년</li>
        </ul>
      </section>

      <section>
        <h2>4. 처리 위탁</h2>
        <ul>
          <li>배송: 택배사(TODO: 실제 택배사명) — 배송지 정보 전달</li>
          <li>데이터 보관: Supabase Inc. — 주문 데이터 저장·운영</li>
          <li>사이트 운영: Vercel Inc. — 웹사이트 호스팅</li>
        </ul>
        <p className="mt-1.5">
          위탁 업무 수행에 필요한 범위를 넘어 개인정보를 제3자에게 제공하지 않습니다.
        </p>
      </section>

      <section>
        <h2>5. 이용자의 권리</h2>
        <p className="mt-1.5">
          이용자는 언제든지 자신의 개인정보에 대한 열람·정정·삭제·처리정지를 요구할 수 있습니다.
          아래 연락처로 요청하시면 지체 없이 처리합니다.
        </p>
      </section>

      <section>
        <h2>6. 파기 절차</h2>
        <p className="mt-1.5">
          보유 기간이 지난 개인정보는 복구할 수 없는 방법으로 즉시 삭제합니다.
        </p>
      </section>

      <section>
        <h2>7. 개인정보 보호책임자</h2>
        <p className="mt-1.5">
          {BUSINESS.owner} · {BUSINESS.email} · {BUSINESS.tel}
        </p>
      </section>
    </Doc>
  )
}
