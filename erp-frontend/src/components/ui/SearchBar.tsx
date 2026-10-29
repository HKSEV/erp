"use client";

import { useRef, useState } from "react";
import styled from "styled-components";
import { FiSearch, FiX } from "react-icons/fi";

interface SearchBarProps {
  placeholder?: string;
  label?: string;                       // 화면에는 보이지 않는 입력창 이름 (스크린리더용)
  defaultValue?: string;
  onSearch: (keyword: string) => void;  // 입력할 때마다 호출 (화면 목록 필터용)
};

// 검색 입력창: 입력 즉시 검색, 검색어가 있으면 지우기(X) 버튼 표시, Esc로도 지움
// 백엔드 검색 API를 붙일 때는 onSearch 쪽에서 debounce(입력이 멈춘 뒤 요청)를 적용
export default function SearchBar({placeholder = "검색어를 입력하세요", label = "검색", defaultValue = "", onSearch}: SearchBarProps) {
  const [keyword, setKeyword] = useState(defaultValue);
  const inputRef = useRef<HTMLInputElement>(null);

  const change = (value: string) => {
    setKeyword(value);
    onSearch(value.trim());
  };
  const clear = () => {
    change("");
    inputRef.current?.focus();
  };

  return (
    <Form role="search" onSubmit={(e) => e.preventDefault()}>
      <SearchIcon aria-hidden="true"/>
      <Input
      ref={inputRef}
      type="search"
      aria-label={label}
      placeholder={placeholder}
      value={keyword}
      onChange={(e) => change(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Escape" && keyword) {
          e.preventDefault();
          clear();
        }
      }}/>
      {keyword && (
        <ClearButton type="button" aria-label="검색어 지우기" onClick={clear}>
          <FiX aria-hidden="true"/>
        </ClearButton>
      )}
    </Form>
  );
};

// 너비: 카드 머리글의 40% (최소 200px: 가장 긴 안내 문구가 잘리지 않는 너비, 최대 240px: 코드·이름 검색에 충분한 길이)
// 머리글이 400px보다 좁으면 제목 아래 줄로 내려가 한 줄을 다 씀
const Form = styled.form`
  position: relative;
  display: flex;
  align-items: center;
  width: clamp(200px, 40cqi, 240px);

  @container (max-width: 400px) {
    width: 100%;
  }
`;
const SearchIcon = styled(FiSearch)`
  position: absolute;
  left: 10px;
  width: 16px;
  height: 16px;
  color: ${({theme}) => theme.colors.textMuted};
  pointer-events: none;
`;
const Input = styled.input`
  width: 100%;
  min-width: 0;
  // 왼쪽 돋보기, 오른쪽 X 버튼 자리
  padding: 6px 32px;
  font-size: ${({theme}) => theme.font.size.md};
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
  // 브라우저 기본 X 버튼은 숨기고 직접 만든 X만 사용 (브라우저마다 모양 통일)
  &::-webkit-search-cancel-button { appearance: none; }
`;
const ClearButton = styled.button`
  position: absolute;
  right: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  padding: 0;
  color: ${({theme}) => theme.colors.textMuted};
  border-radius: ${({theme}) => theme.radius.sm};
  cursor: pointer;

  svg { width: 14px; height: 14px; }
  &:hover {
    color: ${({theme}) => theme.colors.textStrong};
    background-color: ${({theme}) => theme.colors.surfaceSubtle};
  }
  &:focus-visible {
    outline: 2px solid ${({theme}) => theme.colors.accent};
    outline-offset: 1px;
  }
`;
