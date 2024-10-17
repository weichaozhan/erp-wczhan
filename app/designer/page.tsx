import { Layout } from 'antd';
import Tools from './components/tools';
import Sider from 'antd/es/layout/Sider';
import { Content } from 'antd/es/layout/layout';
import classNames from 'classnames';

import ThreeScene from './components/ThreeScene';

import styles from './styles/index.module.scss';

const Designer = () => {

  return (
    <>
      <Tools />
      <Layout className={classNames(styles['main-layout'])} hasSider>
        <Sider width={200} />

        <Content className={classNames(styles.content)}>
          <ThreeScene />
        </Content>
      </Layout>
    </>
  )
};

export default Designer;
