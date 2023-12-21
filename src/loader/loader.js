import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";


const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("../../node_modules/three/examples/jsm/libs/draco/");
//dracoLoader.setDecoderPath("../../node_modules/three/examples/jsm/libs/draco/");

export const getCeiling = () => {
    var ceiling;
const ceilingloader = new GLTFLoader();
ceilingloader.setDRACOLoader(dracoLoader);
ceilingloader.load(
  "../../asssets/20220225ceiling.gltf",
  function (gltf) {
    ceiling = gltf.scene;
    gltf.scene.traverse(function (child) {
      if (child.isMesh) {
        const m = child;
        m.receiveShadow = true;
      }
      if (child.isLight) {
        const l = child;
        l.shadow.mapSize.width = 2048;
        l.shadow.mapSize.height = 2048;
      }
    });

    gltf.scene.scale.set(20, 20, 20);
  },
  (xhr) => {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  (error) => {
    console.log("errrrrrrr", error);
  }
    );
   // return ceiling;
    return "hamara marzi"
}



 