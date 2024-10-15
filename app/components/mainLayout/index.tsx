/**
 * @author weichaozhan
 */

"use client"
import { Layout } from 'antd';
import classNames from 'classnames';
import { usePathname } from 'next/navigation';

import Sider from 'antd/es/layout/Sider';

import mainLayoutStyle from './mainLayout.module.scss';

import { DESIGNER_PATH_NAME, NO_SIDER_PATHS } from '../../constants';
import HeaderContent from '../headerContent';

const { Header, Footer, Content } = Layout;

const usePathHanlder = () => {
  const pathName = usePathname();
  const isNodeSider = NO_SIDER_PATHS.includes(pathName);

  const isDesigner = DESIGNER_PATH_NAME === pathName;

  return {
    isNodeSider,
    isDesigner,
  };
};

const MainLayout = ({
  children,
}: React.PropsWithChildren) => {
  const { isDesigner, isNodeSider } = usePathHanlder();
  
  console.log('isNodeSider', isNodeSider, 'isDesigner', isDesigner);

  return (
    <Layout className={classNames(mainLayoutStyle.layoutWrapper)}>
      <Header className={classNames(mainLayoutStyle.header)}>
        <HeaderContent />
      </Header>
  
      <Layout hasSider={!isNodeSider}>
        {!isDesigner && <Sider width="200" className={classNames(isNodeSider ? mainLayoutStyle.hiden : '')}>
          Sider
        </Sider>}

        <Content className={mainLayoutStyle.content}>
          {children}
        </Content>
      </Layout>
  
      <Footer className={classNames(isDesigner ? mainLayoutStyle.hiden : mainLayoutStyle.footer)}>
        JAMES ZHAN 创作
      </Footer>
    </Layout>
  );
};

export default MainLayout;
