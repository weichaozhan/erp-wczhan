"use client"
import React, { FC, useCallback, useEffect, useImperativeHandle, useState } from 'react';
import { once } from 'lodash';
import { Button, Spin, Tag, Tooltip, Tree } from 'antd';

import { getAuthListApi } from '../../api/auth';
import { ModuleListNode } from '../../types/auth';

import styles from './styles/authTree.module.scss';
import { MODULE_TYPE_MAP } from '../../global/constants';
import Iconfont from '../iconfont';
import { AuthTreeRef } from './types';

interface AuthTreeProps {
  authTreeRef?: React.Ref<AuthTreeRef>;
  checkable?: boolean;
  defaultExpandAll?: boolean;
  children?: React.ReactNode;
  onAddModule?: (module: ModuleListNode) => void;
  onDelModule?: (module: ModuleListNode) => void;
  onAddMenu?: (module: ModuleListNode) => void;
  onDelMenu?: (module: ModuleListNode) => void;
  onAddPermission?: (module: ModuleListNode) => void;
  onDelPermission?: (module: ModuleListNode) => void;
}

const AuthTree: FC<AuthTreeProps> = ({
  authTreeRef,
  checkable = false,
  defaultExpandAll = true,
  children,
  onAddMenu,
  onAddModule,
  onAddPermission,
  onDelMenu,
  onDelModule,
  onDelPermission,
}) => {
  const [loading, setLoading] = useState(false);

  const [treeData, setTreeData] = useState<ModuleListNode[] | undefined>(undefined);

  const getAuthList = async () => {
    setLoading(true);

    const data = await getAuthListApi();

    const map = new Map<number, ModuleListNode>();
    const tree: ModuleListNode[] = [];

    data?.forEach((auth) => {
      const { id, isMenu } = auth;
      if (id) {
        const authTemp = auth as ModuleListNode;
        map.set(id, authTemp);

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

          {id !== 1 ? (
            <>
              <Tooltip title={`添加${MODULE_TYPE_MAP[authTemp.nodetype].name}`}>
                <Button
                  onClick={() => addClick?.(authTemp)}
                  className={styles['option-btn']}
                  type="text"
                  shape="circle"
                  size="small"
                >
                  <Iconfont classes={[styles['module-icon']]} xlinkHref="#icon-jia" />
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
                  <Iconfont classes={[styles['module-icon']]} xlinkHref="#icon-jian2" />
                </Button>
              </Tooltip>
            </>
          ): <></>}

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
              <Button
                className={styles['option-btn']}
                onClick={() => onAddPermission?.(permission)}
                type="text"
                shape="circle"
                size="small"
              >
                <Iconfont classes={[styles['permission-icon']]} xlinkHref="#icon-jia" />
              </Button>
            </Tooltip>

            <Tooltip title={'删除权限'}>
              <Button
                className={styles['option-btn']}
                onClick={() => onDelPermission?.(permission)}
                type="text"
                shape="circle"
                size="small"
              >
                <Iconfont classes={[styles['permission-icon']]} xlinkHref="#icon-jian2" />
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

    setLoading(false);
  };

  const getAuthListMounted = useCallback(once(getAuthList), []);

  useImperativeHandle(authTreeRef, () => ({
    refresh: getAuthList,
  }), []);

  useEffect(() => {
    getAuthListMounted();
  }, []);

  return (
    <div className={styles['auth-tree-wrapper']}>
      <div className={styles['auth-tree-spin-wrapper']}>
        <Spin spinning={loading} />
      </div>

      {children}

      {treeData !== undefined && <Tree
        treeData={treeData}
        checkable={checkable}
        defaultExpandAll={defaultExpandAll}
      />}
    </div>
  )
}

export default AuthTree;
