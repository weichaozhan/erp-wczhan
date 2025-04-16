"use client"
import React, { FC, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { once } from 'lodash';
import { Button, Spin, Tag, Tooltip, Tree } from 'antd';

import { AUTH_MODULE_ID, MODULE_TYPE_MAP, ROOT_MODULE_ID } from '../../global/constants';
import { getAuthListApi } from '../../api/auth';
import { ModuleListNode } from '../../types/auth';
import { AuthTreeRef } from './types';

import Iconfont from '../iconfont';

import styles from './styles/authTree.module.scss';
import { TreeProps } from 'antd/lib';
import { User } from '@/app/types/entity';
import { isBrowserEnv } from '@/app/global/tools';
import { getLoginUserApi } from '@/app/api/user';
import { flushSync } from 'react-dom';

interface AuthTreeProps extends TreeProps<ModuleListNode> {
  authTreeRef?: React.Ref<AuthTreeRef>;
  checkable?: boolean;
  actionable?: boolean;
  defaultExpandAll?: boolean;
  children?: React.ReactNode;
  onAddModule?: (module: ModuleListNode) => void;
  onDelModule?: (module: ModuleListNode) => void;
  onAddPermission?: (module: ModuleListNode) => void;
  onDelPermission?: (module: ModuleListNode) => void;
  onEditModule?: (module: ModuleListNode) => void;
}

const AuthTree: FC<AuthTreeProps> = ({
  authTreeRef,
  checkable = false,
  defaultExpandAll = true,
  children,
  actionable = false,
  onAddModule,
  onAddPermission,
  onDelModule,
  onDelPermission,
  onEditModule,
  ...rest
}) => {
  // current logined user
  const userDataRef = useRef<User>();

  const [loading, setLoading] = useState(false);

  const [treeData, setTreeData] = useState<ModuleListNode[] | undefined>(undefined);

  const isHasActionAuth = useCallback((auth: ModuleListNode, isModule = false) => {
    const isRootModule = isModule && auth.id === ROOT_MODULE_ID;
    const isUserCreate = userDataRef.current && userDataRef.current.id === auth.creatorId;
    
    return !isRootModule && isUserCreate;
  }, [userDataRef.current]);

  const getUserData = useCallback(async () => {
    try {
      const userData = await getLoginUserApi();
      userDataRef.current = userData;
    } catch(err) {
      console.error(err);
    }
  }, []);

  const getAuthList = async () => {
    setLoading(true);

    await getUserData();

    try {
      const data = await getAuthListApi();
  
      const map = new Map<number, ModuleListNode>();
      const tree: ModuleListNode[] = [];
  
      data?.forEach((auth) => {
        const { id, isMenu } = auth;
        if (id) {
          const authTemp = auth as ModuleListNode;
          map.set(id, authTemp);
  
          authTemp.children = [];
          authTemp.key=`module-${id}`;
          authTemp.nodetype = isMenu ? 'menu' : 'module';
          authTemp.title = <div>
            <Tag color={MODULE_TYPE_MAP.module.color}>
              {MODULE_TYPE_MAP.module.name}
            </Tag>

            {isMenu && <Tag color={MODULE_TYPE_MAP.menu.color}>
              {MODULE_TYPE_MAP.menu.name}
            </Tag>}

            {authTemp.nameToShow}
            {actionable && <>
              {isHasActionAuth(authTemp, true) ? (
                <>
                  <Tooltip title={`修改${MODULE_TYPE_MAP[authTemp.nodetype].name}`}>
                    <Button
                      onClick={() => onEditModule?.(authTemp)}
                      className={styles['option-btn']}
                      type="text"
                      shape="circle"
                      size="small"
                    >
                      <Iconfont classes={[styles['module-icon']]} xlinkHref="#icon-edit" />
                    </Button>
                  </Tooltip>

                  <Tooltip title={`添加${MODULE_TYPE_MAP[authTemp.nodetype].name}`}>
                    <Button
                      onClick={() => onAddModule?.(authTemp)}
                      className={styles['option-btn']}
                      type="text"
                      shape="circle"
                      size="small"
                    >
                      <Iconfont classes={[styles['module-icon']]} xlinkHref="#icon-jia" />
                    </Button>
                  </Tooltip>
    
                  {id !== AUTH_MODULE_ID && <Tooltip title={`删除${MODULE_TYPE_MAP[authTemp.nodetype].name}`}>
                    <Button
                      onClick={() => onDelModule?.(authTemp)}
                      className={styles['option-btn']}
                      type="text"
                      shape="circle"
                      size="small"
                    >
                      <Iconfont classes={[styles['danger-icon']]} xlinkHref="#icon-jian2" />
                    </Button>
                  </Tooltip>}
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
            </>}
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
  
              {actionable && isHasActionAuth(permission) && <Tooltip title={'删除权限'}>
                <Button
                  className={styles['option-btn']}
                  onClick={() => onDelPermission?.(permission)}
                  type="text"
                  shape="circle"
                  size="small"
                >
                  <Iconfont classes={[styles['permission-icon']]} xlinkHref="#icon-jian2" />
                </Button>
              </Tooltip>}
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
          const parent = map.get(parentID);
          if (parent) {
            parent?.children?.push(auth);
          } else {
            tree.push(auth);
          }
        }
      });
      setTreeData(tree);
    } catch(err) {
      console.error(err);
    }

    setLoading(false);
  };
  const getAuthListMounted = useCallback(getAuthList, [userDataRef.current]);

  const init = useCallback(once(async () => {
    if (isBrowserEnv()) {
      await getAuthListMounted();
    }
  }), [getAuthListMounted, getUserData, userDataRef.current]);

  useImperativeHandle(authTreeRef, () => ({
    refresh: getAuthList,
  }), []);

  useEffect(() => {
    init();
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
        {...rest}
      />}
    </div>
  )
}

export default AuthTree;
