import type { Metadata } from "next";
import * as S from "@/assets/css/Info.styles";

export const metadata: Metadata = {
  title: "사용자 매뉴얼",
};

// 현재 구현된 기능 기준의 간단한 안내 (완료 단계의 매뉴얼 작성 시 보완)
export default function ManualPage() {
  return (
    <>
      <h1>사용자 매뉴얼</h1>
      <S.InfoMeta>최종 수정: 2026년 10월 29일</S.InfoMeta>

      <h2>1. 시작하기</h2>
      <ol>
        <li>회원가입 화면에서 이름, 이메일, 비밀번호를 입력해 계정을 만듭니다.</li>
        <li>로그인 화면에서 이메일과 비밀번호로 로그인합니다.</li>
        <li>비밀번호를 잊었다면 비밀번호 찾기에서 가입한 이메일을 입력해 임시 비밀번호를 받습니다.</li>
      </ol>

      <h2>2. 화면 구성</h2>
      <ul>
        <li>왼쪽 사이드바에서 업무 메뉴(대시보드, 생산관리, 재고관리, 인사관리)와 시스템관리 메뉴로 이동합니다.</li>
        <li>휴대폰처럼 좁은 화면에서는 왼쪽 위 ☰ 버튼을 눌러 메뉴를 엽니다.</li>
        <li>오른쪽 위의 내 정보에서 비밀번호를 변경하고, 로그아웃할 수 있습니다.</li>
      </ul>

      <h2>3. 메뉴별 기능</h2>
      <table>
        <tbody>
          <tr>
            <th>대시보드</th>
            <td>월별 캘린더에서 공휴일을 확인하고, 날짜를 눌러 업무 일정을 등록·수정·삭제합니다.</td>
          </tr>
          <tr>
            <th>생산관리</th>
            <td>생산 오더 목록과 진행 상태, 진행률을 확인합니다.</td>
          </tr>
          <tr>
            <th>재고관리</th>
            <td>품목별 현재고와 재고 상태(정상·부족·품절), 총 재고 자산을 확인합니다.</td>
          </tr>
          <tr>
            <th>인사관리</th>
            <td>임직원 목록과 재직 상태, 인원 현황을 확인합니다.</td>
          </tr>
          <tr>
            <th>시스템관리</th>
            <td>회사 기본 정보를 확인합니다. 사용자 권한 관리는 준비 중입니다.</td>
          </tr>
        </tbody>
      </table>

      <h2>4. 문의</h2>
      <p>
        사용 중 문제가 있으면 <a href="mailto:support@example.com">support@example.com</a>으로 문의해 주세요.
      </p>
    </>
  );
};
