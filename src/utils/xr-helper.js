let currentSession = null; // For WebXR

class XRHelper {
  static fullscreenEnabled(element) {
    if (element.fullscreenEnabled !== undefined) {
      return element.fullscreenEnabled;
    }
    if (element.webkitFullscreenEnabled !== undefined) {
      return element.webkitFullscreenEnabled;
    }
    if (element.mozFullScreenEnabled !== undefined) {
      return element.mozFullScreenEnabled;
    }
    if (element.msFullscreenEnabled !== undefined) {
      return element.msFullscreenEnabled
    }
    return false;
  }

  static fullscreenElement(element) {
    if (element.fullscreenElement !== undefined) {
      return element.fullscreenElement;
    }
    if (element.webkitFullscreenElement !== undefined) {
      return element.webkitFullscreenElement;
    }
    if (element.mozFullScreenElement !== undefined) {
      return element.mozFullScreenElement;
    }
    if (element.msFullscreenElement !== undefined) {
      return element.msFullscreenElement;
    }
    return null; // @TODO: throws here?
  }

  static requestFullscreen(element) {
    if (element.requestFullscreen !== undefined) {
      return element.requestFullscreen();
    }
    if (element.webkitRequestFullscreen !== undefined) {
      return element.webkitRequestFullscreen();
    }
    if (element.mozRequestFullScreen !== undefined) {
      return element.mozRequestFullScreen();
    }
    if (element.msRequestFullscreen !== undefined) {
      return element.msRequestFullscreen();
    }
    // @TODO: throws here?
  }

  static exitFullscreen(element) {
    if (element.exitFullscreen !== undefined) {
      return element.exitFullscreen();
    }
    if (element.webkitExitFullscreen !== undefined) {
      return element.webkitExitFullscreen();
    }
    if (element.mozCancelFullScreen !== undefined) {
      return element.mozCancelFullScreen();
    }
    if (element.msExitFullscreen !== undefined) {
      return element.msExitFullscreen();
    }
    // @TODO: throws here?
  }

  static updateButton(canvas, button) {
    const width = parseInt(canvas.style.width) || canvas.width;
    button.style.left = 'calc(' + ((width / 2) | 0) + 'px - 75px)';
  }

  static createButton(renderer, controls) {
    const canvas = renderer.domElement;

    const setupWebXRButton = button => {
      button.textContent = 'ENTER XR';  
      let currentSession = null;
      const onSessionStart = session => {
        renderer.vr.enabled = true;
        renderer.vr.setSession(session);
        controls.enabled = false;
        session.addEventListener('end', onSessionEnd);
        button.textContent = 'EXIT XR';
        currentSession = session;
      };
      const onSessionEnd = () => {
        renderer.vr.enabled = false;
        renderer.vr.setSession(null);
        controls.enabled = true;
        currentSession.removeEventListener('end', onSessionEnd);
        button.textContent = 'ENTER XR';
        currentSession = null;
      };
      button.addEventListener('click', event => {
        // @TODO: What if another event click triggers before
        //        request session promise resolves?
        if (currentSession === null) {
          navigator.xr.requestSession('immersive-vr', {optionalFeatures: ['local-floor']}).then(onSessionStart);
        } else {
          currentSession.end();
        }
      });
    };

    const setupWebVRButton = (button, device) => {
      button.textContent = 'ENTER VR';
      const onSessionStart = () => {
        renderer.vr.enabled = true;
        controls.enabled = false;
        button.textContent = 'EXIT VR';
      };
      const onSessionEnd = () => {
        renderer.vr.enabled = false;
        controls.enabled = true;
        button.textContent = 'ENTER VR';
      };
      button.addEventListener('click', event => {
        if (device.isPresenting) {
          device.exitPresent();
        } else {
          device.requestPresent([{source: canvas}]);
        };
      }, false);
      renderer.vr.addEventListener('sessionstart', onSessionStart);
      renderer.vr.addEventListener('sessionend', onSessionEnd);
      renderer.vr.setDevice(device);
    };

    const setupFullscreenButton = button => {
      // If fullscreen isn't supported, give up showing the button.
      if (!XRHelper.fullscreenEnabled(document)) {
        button.style.display = 'none';
        return;
      }
      button.textContent = 'FULLSCREEN';
      button.addEventListener('click', event => {
        if (XRHelper.fullscreenElement(document) === null) {
          XRHelper.requestFullscreen(canvas);
        } else {
          XRHelper.exitFullscreen(document);
        }
      }, false);
    };

    // Assumes canvas.style.width has 'zzzpx'
    const width = parseInt(canvas.style.width) || canvas.width;

    const button = document.createElement('button');
    button.style.cursor = 'pointer';
    button.style.left = 'calc(' + ((width / 2) | 0) + 'px - 75px)';
    button.style.width = '150px';
    button.style.position = 'absolute';
    button.style.bottom = '15px';
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

    button.addEventListener('mouseenter', event => {
      button.style.opacity = '1.0';
    }, false);

    button.addEventListener('mouseleave', event => {
      button.style.opacity = '0.5';
    }, false);

    // Check WebXR compatibility with the same way as Three.js does
    if ('xr' in navigator && 'isSessionSupported' in navigator.xr) {
      // WebXR API
      navigator.xr.isSessionSupported('immersive-vr').then(supported => {
        if (supported) {
          setupWebXRButton(button);
        } else {
          setupFullscreenButton(button);
        }
      });
    } else if ('getVRDisplays' in navigator) {
      // WebVR API
      navigator.getVRDisplays().then(devices => {
        if (devices && devices.length > 0) {
          setupWebVRButton(button, devices[0]);
        } else {
          setupFullscreenButton(button);
        }
      });
    } else {
      setupFullscreenButton(button);
    }

    return button;
  }
}

export {XRHelper};
