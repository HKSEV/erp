"use client";

import { useEffect, useState } from "react";
import api from "./api";
import type { Company } from "@/app/types/Company";

// 회사명(GET /api/company)을 헤더·문서 페이지 로고가 함께 사용
// 같은 토큰이면 요청을 한 번만 보내고, 회사 정보 화면에서 저장하면 열린 화면에 바로 반영
let cache: {token: string; request: Promise<string>} | null = null;
const listeners = new Set<(name: string) => void>();

const readToken = () =>
  sessionStorage.getItem("token") ?? localStorage.getItem("token") ?? "";

function fetchCompanyName(): Promise<string> {
  const token = readToken();
  // 로그인 전(문서 페이지)에는 조회할 수 없으므로 기본 이름 사용
  if (!token)
    return Promise.resolve("");

  if (cache?.token !== token) {
    const request = api.get<Company>("/api/company")
      .then(({data}) => data.name.trim())
      .catch(() => {
        // 실패한 결과는 남기지 않고 다음 화면에서 다시 조회
        if (cache?.token === token)
          cache = null;
        return "";
      });
    cache = {token, request};
  };

  return cache.request;
};

// 회사 정보 화면에서 저장에 성공했을 때 호출
export function updateCompanyName(name: string) {
  const token = readToken();
  if (token)
    cache = {token, request: Promise.resolve(name.trim())};
  listeners.forEach((listener) => listener(name.trim()));
};

// 회사명이 있으면 "{회사명} ERP System", 없으면 기본 이름
export const toErpTitle = (name: string) =>
  name ? `${name} ERP System` : "Smart ERP System";

export default function useCompanyName() {
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    fetchCompanyName().then((data) => {
      if (ignore)
        return;
      setName(data);
      setIsLoading(false);
    });

    const listener = (next: string) => setName(next);
    listeners.add(listener);

    return () => {
      ignore = true;
      listeners.delete(listener);
    };
  }, []);

  return {name, isLoading};
};
