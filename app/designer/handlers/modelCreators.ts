import * as Three from 'three';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';

export interface ThreeObj {
  parrot?: Three.Object3D & { tick?: (time: number) => void, material?: Three.MeshBasicMaterial };
  cube?: Three.Mesh<Three.BoxGeometry, Three.MeshBasicMaterial, Three.Object3DEventMap>;
  line?: Three.Line<Three.BufferGeometry<Three.NormalBufferAttributes>, Three.LineBasicMaterial, Three.Object3DEventMap>;
  renderer?: Three.WebGLRenderer;
  scene?: Three.Scene;
  camera?: Three.PerspectiveCamera;
}

// bird
export interface CreateParrotParmas {
  threeObj: ThreeObj;
}
export const createParrot = async ({
  threeObj,
}: CreateParrotParmas) => {
  const { scene, camera, renderer } = threeObj;
  const loader = new GLTFLoader();


  if (scene && camera && renderer) {
    const parrotData = await loader.loadAsync('/model3d/Parrot.glb');
    
    // get model
    threeObj.parrot = parrotData.scene.children[0];

    const texture = await new Promise<Three.Texture>((res) => {
      new Three.TextureLoader().load('/robot.png', (data) => {
        res(data);
      });
    });
    const material = new Three.MeshBasicMaterial({
      map: texture,
    });
    threeObj.parrot.material = material;

    // get animation
    const anime = parrotData.animations[0];
    // declare mixer
    const mixer = new Three.AnimationMixer(threeObj.parrot);
    // 将动画按照动作进行动画剪辑
    const action = mixer.clipAction(anime);
    action.play();

    threeObj.parrot.tick = (delta: number) => {
      mixer.update(delta);
    };

    threeObj.parrot.scale.set(0.05, 0.05, 0.05);

    // DirectionalLight: 直射光，可以理解为手电筒，从放置处发出平行光。缺点也比较明显，只能照向一个位置，而且直射光很浪费性能，不建议使用太多。
    // AmbientLight: 环境光，从各个方向向场景中的每个对象添加恒定数量的光照，与现实中光的工作模式完全不同。用起来很简单，通常来配合 DirectionalLight 来使用。但环境光由于各方向相同，无法显示出深度信息。
    // HemisphereLight: 半球光，光源在场景顶部的天空颜色和场景底部的地面颜色之间渐变，比较接近现实的光。半球光性能非常高，但其不从某一特定方向照射，因此通常和直射光配合使用实现某区域的高光效果。
    // 设置直射光
    const mainLight = new Three.DirectionalLight();
    // 设置半球光
    const enLight = new Three.HemisphereLight();

    scene.add(threeObj.parrot, mainLight, enLight);
  }
};
