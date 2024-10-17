"use client"

import classNames from 'classnames';
import * as Three from 'three';
import { useCallback } from 'react';

import styles from '../styles/tools.module.scss';

const ThreeScene = () => {
  const hanleThree = useCallback(() => {
    const scene = new Three.Scene();
    console.log('window', window);
  }, []);


  return (
    <div className={classNames(styles['three-scene'])}>
        dadf
    </div>
  );
};

export default ThreeScene;