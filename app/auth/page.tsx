"use client"
import classNames from 'classnames';
import { useCallback, useEffect } from 'react';
import { once } from 'lodash';

import { getAuthListApi } from '../api/auth';

import styles from './styles/authPage.module.scss';
import globalStyles from '../global.module.scss';

function AuthPage() {
  const getAuthList = async () => {
    const data = await getAuthListApi();

    console.log('data', data);
  };

  const getAuthListMounted = useCallback(once(getAuthList), []);

  useEffect(() => {
    getAuthListMounted();
  }, []);

  return (
    <div className={classNames(globalStyles['content-wrapper'])}>
      auth
    </div>
  )
}

export default AuthPage;
