"use client";

import React from "react";
import { PageContainer, PageHeader, Card, TextField, FormStack, Button } from "@/components/ui";

// 저장 API는 아직 없음 (REQ_SET_02)
export default function CompanySettings() {
  return (
    <PageContainer>
      <PageHeader
      title="회사 기본 정보"
      description="시스템에 표시되는 회사 정보를 관리합니다."/>

      <div style={{maxWidth: 640}}>
        <Card title="기본 정보">
          <FormStack>
            <TextField
            id="company-name"
            label="회사명"
            type="text"
            defaultValue="Apple ERP Korea"
            placeholder="회사명을 입력하세요"/>
            <TextField
            id="business-number"
            label="사업자 등록번호"
            type="text"
            defaultValue="123-45-67890"
            hint="- 없이 숫자만 입력해도 됩니다."/>
            <TextField
            id="company-email"
            label="대표 이메일"
            type="email"
            defaultValue="admin@apple-erp.co.kr"/>
            <div>
              <Button>변경사항 저장</Button>
            </div>
          </FormStack>
        </Card>
      </div>
    </PageContainer>
  );
};
