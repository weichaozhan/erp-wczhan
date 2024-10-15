import React from 'react';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ConfigProvider } from 'antd';

import MainLayout from './components/mainLayout/index';

import './globals.css';
import { THEMES } from './constants/theme';

const RootLayout = ({ children }: React.PropsWithChildren) => (
  <html>
    <head>
      <script src="/erpfont/iconfont.js" />
    </head>
    <body>
      <AntdRegistry>
        <ConfigProvider
          theme={THEMES.default}
        >
          <MainLayout>
            {children}
          </MainLayout>
        </ConfigProvider>
      </AntdRegistry>
    </body>
  </html>
);

export default RootLayout;

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sky Tech",
  description: "erp, 场景图设计",
};
