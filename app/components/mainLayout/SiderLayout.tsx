"use client"

import { usePathHanlder } from '@/app/hooks';
import classNames from 'classnames';
import { Menu } from 'antd'

import Sider from 'antd/es/layout/Sider';

import styles from './mainLayout.module.scss';
import { useStore } from '@/app/store';
import { MenuListNode } from '@/app/types';
import { FC, useEffect, useState } from 'react';
import { MenuItemType } from 'antd/es/menu/interface';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface MenuSiderProps {
  menuList: MenuListNode[];
}
const MenuSider: FC<MenuSiderProps> = ({ menuList = [] }) => {
  const pathName = usePathname();

  const [menus, setMenus] = useState<MenuItemType[]>([]);

  const buildItems: (list: MenuListNode[], parendId?: string) => MenuItemType[] = (list, parendId = '0') => list.map(sub => {
    const { children } = sub;
    const isHasChild = (children?.length ?? 0) > 0;
    const id = `${parendId}-${sub.id}`;

    const item: MenuItemType = {
      key: isHasChild ? id : (sub.path ?? id),
      label: isHasChild ? sub.nameToShow : <Link href={sub.path ?? ''}>{sub.nameToShow}</Link>,
    };

    if (isHasChild) {
      return {
        ...item,
        children: buildItems(children ?? [], id),
      };
    }
    return item;
  });

  console.log('pathName', pathName);
  useEffect(() => {
    if (menuList.length) {
      setMenus(buildItems(menuList));
    }
  }, [menuList]);

  return <Menu
    style={{ width: '100%' }}
    mode="vertical"
    theme="light"
    selectedKeys={[pathName]}
    items={menus}
  />;
};

const SiderLayout = () => {
  const { isDesigner, isNodeSider } = usePathHanlder();

  const menus = useStore(state => state.menus);

  return (
    <Sider width="200" className={classNames((isDesigner || isNodeSider) ? styles.hiden : '')}>
      <MenuSider menuList={menus} />
    </Sider>
  );
};

export default SiderLayout;