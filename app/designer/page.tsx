import { Layout } from 'antd';
import Tools from './components/tools';
import Sider from 'antd/es/layout/Sider';
import { Content } from 'antd/es/layout/layout';
import classNames from 'classnames';

import styles from './styles/index.module.scss';

import PreviewSider from './components/previewSider';

const Designer = () => {

  return (
    <>
      <Tools />
      <Layout className={classNames(styles['main-layout'])} hasSider>
        <Sider width={200} className={classNames(styles.sider)} />

        <Content className={classNames(styles.content)}>
          <div style={{ height: '100%', flexGrow: 1, }}>
            content
          </div>
          <PreviewSider />
        </Content>
      </Layout>
    </>
  )
};

export default Designer;
