"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import * as S from "@/assets/css/Style.style";

export default function MyPage() {
  const router = useRouter();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleChangePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      alert("로그인이 필요합니다.");
      router.push("/");
      return;
    };

    try {
      await axios.post("/api/members/change-password", {
        oldPassword, newPassword
      }, {headers: {Authorization: `Bearer ${token}`}});

      alert("비밀번호가 성공적으로 변경되었습니다. 다시 로그인해주세요.")
      localStorage.removeItem("token");
      delete axios.defaults.headers.common["Authorization"];
      router.push("/");
    } catch (err: any) {
      console.error("에러: ", err);
      alert(err.response?.data || "비밀번호 변경에 실패했습니다.");
    };
  };

  return (
    // <S.Container>
    //   <S.Card>
    //     <S.ImageColumn/>
    //     <S.FormColumn>
    //       <S.Title>Forgot Your Password?</S.Title>

    //       <S.Description>
    //         We get it, stuff happens. Just enter your email address below 
    //         and we'll send you a link to reset your password!
    //       </S.Description>

    //       <S.Form>
    //         <S.Input
    //         type="email"
    //         id=""
    //         placeholder="Enter Email Address..."/>
    //         <S.Button type="submit">
    //           Reset Password
    //         </S.Button>
    //       </S.Form>

    //       <S.Divider/>

    //       <S.StyledLink href="/member">
    //         Create an Account!
    //       </S.StyledLink>

    //       <S.StyledLink href="/">
    //         Already have an account? Login!
    //       </S.StyledLink>
    //     </S.FormColumn>
    //   </S.Card>
    // </S.Container>
    <div style={{ padding: "50px" }}>
      <h2>마이페이지 - 비밀번호 변경</h2>
      <form onSubmit={handleChangePassword}>
        <div style={{ marginBottom: "15px" }}>
          <label>기존(또는 임시) 비밀번호: </label>
          <input 
          type="password" 
          value={oldPassword} 
          onChange={(e) => setOldPassword(e.target.value)} 
          required/>
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label>새 비밀번호: </label>
          <input 
          type="password" 
          value={newPassword} 
          onChange={(e) => setNewPassword(e.target.value)} 
          required/>
        </div>
        <button type="submit">비밀번호 변경하기</button>
      </form>
    </div>
  );
};
