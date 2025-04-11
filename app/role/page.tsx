"use client"

import classNames from 'classnames';
import { FC, useState } from 'react';

import globalStyles from '../global.module.scss';

import RoleTable from './components/RoleTable';
import { Button, Divider } from 'antd';
import RoleForm from './components/forms/RoleForm';

const RolePage: FC = () => {
  const [roleVisible, setRoleVisible] = useState(false);

  return <>
    <div
      className={classNames('h-full overflow-scroll', globalStyles['content-wrapper'])}
    >
      <Button
        type="primary"
        onClick={() => setRoleVisible(true)}
      >添加角色</Button>

      <Divider />

      <RoleTable />
    </div>

    <RoleForm isOpen={roleVisible} />
  </>;
};

export default RolePage;
