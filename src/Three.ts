import { ACESFilmicToneMapping, AxesHelper, Bone, Box3, BoxGeometry, Color, EquirectangularReflectionMapping, Mesh, MeshBasicMaterial, Object3D, PerspectiveCamera, Quaternion, Scene, SkinnedMesh, Vector3, WebGLRenderer, sRGBEncoding } from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';

let camera: PerspectiveCamera;
let scene: Scene;
let renderer: WebGLRenderer;
let tentacules: Map<Object3D, Bone[]> = new Map();
let poulpe: Object3D = new Object3D();
let analyser: AnalyserNode;
let audio = document.getElementById("audio") as HTMLAudioElement;
let dataArray: Uint8Array;

//rapidité de move
let coefDate = 0.0006
let coefRotation = 0.0008
const avgCoef = 300

function play(e: any) {

  audio!.src = e; // URL.createObjectURL(e);
  audio!.load();
  audio!.play();

  var context = new AudioContext();
  analyser = context.createAnalyser();
  var src = context.createMediaElementSource(audio);
  src.connect(analyser);
  analyser.connect(context.destination);
  analyser.fftSize = 512;
  var bufferLength = analyser.frequencyBinCount;
  dataArray = new Uint8Array(bufferLength);

}

init();
play("assets/music/Joy.mp3");
// play("assets/music/getLucky.mp3");
animate();
render();


function init() {
  const container = document.querySelector("#app") as HTMLElement;
  document.body.appendChild(container);

  camera = new PerspectiveCamera(73, window.innerWidth / window.innerHeight, 0.25, 1000);

  camera.position.set(10, 0, 0);

  scene = new Scene();
  // DEBUG
  scene.add(new AxesHelper(5))
  console.log("x - rouge");
  console.log("y - vert");
  console.log("z - bleu");


  new RGBELoader()
    .setPath('/assets/textures/')
    // .load('water_drop.hdr', (texture) => {
    .load('venice_sunset_1k.hdr', (texture) => {
      let loader = new GLTFLoader().setPath('/assets/models/')

      let color = new Color()
      color.setHex(0x00ff00 * Math.random())
      let geometry = new BoxGeometry(.3, .3, .3);
      let material = new MeshBasicMaterial({ color: color });
      let cube = new Mesh(geometry, material);
      cube.name = "cube";
      cube.position.set(0, 3, 0)
      cube.geometry.computeBoundingBox();
      scene.add(cube);

      loader.load("corps.gltf", (gltf) => {
        gltf.scene.scale.set(.1, .1, .1);
        gltf.scene.position.set(0, 0, 0)
        gltf.scene.name = "corps";
        poulpe.add(gltf.scene);

        scene.add(poulpe);
      })

      for (let i = 0; i < 8; i++) {
        let j = i + 1
        let tenta: Object3D | undefined = new Object3D();
        loader.load("tentacule.gltf", (gltf) => {

          tenta = gltf.scene.getObjectByName("tentaculeAAnimer") ? gltf.scene.getObjectByName("tentaculeAAnimer") : undefined

          tenta!.position.set(0, 0, 0)
          tenta!.rotation.set(0, 0, 0)
          tenta!.scale.set(.1, .1, .1);
          tenta!.scale.set(.1, .1, .1)
          tenta!.name = "tenta" + j

          // debug
          // tenta.add(new AxesHelper(50))

          if (j == 1) {
            tenta!.translateOnAxis(new Vector3(.5, 0, -1.65), 1)
            tenta!.rotateX(0);
            tenta!.rotateY(Math.PI * 3 / 4);
            tenta!.rotateZ(Math.PI);
          }
          if (j == 2) {
            tenta!.translateOnAxis(new Vector3(-.5, -.17, -1.25), 1)
            tenta!.rotateX(Math.PI * 1 / 7);
            tenta!.rotateY(Math.PI * 5 / 4);
            tenta!.rotateZ(Math.PI);
          }
          if (j == 3) {
            tenta!.translateOnAxis(new Vector3(.5, 0, -1), 1)
            tenta!.rotateX(0)
            tenta!.rotateY(Math.PI / 2)
            tenta!.rotateZ(Math.PI * 9 / 10)
            tenta!.scale.multiply(new Vector3(-1, 1, 1))
          }
          if (j == 4) {
            tenta!.translateOnAxis(new Vector3(-.5, 0, -.75), 1)
            tenta!.rotateX(0)
            tenta!.rotateY(Math.PI * -3 / 8)
            tenta!.rotateZ(Math.PI)
          }
          if (j == 5) {
            tenta!.translateOnAxis(new Vector3(.5, 0, 0), 1)
            tenta!.rotateX(0)
            tenta!.rotateY(Math.PI / 2)
            tenta!.rotateZ(Math.PI * 9 / 10)
          }
          if (j == 6) {
            tenta!.translateOnAxis(new Vector3(.3, 0, .75), 1)
            tenta!.rotateX(0);
            tenta!.rotateY(0);
            tenta!.rotateZ(Math.PI);
            tenta!.scale.multiply(new Vector3(-1, 1, 1))
          }
          if (j == 7) {
            tenta!.translateOnAxis(new Vector3(-.3, 0, .75), 1)
            tenta!.rotateX(0)
            tenta!.rotateY(0)
            tenta!.rotateZ(Math.PI)
          }
          if (j == 8) {
            tenta!.translateOnAxis(new Vector3(-.8, 0, 0), 1)
            tenta!.rotateX(0)
            tenta!.rotateY(Math.PI * -3 / 12)
            tenta!.rotateZ(Math.PI)
            // poulpe.add(new Box3Helper(new Box3().setFromObject(poulpe, true), 0xffff00))
          }
          const mesh = tenta!.children[0] as SkinnedMesh;

          mesh.geometry.computeBoundingBox();

          // scene.add(new Box3Helper(new Box3().setFromObject(tenta, true), 0xffff00));


          tentacules.set(tenta!, mesh.skeleton.bones)
          poulpe.add(tenta!);

          render();
        })
      }

      texture.mapping = EquirectangularReflectionMapping;

      scene.background = texture;
      scene.environment = texture;

      render();

    });

  // renderer
  renderer = new WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;
  renderer.outputEncoding = sRGBEncoding;
  container.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.addEventListener('change', render); // use if there is no animation loop
  controls.minDistance = 2;
  controls.maxDistance = 10;
  controls.target.set(0, 0, - 0.2);
  controls.update();

  window.addEventListener('resize', onWindowResize);

}

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);

  render();

}

//

function render() {

  renderer.render(scene, camera);

}



function animate() {
  // poulpe.applyQuaternion(new Quaternion().setFromAxisAngle(new Vector3(.5, 1, 0), Math.PI / 90));
  requestAnimationFrame(animate);
  analyser.getByteFrequencyData(dataArray);

  //divide in 3 parts the dataArray (low mid high)
  const lowArray = dataArray.slice(0, dataArray.length / 3 - 1);
  const midArray = dataArray.slice(dataArray.length / 3 - 1, (dataArray.length / 3 - 1) * 2);
  const highArray = dataArray.slice((dataArray.length / 3 - 1) * 2, dataArray.length - 1);

  const lowerArrayAvg = lowArray.reduce((a, b) => a + b, 0) / lowArray.length / avgCoef;
  const midArrayAvg = midArray.reduce((a, b) => a + b, 0) / midArray.length / avgCoef;
  const upperArrayAvg = highArray.reduce((a, b) => a + b, 0) / highArray.length / avgCoef;
  // console.log(`${lowerArrayAvg} ${midArrayAvg} ${upperArrayAvg}`);
  if (lowerArrayAvg != 0 || midArrayAvg != 0 || upperArrayAvg != 0) {
    poulpe.scale.lerp(new Vector3(lowerArrayAvg, lowerArrayAvg, lowerArrayAvg), 1);
  }

  //get the average of each part

  poulpe.position.lerp(new Vector3(0, 0, upperArrayAvg), 1);
  poulpe.rotation.set(0, 0, midArrayAvg);
  // poulpe.applyQuaternion(new Quaternion(lowerArrayAvg / 500, midArrayAvg / 500, upperArrayAvg / 500, 1));




  Array.from(tentacules).forEach((el) => {
    const tentacule = el[0];
    const bones = el[1];
    bones[0];

    // box.intersects(box2) ==> true si box et box2 se touchent

    bones.forEach((bone, i) => {
      let cube = scene.getObjectByName("cube");

      // verifie la collision avec le cube
      let box = new Box3().setFromObject(cube!, true);
      let box2 = new Box3().setFromObject(poulpe, true);
      if (!box.intersectsBox(box2)) {
        cube!.position.x += Math.sin(Date.now() * coefDate) * coefRotation * Math.random();
        cube!.position.y += Math.cos(-Date.now() * coefDate) * coefRotation * Math.random();
      }
      else {
        cube!.position.y = 3;
      }

      if (i % 3 == 0)
        bone.rotation.x += Math.sin(-Date.now() * coefDate) * coefRotation * Math.random();
      else
        bone.rotation.x += Math.cos(Date.now() * coefDate) * coefRotation * Math.random();

      bone.rotation.z += Math.cos(-Date.now() * coefDate) * coefRotation * Math.random();

    })

  })

  renderer.render(scene, camera);
}

/**
 * extrait les enfants
 * @param obj object 3D dont les enfants sont à extraire
 * @returns le tableau de tous les enfants
 */
// function extract(obj: Object3D): Array<Object3D> {
//   if (obj.children.length == 0) return [obj];
//   return [obj.children[0], ...extract(obj.children[0])]
// }