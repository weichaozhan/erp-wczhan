"use client"

import classNames from 'classnames';
import Link from 'next/link';
import { Header } from 'antd/es/layout/layout';

import styles from './index.module.scss';
import mainLayoutStyle from '../mainLayout/mainLayout.module.scss';

import Tools from './toos';
import { useStore } from '@/app/store';

const HeaderContent = () => {
  const isLogin = useStore(state => state.isLogin);

  return isLogin ? (
    <Header className={classNames(mainLayoutStyle.header)}>
      <div className={classNames(styles.wrapper)}>
        <Link href="/" className={classNames(styles['title-wrapper'])} >
          <h1 className={classNames(styles.title)}>
            简易 ERP
          </h1>
        </Link>

        <div id="potalTools" className={classNames(styles['potal-tools-wrapper'])} />

        <Tools />
      </div>
    </Header>
  ) : <></>;
};

export default HeaderContent;
