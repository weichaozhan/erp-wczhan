"use client"
import { useRef, useState } from 'react';
import { App, Button, Divider } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import { isNil } from 'lodash';

import globalStyles from '../global.module.scss';
import styles from './styles/authPage.module.scss';

import AuthTree from '../components/AuthTree';
import { AuthTreeRef } from '../components/AuthTree/types';
import PermissionForm from './forms/PermissionForm';
import { ModuleListNode } from '../types/auth';
import { Permission, SysModule } from '../types/entity';
import { deleteModuleApi, delPermissionApi } from '../api/auth';
import ModuleForm from './forms/ModuleForm';

function AuthPage() {
  const { modal, message } = App.useApp();

  const authTreeRef = useRef<AuthTreeRef | null>(null);

  // permission
  const [permVisible, setPermVisible] = useState(false);
  const [permParentId, setPermParentId] = useState<number>();
  // module & menu
  const [isEdit, setIsEdit] = useState(false);
  const [moduleVisible, setModuleVisible] = useState(false);
  const [moduleParentId, setModuleParentId] = useState<number>();
  const [moduleData, setModuleData] = useState<ModuleListNode>();

  // permission handlers
  const openPermissionForm = (module: ModuleListNode) => {
    setPermParentId(module.id);
    setPermVisible(true);
  };
  const delPermission = (permission: Permission) => {
    modal.confirm({
      title: '删除权限',
      icon: <ExclamationCircleOutlined className={styles['danger-color']} />,
      content: `确认删除权限【${permission.nameDesc}】？`,
      okType: 'danger',
      cancelText: '取消',
      okText: '确认',
      onOk: async () => {
        const { id } = permission;
        if (!isNil(id)) {
          await delPermissionApi(id);
          authTreeRef.current?.refresh?.();
          message.success(`删除权限【${permission.nameDesc}】成功！`);
        }
      },
    });
  }

  // module handlers
  const openModuleForm = (module?: ModuleListNode, isEditBtn = false) => {
    setIsEdit(isEditBtn);
    
    if (isEditBtn) {
      setModuleData(module);
    } else {
      setModuleParentId(module?.id);
    }
    setModuleVisible(true);
  };
  const delModule = (sysModule: SysModule) => {
    modal.confirm({
      title: '删除模块',
      icon: <ExclamationCircleOutlined className={styles['danger-color']} />,
      content: `确认删除模块【${sysModule.nameToShow}】？`,
      okType: 'danger',
      cancelText: '取消',
      okText: '确认',
      onOk: async () => {
        const { id } = sysModule;
        if (!isNil(id)) {
          await deleteModuleApi(id);
          authTreeRef.current?.refresh?.();
          message.success(`删除模块【${sysModule.nameToShow}】成功！`);
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
          actionable
          authTreeRef={ref => { authTreeRef.current = ref }}

          onAddPermission={openPermissionForm}
          onDelPermission={delPermission}

          onAddModule={(module) => openModuleForm(module, false)}
          onEditModule={(module) => openModuleForm(module, true)}
          onDelModule={delModule}
        >
          <Button
            size="small"
            onClick={() => openModuleForm(undefined, false)}
          >
            添加模块
          </Button>

          <Divider />
        </AuthTree>
      </div>

      <ModuleForm
        isEdit={isEdit}
        isOpen={moduleVisible}
        parentID={moduleParentId}
        moduleData={moduleData}
        closeModal={() => {
          setModuleParentId(undefined);
          setModuleData(undefined);
          setModuleVisible(false);
        }}
        onOkSuccess={() => { authTreeRef.current?.refresh() }}
      />
      
      <PermissionForm
        isOpen={permVisible}
        parentID={permParentId}
        closeModal={() => {
          setPermParentId(undefined);
          setPermVisible(false);
        }}
        onOkSuccess={() => { authTreeRef.current?.refresh() }}
      />
    </>
  )
}

export default AuthPage;
