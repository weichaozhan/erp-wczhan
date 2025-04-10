import classNames from 'classnames';
import { FC } from 'react';

import globalStyles from '../global.module.scss';
import styles from './styles/rolePage.module.scss';

import RoleTable from './components/RoleTable';
import { Button, Divider } from 'antd';

const RolePage: FC = () => {
  return <div
    className={classNames(globalStyles['content-wrapper'], styles['role-content-wrapper'])}
  >
    <Button type="primary">添加角色</Button>

    <Divider />

    <RoleTable />
  </div>;
};

export default RolePage;
