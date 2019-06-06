import {
  PerspectiveCamera,
  Scene,
  WebGLRenderer
} from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {VRHelper} from '../utils/vr-helper';
import {THREEHelper} from '../utils/three-helper';

class Video360 extends HTMLElement {
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
    const loop = this.getAttribute('loop') !== null;


    // DOM

    const shadow = this.attachShadow({mode: 'open'});

    const container = document.createElement('div');
    container.style.position = 'relative';
    shadow.appendChild(container);


    // Three.js renderer

    const renderer = new WebGLRenderer({
      antialias: true
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);
    renderer.setAnimationLoop(render);
    container.appendChild(renderer.domElement);


    // Three.js objects

    const scene = new Scene();
    const camera = new PerspectiveCamera(60, width / height);
    camera.layers.enable(1);
    camera.position.z = 0.1;

    const video = document.createElement('video');
    video.src = src;
    video.loop = loop;
    video.muted = true;
    video.play().catch(error => console.error(error));

    const texture = THREEHelper.create360VideoTexture(video);

    scene.add(THREEHelper.createSphereMeshFor360(texture));


    // Three.js camera controls

    const controls = new OrbitControls(camera, renderer.domElement);


    // VR / Fullscreen

    container.appendChild(VRHelper.createButton(renderer.domElement, device));

    THREEHelper.setupVRModeSwitching(renderer, camera, controls, device);


    //

    function render() {
      if (video.readyState >= video.HAVE_CURRENT_DATA) {
        texture.needsUpdate = true;
      }

      renderer.render(scene, camera);
    }
  }
}

customElements.define('video-360', Video360);
