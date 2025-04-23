import classNames from 'classnames';
import { Button } from 'antd';

import Iconfont from '../iconfont';

import styles from './tools.module.scss';
import { AUTHORIZATION } from '@/app/global/constants';

const Tools = () => {
  return (
    <div className={classNames(styles['tools-wrapper'])}>
      <Iconfont classes={[styles['user-logo']]} xlinkHref="#icon-officer" />
      <Button
        size="small"
        type="text"
        onClick={() => {
          localStorage.removeItem(AUTHORIZATION);
          window.location.href = '/login';
        }}
      >
        退出
      </Button>
    </div>
  );
};

export default Tools;
