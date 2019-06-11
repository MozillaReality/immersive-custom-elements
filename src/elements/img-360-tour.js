import {
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  PlaneBufferGeometry,
  Raycaster,
  Scene,
  WebGLRenderer
} from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {VRHelper} from '../utils/vr-helper';
import {THREEHelper} from '../utils/three-helper';

class Img360Tour extends HTMLElement {
  connectedCallback() {
    VRHelper.getVRDevice().then(device => {
      this._initialize(device);
    });
  }

  _initialize(device) {
    const hasDevice = device !== null;


    // Attributes

    const width = parseInt(this.getAttribute('width')) || 0;
    const height = parseInt(this.getAttribute('height')) || 0;


    // DOM

    const shadow = this.attachShadow({mode: 'open'});

    const container = document.createElement('div');
    container.style.position = 'relative';
    shadow.appendChild(container);


    // Three.js renderer

    const renderer = new WebGLRenderer({antialias: true});
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);
    renderer.setAnimationLoop(render);
    container.appendChild(renderer.domElement);


    // Three.js objects

    const scene = new Scene();
    const camera = new PerspectiveCamera(60, width / height);
    camera.position.z = 0.1;
    scene.add(camera);

    const crosshair = THREEHelper.createCrosshairMesh();
    crosshair.position.z = -2;
    camera.add(crosshair);

    const imageMeshes = [];
    const targets = []; // raycast targets

    const target = new Mesh(
      new PlaneBufferGeometry(0.5, 0.5),
      new MeshBasicMaterial( {
        color: 0xffffff,
        opacity: 0.3,
        transparent: true
      })
    );
    target.position.z = 2;
    target.rotation.x = Math.PI;
    scene.add(target);
    targets.push(target);


    // Child <img-360-tour-item> elements handling.
    // Traverse and add 360 image meshes.

    function add360ImageMesh(element) {
      const src = element.getAttribute('src') || '';

      THREEHelper.create360ImageMesh(src).then(mesh => {
        mesh.visible = imageMeshes.length === 0;
        scene.add(mesh);
        imageMeshes.push(mesh);
        render();
      });
    }

    function traverseImg360Elements(children) {
      for (let i = 0, il = children.length; i < il; i++) {
        const child = children[i];

        if (child.tagName === 'IMG-360-TOUR-ITEM') {
          add360ImageMesh(child);

          if (child.children) {
            traverseImg360Elements(child.children);
          }
        }
      }
    }

    traverseImg360Elements(this.children);


    // On Chrome, when this method is called children don't seem to be added yet.
    // So observing child elements addition.

    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.addedNodes.length) {
          traverseImg360Elements(mutation.addedNodes);
        }
      })
    })

    observer.observe(this, {childList: true});


    // Raycasting.
    // Switches image if intersecting targets for 3seconds (180frames).

    let imageIndex = 0;
    let intersectingFrameCount = 0;
    const raycaster = new Raycaster();

    function switchImage() {
      imageIndex++;

      if (imageIndex >= imageMeshes.length) {
        imageIndex = 0;
      }

      for (let i = 0, il = imageMeshes.length; i < il; i++) {
        if (i === imageIndex) {
          imageMeshes[i].visible = true;
        } else {
          imageMeshes[i].visible = false;
        }
      }
    }

    function raycast() {
      raycaster.setFromCamera({x: 0, y: 0}, camera);
      const intersects = raycaster.intersectObjects(targets);

      if (intersects.length > 0) {
        target.material.opacity = 0.5;
        intersectingFrameCount++;

        if (intersectingFrameCount >= 180) {
          switchImage();
          intersectingFrameCount = 0;
        }
      } else {
        target.material.opacity = 0.3;
        intersectingFrameCount = 0;
      }
    }


    // Three.js camera controls

    const controls = new OrbitControls(camera, renderer.domElement);


    // VR / Fullscreen

    container.appendChild(VRHelper.createButton(renderer.domElement, device));

    THREEHelper.setupVRModeSwitching(renderer, camera, controls, device);


    //

    function render() {
      raycast();
      renderer.render(scene, camera);
    }
  }
}

customElements.define('img-360-tour', Img360Tour);
