import classNames from 'classnames';

import styles from '../../styles/previewSider.module.scss';

import Preview from './preview';

const PreviewSider = () => {
  return (
    <div className={classNames(styles.wrapper)}>
      <Preview />
    </div>
  );
};

export default PreviewSider;
