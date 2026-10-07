"use client";

import { ThemeProvider } from "styled-components";
import { theme } from "@/assets/css/Theme";
import { GlobalStyle } from "@/assets/css/Global.style";

export default function ThemeProviderWrapper({children}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle/>
      {children}
    </ThemeProvider>
  );
};
