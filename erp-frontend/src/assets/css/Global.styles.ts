"use client";

import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;

    @font-face {
      font-family: 'Pretendard';
      src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/pretendard@1.0/Pretendard-Thin.woff2') format('woff2');
      font-weight: 100;
      font-display: swap;
    }

    @font-face {
      font-family: 'Pretendard';
      src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/pretendard@1.0/Pretendard-ExtraLight.woff2') format('woff2');
      font-weight: 200;
      font-display: swap;
    }

    @font-face {
      font-family: 'Pretendard';
      src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/pretendard@1.0/Pretendard-Light.woff2') format('woff2');
      font-weight: 300;
      font-display: swap;
    }

    @font-face {
      font-family: 'Pretendard';
      src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/pretendard@1.0/Pretendard-Regular.woff2') format('woff2');
      font-weight: 400;
      font-display: swap;
    }

    @font-face {
      font-family: 'Pretendard';
      src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/pretendard@1.0/Pretendard-Medium.woff2') format('woff2');
      font-weight: 500;
      font-display: swap;
    }

    @font-face {
      font-family: 'Pretendard';
      src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/pretendard@1.0/Pretendard-SemiBold.woff2') format('woff2');
      font-weight: 600;
      font-display: swap;
    }

    @font-face {
      font-family: 'Pretendard';
      src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/pretendard@1.0/Pretendard-Bold.woff2') format('woff2');
      font-weight: 700;
      font-display: swap;
    }

    @font-face {
      font-family: 'Pretendard';
      src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/pretendard@1.0/Pretendard-ExtraBold.woff2') format('woff2');
      font-weight: 800;
      font-display: swap;
    }

    @font-face {
      font-family: 'Pretendard';
      src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/pretendard@1.0/Pretendard-Black.woff2') format('woff2');
      font-weight: 900;
      font-display: swap;
    }
  }

  html, body {
    width: 100%;
    height: 100%;
    font-size: 16px;
  }

  body {
    background-color: ${({theme}) => theme.colors.background};
    color: ${({theme}) => theme.colors.text};
    font-family: 'Pretendard';
    font-weight: 400;
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  // Bootstrap·Tailwind 제거 후에도 기존 화면이 같도록 필요한 기본값만 유지
  *, *::before, *::after {
    border: 0 solid;
  }
  button, input, select, textarea {
    font: inherit;
    color: inherit;
  }
  button {
    background-color: transparent;
  }
  h1, h2, h3, h4, h5, h6 {
    line-height: 1.2;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  o, ul, li {
    list-style: none;
  }
`;