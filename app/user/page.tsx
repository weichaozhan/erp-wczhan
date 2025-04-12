import { FC } from 'react';

import globalStyles from '../global.module.scss';
import classNames from 'classnames';
import UserTable from './components/UserTable';

const UserPage: FC = () => {
  return (
    <div className={classNames('h-full overflow-scroll', globalStyles['content-wrapper'])}>
      <UserTable />
    </div>
  );
};

export default UserPage;