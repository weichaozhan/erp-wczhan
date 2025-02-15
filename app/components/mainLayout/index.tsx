/**
 * @author weichaozhan
 */

import { Layout } from 'antd';
import classNames from 'classnames';

import { Content } from 'antd/es/layout/layout';

import mainLayoutStyle from './mainLayout.module.scss';

import HeaderContent from '../headerContent';
import SiderLayout from './SiderLayout';
import FooterLayout from './FooterLayout';

const MainLayout = ({
  children,
}: React.PropsWithChildren) => {
  return (
    <Layout className={classNames(mainLayoutStyle.layoutWrapper)}>
      <HeaderContent />
  
      <Layout hasSider>
        <SiderLayout />

        <Content className={mainLayoutStyle.content}>
          {children}
        </Content>
      </Layout>

      <FooterLayout />
    </Layout>
  );
};

export default MainLayout;
