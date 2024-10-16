"use client"

import { useEffect, useState } from 'react';
import classNames from 'classnames';
import { createPortal } from 'react-dom';

import styles from '../styles/tools.module.scss';

const Tools = () => {
  return (
    <div className={classNames(styles.wrapper)}>
      Designer Tools
    </div>
  );
};

const ToolsWrapper = () => {
  const [doc, setDoc] = useState<Document | undefined>();

  useEffect(() => {
    setDoc(document);
  }, []);

  return (
    <>
      {doc && createPortal((
        <Tools />
      ), doc.querySelector('#potalTools') ?? doc.body)}
    </>
  )
};

export default ToolsWrapper;
