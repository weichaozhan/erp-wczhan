"use client"
import { useState } from 'react';
import classNames from 'classnames';
import { RadioChangeEvent, Group as RadioGroup, Button as RadioButton } from 'antd/es/radio';
import { Modal } from 'antd';

import styles from '../../styles/previewSider.module.scss';

import ThreeScene from '../../components/ThreeScene';
import { THREED } from './constant';
import ModeSelector from './modeSelector';

const Preview = () => {
  const [tabVal, setTabVal] = useState<string>(THREED);
  const [modalTabVal, setModalTabVal] = useState<string>(THREED);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const changeTab = (e: RadioChangeEvent) => {
    setTabVal(e.target.value);
    setModalTabVal(e.target.value);
  };

  const onClose = () => {
    setModalTabVal(THREED);
    setIsModalOpen(false);
  }

  const changeModalTab = (e: RadioChangeEvent) => {
    setModalTabVal(e.target.value);
  };

  return (
    <>
      <div className={classNames(styles.previewWrapper)}>
        <div className={classNames(styles.preview)}>
          <ModeSelector
            onChange={changeTab}
            value={tabVal}
            groupClassName={styles.small}
            size="small"
          />
          
          <div className={classNames(styles.threeDWrapper)} style={{ display: tabVal === THREED ? '' : 'none' }}>
            <ThreeScene />
          </div>

          <div className={classNames(styles.previewBtn)} onClick={() => setIsModalOpen(true)}>
            预览
          </div>
        </div>
      </div>

      <Modal
        title="效果图"
        destroyOnClose
        open={isModalOpen}
        width="800px"
        onCancel={onClose}
        footer={null}
      >
        <div className={classNames(styles.previewModeal)}>
          <ModeSelector
            groupClassName={styles.modalSelector}
            onChange={changeModalTab}
            value={modalTabVal}
          />
          
          <div className={classNames(styles.modalContent)}>
            <div className={classNames(styles.modalThreeDWrapper)} style={{ display: modalTabVal === THREED ? '' : 'none' }}>
              <ThreeScene />
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Preview;