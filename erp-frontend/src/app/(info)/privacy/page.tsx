import type { Metadata } from "next";
import * as S from "@/assets/css/Info.styles";

export const metadata: Metadata = {
  title: "개인정보처리방침",
};

export default function PrivacyPage() {
  return (
    <>
      <h1>개인정보처리방침</h1>
      <S.InfoMeta>시행일: 2026년 10월 29일 · 본 방침은 포트폴리오 프로젝트용 예시입니다.</S.InfoMeta>

      <p>
        Smart ERP System(이하 &quot;시스템&quot;)은 이용자의 개인정보를 소중히 다루며,
        「개인정보 보호법」에 따라 아래와 같이 개인정보를 처리합니다.
      </p>

      <h2>1. 수집하는 개인정보 항목</h2>
      <table>
        <tbody>
          <tr>
            <th>필수</th>
            <td>이름, 성, 이메일, 비밀번호</td>
          </tr>
          <tr>
            <th>선택</th>
            <td>성별, 회사명, 직급, 전화번호, 주소, 상세주소</td>
          </tr>
          <tr>
            <th>업무 처리</th>
            <td>임직원 정보(사번, 부서, 직급, 재직 상태, 입사일)</td>
          </tr>
        </tbody>
      </table>

      <h2>2. 수집 및 이용 목적</h2>
      <ul>
        <li>회원 식별과 로그인, 비밀번호 찾기 등 계정 관리</li>
        <li>생산·재고·인사 등 사내 업무 처리</li>
        <li>업무 일정 공유와 공지 전달</li>
      </ul>

      <h2>3. 보유 및 이용 기간</h2>
      <p>
        회원 탈퇴 또는 퇴사 처리 시까지 보유하며, 이후 지체 없이 파기합니다.
        다만 관계 법령에 따라 보존이 필요한 경우 해당 기간 동안 보관합니다.
      </p>

      <h2>4. 제3자 제공</h2>
      <p>시스템은 이용자의 개인정보를 외부에 제공하지 않습니다.</p>

      <h2>5. 안전성 확보 조치</h2>
      <ul>
        <li>비밀번호는 BCrypt로 암호화하여 저장하며, 원래 값을 확인할 수 없습니다.</li>
        <li>로그인 후에는 JWT 토큰으로 인증하고, 권한에 따라 접근을 제한합니다.</li>
      </ul>

      <h2>6. 문의처</h2>
      <p>
        개인정보 관련 문의는 <a href="mailto:support@example.com">support@example.com</a>으로 보내 주세요.
      </p>
    </>
  );
};
