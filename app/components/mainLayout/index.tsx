"use client"
import React from 'react';
import { Layout, Button } from 'antd';
import classNames from 'classnames';
import { usePathname } from 'next/navigation';

import { Header, Footer, Content } from 'antd/lib/layout/layout';
import Sider from 'antd/es/layout/Sider';

import mainLayoutStyle from './mainLayout.module.scss';

import { HOME_PATH_NAME } from '../../constants';

const MainLayout = ({
  children,
}: React.PropsWithChildren) => {

  const pathName = usePathname();
  const isHomePage = pathName === HOME_PATH_NAME;
  console.log('router', isHomePage);

  return (
    <Layout>
      <Header className={classNames(mainLayoutStyle.header)}>
        <h1 className={classNames(mainLayoutStyle.title)}>
          This is Header
        </h1>
        <Button>test</Button>
      </Header>
  
      <Layout>
        <Content>
          <Sider width="200" className={classNames(isHomePage ? mainLayoutStyle.hiden : '')}>
            Sider
          </Sider>
          {children}
        </Content>
      </Layout>
  
      <Footer>
        This is Footer
      </Footer>
    </Layout>
  );
};

export default MainLayout;
