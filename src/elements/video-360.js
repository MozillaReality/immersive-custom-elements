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

    let src = this.getAttribute('src') || '';
    let width = parseInt(this.getAttribute('width')) || 0;
    let height = parseInt(this.getAttribute('height')) || 0;
    let loop = this.getAttribute('loop') !== null;


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
    const camera = new PerspectiveCamera(90, width / height);
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

    const button = VRHelper.createButton(renderer.domElement, device);
    container.appendChild(button);

    THREEHelper.setupVRModeSwitching(renderer, camera, controls, device);


    // dynamic attributes change

    const observer = new MutationObserver(mutations => {
      const newSrc = this.getAttribute('src') || '';
      const newWidth = parseInt(this.getAttribute('width')) || 0;
      const newHeight = parseInt(this.getAttribute('height')) || 0;
      const newLoop = this.getAttribute('loop') !== null;

      if (newWidth !== width || newHeight !== height) {
        width = newWidth;
        height = newHeight;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        renderer.setSize(width, height);

        VRHelper.updateButton(renderer.domElement, button);
      }

      if (newSrc !== src) {
        src = newSrc;
        video.src = src;
        video.play().catch(error => console.error(error));
      }

      if (newLoop !== loop) {
        loop = newLoop;
        video.loop = loop;
      }
    });

    observer.observe(this, {
      attributes: true
    });


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
