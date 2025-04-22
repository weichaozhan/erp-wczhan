import classNames from 'classnames';

import globalStyles from '../global.module.scss';

function AuthPage() {

  return (
    <>
      <div
        className={classNames('h-full overflow-scroll', globalStyles['content-wrapper'])}
      >
        群组管理
      </div>
    </>
  )
}

export default AuthPage;
