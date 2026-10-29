"use client";

// 강조색 후보: ACCENT 값만 바꾸면 버튼·현재 메뉴·링크 색이 함께 바뀜
const ACCENT_PALETTES = {
  blue:   { main: "#2563EB", hover: "#1D4ED8", subtle: "#EFF6FF", border: "#BFDBFE", text: "#1E40AF" }, // A. 현재 정리
  petrol: { main: "#0E5A6B", hover: "#0A4755", subtle: "#E6F2F4", border: "#B3D4DA", text: "#0A4755" }, // B. 쿨 페트롤
  indigo: { main: "#4338CA", hover: "#3730A3", subtle: "#EEF2FF", border: "#C7D2FE", text: "#3730A3" }, // C. 미드나잇 인디고
};
const ACCENT = ACCENT_PALETTES.blue;

export const theme = {
  colors: {
    // 기존 키: Global.styles.ts에서 사용 중이라 값 유지
    background: "#536692",
    primary: ACCENT.main,
    text: "#333",

    // 바탕
    bg: "#F8FAFC",            // 본문 영역 바탕
    surface: "#FFFFFF",       // 카드, 표, 사이드바, 모달
    surfaceSubtle: "#F1F5F9", // 표 머리글, hover

    // 글자
    textStrong: "#0F172A",    // 제목, 숫자
    textBody: "#334155",      // 본문
    textSecondary: "#475569", // 메뉴, 보조 글자
    textMuted: "#64748B",     // 라벨, 설명
    textDisabled: "#94A3B8",  // 비활성, 그룹 제목

    // 선
    border: "#E2E8F0",
    borderStrong: "#CBD5E1",  // 입력창 테두리

    // 강조색
    accent: ACCENT.main,
    accentHover: ACCENT.hover,
    accentSubtle: ACCENT.subtle, // 현재 메뉴 배경, 선택된 행
    accentBorder: ACCENT.border, // 연한 강조 테두리 (달력 날짜 hover)
    accentText: ACCENT.text,     // 연한 배경 위의 강조 글자
    onAccent: "#FFFFFF",

    // 버튼용 단색
    danger: "#EF4444",
    dangerHover: "#DC2626",
    neutral: "#858796",
    neutralHover: "#717384",

    // 어두운 영역 (헤더, 알림창)
    dark: "#1E293B",
    darkSubtle: "#334155",    // 어두운 영역의 hover
    darkBorder: "#475569",
    onDark: "#FFFFFF",
    onDarkSoft: "#E2E8F0",
    onDarkMuted: "#CBD5E1",

    // 화면을 덮는 반투명 배경 (모바일 서랍 등)
    overlay: "rgba(0, 0, 0, 0.4)",
    backdrop: "rgba(15, 23, 42, 0.32)", // 모달 뒤 배경 (blur와 함께 사용)
  },

  // 상태 색: 정상·대기·품절 등 모든 화면에서 동일하게 사용
  // dot: 흰 바탕에 점만 단독으로 표시할 때 쓰는 밝은 색 (일정 상태 선택 등)
  status: {
    success: { fg: "#166534", bg: "#DCFCE7", dot: "#22C55E" }, // 정상, 완료, 재직
    warning: { fg: "#92400E", bg: "#FEF3C7", dot: "#F59E0B" }, // 부족, 대기, 휴직
    danger:  { fg: "#991B1B", bg: "#FEE2E2", dot: "#EF4444" }, // 품절, 퇴사, 삭제
    info:    { fg: "#1E40AF", bg: "#DBEAFE", dot: "#3B82F6" }, // 진행 중
    neutral: { fg: "#475569", bg: "#F1F5F9", dot: "#94A3B8" }, // 취소, 알 수 없음
  },

  space:  { xs: "4px", sm: "8px", md: "12px", lg: "16px", xl: "24px", xxl: "32px" },
  radius: { sm: "4px", md: "6px", lg: "8px", xl: "12px", pill: "999px" },
  font: {
    size: { xs: "12px", sm: "13px", md: "14px", lg: "16px", xl: "20px", xxl: "24px", xxxl: "28px" },
    weight: { regular: 400, medium: 500, bold: 700 },
  },
  shadow: {
    card: "0 1px 2px rgba(15, 23, 42, 0.06)",
    header: "0 2px 4px rgba(0, 0, 0, 0.1)",
    drawer: "4px 0 12px rgba(0, 0, 0, 0.15)",
    popover: "0 4px 16px rgba(15, 23, 42, 0.12)",
    modal: "0 24px 64px rgba(15, 23, 42, 0.16), 0 8px 24px rgba(15, 23, 42, 0.06)",
    authCard: "0 24px 64px rgba(59, 130, 246, 0.09), 0 4px 16px rgba(15, 23, 42, 0.025)", // 로그인·회원가입 카드
    accent: "0 4px 12px rgba(37, 99, 235, 0.16)", // 강조 버튼 hover
  },
  // 쌓임 순서: 흩어져 있던 값(100, 140, 150)을 정리
  zIndex: { header: 100, backdrop: 140, drawer: 150, dropdown: 200, modal: 1000, toast: 1100 },
  breakpoint: { mobile: "768px" },
};

export type AppTheme = typeof theme;
