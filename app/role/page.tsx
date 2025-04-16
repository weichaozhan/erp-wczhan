"use client"

import classNames from 'classnames';
import { FC, useRef, useState } from 'react';

import globalStyles from '../global.module.scss';

import RoleTable from './components/RoleTable';
import { App, Button, Divider } from 'antd';
import RoleForm from './components/forms/RoleForm';
import { Role } from '../types/entity';
import { RoleTableRef } from '../components/AuthTree/types';
import { delRoleApi } from '../api/auth';

const RolePage: FC = () => {
  const {message } = App.useApp();

  const tableRef = useRef<RoleTableRef | null>();

  const [isEdit, setIsEdit] = useState(false);
  const [roleVisible, setRoleVisible] = useState(false);

  const [roleData, setRoleData] = useState<Role>();

  const delRole = async (role: Role) => {
    try {
      await delRoleApi(role.id);
      message.success(`删除【${role.nameToShow}】成功!`);
    } catch (e) {
      message.error(Object.toString.call(e));
    }
  };

  return <>
    <div
      className={classNames('h-full overflow-scroll', globalStyles['content-wrapper'])}
    >
      <Button
        type="primary"
        onClick={() => {
          setRoleVisible(true);
          setIsEdit(false);
        }}
      >添加角色</Button>

      <Divider />

      <RoleTable
        tableRef={ref => { tableRef.current = ref }}
        onEdit={(role) => {
          setRoleVisible(true);
          setRoleData(role);
          setIsEdit(true);
        }}
        onDel={delRole}
      />
    </div>

    <RoleForm
      roleData={roleData}
      isOpen={roleVisible}
      isEdit={isEdit}
      onOkSuccess={() => {
        tableRef.current?.refresh();
      }}
      closeModal={() => {
        setRoleVisible(false);
        setRoleData(undefined);
        setIsEdit(false);
      }}
    />
  </>;
};

export default RolePage;
