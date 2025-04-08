"use client"
import { FC, useCallback, useEffect, useState } from 'react';
import { once } from 'lodash';
import { Button, Tag, Tooltip, Tree } from 'antd';

import { getAuthListApi } from '../../api/auth';
import { ModuleListNode } from '../../types/auth';

import styles from './styles/authTree.module.scss';
import { MODULE_TYPE_MAP } from '../../global/constants';
import Iconfont from '../iconfont';

interface AuthTreeProps {
  onAddModule?: (module: ModuleListNode) => void;
  onDelModule?: (module: ModuleListNode) => void;
  onAddMenu?: (module: ModuleListNode) => void;
  onDelMenu?: (module: ModuleListNode) => void;
  onAddPermission?: (module: ModuleListNode) => void;
  onDelPermission?: (module: ModuleListNode) => void;
}

const AuthTree: FC<AuthTreeProps> = ({
  onAddMenu,
  onAddModule,
  onAddPermission,
  onDelMenu,
  onDelModule,
  onDelPermission,
}) => {
  const [treeData, setTreeData] = useState<ModuleListNode[]>([]);

  const getAuthList = async () => {
    const data = await getAuthListApi();

    const map = new Map<number, ModuleListNode>();
    const tree: ModuleListNode[] = [];

    data?.forEach((auth) => {
      const { id, isMenu } = auth;
      if (id) {
        const authTemp = auth as ModuleListNode;
        map.set(id, authTemp);

        const styleModule = isMenu ? styles['menu-icon'] : styles['module-icon'];

        const addClick = isMenu ? onAddMenu : onAddModule;
        const delClick = isMenu ? onDelMenu : onDelModule;

        authTemp.children = [];
        authTemp.key=`module-${id}`;
        authTemp.nodetype = isMenu ? 'menu' : 'module';
        authTemp.title = <div>
          <Tag color={MODULE_TYPE_MAP[authTemp.nodetype].color}>
            {MODULE_TYPE_MAP[authTemp.nodetype].name}
          </Tag>
          {authTemp.nameToShow}

          <Tooltip title={`添加${MODULE_TYPE_MAP[authTemp.nodetype].name}`}>
            <Button
              onClick={() => addClick?.(authTemp)}
              className={styles['option-btn']}
              type="text"
              shape="circle"
              size="small"
            >
              <Iconfont classes={[styleModule]} xlinkHref="#icon-jia" />
            </Button>
          </Tooltip>

          <Tooltip title={`删除${MODULE_TYPE_MAP[authTemp.nodetype].name}`}>
            <Button
              onClick={() => delClick?.(authTemp)}
              className={styles['option-btn']}
              type="text"
              shape="circle"
              size="small"
            >
              <Iconfont classes={[styleModule]} xlinkHref="#icon-jian2" />
            </Button>
          </Tooltip>

          <Tooltip title={`添加${MODULE_TYPE_MAP.permission.name}`}>
            <Button
              className={styles['option-btn']}
              onClick={() => onAddPermission?.(authTemp)}
              type="text"
              shape="circle"
              size="small"
            >
              <Iconfont classes={[styles['permission-icon']]} xlinkHref="#icon-jia" />
            </Button>
          </Tooltip>
        </div>;

        authTemp.permissions?.forEach(permission => {
          authTemp.children?.push({
            ...permission,
            key: `${permission.id}`,
            nodetype: 'permission',
            title: <div>
            <Tag color={MODULE_TYPE_MAP.permission.color}>
              {MODULE_TYPE_MAP.permission.name}
            </Tag>
            
            {permission.nameDesc}

            <Tooltip title={'添加权限'}>
              <Button className={styles['option-btn']} type="text" shape="circle" size="small">
                <Iconfont classes={[styles['permission-icon']]} xlinkHref="#icon-jia" />
              </Button>
            </Tooltip>

            <Tooltip title={'添加权限'}>
              <Button className={styles['option-btn']} type="text" shape="circle" size="small">
                <Iconfont classes={[styles['permission-icon']]} xlinkHref="#icon-jia" />
              </Button>
            </Tooltip>
          </div>,
          });
        });
      }
    });
    data?.forEach(auth => {
      const { parentID } = auth;
      if (!parentID) {
        tree.push(auth);
      } else {
        map.get(parentID)?.children?.push(auth);
      }
    });
    setTreeData(tree);
  };

  const getAuthListMounted = useCallback(once(getAuthList), []);

  useEffect(() => {
    getAuthListMounted();
  }, []);

  return (
    <Tree
      treeData={treeData}
      checkable={false}
    />
  )
}

export default AuthTree;
