"use client"

import _ from 'lodash';
import classNames from 'classnames';
import * as Three from 'three';
import { useCallback, useEffect, useRef } from 'react';
import { Button } from 'antd';

import styles from '../styles/threeScene.module.scss';

interface ThreeObj {
  cube?: Three.Mesh<Three.BoxGeometry, Three.MeshBasicMaterial, Three.Object3DEventMap>,
  renderer?: Three.WebGLRenderer,
  scene?: Three.Scene,
  camera?: Three.PerspectiveCamera,
}

const ThreeScene = () => {
  const wrapperDom = useRef<Element | null>();
  const animeTimer = useRef<number | null | undefined>();

  const threeObj = useRef<ThreeObj>({});

  const animate = useCallback(() => {
        const { cube, renderer, scene, camera } = threeObj.current;
        
        if (animeTimer.current === null) {
          animeTimer.current = undefined;
          return;
        }

        if (cube && renderer && scene && camera) {
          animeTimer.current = requestAnimationFrame(() => {
            animate();
          });
          renderer.render(scene, camera);
          cube.rotation.x += 0.01
          cube.rotation.y += 0.01
          cube.rotation.z += 0.01
        }
  }, []);

  const initThree = useCallback(_.once(() => {
    if (wrapperDom.current) {
      const width = wrapperDom.current.clientWidth;
      const height = wrapperDom.current.clientHeight;

      threeObj.current.scene = new Three.Scene();
      
      threeObj.current.camera = new Three.PerspectiveCamera( 75, width / height, 0.1, 1000);

      threeObj.current.renderer = new Three.WebGLRenderer();
      threeObj.current.renderer.setSize( width, height );
      wrapperDom.current.appendChild(threeObj.current.renderer.domElement);

      const geometry = new Three.BoxGeometry( 1, 1, 1 );
      const material = new Three.MeshBasicMaterial( { color: 0x00ff00 } );
      threeObj.current.cube = new Three.Mesh( geometry, material );

      threeObj.current.scene.add(threeObj.current.cube);

      threeObj.current.camera.position.z = 5;

      animate();
    }
  }), []);

  const stop = (position?: {
    x: number,
    y: number,
    z: number,
  } | undefined) => {
    animeTimer.current && cancelAnimationFrame(animeTimer.current);

    animeTimer.current = null;

    if (position) {
      const { x, y, z } = position;
      requestAnimationFrame(() => {
        const {cube, renderer, scene, camera} = threeObj.current;
        
        if (cube && renderer && scene && camera) {
          cube.rotation.x = x;
          cube.rotation.y = y;
          cube.rotation.z = z;
          renderer.render(scene, camera);
        }
      });
    }
  };

  const reset = () => {
    stop({ x: 0, y: 0, z: 0 });
  };

  const play = () => {
    if (animeTimer.current === null) {
      animeTimer.current = undefined;
      animate();
    }
  };

  useEffect(() => {
    wrapperDom.current = document.querySelector('#three-scene');
    initThree();
  }, []);


  return (
    <div className={classNames(styles['three-content-wrapper'])} >
      <div className={classNames(styles['tools-wrapper'])}>
        <Button onClick={reset}>
          重置
        </Button>

        <Button onClick={play}>
          播放
        </Button>
      </div>
      <div id="three-scene" className={classNames(styles['three-scene'])} >
      </div>
    </div>
  );
};

export default ThreeScene;