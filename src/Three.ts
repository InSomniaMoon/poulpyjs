import { ACESFilmicToneMapping, AnimationAction, AnimationClip, AnimationMixer, AxesHelper, BoxHelper, EquirectangularReflectionMapping, Event, Object3D, PerspectiveCamera, Scene, Vector3, VectorKeyframeTrack, WebGLRenderer, sRGBEncoding } from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';

let camera: PerspectiveCamera;
let scene: Scene;
let renderer: WebGLRenderer;
let bones: Object3D<Event>[] = [];

let arms: Object3D<Event>[][] = [];

init();
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
    .load('venice_sunset_1k.hdr', (texture) => {

      let loader = new GLTFLoader().setPath('/assets/models/')

      loader.load("corps.gltf", (gltf) => {
        gltf.scene.scale.set(.1, .1, .1);
        gltf.scene.position.set(0, 0, 0)
        gltf.scene.name = "corps";
        scene.add(gltf.scene);
      })

      for (let i = 0; i < 8; i++) {
        let j = i + 1
        let tenta = new Object3D();
        loader.load("tentacule.gltf", (gltf) => {

          tenta = gltf.scene.children[1]
          tenta.position.set(0, 0, 0)
          tenta.rotation.set(0, 0, 0)
          tenta.scale.set(.1, .1, .1);
          tenta.scale.set(.1, .1, .1)
          tenta.name = "tenta" + j

          // debug
          // tenta.add(new AxesHelper(50))

          scene.add(tenta)
          console.log(tenta.name, tenta);
          arms.push(extract(tenta.children[1]))

          if (j == 1) {
            tenta.translateOnAxis(new Vector3(.5, 0, -1.65), 1)
            tenta.rotateX(0);
            tenta.rotateY(Math.PI * 3 / 4);
            tenta.rotateZ(Math.PI);
          }
          if (j == 2) {
            tenta.translateOnAxis(new Vector3(-.5, -.17, -1.25), 1)
            tenta.rotateX(Math.PI * 1 / 7);
            tenta.rotateY(Math.PI * 5 / 4);
            tenta.rotateZ(Math.PI);
          }
          if (j == 3) {
            tenta.translateOnAxis(new Vector3(.5, 0, -1), 1)
            tenta.rotateX(0)
            tenta.rotateY(Math.PI / 2)
            tenta.rotateZ(Math.PI * 9 / 10)
            tenta.scale.multiply(new Vector3(-1, 1, 1))
          }
          if (j == 4) {
            tenta.translateOnAxis(new Vector3(-.5, 0, -.75), 1)
            tenta.rotateX(0)
            tenta.rotateY(Math.PI * -3 / 8)
            tenta.rotateZ(Math.PI)
          }
          if (j == 5) {
            tenta.translateOnAxis(new Vector3(.5, 0, 0), 1)
            tenta.rotateX(0)
            tenta.rotateY(Math.PI / 2)
            tenta.rotateZ(Math.PI * 9 / 10)
          }
          if (j == 6) {
            tenta.translateOnAxis(new Vector3(.3, 0, .75), 1)
            tenta.rotateX(0);
            tenta.rotateY(0);
            tenta.rotateZ(Math.PI);
            tenta.scale.multiply(new Vector3(-1, 1, 1))
          }
          if (j == 7) {
            tenta.translateOnAxis(new Vector3(-.3, 0, .75), 1)
            tenta.rotateX(0)
            tenta.rotateY(0)
            tenta.rotateZ(Math.PI)
          }
          if (j == 8) {
            tenta.translateOnAxis(new Vector3(-.8, 0, 0), 1)
            tenta.rotateX(0)
            tenta.rotateY(Math.PI * -3 / 12)
            tenta.rotateZ(Math.PI)
          }

          render()
          console.log(arms);

        })



      }



      // loader.load("arm.gltf", (gltf) => {

      //   gltf.scene.scale.set(0.1, 0.1, 0.1);
      //   scene.add(gltf.scene)

      //   let obj = scene.getObjectByName("Bone")
      //   if (obj != undefined) {
      //     bones = bones.concat(extract(obj));
      //   }

      //   console.log(bones);
      //   console.log(bones.map(bone => bone.name).reduce((acc, cur) => acc + " " + cur, ""));

      // });

      texture.mapping = EquirectangularReflectionMapping;

      scene.background = texture;
      scene.environment = texture;

      render();
      // definition du material pour les mesh
      // const material = new MeshNormalMaterial({ transparent: true, opacity: 0.5, side: 0 });
      // let cube = new Cube(material);

      // let cube1 = cube.methode1
      // let cube2 = cube.methode2

      // cube1.translateX(2).translateY(.5); // on decale le cube pour le distinguer du premier
      // scene.add(cube1); // on ajoute le 1e cube à la scene 
      // scene.add(cube2); // on ajoute le 2e cube à la scene

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

  requestAnimationFrame(animate);
  arms.forEach(arm => {

    arm.forEach((bone, i) => {
      if (i % 3 == 0)
        bone.rotation.x += Math.sin(-Date.now() * 0.0006 ) * 0.0004 * Math.random();
      else
        bone.rotation.x += Math.cos(Date.now() * 0.0006 ) * 0.0004 * Math.random();

      bone.rotation.z += Math.cos(-Date.now() * 0.0006 ) * 0.0004 * Math.random();
    })
  })

  renderer.render(scene, camera);
}

/**
 * extrait les enfants
 * @param obj object 3D dont les enfants sont à extraire
 * @returns le tableau de tous les enfants
 */
function extract(obj: Object3D): Array<Object3D> {
  if (obj.children.length == 0) return [obj];
  return [obj.children[0], ...extract(obj.children[0])]
}