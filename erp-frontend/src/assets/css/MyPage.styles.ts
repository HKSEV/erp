import styled from "styled-components";

// 마이페이지
export const MyPageWrapper = styled.div`
  width: 100%;
  max-width: 860px;
  margin: 0 auto;
`;
export const MyPageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 24px;

  @media (max-width: 768px) {
    align-items: flex-start;
    flex-direction: column;
    gap: 6px;
  }
`;
export const MyPageTitle = styled.h1`
  margin-bottom: ${({theme}) => theme.space.sm};
  color: ${({theme}) => theme.colors.textStrong};
  font-size: 1.6rem;
  font-weight: 700;
  line-height: 1.3;
`;
export const MyPageSubtitle = styled.p`
  margin-bottom: ${({theme}) => theme.space.lg};
  color: ${({theme}) => theme.colors.textMuted};
  font-size: 0.9rem;
  line-height: 1.5;
`;
export const MyPageCard = styled.section`
  background-color: ${({theme}) => theme.colors.surface};
  border: 1px solid ${({theme}) => theme.colors.border};
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.05);
  overflow: hidden;
`;
export const MyPageCardHeader = styled.div`
  padding: 20px 24px;
  border-bottom: 1px solid ${({theme}) => theme.colors.border};
  background-color: ${({theme}) => theme.colors.bg};
`;
export const MyPageCardTitle = styled.h2`
  color: ${({theme}) => theme.colors.textStrong};
  font-size: 1.05rem;
  font-weight: 700;
  margin-bottom: 4px;
`;
export const MyPageCardDescription = styled.p`
  margin-bottom: ${({theme}) => theme.space.lg};
  color: ${({theme}) => theme.colors.textMuted};
  font-size: 0.85rem;
  line-height: 1.5;
`;
export const MyPageForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 24px;

  @media (max-width: 768px) {
    padding: 20px 16px;
  }
`;
export const MyPageFormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;
export const MyPageLabel = styled.label`
  color: ${({theme}) => theme.colors.textBody};
  font-size: 0.875rem;
  font-weight: 600;
`;
export const MyPageInput = styled.input`
  width: 100%;
  padding: 11px 14px;
  border: 1px solid ${({theme}) => theme.colors.borderStrong};
  border-radius: 6px;
  outline: none;
  background-color: ${({theme}) => theme.colors.surface};
  color: ${({theme}) => theme.colors.textStrong};
  font-family: inherit;
  font-size: 0.9rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;

  &::placeholder {
    color: ${({theme}) => theme.colors.textDisabled};
  }

  &:hover {
    border-color: ${({theme}) => theme.colors.textDisabled};
  }

  &:focus {
    border-color: ${({theme}) => theme.colors.accent};
    box-shadow: 0 0 0 3px ${({theme}) => theme.colors.accentSubtle};
  }
`;
export const MyPageHint = styled.p`
  margin-bottom: ${({theme}) => theme.space.lg};
  color: ${({theme}) => theme.colors.textDisabled};
  font-size: 0.78rem;
  line-height: 1.45;
`;
export const MyPageButton = styled.button`
  width: auto;
  background-color: ${({theme}) => theme.colors.accent};
  color: ${({theme}) => theme.colors.onAccent};
  align-self: flex-end;
  min-width: 150px;
  padding: 10px 18px;
  border: none;
  border-radius: 10rem;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.15s ease-in-out;

  &:hover {
    background-color: ${({theme}) => theme.colors.accentHover};
  }

  @media (max-width: 480px) {
    width: 100%;
    align-self: stretch;
  }
`;
