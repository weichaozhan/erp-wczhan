import classNames from 'classnames';

import Iconfont from '../iconfont';

import styles from './tools.module.scss';

const Tools = () => {
  return (
    <div className={classNames(styles['tools-wrapper'])}>
      <Iconfont classes={[styles['user-logo']]} xlinkHref="#icon-officer" />
    </div>
  );
};

export default Tools;
