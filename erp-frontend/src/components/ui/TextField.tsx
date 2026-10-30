"use client";

import styled from "styled-components";

interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;     // label과 입력창을 연결 (라벨을 눌러도 입력창에 포커스)
  label: string;
  hint?: string;   // 입력칸 아래 안내 문구
  error?: string;  // 값이 잘못됐을 때 안내 문구 대신 빨간 글자로 표시
};

// 라벨 + 입력창
export default function TextField({id, label, hint, error, ...rest}: TextFieldProps) {
  const message = error || hint;
  return (
    <Field>
      <Label htmlFor={id}>{label}</Label>
      <Input
      id={id}
      aria-invalid={error ? true : undefined}
      aria-describedby={message ? `${id}-hint` : undefined}
      $invalid={Boolean(error)}
      {...rest}/>
      {message && <Hint id={`${id}-hint`} $error={Boolean(error)}>{message}</Hint>}
    </Field>
  );
};

// 입력칸 여러 개를 세로로 쌓는 영역
export const FormStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({theme}) => theme.space.lg};
`;

// 폼 하단 버튼 영역 (오른쪽 정렬)
export const FormActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({theme}) => theme.space.sm};
`;

// 입력칸 + 버튼을 한 줄에 (예: 주소 + 주소 검색)
export const FieldWithButton = styled.div`
  display: flex;
  align-items: flex-end;
  gap: ${({theme}) => theme.space.sm};

  > :first-child {
    flex: 1;
    min-width: 0;
  }
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({theme}) => theme.space.xs};
`;
const Label = styled.label`
  font-size: ${({theme}) => theme.font.size.sm};
  font-weight: ${({theme}) => theme.font.weight.medium};
  color: ${({theme}) => theme.colors.textSecondary};
`;
const Input = styled.input<{$invalid: boolean}>`
  padding: 8px 12px;
  font-size: ${({theme}) => theme.font.size.md};
  color: ${({theme}) => theme.colors.textBody};
  background-color: ${({theme}) => theme.colors.surface};
  border: 1px solid ${({theme, $invalid}) => ($invalid ? theme.colors.danger : theme.colors.borderStrong)};
  border-radius: ${({theme}) => theme.radius.md};

  &::placeholder { color: ${({theme}) => theme.colors.textDisabled}; }
  &:focus {
    outline: none;
    border-color: ${({theme, $invalid}) => ($invalid ? theme.colors.danger : theme.colors.accent)};
    box-shadow: 0 0 0 3px ${({theme, $invalid}) => ($invalid ? theme.status.danger.bg : theme.colors.accentSubtle)};
  }
  // 주소처럼 검색 버튼으로만 채우는 칸
  &:read-only {
    background-color: ${({theme}) => theme.colors.surfaceSubtle};
    cursor: default;
  }
`;
const Hint = styled.p<{$error: boolean}>`
  margin: 0;
  font-size: ${({theme}) => theme.font.size.xs};
  color: ${({theme, $error}) => ($error ? theme.status.danger.fg : theme.colors.textMuted)};
`;
