import classNames from 'classnames';

import styles from './styles/index.module.scss';
import LoginForm from './form';

function Login() {
  return (
    <div className={classNames(styles.wrapper)}>
      <LoginForm />
    </div>
  )
}

export default Login;