"use client"

import _ from 'lodash';
import classNames from 'classnames';
import * as Three from 'three';
import { useCallback, useEffect, useRef } from 'react';
import { Button } from 'antd';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';

import styles from '../styles/threeScene.module.scss';

interface ThreeObj {
  parrot?: Three.Object3D<Three.Object3DEventMap> & { tick?: (time: number) => void };
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

  // Three 帧时时钟
  const clockThree = useRef<Three.Clock | undefined>();

  const threeObj = useRef<ThreeObj>({});

  const animate = useCallback(() => {
        const { parrot, cube, line, renderer, scene, camera } = threeObj.current;
        
        if (animeTimer.current === null) {
          animeTimer.current = undefined;
          return;
        }

        if (renderer && scene && camera) {
          if (cube || line || parrot) {
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

          if (parrot) {
            parrot.rotation.y += 0.01;
            if (clockThree.current) {
              parrot.tick?.(clockThree.current.getDelta());
            }
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

  // bird
  const createParrot = async () => {
    const { scene, camera, renderer } = threeObj.current;
    const loader = new GLTFLoader();

    if (scene && camera && renderer) {
      const parrotData = await loader.loadAsync('/model3d/Parrot.glb');
      
      // get model
      threeObj.current.parrot = parrotData.scene.children[0];

      // get animation
      const anime = parrotData.animations[0];
      // declare mixer
      const mixer = new Three.AnimationMixer(threeObj.current.parrot);
      // 将动画按照动作进行动画剪辑
      const action = mixer.clipAction(anime);
      action.play();
  
      threeObj.current.parrot.tick = (delta: number) => {
        mixer.update(delta);
      };

      threeObj.current.parrot.scale.set(0.05, 0.05, 0.05);

      threeObj.current.parrot.position.set(-6, 0, -2);

      // DirectionalLight: 直射光，可以理解为手电筒，从放置处发出平行光。缺点也比较明显，只能照向一个位置，而且直射光很浪费性能，不建议使用太多。
      // AmbientLight: 环境光，从各个方向向场景中的每个对象添加恒定数量的光照，与现实中光的工作模式完全不同。用起来很简单，通常来配合 DirectionalLight 来使用。但环境光由于各方向相同，无法显示出深度信息。
      // HemisphereLight: 半球光，光源在场景顶部的天空颜色和场景底部的地面颜色之间渐变，比较接近现实的光。半球光性能非常高，但其不从某一特定方向照射，因此通常和直射光配合使用实现某区域的高光效果。
      // 设置直射光
      const mainLight = new Three.DirectionalLight();
      // 设置半球光
      const enLight = new Three.HemisphereLight();

      scene.add(threeObj.current.parrot, mainLight, enLight);
      renderer.render(scene, camera);
      clockThree.current = new Three.Clock();
    }

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

      threeObj.current.camera.position.z = 10;

      createCube();
      createLine();
      await createParrot();
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