import classNames from 'classnames';
import Link from 'next/link';

import styles from './index.module.scss';
import Tools from './toos';

const HeaderContent = () => {
  return (
    <div className={classNames(styles.wrapper)}>
      <Link href="/" className={classNames(styles['title-wrapper'])} >
        <h1 className={classNames(styles.title)}>
          简易 ERP
        </h1>
      </Link>

      <div id="potalTools" className={classNames(styles['potal-tools-wrapper'])} />

      <Tools />
    </div>
  );
};

export default HeaderContent;
