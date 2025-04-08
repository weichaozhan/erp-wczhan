"use client"
import classNames from 'classnames';
import { DeleteFilled } from '@ant-design/icons';

import globalStyles from '../global.module.scss';
import styles from './styles/authPage.module.scss';

import AuthTree from '../components/AuthTree';
import { App, Button, Divider } from 'antd';
import { useRef, useState } from 'react';
import { AuthTreeRef } from '../components/AuthTree/types';
import PermissionForm from './forms/PermissionForm';
import { ModuleListNode } from '../types/auth';
import { Permission } from '../types/entity';
import { isNil } from 'lodash';
import { delPermissionApi } from '../api/auth';

function AuthPage() {
  const { modal, message } = App.useApp();

  const authTreeRef = useRef<AuthTreeRef | null>(null);

  const [permVisible, setPermVisible] = useState(false);
  const [permParentId, setPermParentId] = useState<number>();

  const openPermissionForm = (module: ModuleListNode) => {
    console.log('module', module);
    setPermParentId(module.id);
    setPermVisible(true);
  };
  const delPermission = (permission: Permission) => {
    modal.confirm({
      title: '删除权限',
      icon: <DeleteFilled />,
      content: `确认删除权限【${permission.nameDesc}】？`,
      okType: 'danger',
      onOk: async () => {
        const { id } = permission;
        if (!isNil(id)) {
          await delPermissionApi(id);
          authTreeRef.current?.refresh?.();
          message.success('删除权限【${permission.nameDesc}】成功！');
        }
      },
    });
  }

  return (
    <>
      <div
        className={classNames(globalStyles['content-wrapper'], styles['auth-content-wrapper'])}
      >
        <AuthTree
          authTreeRef={ref => { authTreeRef.current = ref }}
          onAddPermission={openPermissionForm}
          onDelPermission={delPermission}
        >
          <Button size="small" >
            添加模块
          </Button>

          <Divider />
        </AuthTree>
      </div>

      <PermissionForm
        isOpen={permVisible}
        parentID={permParentId}
        closeModal={() => setPermVisible(false)}
        onOkSuccess={() => { authTreeRef.current?.refresh() }}
      />
    </>
  )
}

export default AuthPage;
