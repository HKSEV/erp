import "styled-components";
import type { AppTheme } from "./assets/css/Theme";

// styled-components의 theme 타입을 Theme.ts와 연결 (theme.colors. 자동완성)
declare module "styled-components" {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface DefaultTheme extends AppTheme {}
}
