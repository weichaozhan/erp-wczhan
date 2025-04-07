import { Layout } from 'antd';
import Tools from './components/tools';
import { Content } from 'antd/es/layout/layout';
import classNames from 'classnames';

import styles from './styles/index.module.scss';
import globalStyles from '../global.module.scss';

import PreviewSider from './components/previewSider';
import ToolsSider from './components/toolsSider';

const Designer = () => {

  return (
    <>
      <Tools />
      <Layout className={classNames(styles['main-layout'])} hasSider>
        <ToolsSider />

        <Content className={classNames(styles.content)}>
          <div className={globalStyles['content-wrapper']} style={{ height: '100%', flexGrow: 1, }}>
            content
          </div>
          <PreviewSider />
        </Content>
      </Layout>
    </>
  )
};

export default Designer;
