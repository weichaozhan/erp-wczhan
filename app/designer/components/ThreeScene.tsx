"use client"

import _ from 'lodash';
import classNames from 'classnames';
import * as Three from 'three';
import { useCallback, useEffect, useRef } from 'react';
import { Button } from 'antd';

import styles from '../styles/threeScene.module.scss';

interface ThreeObj {
  cube?: Three.Mesh<Three.BoxGeometry, Three.MeshBasicMaterial, Three.Object3DEventMap>;
  line?: Three.Line<Three.BufferGeometry<Three.NormalBufferAttributes>, Three.LineBasicMaterial, Three.Object3DEventMap>;
  renderer?: Three.WebGLRenderer;
  scene?: Three.Scene;
  camera?: Three.PerspectiveCamera;
}

const ThreeScene = () => {
  const wrapperDom = useRef<Element | null>();
  const animeTimer = useRef<number | null | undefined>();
  const resizeTarget = useRef<EventListenerObject['handleEvent']>();

  const threeObj = useRef<ThreeObj>({});

  const animate = useCallback(() => {
        const { cube, line, renderer, scene, camera } = threeObj.current;
        
        if (animeTimer.current === null) {
          animeTimer.current = undefined;
          return;
        }

        if (renderer && scene && camera) {
          if (cube || line) {
            animeTimer.current = requestAnimationFrame(() => {
              animate();
            });
            renderer.render(scene, camera);
          }
          // 立方体旋转
          if (cube) {
            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;
            cube.rotation.z += 0.01;
          }

          if (line) {
            line.rotation.x -= 0.02;
            line.rotation.y -= 0.01;
            line.rotation.z += 0.01;
          }
        }
  }, []);

  const handleResize = () => {
    resizeTarget.current = () => {
      if (wrapperDom.current && threeObj.current.camera) {
        const width = wrapperDom.current.clientWidth;
        const height = wrapperDom.current.clientHeight;

        threeObj.current.renderer?.setSize(width, height);
        threeObj.current.camera.aspect = width / height;
        threeObj.current.camera.updateProjectionMatrix();
      }
    };
    window.addEventListener('resize', resizeTarget.current);
  };

  // 立方体
  const createCube = () => {
    const geometry = new Three.BoxGeometry(1, 1, 1);
    const material = new Three.MeshBasicMaterial({ color: 0x00ff00 });
    threeObj.current.cube = new Three.Mesh(geometry, material);

    threeObj.current.scene?.add(threeObj.current.cube);
  }

  // 画线
  const createLine = () => {
    const material = new Three.LineBasicMaterial({
      color: 'red',
    });

    const points: Three.Vector3[] = [];
    points.push(new Three.Vector3(-2, 0, 0));
    points.push(new Three.Vector3(0, 3, 0));
    points.push(new Three.Vector3(2, 0, 0));

    const geometry = new Three.BufferGeometry().setFromPoints(points);

    threeObj.current.line = new Three.Line(geometry, material);

    threeObj.current.scene?.add(threeObj.current.line);
  }

  const initThree = useCallback(_.once(() => {
    if (wrapperDom.current) {
      if (resizeTarget.current) {
        window.removeEventListener('resize', resizeTarget.current);
      }

      const width = wrapperDom.current.clientWidth;
      const height = wrapperDom.current.clientHeight;

      threeObj.current.scene = new Three.Scene();
      
      threeObj.current.camera = new Three.PerspectiveCamera( 75, width / height, 0.01, 1000);

      threeObj.current.renderer = new Three.WebGLRenderer();
      threeObj.current.renderer.setSize( width, height );
      wrapperDom.current.appendChild(threeObj.current.renderer.domElement);

      threeObj.current.camera.position.z = 5;

      createCube();
      createLine();

      animate();

      handleResize();
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