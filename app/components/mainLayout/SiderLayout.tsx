"use client"

import { usePathHanlder } from '@/app/hooks';
import classNames from 'classnames';
import { Menu } from 'antd'

import Sider from 'antd/es/layout/Sider';

import styles from './mainLayout.module.scss';
import { useStore } from '@/app/store';
import { MenuListNode } from '@/app/types';
import { FC, useEffect, useMemo, useRef, useState } from 'react';
import { MenuItemType } from 'antd/es/menu/interface';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface MenuSiderProps {
  menuList: MenuListNode[];
}
const MenuSider: FC<MenuSiderProps> = ({ menuList = [] }) => {
  const pathName = usePathname();

  const defaultOpenKeysRef = useRef<string[]>([]);
  const [menus, setMenus] = useState<MenuItemType[]>([]);

  const buildItems: (list: MenuListNode[], parendId?: string) => MenuItemType[] = (list, parendId = '0') => list.map(sub => {
    const { children } = sub;
    const isHasChild = (children?.length ?? 0) > 0;
    const id = `${parendId}-${sub.id}`;

    const item: MenuItemType = {
      key: isHasChild ? id : (sub.path ?? id),
      label: isHasChild ? sub.nameToShow : <Link href={sub.path ?? ''}>{sub.nameToShow}</Link>,
    };

    if (sub.path === pathName) {
      defaultOpenKeysRef.current = [parendId];
    }

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

  return !!menus.length && <Menu
    className="border-e-0"
    style={{ width: '100%' }}
    mode="inline"
    theme="light"
    selectedKeys={[pathName]}
    defaultOpenKeys={defaultOpenKeysRef.current}
    items={menus}
  />;
};

const SiderLayout = () => {
  const { isDesigner, isNodeSider } = usePathHanlder();

  const menus = useStore(state => state.menus);

  const menuList = useMemo<MenuListNode[]>(() => {
    const map = new Map<number, MenuListNode>();
    const list: MenuListNode[] = [];
    
    menus.forEach(menu => {
      const { id } = menu;
      if (id) {
        map.set(id, menu);
        menu.children = [];
      }
    });

    menus.forEach(menu => {
      const { id, parentID } = menu;
      if (parentID) {

        if (id) {
          const parent = map.get(parentID);
          if (parent) {
            parent?.children?.push?.(menu);
          } else {
            list.push(menu);    
          }
        }
      } else {
        list.push(menu);
      }
    });
    return list;
  }, [menus]);

  return (
    <Sider width="200" className={classNames('shadow overflow-scroll bg-white', (isDesigner || isNodeSider) ? styles.hiden : '')}>
      <MenuSider menuList={menuList} />
    </Sider>
  );
};

export default SiderLayout;