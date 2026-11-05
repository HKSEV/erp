"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { isAxiosError } from "axios";
import { exchangeKakaoCode } from "@/app/lib/kakao";
import { saveToken } from "@/app/lib/auth";
import { setLogin } from "@/store/authSlice";
import useModal from "@/components/contexts/ModalContext";
import * as S from "@/assets/css/Style.styles";

export default function KakaoCallback() {
  const router = useRouter();
  const dispatch = useDispatch();
  const {openAlertModal} = useModal();
  const [error, setError] = useState("");

  const exchangeRef =
    useRef<ReturnType<typeof exchangeKakaoCode> | null>(null);
  const handledRef = useRef(false);

  useEffect(() => {
    let active = true;

    const fail = (err: unknown) => {
      if (!active || handledRef.current)
        return;

      handledRef.current = true;

      const data = isAxiosError<string | {message?: unknown}>(err)
        ? err.response?.data
        : undefined;

      const message = typeof data === "string"
        ? data
        : typeof data?.message === "string"
        ? data.message
        : err instanceof Error
        ? err.message
        : "카카오 로그인에 실패했습니다.";

      setError(message);
      openAlertModal(message, undefined, {variant: "error"});
    };

    try {
      // StrictMode에서 Effect가 재실행되어도 같은 요청을 사용합니다.
      exchangeRef.current ??= exchangeKakaoCode();

      const {request, rememberMe} = exchangeRef.current;

      request.then(({data}) => {
        if (!active || handledRef.current)
          return;

        if (typeof data.token !== "string" || !data.token.trim())
          throw new Error("로그인 응답에 토큰이 없습니다.");

        saveToken(data.token, rememberMe);
        dispatch(setLogin({token: data.token}));

        handledRef.current = true;

        openAlertModal(
          "카카오 로그인이 완료되었습니다.",
          () => router.replace("/dashboard"),
          {variant: "success"}
        );
      }).catch(fail);
    } catch (err: unknown) {
      fail(err);
    }

    return () => {active = false;};
  }, [dispatch, openAlertModal, router]);

  return (
    <S.MemberContainer>
      <meta name="referrer" content="no-referrer"/>
      <meta name="robots" content="noindex, nofollow"/>

      <S.MemberCard>
        <S.MemberTitle>카카오 로그인</S.MemberTitle>

        <S.MemberDescription role={error ? "alert" : "status"}>
          {error || "카카오 인증을 확인하고 있습니다."}
        </S.MemberDescription>

        {error && (
          <S.MemberFooter>
            <S.MemberTextLink href="/">
              로그인으로 이동
            </S.MemberTextLink>
            <S.MemberTextLink href="/register">
              회원가입으로 이동
            </S.MemberTextLink>
          </S.MemberFooter>
        )}
      </S.MemberCard>
    </S.MemberContainer>
  );
};
