"use client"

import _ from 'lodash';
import classNames from 'classnames';
import * as Three from 'three';
import interact from 'interactjs';
import { useCallback, useEffect, useRef } from 'react';

import styles from '../styles/threeScene.module.scss';

import { ThreeObj, createParrot } from '../handlers/modelCreators';

const ThreeScene = () => {
  const wrapperDom = useRef<Element | null>();
  const resizeTarget = useRef<EventListenerObject['handleEvent']>();

  // Three 帧时时钟
  const clockThree = useRef<Three.Clock | undefined>();

  const threeObj = useRef<ThreeObj>({});

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
    interact('#three-scene').draggable({
      listeners: {
        move: (e) => {
          const { parrot } = threeObj.current;
          const { x, y } = e.delta ?? {};
          
          if (clockThree.current && parrot) {
            const texture = new Three.TextureLoader().load('/robot.png');
            const material = new Three.MeshBasicMaterial({
              map: texture,
            });
            parrot.material = material;

            if (x) {
              parrot.rotation.y += (x / 10);
            }
            if (y) {
              parrot.rotation.x += (y / 10);
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

      const width = wrapperDom.current.clientWidth;
      const height = wrapperDom.current.clientHeight;

      threeObj.current.scene = new Three.Scene();
      threeObj.current.scene.background = new Three.Color('rgb(255, 255, 255)');
      
      threeObj.current.camera = new Three.PerspectiveCamera( 75, width / height, 0.01, 1000);

      threeObj.current.renderer = new Three.WebGLRenderer();
      threeObj.current.renderer.setSize( width, height );
      wrapperDom.current.appendChild(threeObj.current.renderer.domElement);

      threeObj.current.camera.position.z = 6;

      await createParrot({ threeObj: threeObj.current });

      clockThree.current = new Three.Clock();

      handleResize();

      dragHandler();
    }
  }), []);

  useEffect(() => {
    wrapperDom.current = document.querySelector('#three-scene');
    initThree();
  }, []);


  return (
    <div className={classNames(styles['three-content-wrapper'])} >
      <div id="three-scene" className={classNames(styles['three-scene'])} >
      </div>
    </div>
  );
};

export default ThreeScene;