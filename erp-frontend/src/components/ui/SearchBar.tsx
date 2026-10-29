"use client";

import { useState } from "react";
import styled from "styled-components";
import Button from "./Button";

interface SearchBarProps {
  placeholder?: string;
  label?: string;                       // 화면에는 보이지 않는 입력창 이름 (스크린리더용)
  defaultValue?: string;
  onSearch: (keyword: string) => void;  // 검색 버튼 또는 Enter
};

// 검색 입력창 + 검색 버튼
export default function SearchBar({placeholder = "검색어를 입력하세요", label = "검색", defaultValue = "", onSearch}: SearchBarProps) {
  const [keyword, setKeyword] = useState(defaultValue);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch(keyword.trim());
  };

  return (
    <Form role="search" onSubmit={handleSubmit}>
      <Input
      type="search"
      aria-label={label}
      placeholder={placeholder}
      value={keyword}
      onChange={(e) => setKeyword(e.target.value)}/>
      <Button type="submit" variant="secondary" size="sm">검색</Button>
    </Form>
  );
};

const Form = styled.form`
  display: flex;
  gap: ${({theme}) => theme.space.sm};
  width: 100%;
  max-width: 320px;
`;
const Input = styled.input`
  flex: 1;
  min-width: 0;
  padding: 6px 10px;
  font-size: ${({theme}) => theme.font.size.sm};
  color: ${({theme}) => theme.colors.textBody};
  background-color: ${({theme}) => theme.colors.surface};
  border: 1px solid ${({theme}) => theme.colors.borderStrong};
  border-radius: ${({theme}) => theme.radius.md};

  &::placeholder { color: ${({theme}) => theme.colors.textDisabled}; }
  &:focus {
    outline: none;
    border-color: ${({theme}) => theme.colors.accent};
    box-shadow: 0 0 0 3px ${({theme}) => theme.colors.accentSubtle};
  }
`;
