"use client";

import { useEffect, useState } from "react";
import api from "./api";
import type { MemberProfile } from "@/app/types/Member";

// 로그인한 회원 정보(GET /api/members/me)를 사이드바·시스템관리 화면이 함께 사용
// 같은 토큰이면 요청을 한 번만 보내고, 다른 계정으로 다시 로그인하면 새로 조회
let cache: {token: string; request: Promise<MemberProfile | null>} | null = null;

const readToken = () =>
  sessionStorage.getItem("token") ?? localStorage.getItem("token") ?? "";

function fetchCurrentMember(): Promise<MemberProfile | null> {
  const token = readToken();
  if (!token)
    return Promise.resolve(null);

  if (cache?.token !== token) {
    const request = api.get<MemberProfile>("/api/members/me")
      .then(({data}) => data)
      .catch(() => {
        // 실패한 결과는 남기지 않고 다음 화면에서 다시 조회
        if (cache?.token === token)
          cache = null;
        return null;
      });
    cache = {token, request};
  };

  return cache.request;
};

export default function useCurrentMember() {
  const [member, setMember] = useState<MemberProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    fetchCurrentMember().then((data) => {
      if (ignore)
        return;
      setMember(data);
      setIsLoading(false);
    });

    return () => {
      ignore = true;
    };
  }, []);

  return {
    member,
    isLoading,
    isAdmin: member?.role === "ADMIN" && member.active,
  };
};
