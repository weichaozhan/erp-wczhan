"use client"

import classNames from 'classnames';
import { FC, useState } from 'react';

import globalStyles from '../global.module.scss';

import RoleTable from './components/RoleTable';
import { Button, Divider } from 'antd';
import RoleForm from './components/forms/RoleForm';
import { Role } from '../types/entity';

const RolePage: FC = () => {
  const [isEdit, seIsEdit] = useState(false);
  const [roleVisible, setRoleVisible] = useState(false);

  const [roleData, setRoleData] = useState<Role>();

  return <>
    <div
      className={classNames('h-full overflow-scroll', globalStyles['content-wrapper'])}
    >
      <Button
        type="primary"
        onClick={() => {
          setRoleVisible(true);
          seIsEdit(false);
        }}
      >添加角色</Button>

      <Divider />

      <RoleTable
        onEdit={(role) => {
          setRoleVisible(true);
          setRoleData(role);
          seIsEdit(true);
        }}
      />
    </div>

    <RoleForm
      roleData={roleData}
      isOpen={roleVisible}
      isEdit={isEdit}
      closeModal={() => {
        setRoleVisible(false);
        setRoleData(undefined);
      }}
    />
  </>;
};

export default RolePage;
