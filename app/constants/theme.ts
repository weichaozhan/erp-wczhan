import { ThemeConfig } from "antd";

const LIGHT_BLUE = '#167fff82'; 

export const THEME_TOKENS: {
  [props: string]: ThemeConfig['token'];
} = {
  default: {
    colorPrimary: LIGHT_BLUE,
  },
};