import {
  PerspectiveCamera,
  Scene,
  WebGLRenderer
} from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {VRHelper} from '../utils/vr-helper';
import {THREEHelper} from '../utils/three-helper';

class Img360 extends HTMLElement {
  connectedCallback() {
    VRHelper.getVRDevice().then(device => {
      this._initialize(device);
    });
  }

  _initialize(device) {
    const hasDevice = device !== null;


    // Attributes

    const src = this.getAttribute('src') || '';
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
    container.appendChild(renderer.domElement);


    // Three.js objects

    const scene = new Scene();
    const camera = new PerspectiveCamera(60, width / height);
    camera.position.z = 0.1;

    THREEHelper.create360ImageMesh(src).then(mesh => {
      scene.add(mesh);
      render();
    });


    // Three.js camera controls

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.addEventListener('change', event => {
      render();
    });


    // VR / Fullscreen

    container.appendChild(VRHelper.createButton(renderer.domElement, device));

    THREEHelper.setupVRModeSwitching(renderer, camera, controls, device);

    if (hasDevice) {
      window.addEventListener('vrdisplaypresentchange', event => {
        if (device.isPresenting) {
          renderer.setAnimationLoop(render);
        } else {
          renderer.setAnimationLoop(null);
        }

        render();
      }, false);
    } else {
      window.addEventListener('fullscreenchange', event => {
        render();
      }, false);
    }


    //

    function render() {
      renderer.render(scene, camera);
    }
  }
}

customElements.define('img-360', Img360);
