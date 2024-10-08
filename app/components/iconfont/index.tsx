import classNames from 'classnames';
import { FC } from 'react';

import styles from './index.module.scss';

type Props = {
  xlinkHref: string;
  classes?: string[];
}

const Iconfont: FC<Props> = ({
  xlinkHref,
  classes,
}) => (
  <svg
    className={classNames('iconfont', styles['svg-outter'], ...(classes ?? []))}
    aria-hidden="true"
  >
    <use xlinkHref={xlinkHref}></use>
  </svg>
);

export default Iconfont;
