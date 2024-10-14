/**
 * @author weichaozhan
 */

"use client"
import { Layout } from 'antd';
import classNames from 'classnames';
import { usePathname } from 'next/navigation';

import Sider from 'antd/es/layout/Sider';

import mainLayoutStyle from './mainLayout.module.scss';

import { NO_SIDER_PATHS } from '../../constants';
import HeaderContent from '../headerContent';

const { Header, Footer, Content } = Layout;

const MainLayout = ({
  children,
}: React.PropsWithChildren) => {

  const pathName = usePathname();
  const isHomePage = NO_SIDER_PATHS.includes(pathName);
  console.log('router', isHomePage);

  return (
    <Layout className={classNames(mainLayoutStyle.layoutWrapper)}>
      <Header className={classNames(mainLayoutStyle.header)}>
        <HeaderContent />
      </Header>
  
      <Layout hasSider={!isHomePage}>
        <Sider width="200" className={classNames(isHomePage ? mainLayoutStyle.hiden : '')}>
          Sider
        </Sider>
        <Content className={mainLayoutStyle.content}>
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
