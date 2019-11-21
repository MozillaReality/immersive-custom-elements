import {
  PerspectiveCamera,
  Scene,
  WebGLRenderer
} from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {
  DeviceOrientationControlsWrapper,
  DeviceOrientationHelper
} from '../utils/deviceorientation-helper';
import {XRHelper} from '../utils/xr-helper';
import {THREEHelper} from '../utils/three-helper';

class Img360 extends HTMLElement {
  connectedCallback() {
    Promise.all([
      DeviceOrientationHelper.hasDeviceOrientation()
    ]).then(array => {
      this._initialize(array[0], array[1]);
    });
  }

  _initialize(hasDeviceOrientation) {
    // Attributes

    let src = this.getAttribute('src') || '';
    let width = parseInt(this.getAttribute('width')) || 0;
    let height = parseInt(this.getAttribute('height')) || 0;


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
    const camera = new PerspectiveCamera(90, width / height);
    camera.position.z = 0.1;

    let mesh;

    THREEHelper.create360ImageMesh(src).then(imageMesh => {
      mesh = imageMesh;
      scene.add(mesh);
      render();
    });


    // Three.js camera controls

    const controls = hasDeviceOrientation
      ? new DeviceOrientationControlsWrapper(camera)
      : new OrbitControls(camera, renderer.domElement);
    controls.addEventListener('change', event => {
      render();
    });

    // VR / Fullscreen

    const button = XRHelper.createButton(renderer, controls);
    container.appendChild(button);

    renderer.vr.addEventListener('sessionstart', event => {
      renderer.setAnimationLoop(render);
      render()
    });
    renderer.vr.addEventListener('sessionend', event => {
      renderer.setAnimationLoop(null);
      render();
    });
    window.addEventListener('fullscreenchange', event => {
      render();
    }, false);


    // dynamic attributes change

    const observer = new MutationObserver(mutations => {
      const newSrc = this.getAttribute('src') || '';
      const newWidth = parseInt(this.getAttribute('width')) || 0;
      const newHeight = parseInt(this.getAttribute('height')) || 0;

      if (newWidth !== width || newHeight !== height) {
        width = newWidth;
        height = newHeight;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        renderer.setSize(width, height);

        XRHelper.updateButton(renderer.domElement, button);

        render();
      }

      if (newSrc !== src) {
        src = newSrc;
        THREEHelper.load360ImageTexture(src).then(texture => {
          mesh.material.map.dispose();
          mesh.material.map = texture;
          render();
        });
      }
    });

    observer.observe(this, {
      attributes: true
    });

    const render = () => {
      renderer.render(scene, camera);
    };
  }
}

customElements.define('img-360', Img360);
