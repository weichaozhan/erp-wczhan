import React from 'react';
import { Layout } from 'antd';

import { Header, Footer, Content } from 'antd/lib/layout/layout';
import Sider from 'antd/es/layout/Sider';

const MainLayout = ({
  children,
}: React.PropsWithChildren) => (
  <Layout>
    <Header>
      This is Header
    </Header>

    <Layout>
      <Sider width="25%">
        Sider
      </Sider>
      <Content>
        {children}
      </Content>
    </Layout>

    <Footer>
      This is Footer
    </Footer>
  </Layout>
);

export default MainLayout;
