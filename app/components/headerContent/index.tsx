import classNames from 'classnames';
import Link from 'next/link';

import styles from './index.module.scss';
import Tools from './toos';

const HeaderContent = () => {
  return (
    <div className={classNames(styles.wrapper)}>
      <Link href="/" >
        <h1 className={classNames(styles.title)}>
          简易 ERP
        </h1>
      </Link>

      <Tools />
    </div>
  );
};

export default HeaderContent;
