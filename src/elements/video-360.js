import {
  PerspectiveCamera,
  Scene,
  WebGLRenderer
} from 'three';
import {DeviceOrientationControls} from 'three/examples/jsm/controls/DeviceOrientationControls';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {
  DeviceOrientationHelper
} from '../utils/deviceorientation-helper';import {VRHelper} from '../utils/vr-helper';
import {THREEHelper} from '../utils/three-helper';

class Video360 extends HTMLElement {
  connectedCallback() {
    Promise.all([
      VRHelper.getVRDevice(),
      DeviceOrientationHelper.hasDeviceOrientation()
    ]).then(array => {
      this._initialize(array[0], array[1]);
    });
  }

  _initialize(device, hasDeviceOrientation) {
    const hasDevice = device !== null;

    // Attributes

    let src = this.getAttribute('src') || '';
    let width = parseInt(this.getAttribute('width')) || 0;
    let height = parseInt(this.getAttribute('height')) || 0;
    let loop = this.getAttribute('loop') !== null;
    let muted = this.getAttribute('muted') !== null;
    let autoplay = this.getAttribute('autoplay') !== null;


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
    renderer.setAnimationLoop(() => {
      if (video.readyState >= video.HAVE_CURRENT_DATA) {
        texture.needsUpdate = true;
      }

      if (hasDeviceOrientation && controls.enabled) {
        controls.update();
      }

      renderer.render(scene, camera);
    });
    container.appendChild(renderer.domElement);


    // video element

    let readyToStart = false;
    let triggered = autoplay;

    const video = document.createElement('video');

    video.addEventListener('canplaythrough', event => {
      readyToStart = true;
      play();
    });

    renderer.domElement.addEventListener('click', event => {
      triggered = true;
      play();
    }, false);

    renderer.domElement.addEventListener('touchend', event => {
      triggered = true;
      play();
    }, false);

    const play = () => {
      if (!readyToStart || !triggered || !video.paused) return;

      // @TODO: proper error handling
      video.play().catch(error => console.error(error.message));
    };

    video.src = src;
    video.loop = loop;
    video.muted = muted;

    // This line is necessary for iOS.
    // Otherwise video plays in fullscreen mode as regular video.
    video.setAttribute('playsinline', true);

    // Seems like explicit video.load() call is needed
    // for some (mobile?) platforms.
    video.load();

    // Three.js objects

    const scene = new Scene();
    const camera = new PerspectiveCamera(90, width / height);
    camera.layers.enable(1);
    camera.position.z = 0.1;

    const texture = THREEHelper.create360VideoTexture(video);

    scene.add(THREEHelper.createSphereMeshFor360(texture));


    // Three.js camera controls

    const controls = hasDeviceOrientation
      ? new DeviceOrientationControls(camera)
      : new OrbitControls(camera, renderer.domElement);


    // VR / Fullscreen

    const button = VRHelper.createButton(renderer.domElement, device);
    container.appendChild(button);

    THREEHelper.setupVRModeSwitching(renderer, camera, controls, device);

    window.addEventListener('vrdisplaypresentchange', event => {
      triggered = true;
      play();
    }, false);

    document.addEventListener('fullscreenchange', event => {
      triggered = true;
      play();
    }, false);

    // dynamic attributes change

    const observer = new MutationObserver(mutations => {
      const newSrc = this.getAttribute('src') || '';
      const newWidth = parseInt(this.getAttribute('width')) || 0;
      const newHeight = parseInt(this.getAttribute('height')) || 0;
      const newLoop = this.getAttribute('loop') !== null;
      const newMuted = this.getAttribute('muted') !== null;
      const newAutoplay = this.getAttribute('autoplay') !== null;

      if (newWidth !== width || newHeight !== height) {
        width = newWidth;
        height = newHeight;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        renderer.setSize(width, height);

        VRHelper.updateButton(renderer.domElement, button);
      }

      if (newLoop !== loop) {
        loop = newLoop;
        video.loop = loop;
      }

      if (newMuted !== muted) {
        muted = newMuted;
        video.muted = muted;
      }

      if (newAutoplay !== autoplay) {
        autoplay = newAutoplay;
      }

      if (newSrc !== src) {
        src = newSrc;
        video.src = src;
        readyToStart = false;
        video.load();
      }
    });

    observer.observe(this, {
      attributes: true
    });
  }
}

customElements.define('video-360', Video360);
