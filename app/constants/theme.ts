/**
 * @author weichaozhan
 */

import { ThemeConfig } from 'antd';

const LIGHT_BLUE = '#167fffff';
const WHITE = '#fffff';

export const THEMES: {
  default: ThemeConfig;
} = {
  default: {
    components: {
      Layout: {
        bodyBg: WHITE,
        headerBg: LIGHT_BLUE,
        footerBg: LIGHT_BLUE,
        colorText: WHITE,
      },
    }
  },
};