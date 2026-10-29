"use client";

import styled from "styled-components";

interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;     // label과 입력창을 연결 (라벨을 눌러도 입력창에 포커스)
  label: string;
  hint?: string;  // 입력칸 아래 안내 문구
};

// 라벨 + 입력창
export default function TextField({id, label, hint, ...rest}: TextFieldProps) {
  return (
    <Field>
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} aria-describedby={hint ? `${id}-hint` : undefined} {...rest}/>
      {hint && <Hint id={`${id}-hint`}>{hint}</Hint>}
    </Field>
  );
};

// 입력칸 여러 개를 세로로 쌓는 영역
export const FormStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({theme}) => theme.space.lg};
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
const Input = styled.input`
  padding: 8px 12px;
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
`;
const Hint = styled.p`
  margin: 0;
  font-size: ${({theme}) => theme.font.size.xs};
  color: ${({theme}) => theme.colors.textMuted};
`;
