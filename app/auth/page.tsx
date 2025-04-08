"use client"
import classNames from 'classnames';

import globalStyles from '../global.module.scss';
import AuthTree from '../components/AuthTree';

function AuthPage() {

  return (
    <div
      className={classNames(globalStyles['content-wrapper'])}
    >
      <AuthTree />
    </div>
  )
}

export default AuthPage;
