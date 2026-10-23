import { redirect } from "next/navigation";

// 기존 설정 주소는 시스템관리 > 회사 기본 정보로 이동
export default function SettingsRedirect() {
  redirect("/dashboard/system/company");
};
