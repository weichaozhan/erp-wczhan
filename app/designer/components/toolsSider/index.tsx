"use client"
import Sider from 'antd/es/layout/Sider';
import classNames from 'classnames';

import styles from './toolsSider.module.scss';
import { useStore } from '@/app/store';
import { GOODS } from '@/app/global/constants/goods';

const ToolsSider = () => {
  const setGoods = useStore((state) => state.setGoods);

  return (
    <Sider width={200} className={classNames(styles.sider)} onClick={() => setGoods(GOODS.FRAMED_PAINT_3040)} >

    </Sider>
  );
};

export default ToolsSider;
