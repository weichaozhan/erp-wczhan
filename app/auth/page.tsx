"use client"
import classNames from 'classnames';

import globalStyles from '../global.module.scss';
import styles from './styles/authPage.module.scss';

import AuthTree from '../components/AuthTree';
import { Button, Divider } from 'antd';
import { useRef } from 'react';
import { AuthTreeRef } from '../components/AuthTree/types';

function AuthPage() {
  const authTreeRef = useRef<AuthTreeRef | null>(null);

  return (
    <div
      className={classNames(globalStyles['content-wrapper'], styles['auth-content-wrapper'])}
    >
      <AuthTree
        authTreeRef={ref => { authTreeRef.current = ref }}
      >
        <Button size="small" >
          添加模块
        </Button>

        <Divider />
      </AuthTree>
    </div>
  )
}

export default AuthPage;
