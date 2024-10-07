/**
 * @author weichaozhan
 */

"use client"
import React from 'react';
import { Layout } from 'antd';
import classNames from 'classnames';
import { usePathname } from 'next/navigation';

import Sider from 'antd/es/layout/Sider';

import mainLayoutStyle from './mainLayout.module.scss';

import { HOME_PATH_NAME } from '../../constants';

const { Header, Footer, Content } = Layout;

const MainLayout = ({
  children,
}: React.PropsWithChildren) => {

  const pathName = usePathname();
  const isHomePage = pathName === HOME_PATH_NAME;
  console.log('router', isHomePage);

  return (
    <Layout className={classNames(mainLayoutStyle.layoutWrapper)}>
      <Header className={classNames(mainLayoutStyle.header)}>
        <h1 className={classNames(mainLayoutStyle.title)}>
          简易 ERP
        </h1>
      </Header>
  
      <Layout hasSider={!isHomePage}>
        <Sider width="200" className={classNames(isHomePage ? mainLayoutStyle.hiden : '')}>
          Sider
        </Sider>
        <Content>
          {children}
        </Content>
      </Layout>
  
      <Footer className={classNames(mainLayoutStyle.footer)}>
        JAMES ZHAN 创作
      </Footer>
    </Layout>
  );
};

export default MainLayout;
