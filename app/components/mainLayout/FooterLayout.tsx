"use client"

import classNames from 'classnames';
import { Footer } from 'antd/es/layout/layout';

import { usePathHanlder } from '@/app/hooks';

import styles from './mainLayout.module.scss';
import { useStore } from '@/app/store';

const FooterLayout = () => {
  const { isDesigner, isNodeSider } = usePathHanlder();

  const isLogin = useStore(state => state.isLogin);

  return (
    isLogin ? (
      <Footer className={classNames(isDesigner ? styles.hiden : styles.footer)}>
        JAMES ZHAN 创作
      </Footer>
    ) : <></>
  );
};

export default FooterLayout;