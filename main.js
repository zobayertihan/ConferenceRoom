import * as THREE from "three";
import * as TWEEN from "@tweenjs/tween.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { RectAreaLightHelper } from "three/addons/helpers/RectAreaLightHelper.js";
import { SVGLoader } from "three/addons/loaders/SVGLoader.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";

// DOM Declaration - START
const sideDrawer = document.getElementById("side-drawer");
const sideDrawerCross = document.querySelector("#side-drawer .header span");
const sideDrawerContent = document.querySelector("#side-drawer .content");
const sideDrawerAllContent = document.querySelectorAll(
  "#side-drawer .content div"
);
const visitBtn = document.querySelector("#visit-btn button");
const introBody = document.getElementById("intro-body");

const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

let videoMeshArray = [];

sideDrawerCross.addEventListener("click", () => {
  sideDrawer.style.right = "-100%";
});
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 1.5, 12);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;

document.body.appendChild(renderer.domElement);
renderer.shadowMap.enabled = true;

const renderScene = new RenderPass(scene, camera);
const composer = new EffectComposer(renderer);
composer.addPass(renderScene);

const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  0.1,
  0.1,
  0.1
);
// const bloomPass = new BloomPass(1, 25, 5, 256);
composer.addPass(bloomPass);

const axesHelper = new THREE.AxesHelper(100);
//scene.add(axesHelper);

let floor;
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector3();
let svgImage; // Reference to the SVG element

//SVG LOADER
const cubeData = [
  {
    id: 1,
    position: {
      x: -2.9,
      y: 1.75,
      z: 7.0
    },
    rotationY: 0.6,
    cameraPosition: {
      x: -4.5,
      z: 10.8
    }
  },
  {
    id: 2,
    position: {
      x: -7.0,
      y: 1.75,
      z: 2.5
    },
    rotationY: 0.9,
    cameraPosition: {
      x: -9.59,
      z: 4.37
    }
  },
  {
    id: 3,
    position: {
      x: -6.8,
      y: 1.75,
      z: -2.5
    },
    rotationY: 1.1,
    cameraPosition: {
      x: -10.27,
      z: -3.5
    }
  },
  {
    id: 4,
    position: {
      x: -3.5,
      y: 1.75,
      z: -7.0
    },
    rotationY: 1.4,
    cameraPosition: {
      x: -4.12,
      z: -9.5
    }
  },
  {
    id: 5,
    position: {
      x: 3.0,
      y: 1.75,
      z: -7.0
    },
    rotationY: 1.65,
    cameraPosition: {
      x: 3.8,
      z: -9.5
    }
  },
  {
    id: 6,
    position: {
      x: 7.0,
      y: 1.75,
      z: -2.5
    },
    rotationY: 1.9,
    cameraPosition: {
      x: 10.5,
      z: -3.0
    }
  },
  {
    id: 7,
    position: {
      x: 7.0,
      y: 1.75,
      z: 3.0
    },
    rotationY: 2.1,
    cameraPosition: {
      x: 9.46,
      z: 3.77
    }
  },
  {
    id: 8,
    position: {
      x: 3.5,
      y: 1.75,
      z: 7.0
    },
    rotationY: 2.35,
    cameraPosition: {
      x: 5.5,
      z: 10.0
    }
  }
];

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

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("../../node_modules/three/examples/jsm/libs/draco/");

function loadAndPlaceSVG(scene) {
  const loader = new SVGLoader();
  // loader.setDRACOLoader(dracoLoader);
  loader.load(
    "./assets/spcontrol.svg",
    (data) => {
      const paths = data.paths;
      const group = new THREE.Group();

      for (let i = 0; i < paths.length; i++) {
        const path = paths[i];

        const material = new THREE.MeshBasicMaterial({
          color: path.color,
          side: THREE.DoubleSide,
          depthWrite: false,
          transparent: true,
          opacity: 0.6
        });

        const shapes = SVGLoader.createShapes(path);

        for (let j = 0; j < shapes.length; j++) {
          const shape = shapes[j];
          const geometry = new THREE.ShapeGeometry(shape);
          const mesh = new THREE.Mesh(geometry, material);
          group.add(mesh);
        }
      }

      group.scale.set(0.005, 0.005, 0.005);
      group.rotation.x = -Math.PI * 0.5;
      group.visible = false;
      scene.add(group);
      svgImage = group;
    },

    (error) => {
      //console.log(error);
    }
  );
}

let shootingObjectContainer;
let logo;
let tween;
let wall;
function rotateModel() {
  const rotation = { y: logo.rotation.y };
  const targetRotation = { y: logo.rotation.y + Math.PI * 2 }; // Rotate 360 degrees (2 * Math.PI)
  const duration = 2000; // Duration in milliseconds (adjust as needed)
  tween = true;
}
function loadAllModels() {
  // ceiling loader
  const ceilingloader = new GLTFLoader();
  ceilingloader.setDRACOLoader(dracoLoader);
  ceilingloader.load(
    "./assets/20220225ceiling.gltf",
    function (gltf) {
      scene.add(gltf.scene);
    },
    (xhr) => {},
    (error) => {
      console.log(error);
    }
  );

  // floor loader

  const floorloader = new GLTFLoader();
  floorloader.setDRACOLoader(dracoLoader);
  floorloader.load(
    "./assets/20220601floor.gltf",
    function (gltf) {
      scene.add(gltf.scene);
      floor = gltf.scene;
      gltf.scene.name = "floor";
      gltf.scene.receiveShadow = true;
      loadAndPlaceSVG(scene, floor);
    },
    (xhr) => {},
    (error) => {
      console.log("errrrrrrr", error);
    }
  );

  // ceilingLightloader loader
  const ceilingLightloader = new GLTFLoader();
  ceilingLightloader.setDRACOLoader(dracoLoader);
  ceilingLightloader.load(
    "./assets/20220601lit.gltf",
    function (gltf) {
      scene.add(gltf.scene);
      //gltf.scene.children[0]
      console.log(gltf.scene.children[0].material);
    },
    (xhr) => {},
    (error) => {
      console.log(error);
    }
  );

  // wallloader loader

  const wallloader = new GLTFLoader();
  wallloader.setDRACOLoader(dracoLoader);
  wallloader.load(
    "./assets/20220601wall.gltf",
    function (gltf) {
      scene.add(gltf.scene);
      wall = gltf.scene;
      gltf.scene.castShadow = true;
      gltf.scene.name = "wall";
      wall = gltf.scene;
    },
    (xhr) => {},
    (error) => {
      console.log(error);
    }
  );
  // chair table loader
  const propsloader = new GLTFLoader();
  propsloader.setDRACOLoader(dracoLoader);
  propsloader.load(
    "./assets/20220601web.gltf",
    function (gltf) {
      scene.add(gltf.scene);
    },
    (xhr) => {},
    (error) => {
      console.log(error);
    }
  );

  // virtual loader
  const virtualloader = new GLTFLoader();
  virtualloader.setDRACOLoader(dracoLoader);
  virtualloader.load(
    "./assets/20220225virtual.gltf",
    function (gltf) {
      scene.add(gltf.scene);
    },
    (xhr) => {},
    (error) => {
      console.log(error);
    }
  );

  // Facilities loader
  const facilitiesloader = new GLTFLoader();
  facilitiesloader.setDRACOLoader(dracoLoader);
  facilitiesloader.load(
    "./assets/facilities.gltf",
    function (gltf) {
      scene.add(gltf.scene);
      const model = gltf.scene;
      model.getObjectByName("CeilingLight+RF").material.color = new THREE.Color(
        "black"
      );

      gltf.scene.traverse((child) => {
        if (child.isMesh) {
          // Check if the material has an emissive property
          if (child.material.emissive) {
            child.material.envMapIntensity = 3.0;
            child.material.emissiveIntensity = 2000.0;
          }
        }
      });
    },
    (xhr) => {},
    (error) => {
      console.log("errrrrrrr", error);
    }
  );

  // Shooting loader
  const shootingSpaceloader = new GLTFLoader();
  shootingSpaceloader.setDRACOLoader(dracoLoader);
  shootingSpaceloader.load(
    "./assets/20220601shooting.gltf",
    function (gltf) {
      scene.add(gltf.scene);
      gltf.scene.children[3].material.emissive.set(1, 1, 1);

      shootingObjectContainer = gltf.scene.children[3];
    },
    (xhr) => {},
    (error) => {
      console.log("errrrrrrr", error);
    }
  );

  // clickPointloader loader
  const clickPointloader = new GLTFLoader();
  clickPointloader.setDRACOLoader(dracoLoader);
  clickPointloader.load(
    "./assets/clickpoint_prmd.gltf",
    function (gltf) {
      //  scene.add(gltf.scene);
    },
    (xhr) => {},
    (error) => {
      console.log(error);
    }
  );

  // Shooting loader
  const logoscalefactor = 0.22;
  const logoloader = new GLTFLoader();
  logoloader.setDRACOLoader(dracoLoader);
  logoloader.load(
    "./assets/logo1.gltf",
    function (gltf) {
      gltf.scene.name = "logo";
      scene.add(gltf.scene);
      gltf.scene.scale.set(logoscalefactor, logoscalefactor, logoscalefactor);
      gltf.scene.position.x = -2.5;
      gltf.scene.position.y = -0.5;
      logo = gltf.scene;
    },
    (xhr) => {},
    (error) => {
      console.log(error);
    }
  );
}

// Create an EffectComposer instance
// composer.addPass(shootingObjectContainer);

// Add a mousemove event listener to your renderer
renderer.domElement.addEventListener("mousemove", onMouseMove);

function onMouseMove(event) {
  try {
    //     if (!floor) {
    //   console.error("Floor not properly loaded or initialized.");
    //   return;
    // }

    // Update the raycaster with the mouse position
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    // Perform the raycasting and get the objects intersected by the ray
    const intersects = raycaster.intersectObject(floor, true);

    if (intersects.length > 0) {
      // Calculate the position where the SVG should be placed
      const intersectionPoint = intersects[0].point;
      intersectionPoint.y += 0.0001;
      intersectionPoint.x -= 0.2;
      intersectionPoint.z += 0.3;
      svgImage.position.copy(intersectionPoint);
      // Make the SVG visible
      svgImage.visible = true;
    }
  } catch {
    (e) => {
      console.error(e, "Floor not properly loaded or initialized.");
    };
  }
}

function controls() {
  let prevInitPos = 0;
  const moveSpeed = 0.1;
  document.addEventListener("keydown", (event) => {
    let lowerX = -13.0;
    let higherX = 13.0;
    let lowerZ = -14.0;
    let higherZ = 14.0;

    let dist = camera.getWorldDirection(new THREE.Vector3());
    switch (event.key) {
      case "w":
      case "ArrowUp":
        // Move the camera forward along its current direction
        let newx = camera.position.x + dist.multiplyScalar(moveSpeed).x;
        let newz = camera.position.z + dist.multiplyScalar(moveSpeed).z;
        if (
          newx < higherX &&
          newx > lowerX &&
          newz < higherZ &&
          newz > lowerZ
        ) {
          camera.position.add(
            camera
              .getWorldDirection(new THREE.Vector3())
              .multiplyScalar(+moveSpeed)
          );
        }
        // console.log(camera.getWorldDirection(new THREE.Vector3()));
        break;
      case "s":
      case "ArrowDown":
        // Move the camera backward along its current direction
        let newx1 = camera.position.x + dist.multiplyScalar(-moveSpeed).x;
        let newz1 = camera.position.z + dist.multiplyScalar(-moveSpeed).z;
        if (
          newx1 < higherX &&
          newx1 > lowerX &&
          newz1 < higherZ &&
          newz1 > lowerZ
        ) {
          camera.position.add(
            camera
              .getWorldDirection(new THREE.Vector3())
              .multiplyScalar(-moveSpeed)
          );
        }
        break;
      case "a":
      case "ArrowLeft":
        // Rotate the camera to the left
        let newxl = camera.position.x - moveSpeed;
        let newzl = camera.position.z - moveSpeed;
        if (
          newxl < higherX &&
          newxl > lowerX &&
          newzl < higherZ &&
          newzl > lowerZ
        ) {
          camera.translateX(-moveSpeed);
        }
        break;
      case "d":
      case "ArrowRight":
        // Rotate the camera to the right
        let newxr = camera.position.x + moveSpeed;
        let newzr = camera.position.z + moveSpeed;
        if (
          newxr < higherX &&
          newxr > lowerX &&
          newzr < higherZ &&
          newzr > lowerZ
        ) {
          camera.translateX(moveSpeed);
        }
        break;
    }
  });

  let isDragging = false;
  let prevMouseX = 0;

  renderer.domElement.addEventListener("mousedown", (event) => {
    isDragging = true;
    prevMouseX = event.clientX;
    prevInitPos = event.clientX;
  });

  renderer.domElement.addEventListener("mouseup", (event) => {
    isDragging = false;
    if (prevInitPos === event.clientX) {
      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2();
      // Calculate mouse coordinates based on the click event
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      // Set the raycaster's origin and direction
      raycaster.setFromCamera(mouse, camera);

      const intersects = raycaster.intersectObject(
        scene.children.find((i) => i.name.toLowerCase() === "floor")
      );
      const logointersects = raycaster.intersectObject(
        scene.children.find((i) => i.name.toLowerCase() === "logo")
      );
      if (
        intersects.length > 0 &&
        intersects.find((i) => i.object.name.toLowerCase() === "floor")
      ) {
        // Get the intersection point on the floor
        const intersectionPoint = intersects[0].point;
        // Define the current camera position
        const currentPosition = {
          x: camera.position.x,
          z: camera.position.z
        };

        // Define the target position (intersection point)
        const targetPosition = {
          x: intersectionPoint.x,
          z: intersectionPoint.z
        };

        // Calculate the lookAt target position (a point ahead of the camera)
        const lookAtPosition = {
          x: camera.position.x + (targetPosition.x - camera.position.x) * 2.0, // Adjust the multiplier for the desired distance
          z: camera.position.z + (targetPosition.z - camera.position.z) * 2.0 // Adjust the multiplier for the desired distance
        };
        // const lookAtPosition = {
        //   x:
        //     camera.getWorldDirection(new THREE.Vector3()).x +
        //     targetPosition.x -
        //     camera.position.x, // Adjust the multiplier for the desired distance
        //   z:
        //     camera.getWorldDirection(new THREE.Vector3()).z +
        //     targetPosition.z -
        //     camera.position.z // Adjust the multiplier for the desired distance
        // };

        // Create a Tween for smooth camera transition
        const tween = new TWEEN.Tween(currentPosition)
          .to(targetPosition, 1500) // Adjust the duration as needed (in milliseconds)
          .easing(TWEEN.Easing.Cubic.InOut)
          .onUpdate(() => {
            // Update the camera position during the animation
            camera.position.x = currentPosition.x;
            camera.position.z = currentPosition.z;
            // Update the lookAt target position
            camera.lookAt(
              lookAtPosition.x,
              camera.position.y,
              lookAtPosition.z
            );
          })
          .start(); // Start the animation

        // Add the Tween to the update loop
        function animateTween() {
          if (tween.update()) {
            requestAnimationFrame(animateTween);
          }
        }

        animateTween();
      }
      if (
        logointersects.length > 0 &&
        logointersects.find((i) => i.object.name.toLowerCase().includes("mesh"))
      ) {
        rotateModel();
      }
    }
  });

  renderer.domElement.addEventListener("mousemove", (event) => {
    if (isDragging) {
      const deltaX = event.clientX - prevMouseX;
      camera.rotation.y += deltaX * 0.01; // Adjust rotation speed as needed
      prevMouseX = event.clientX;
    }
  });
}
function lights() {
  const width = 70;
  const height = 40;
  const intensity = 1.0;

  const directionalLightIntensity1 = 1;
  const directionalLightIntensity2 = 1;
  const directionalLightIntensity3 = 1;
  const rectLight1 = new THREE.RectAreaLight(
    0xffffff,
    intensity,
    width,
    height
  );
  const rectLight2 = new THREE.RectAreaLight(
    0xffffff,
    intensity,
    width,
    height
  );
  const rectLight3 = new THREE.RectAreaLight(
    0xffffff,
    intensity,
    width,
    height
  );

  rectLight1.position.set(-20, 0, 0);
  rectLight2.position.set(20, 0, 0);
  rectLight3.position.set(5, 0, -25);

  rectLight2.rotateY(-30);
  rectLight1.lookAt(5, 5, 5);
  rectLight3.rotateY(60);
  scene.add(rectLight1, rectLight2, rectLight3);

  const helper1 = new RectAreaLightHelper(rectLight1);
  rectLight1.add(helper1);

  const helper2 = new RectAreaLightHelper(rectLight2);
  rectLight2.add(helper2);

  const helper3 = new RectAreaLightHelper(rectLight3);
  rectLight3.add(helper3);

  // Ambient Light
  const ambientLight = new THREE.AmbientLight(0x333333, 1); // previous 100
  scene.add(ambientLight);

  // const pointerLight = new THREE.

  // Directional Light
  const directionalLight1 = new THREE.DirectionalLight(0xffffff, 5);
  const directionalLightHelper1 = new THREE.DirectionalLightHelper(
    directionalLight1,
    directionalLightIntensity1
  );
  //scene.add(directionalLight1, directionalLightHelper1);
  directionalLight1.position.set(14, 5, 0);

  //directionalLight2
  const directionalLight2 = new THREE.DirectionalLight(
    0xffffff,
    directionalLightIntensity2
  );
  const directionalLightHelper2 = new THREE.DirectionalLightHelper(
    directionalLight2,
    5
  );
  //scene.add(directionalLight2, directionalLightHelper2);
  directionalLight2.position.set(0, 5, 14);

  //directionalLight3
  const directionalLight3 = new THREE.DirectionalLight(
    0xffffff,
    directionalLightIntensity3
  );
  const directionalLightHelper3 = new THREE.DirectionalLightHelper(
    directionalLight3,
    5
  );
  //scene.add(directionalLight3, directionalLightHelper3);
  directionalLight3.position.set(-14, 5, 0);

  //directionalLight4
  const directionalLight4 = new THREE.DirectionalLight(0xffffff, 5);
  const directionalLightHelper4 = new THREE.DirectionalLightHelper(
    directionalLight4,
    5
  );
  scene.add(directionalLight4, directionalLightHelper4);
  directionalLight4.position.set(0, 5, -14);
}
function animate() {
  requestAnimationFrame(animate);
  TWEEN.update();
  if (tween == true) logo.rotation.y += 0.01;
  // renderer.render(scene, camera);
  composer.render();
}

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
let prevId;
function loadVideoContent() {
  // Create and position/rotate cubes based on cubeData
  for (const data of cubeData) {
    const cubeGeo = new THREE.BoxGeometry(0.5, 1.75, 2.5);
    const cubeMet = new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide
    });
    const originalCube = new THREE.Mesh(cubeGeo, cubeMet);
    originalCube.name = `cube-${data.id}`;
    originalCube.position.set(
      data.position.x,
      data.position.y,
      data.position.z
    );
    originalCube.rotation.y = -Math.PI * data.rotationY;
    //cubes.push(originalCube);
    scene.add(originalCube);
    originalCube.cursor = "pointer";
    originalCube.userData.id = data.id;
    ///GLTF//
    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);
    loader.load(
      "./assets/clickpoint_prmd.gltf",
      function (gltf) {
        const model = gltf.scene;
        originalCube.add(model);
        // console.log(model);
        model.getObjectByName("Pyramid").material.color.set(0, 0, 1);
      },
      (xhr) => {},
      (error) => {
        console.log(error);
      }
    );
    renderer.domElement.addEventListener("mousemove", function (event) {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children);
      // const intersectsBox = raycaster.intersectObjects(scene.children);

      // Reset the cursor to the default style
      document.body.style.cursor = "auto";

      if (intersects.length > 0) {
        const intersectedObject = intersects[0].object;
        // const intersectedObjectBOX = intersectsBox[0].object;

        // Check if the intersected object has a custom cursor property
        if (intersectedObject.cursor) {
          document.body.style.cursor = intersectedObject.cursor;
        }
        //////
        if (intersectedObject === originalCube) {
          // Change color of pyramid when hovering over the cube
          intersectedObject?.children[0]?.children[0].material.color.set(
            0xff0000
          );
          intersectedObject.children[0].position.y = 0.8;
          // console.log(intersectedObject.children[0].position);
        } else {
          originalCube?.children[0]?.children[0]?.material?.color.set(0x0000ff);
          if (originalCube) originalCube.children[0].position.y = 0.3;
        }
        /////
      }
    });
    renderer.domElement.addEventListener("click", function onMouseClick(event) {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);

      const intersects = raycaster.intersectObject(originalCube);
      if (intersects.length > 0) {
        const clickedCube = intersects[0].object;
        const currentPosition = {
          x: camera.position.x,
          z: camera.position.z
        };
        const targetPosition = {
          x: data.cameraPosition.x,
          z: data.cameraPosition.z
        };
        const tween = new TWEEN.Tween(currentPosition)
          .to(targetPosition, 1500)
          .easing(TWEEN.Easing.Cubic.InOut)
          .onUpdate(() => {
            camera.position.x = currentPosition.x;
            camera.position.z = currentPosition.z;
            camera.lookAt(0, camera.position.y, 0);
          })
          .start();
        sideDrawer.style.right = "0";
        if (prevId) {
          document.getElementById(`content-${prevId}`).style.display = "none";
        }

        prevId = data.id;

        document.getElementById(`content-${prevId}`).style.display = "block";
        hideVideos(prevId);

        // document.getElementsByClassName(`content`).
        // currId = data.id;
      }
    });
  }
}

function createVideo() {
  videoMetaData.forEach((item) => {
    videoMeshArray.push(new createVideoWithMesh(item).getMesh());
  });
}
function loadVideo(item, arg) {
  const currentPosition = {
    x: item.position.x,
    y: arg == true ? -2 : item.position.y,
    z: item.position.z
  };
  const targetPosition = {
    x: item.position.x,
    y: arg == true ? 1.75 : item.position.y,
    z: item.position.z
  };
  //console.log(item.position, currentPosition, targetPosition, arg);

  new TWEEN.Tween(currentPosition)
    .to(targetPosition, item.delay * 1000)
    .easing(TWEEN.Easing.Cubic.InOut)
    .onUpdate(() => {
      item.position.y = targetPosition.y;
    })
    .start(); // Start the animation
}
function loadAllVideo(arg) {
  videoMeshArray.forEach((item) => {
    loadVideo(item, arg);
  });
  // console.log(videoMeshArray);
}
function hideSingleVideo(item) {
  const currentPosition = {
    x: item.position.x,
    y: item.position.y,
    z: item.position.z
  };
  const targetPosition = {
    x: item.position.x,
    y: -2,
    z: item.position.z
  };
  new TWEEN.Tween(currentPosition)
    .to(targetPosition, 1500)
    .easing(TWEEN.Easing.Cubic.InOut)
    .onUpdate(() => {
      item.position.x = targetPosition.x;
      item.position.y = targetPosition.y;
      item.position.z = targetPosition.z;
    })
    .start();
}
function hideVideos(currentId) {
  //console.log(videoMeshArray, "called");
  videoMeshArray.forEach((item) => {
    if (currentId !== item.userData.id) {
      hideSingleVideo(item);
    }
  });
}
function pointerLight() {
  const ceilingPL = new THREE.PointLight(0xffffff, 100);
  // scene.add(ceilingPL);
}

prevBtn.addEventListener("click", () => {
  const currentPosition = {
    x: camera.position.x,
    z: camera.position.z
  };
  const targetPosition = {
    x: cubeData[prevId + 1].cameraPosition.x,
    z: cubeData[prevId + 1].cameraPosition.z
  };
  // const targetPosition = {
  //   x: 0,
  //   z: 0
  // };
  console.log("got click", cubeData[prevId + 1], prevId - 1);

  const tween = new TWEEN.Tween(currentPosition)
    .to(targetPosition, 1500)
    .easing(TWEEN.Easing.Cubic.InOut)
    .onUpdate(() => {
      camera.position.x = targetPosition.x;
      camera.position.z = targetPosition.z;
      // camera.position.x = 0;
      // camera.position.z = 0;
      camera.lookAt(0, camera.position.y, 0);
    })
    .start();
  //prevId = prevId + 1;
});

window.addEventListener("load", () => {
  loadAllModels();
  controls();
  lights();
  animate();
  pointerLight();
  //loadVideo();
  loadVideoContent();
  createVideo();
  // loadVideo(); //
  loadAllVideo(true);
  introBody.style.visibility = "hidden";
  setTimeout(
    () => {
      visitBtn.innerHTML = "Visit";
      visitBtn.addEventListener("click", () => {
        loadAllVideo(true);
        introBody.style.visibility = "hidden";
      });
    },

    3000
  );
});

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
