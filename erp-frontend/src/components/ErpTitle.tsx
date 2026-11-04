"use client";

import useCompanyName, { toErpTitle } from "@/app/lib/company";

// 헤더·문서 페이지 로고 글자 (불러오는 동안은 비워 두어 기본 이름이 잠깐 보이지 않게 함)
export default function ErpTitle() {
  const {name, isLoading} = useCompanyName();

  return isLoading ? null : toErpTitle(name);
};
