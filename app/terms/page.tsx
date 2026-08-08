import type { Metadata } from 'next'
import Doc from '@/components/Doc'
import { SITE, BUSINESS } from '@/lib/constants'

export const metadata: Metadata = { title: '이용약관' }

// TODO(운영자): 개업 전 실제 운영 조건에 맞게 검토하세요. 표준약관을 참고한 초안입니다.
export default function TermsPage() {
  return (
    <Doc title="이용약관" updated="0000년 00월 00일">
      <section>
        <h2>제1조 (목적)</h2>
        <p className="mt-1.5">
          본 약관은 {BUSINESS.company}(이하 &lsquo;회사&rsquo;)가 운영하는 {SITE.name}(이하
          &lsquo;사이트&rsquo;)에서 제공하는 타로 콘텐츠 및 상품 판매 서비스의 이용 조건과 절차를
          정하는 것을 목적으로 합니다.
        </p>
      </section>

      <section>
        <h2>제2조 (서비스의 내용)</h2>
        <ul>
          <li>타로 카드 결과와 해석 콘텐츠 제공</li>
          <li>108염주 팔찌·합장주 등 상품의 판매 및 배송</li>
          <li>타로 결과와 연계된 한정 할인(이하 &lsquo;타로 특가&rsquo;) 제공</li>
        </ul>
      </section>

      <section>
        <h2>제3조 (타로 콘텐츠의 성격)</h2>
        <p className="mt-1.5">
          타로 결과와 해석은 오락 목적의 콘텐츠이며, 이용자의 미래·건강·재산 등 어떠한 결과도
          보증하지 않습니다. 이용자가 콘텐츠를 근거로 내린 판단의 책임은 이용자 본인에게 있습니다.
        </p>
      </section>

      <section>
        <h2>제4조 (비회원 주문)</h2>
        <p className="mt-1.5">
          사이트는 회원가입 없이 주문할 수 있습니다. 이용자는 주문 시 정확한 정보를 입력해야 하며,
          잘못된 정보로 발생한 배송 지연·오배송에 대해 회사는 책임지지 않습니다.
        </p>
      </section>

      <section>
        <h2>제5조 (대금 지급)</h2>
        <p className="mt-1.5">
          결제 수단은 무통장입금이며, 주문 후 48시간 이내에 입금해야 합니다. 기한 내 입금이 확인되지
          않으면 주문은 자동으로 취소됩니다.
        </p>
      </section>

      <section>
        <h2>제6조 (타로 특가)</h2>
        <p className="mt-1.5">
          타로 특가는 타로 결과 확인 시점부터 24시간 동안 적용됩니다. 할인 적용 여부는 주문 시점을
          기준으로 하며, 회사는 특가의 대상·할인율·기간을 사전 공지 후 변경할 수 있습니다.
        </p>
      </section>

      <section>
        <h2>제7조 (청약철회 및 환불)</h2>
        <p className="mt-1.5">
          청약철회, 교환, 환불은 전자상거래 등에서의 소비자보호에 관한 법률에 따르며, 구체적인
          절차는 &lsquo;배송·교환·환불 안내&rsquo;에 따릅니다.
        </p>
      </section>

      <section>
        <h2>제8조 (면책)</h2>
        <p className="mt-1.5">
          천재지변, 통신 장애 등 회사의 귀책사유가 없는 사유로 서비스를 제공할 수 없는 경우 회사는
          책임을 지지 않습니다.
        </p>
      </section>

      <section>
        <h2>제9조 (분쟁 해결)</h2>
        <p className="mt-1.5">
          본 약관은 대한민국 법령에 따라 해석되며, 분쟁이 발생할 경우 회사의 소재지를 관할하는
          법원을 관할 법원으로 합니다. 문의: {BUSINESS.email}
        </p>
      </section>
    </Doc>
  )
}
