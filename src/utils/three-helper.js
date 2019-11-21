import {
  BackSide,
  ClampToEdgeWrapping,
  LinearFilter,
  Mesh,
  MeshBasicMaterial,
  NearestFilter,
  RingBufferGeometry,
  SphereBufferGeometry,
  Texture,
  TextureLoader
} from 'three';

class THREEHelper {
  static createSphereMeshFor360(texture) {
    return new Mesh(
      new SphereBufferGeometry(500, 60, 40),
      new MeshBasicMaterial({
        map: texture,
        side: BackSide
      })
    );
  }

  static load360ImageTexture(url) {
    return new Promise((resolve, reject) => {
      const texture = new TextureLoader().load(url, texture => {
        texture.wrapS = ClampToEdgeWrapping;
        texture.wrapT = ClampToEdgeWrapping;
        texture.minFilter = LinearFilter;
        resolve(texture);
      }, undefined, reject);
    });
  }

  static create360VideoTexture(video) {
    const texture = new Texture(video);
    texture.generateMipmaps = false;
    texture.wrapS = ClampToEdgeWrapping;
    texture.wrapT = ClampToEdgeWrapping;
    texture.minFilter = NearestFilter;
    texture.maxFilter = NearestFilter;
    return texture;
  }

  static create360ImageMesh(url) {
    return new Promise((resolve, reject) => {
      this.load360ImageTexture(url).then(texture => {
        resolve(this.createSphereMeshFor360(texture));
      })
    });
  }

  static create360VideoMesh(video) {
    return this.createSphereMeshFor360(this.create360VideoTexture(video));
  }

  static createCrosshairMesh() {
    return new Mesh(
      new RingBufferGeometry(0.02, 0.04, 32),
      new MeshBasicMaterial( {
        color: 0xffffff,
        opacity: 0.5,
        transparent: true
      })
    );
  }
}

export {THREEHelper};
