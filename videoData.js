import * as THREE from "three";
import * as TWEEN from "@tweenjs/tween.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { RectAreaLightHelper } from "three/addons/helpers/RectAreaLightHelper.js";
import { SVGLoader } from "three/addons/loaders/SVGLoader.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";

let videoMetaData = [
  {
    id: 1,
    src: "o4ulq.mp4",
    position: {
      x: -2.1,
      y: 1.75,
      z: 8.75
    },
    rotationY: 0.82,
    delay: 3
  },
  {
    id: 2,
    src: "shinseikatsu.mp4",
    position: {
      x: -7.5,
      y: 1.75,
      z: 4.8
    },
    rotationY: 1.05,
    delay: 3
  },
  {
    id: 3,
    src: "musixrlq.mp4",
    position: {
      x: -8.8,
      y: 1.75,
      z: -1.9
    },
    rotationY: 1.3,
    delay: 4
  },
  {
    id: 4,
    src: "o4ulq.mp4",
    position: {
      x: -5.0,
      y: 1.75,
      z: -7.5
    },
    rotationY: 1.552,
    delay: 4
  },
  {
    id: 5,
    src: "shinseikatsu.mp4",
    position: {
      x: 2.05,
      y: 1.75,
      z: -8.8
    },
    rotationY: 1.8,
    delay: 5
  },
  {
    id: 6,
    src: "musixrlq.mp4",
    position: {
      x: 8.0,
      y: 1.75,
      z: -4.4
    },
    rotationY: 2.1,
    delay: 5
  },
  {
    id: 7,
    src: "shinseikatsu.mp4",
    position: {
      x: 9.0,
      y: 1.75,
      z: 2.0
    },
    rotationY: 2.3,
    delay: 6
  },
  {
    id: 8,
    src: "musixrlq.mp4",
    position: {
      x: 5.0,
      y: 1.75,
      z: 8.0
    },
    rotationY: 2.55,
    delay: 6
  }
];
class createVideoWithMesh {
  constructor(item) {
    this.item = item;
    this.mesh;
    const videoScalingFactor = 2.5;
    const videoOpacity = 0.8;

    const video = document.createElement("video");
    video.src = `./assets/${this.item.src}`;
    video.loop = true;
    video.muted = true;
    video.crossOrigin = "anonymous"; // You may need this depending on your video source
    video.addEventListener("loadedmetadata", function () {
      video.play();
    });

    // Create a video texture
    const videoTexture = new THREE.VideoTexture(video);
    videoTexture.minFilter = THREE.LinearFilter; // Set appropriate filter options

    // Create a material with the video texture
    const material = new THREE.MeshBasicMaterial({
      map: videoTexture,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: videoOpacity
    });
    const geometry = new THREE.PlaneGeometry(16 / 10, 9 / 10, 16, 16);
    const positions = geometry.attributes.position;

    const axis = new THREE.Vector3(0, 1, 0);
    const axisPosition = new THREE.Vector3(-2, 0, 2);
    const vTemp = new THREE.Vector3(0, 0, 0);
    let lengthOfArc;
    let angleOfArc;

    for (let i = 0; i < positions.count; i++) {
      vTemp.fromBufferAttribute(positions, i);
      lengthOfArc = vTemp.x - axisPosition.x;
      angleOfArc = lengthOfArc / axisPosition.z;
      vTemp
        .setX(0)
        .setZ(-axisPosition.z)
        .applyAxisAngle(axis, -angleOfArc)
        .add(axisPosition);
      positions.setXYZ(i, vTemp.x, vTemp.y, vTemp.z);
    }

    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = `video-${this.item.id}`;
    // console.log(mesh.position, " before creation ");
    mesh.position.set(this.item.position.x, -2, this.item.position.z);
    // console.log(mesh.position, " after creation ");
    mesh.rotation.y = -Math.PI * this.item.rotationY;
    mesh.userData.id = item.id;
    mesh.scale.set(videoScalingFactor, videoScalingFactor, videoScalingFactor);
    scene.add(mesh);
    //console.log("after creation 2", mesh.position);
    this.mesh = mesh;
  }
  getMesh() {
    return this.mesh;
  }
}
let videoMeshArray = [];
function createVideo() {
  videoMetaData.forEach((item) => {
    videoMeshArray.push(new createVideoWithMesh(item).getMesh());
  });
}
