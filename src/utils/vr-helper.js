class VRHelper {
  static createButton(canvas, device) {
    // Assumes canvas.style.width has 'zzzpx'
    const width = parseInt(canvas.style.width) || canvas.width;
    const hasDevice = device !== null;

    const button = document.createElement('button');
    button.textContent = hasDevice ? 'ENTER VR' : 'FULLSCREEN';
    button.style.display = hasDevice || VRHelper.fullscreenEnabled(document) ? '' : 'none';
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

    if (hasDevice) {
      button.addEventListener('click', event => {
        if (device.isPresenting) {
          device.exitPresent();
        } else {
          device.requestPresent([{source: canvas}]);
        };
      }, false);

      window.addEventListener('vrdisplaypresentchange', event => {
        if (device.isPresenting) {
          button.textContent = 'EXIT VR';
        } else {
          button.textContent = 'ENTER VR';
        }
      }, false);
    } else {
      // If no device, enters fullscreen instead.
      button.addEventListener('click', event => {
        if (VRHelper.fullscreenElement(document) === null) {
          VRHelper.requestFullscreen(canvas);
        } else {
          VRHelper.exitFullscreen(document);
        }
      }, false);
    }

    return button;
  }

  static fullscreenEnabled(element) {
    if (element.fullscreenEnabled !== undefined) {
      return element.fullscreenEnabled;
    }
    if (element.webkitFullscreenEnabld !== undefined) {
      return element.webkitFullscreenEnabled;
    }
    if (element.mozFullScreenEnabled !== undefined) {
      return element.moxFullScreenEnabled;
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

  static getVRDevice() {
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

export {VRHelper};
