"use client"

import { usePathHanlder } from '@/app/hooks';
import classNames from 'classnames';

import Sider from 'antd/es/layout/Sider';

import styles from './mainLayout.module.scss';

const SiderLayout = () => {
  const { isDesigner, isNodeSider } = usePathHanlder();

  return (
    <>
      {!isDesigner && <Sider width="200" className={classNames(isNodeSider ? styles.hiden : '')}>
          Sider
        </Sider>}
    </>
  );
};

export default SiderLayout;