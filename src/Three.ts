import { ACESFilmicToneMapping, AxesHelper, Bone, Box3, Box3Helper, BoxGeometry, Color, EquirectangularReflectionMapping, Event, EventDispatcher, Material, Mesh, MeshBasicMaterial, Object3D, PerspectiveCamera, Quaternion, Scene, SkeletonHelper, SkinnedMesh, Vector3, WebGLRenderer, sRGBEncoding } from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';

let camera: PerspectiveCamera;
let scene: Scene;
let renderer: WebGLRenderer;
let tentacules: Map<Object3D, Bone[]> = new Map();
let poulpe: Object3D = new Object3D();

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
        let tenta = new Object3D();
        loader.load("tentacule.gltf", (gltf) => {
          console.log(gltf.scene.children.map(el => el.name).reduce((acc, el) => acc + " " + el));

          tenta = gltf.scene.getObjectByName("tentaculeAAnimer")

          tenta.position.set(0, 0, 0)
          tenta.rotation.set(0, 0, 0)
          tenta.scale.set(.1, .1, .1);
          tenta.scale.set(.1, .1, .1)
          tenta.name = "tenta" + j

          // debug
          // tenta.add(new AxesHelper(50))

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
            // poulpe.add(new Box3Helper(new Box3().setFromObject(poulpe, true), 0xffff00))
          }
          const mesh = tenta.children[0] as SkinnedMesh;

          mesh.skeleton.bones.forEach(bone => {
            // stocker les boxes

            // scene.add(new Box3Helper(new Box3().setFromObject(bone, true), 0xffff00));
          })
          mesh.geometry.computeBoundingBox();

          // scene.add(new Box3Helper(new Box3().setFromObject(tenta, true), 0xffff00));


          tentacules.set(tenta, mesh.skeleton.bones)
          poulpe.add(tenta);
          console.log(tentacules);

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

//rapidité de move
let coefDate = 0.0006
let coefRotation = 0.0008

function animate() {
  // poulpe.applyQuaternion(new Quaternion().setFromAxisAngle(new Vector3(.5, 1, 0), Math.PI / 90));
  requestAnimationFrame(animate);
  Array.from(tentacules).forEach((el) => {
    const tentacule = el[0];
    const bones = el[1];
    bones[0];

    // box.intersects(box2) ==> true si box et box2 se touchent


    (tentacule.children[0] as SkinnedMesh).geometry.computeBoundingBox();



    bones.forEach((bone, i) => {
      let cube = scene.getObjectByName("cube");

      // verifie la collision avec le cube
      let box = new Box3().setFromObject(cube, true);
      let box2 = new Box3().setFromObject(poulpe, true);
      if (!box.intersectsBox(box2)) {
        cube.position.x += Math.sin(Date.now() * coefDate) * coefRotation * Math.random();
        cube.position.y += Math.cos(-Date.now() * coefDate) * coefRotation * Math.random();
      }
      else {
        cube.position.y = 3;
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
function extract(obj: Object3D): Array<Object3D> {
  if (obj.children.length == 0) return [obj];
  return [obj.children[0], ...extract(obj.children[0])]
}