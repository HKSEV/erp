"use client";

import React from "react";
import * as S from "@/assets/css/Style.styles";
import styles from "@/assets/sass/Settings.module.scss";

// 시스템관리 > 회사 기본 정보 (기존 /dashboard/settings 화면에서 이동)
// 메뉴 전환은 사이드바가 담당하므로 화면 안의 메뉴는 제거
export default function CompanySettings() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>회사 기본 정보</h2>
      </div>
      <div className={styles.content} style={{gridTemplateColumns: "1fr"}}>
        <div className={styles.mainPanel}>

          <div className={styles.formGroup}>
            <label>회사명</label>
            <input type="text" defaultValue="Apple ERP Korea" placeholder="회사명을 입력하세요" />
          </div>
          
          <div className={styles.formGroup}>
            <label>사업자 등록번호</label>
            <input type="text" defaultValue="123-45-67890" placeholder="- 없이 입력" />
          </div>

          <div className={styles.formGroup}>
            <label>대표 이메일</label>
            <input type="email" defaultValue="admin@apple-erp.co.kr" />
          </div>

          <button className={styles.saveBtn}>변경사항 저장</button>
        </div>
      </div>
    </div>
  );
};
