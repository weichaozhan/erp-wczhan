import classNames from 'classnames';

import globalStyles from '../global.module.scss';
import GroupTable from './GroupTable';

function AuthPage() {

  return (
    <>
      <div
        className={classNames('h-full overflow-scroll', globalStyles['content-wrapper'])}
      >
        <GroupTable />
      </div>
    </>
  )
}

export default AuthPage;
