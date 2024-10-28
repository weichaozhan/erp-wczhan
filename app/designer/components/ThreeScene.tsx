"use client"

import _ from 'lodash';
import classNames from 'classnames';
import * as Three from 'three';
import interact from 'interactjs';
import { FC, useCallback, useEffect, useRef, useState } from 'react';
import Spin from 'antd/lib/spin';

import styles from '../styles/threeScene.module.scss';

import { ThreeObj, createParrot } from '../handlers/modelCreators';
import { Target } from '@interactjs/types';

interface Props {
}
const ThreeScene: FC<Props> = () => {
  const wrapperDom = useRef<HTMLDivElement | null>(null);
  const resizeTarget = useRef<EventListenerObject['handleEvent']>();

  // Three 帧时时钟
  const clockThree = useRef<Three.Clock | undefined>();

  const threeObj = useRef<ThreeObj>({});

  // loading
  const [loading, setLoading] = useState(false);

  const rerenderCanvas = () => {
    const { renderer, camera, scene } = threeObj.current;

    if (renderer && scene && camera) {
      renderer.render(scene, camera);
    }
  };

  const handleResize = () => {
    resizeTarget.current = () => {
      const { renderer, camera, scene } = threeObj.current;
      if (wrapperDom.current && camera) {
        const width = wrapperDom.current.clientWidth;
        const height = wrapperDom.current.clientHeight;

        threeObj.current.renderer?.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        rerenderCanvas();
      }
    };
    window.addEventListener('resize', resizeTarget.current);
  };

  const dragHandler = () => {
    interact(wrapperDom.current as Target).draggable({
      listeners: {
        move: (e) => {
          const { parrot } = threeObj.current;
          const { x, y } = e.delta ?? {};
          
          if (clockThree.current && parrot) {
            if (x) {
              parrot.rotation.y += (x / 100);
            }
            if (y) {
              parrot.rotation.x += (y / 100);
            }
            rerenderCanvas();
          }
        },
      },
    });
  };

  const initThree = useCallback(_.once(async () => {
    if (wrapperDom.current) {
      if (resizeTarget.current) {
        window.removeEventListener('resize', resizeTarget.current);
      }

      setLoading(true);

      const width = wrapperDom.current.clientWidth;
      const height = wrapperDom.current.clientHeight;

      threeObj.current.scene = new Three.Scene();
      threeObj.current.scene.background
      threeObj.current.scene.background = new Three.Color(0xf5f5f5);
      
      threeObj.current.camera = new Three.PerspectiveCamera( 75, width / height, 0.01, 1000);

      threeObj.current.renderer = new Three.WebGLRenderer();
      threeObj.current.renderer.setSize( width, height );
      wrapperDom.current.appendChild(threeObj.current.renderer.domElement);

      threeObj.current.camera.position.z = 6;

      await createParrot({ threeObj: threeObj.current });

      clockThree.current = new Three.Clock();

      handleResize();

      dragHandler();

      rerenderCanvas();

      setLoading(false);
    }
  }), []);

  useEffect(() => {
    initThree();
  }, []);


  return (
    <div className={classNames(styles['three-content-wrapper'])} >
      <div
        ref={r => {
          wrapperDom.current = r;
        }} 
        className={classNames(styles['three-scene'])}
      >
      </div>

      <div className={classNames(styles.loading, loading ? undefined : styles.hidden)}>
        <Spin size="large" />
      </div>
    </div>
  );
};

export default ThreeScene;