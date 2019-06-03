# immersive-custom-elements

`immersive-custom-elements` is a set of web components. You can easily place immersive (VR) contents into your web page by just putting custom element tags.

Demo(TBD) / Documentation(TBD)

## Usage

### Sample code

```html
<html>
  <head>
    <script src="./build/immersive-custom-elements.js"></script>
  </head>
  <body>
    <img-360 src="./image.jpg" width="640" height="480" />
  </body>
</html>
```

## Custom element tags

- \<img-360\>
- \<video-360\>
- other new elements coming later

### \<img-360\>

```javascript
<img-360 src="imagefile.jpg" width="640" height="480" />
```

| attribute | type | description |
| ---- | ---- | ---- |
| src | strings | Path to image file |
| width | number | element width |
| height | number | element height |

![GitHub Logo](screenshots/img-360.gif)

### \<video-360\>

```javascript
<video-360 src="video.mp4" width="640" height="480"></video>
```

| attribute | type | description |
| ---- | ---- | ---- |
| src | strings | Path to video file |
| width | number | element width |
| height | number | element height |

![GitHub Logo](screenshots/video-360.gif)

## Immersive mode

You can enter immersive mode by clicking "ENTER VR" button if you have a HMD.

## How to take 360 picture/video

- [RICOH THETA](https://theta360.com/)

## Development

### How to build

```sh
$ git clone https://github.com/MozillaReality/immersive-custom-elements.git
$ cd immersive-custom-elements
$ npm install
$ npm run build
```

## Similar projects

- [model-viewer](https://github.com/GoogleWebComponents/model-viewer)

## License

Mozilla Public License Version 2.0
