import {
  BackSide,
  ClampToEdgeWrapping,
  Mesh,
  MeshBasicMaterial,
  NearestFilter,
  PerspectiveCamera,
  Scene,
  SphereBufferGeometry,
  Texture,
  WebGLRenderer
} from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';

class Video360 extends HTMLElement {
  connectedCallback() {
    this._getVRDevice().then(device => {
      this._initialize(device);
    });
  }

  _initialize(device) {
    const hasDevice = device !== null;

    const shadow = this.attachShadow({mode: 'open'});

    const container = document.createElement('div');
    shadow.appendChild(container);

    const src = this.getAttribute('src') || '';
    const width = parseInt(this.getAttribute('width')) || 0;
    const height = parseInt(this.getAttribute('height')) || 0;
    const loop = this.getAttribute('loop') !== null;

    const video = document.createElement('video');
    video.src = src;
    video.loop = loop;
    video.muted = true;
    video.play().catch(error => console.error(error));

    const texture = new Texture(video);
    texture.generateMipmaps = false;
    texture.wrapS = ClampToEdgeWrapping;
    texture.wrapT = ClampToEdgeWrapping;
    texture.minFilter = NearestFilter;
    texture.maxFilter = NearestFilter;

    const scene = new Scene();
    const camera = new PerspectiveCamera(75, width / height);
    camera.layers.enable(1);
    camera.position.z = 0.1;

    const geometry = new SphereBufferGeometry(500, 60, 40);
    const material = new MeshBasicMaterial({
      map: texture
    });
    const mesh = new Mesh(geometry, material);

    geometry.scale(-1, 1, 1);
    const uvs = geometry.attributes.uv.array;
    for (let i = 0, il = uvs.length; i < il; i += 2) {
      uvs[i] *= 0.5;
    }
    mesh.layers.set(1);

    scene.add(mesh);

    const geometry2 = new SphereBufferGeometry(500, 60, 40);
    const mesh2 = new Mesh(geometry2, material);

    geometry2.scale(-1, 1, 1);
    const uvs2 = geometry2.attributes.uv.array;
    for (let i = 0, il = uvs2.length; i < il; i += 2) {
      uvs2[i] = uvs2[i] * 0.5 + 0.5;
    }
    mesh2.layers.set(2);

    scene.add(mesh2);

    const renderer = new WebGLRenderer({
      antialias: true
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);

    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);

    function render() {
      renderer.render(scene, camera);
    }

    function animate() {
      requestAnimationFrame(animate);

      if (video.readyState >= video.HAVE_CURRENT_DATA) {
        texture.needsUpdate = true;
      }

      render();
    }

    const button = document.createElement('button');
    button.textContent = hasDevice ? 'ENTER VR' : 'FULLSCREEN';
    button.style.display = '';
    button.style.cursor = 'pointer';
    button.style.left = '30px';
    button.style.width = '150px';
    button.style.position = 'absolute';
    button.style.top = '30px';
    button.style.padding = '12px 6px';
    button.style.border = '1px solid #fff';
    button.style.borderRadius = '4px';
    button.style.background = 'rgba(0,0,0,0.1)';
    button.style.color = '#fff';
    button.style.font = 'normal 13px sans-serif';
    button.style.textAlign = 'center';
    button.style.opacity = '0.5';
    button.style.outline = 'none';
    button.style.zIndex = '999';
    container.appendChild(button);

    button.addEventListener('mouseenter', event => {
      button.style.opacity = '1.0';
    }, false);

    button.addEventListener('mouseleave', event => {
      button.style.opacity = '0.5';
    }, false);

    if (hasDevice) {
      const cameraCache = {
        position: camera.position.clone(),
        rotation: camera.rotation.clone()
      };

      button.addEventListener('click', event => {
        if (device.isPresenting) {
          device.exitPresent();
        } else {
          device.requestPresent([{source: renderer.domElement}]);
        };
      }, false);

      window.addEventListener('vrdisplaypresentchange', event => {
        if (device.isPresenting) {
          button.textContent = 'EXIT VR';
          renderer.vr.enabled = true;
          renderer.setAnimationLoop(render);
          controls.enabled = false;
          cameraCache.position.copy(camera.position);
          cameraCache.rotation.copy(camera.rotation);
        } else {
          button.textContent = 'ENTER VR';
          renderer.vr.enabled = false;
          renderer.setAnimationLoop(null);
          controls.enabled = true;
          camera.position.copy(cameraCache.position);
          camera.rotation.copy(cameraCache.rotation);
          render();
        }
      }, false);

      renderer.vr.setDevice(device);
    } else {
      let isFullscreen = false;
      button.addEventListener('click', event => {
        if (isFullscreen) {
          document.exitFullscreen()
        } else {
          renderer.domElement.requestFullscreen();
        }
      }, false);

      window.addEventListener('fullscreenchange', event => {
        if (document.fullscreenElement) {
          camera.aspect = screen.width / screen.height;
          camera.updateProjectionMatrix();
          renderer.setSize(screen.width, screen.height);
          render();
        } else {
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
          renderer.setSize(width, height);
          render();
        }
      }, false);
    }

    animate();
  }

  _getVRDevice() {
    if (!('getVRDisplays' in navigator)) {
      return Promise.resolve(null);
    }

    return new Promise((resolve, reject) => {
      navigator.getVRDisplays().then(devices => {
        if (devices && devices.length > 0) {
          resolve(devices[0]);
        } else {
          resolve(null);
        }
      });
    });
  }
}

customElements.define('video-360', Video360);
