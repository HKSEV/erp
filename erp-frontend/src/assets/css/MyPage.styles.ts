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
  color: #0F172A;
  font-size: 1.6rem;
  font-weight: 700;
  line-height: 1.3;
`;
export const MyPageSubtitle = styled.p`
  color: #64748B;
  font-size: 0.9rem;
  line-height: 1.5;
`;
export const MyPageCard = styled.section`
  background-color: #FFF;
  border: 1px solid #E2E8F0;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.05);
  overflow: hidden;
`;
export const MyPageCardHeader = styled.div`
  padding: 20px 24px;
  border-bottom: 1px solid #E2E8F0;
  background-color: #F8FAFC;
`;
export const MyPageCardTitle = styled.h2`
  color: #1E293B;
  font-size: 1.05rem;
  font-weight: 700;
  margin-bottom: 4px;
`;
export const MyPageCardDescription = styled.p`
  color: #64748B;
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
  color: #334155;
  font-size: 0.875rem;
  font-weight: 600;
`;
export const MyPageInput = styled.input`
  width: 100%;
  padding: 11px 14px;
  border: 1px solid #CBD5E1;
  border-radius: 6px;
  outline: none;
  background-color: #FFF;
  color: #1E293B;
  font-family: inherit;
  font-size: 0.9rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;

  &::placeholder {
    color: #94A3B8;
  }

  &:hover {
    border-color: #94A3B8;
  }

  &:focus {
    border-color: #4E73DF;
    box-shadow: 0 0 0 0.2rem rgba(78, 115, 223, 0.15);
  }
`;
export const MyPageHint = styled.p`
  color: #94A3B8;
  font-size: 0.78rem;
  line-height: 1.45;
`;
export const MyPageButton = styled.button`
  width: auto;
  padding: 0.8rem;
  background-color: #4E73DF;
  color: white;
  align-self: flex-end;
  min-width: 150px;
  padding: 10px 18px;
  border: none;
  border-radius: 10rem;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.15s ease-in-out;

  &:hover {
    background-color: #2E59D9;
  }

  @media (max-width: 480px) {
    width: 100%;
    align-self: stretch;
  }
`;
