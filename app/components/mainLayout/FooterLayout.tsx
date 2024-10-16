"use client"

import classNames from 'classnames';
import { Footer } from 'antd/es/layout/layout';

import { usePathHanlder } from '@/app/hooks';

import styles from './mainLayout.module.scss';

const FooterLayout = () => {
  const { isDesigner, isNodeSider } = usePathHanlder();

  return (
    <Footer className={classNames(isDesigner ? styles.hiden : styles.footer)}>
      JAMES ZHAN 创作
    </Footer>
  );
};

export default FooterLayout;