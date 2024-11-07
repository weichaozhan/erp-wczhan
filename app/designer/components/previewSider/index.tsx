"use client"
import classNames from 'classnames';

import styles from '../../styles/previewSider.module.scss';

import Preview from './preview';

import { useStore } from '@/app/store';

const PreviewSider = () => {
  const goods = useStore(state => state.goods);

  console.log('goodsgoods', goods);

  return (
    <div className={classNames(styles.wrapper)}>
      <Preview />
    </div>
  );
};

export default PreviewSider;
