"use client"

import classNames from 'classnames';
import { Footer } from 'antd/es/layout/layout';

import { usePathHanlder } from '@/app/hooks';

import styles from './mainLayout.module.scss';
import { useStore } from '@/app/store';
import { useEffect, useState } from 'react';

const FooterLayout = () => {
  const { isDesigner } = usePathHanlder();

  const isLogin = useStore(state => state.isLogin);

  const [isHide, setIsHide] = useState(false);

  useEffect(() => {
    setIsHide(isDesigner || !isLogin);
  }, [isDesigner, isLogin]);

  return (
    <Footer
      className={classNames(
        isHide ? styles.hiden : styles.footer,
      )}
    >
      JAMES ZHAN 创作
    </Footer>
  );
};

export default FooterLayout;