import {
  EventDispatcher
} from 'three';
import {
  DeviceOrientationControls
} from 'three/examples/jsm/controls/DeviceOrientationControls';

class DeviceOrientationControlsWrapper extends EventDispatcher {
  constructor(camera) {
    super();

    this.controls = new DeviceOrientationControls(camera);
    this.prohibiting = false;

    const onChange = (event) => {
      if (!this.controls.enabled || this.prohibiting) return;
      this.controls.update();
      this.dispatchEvent({type: 'change'});

      // Ignoring the event in the same animation frame.
      // because this event is fired too often.
      this.prohibiting = true;
      requestAnimationFrame(() => { this.prohibiting = false; });
    };

    window.addEventListener('orientationchange', onChange, false);
    window.addEventListener('deviceorientation', onChange, false);
  }

  get enabled() {
    return this.controls.enabled;
  }

  set enabled(enabled) {
    this.controls.enabled = enabled;
  }
}

class DeviceOrientationHelper {
  static hasDeviceOrientation() {
    return new Promise((resolve) => {
      let detecting = true;

      const onOrientationChange = () => {
        if (detecting) {
          detecting = false;
          removeEventListeners();
          resolve(true);
        }
      };

      const onDeviceOrientation = (event) => {
        if (detecting) {
          detecting = false;
          removeEventListeners();
          resolve(event.alpha === null ? false : true);
        }
      };

      const removeEventListeners = () => {
        window.removeEventListener('orientationchange', onOrientationChange, false);
        window.removeEventListener('deviceorientation', onDeviceOrientation, false);
      };

      window.addEventListener('orientationchange', onOrientationChange, false);
      window.addEventListener('deviceorientation', onDeviceOrientation, false);

      // Determining device orientation isn't supported if
      // orientation event isn't called in 100ms.
      setTimeout(() => {
        if (detecting) {
          detecting = false;
          removeEventListeners();
          resolve(false);
        }
      }, 100);
    });
  }
}

export {
  DeviceOrientationControlsWrapper,
  DeviceOrientationHelper
};
