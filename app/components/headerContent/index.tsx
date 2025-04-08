"use client"

import classNames from 'classnames';
import Link from 'next/link';
import { Header } from 'antd/es/layout/layout';

import styles from './index.module.scss';
import mainLayoutStyle from '../mainLayout/mainLayout.module.scss';

import Tools from './tools';
import { useStore } from '@/app/store';
import { useEffect, useState } from 'react';

const HeaderContent = () => {
  const isLogin = useStore(state => state.isLogin);

  const [isHide, setIsHide] = useState(false);

  useEffect(() => {
    setIsHide(!isLogin);
  }, [isLogin]);

  return <Header className={classNames(isHide ? mainLayoutStyle.hiden : mainLayoutStyle.header)}>
    <div className={classNames(styles.wrapper)}>
      <Link href="/" className={classNames(styles['title-wrapper'])} >
        <h1 className={classNames(styles.title)}>
          简易 ERP
        </h1>
      </Link>

      <div id="potalTools" className={classNames(styles['potal-tools-wrapper'])} />

      <Tools />
    </div>
  </Header>;
};

export default HeaderContent;
