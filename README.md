# immersive-custom-elements

`immersive-custom-elements` is a set of web components. You can easily place immersive (VR) contents into your web page by just putting custom element tags.

[Demo](https://raw.githack.com/MozillaReality/immersive-custom-elements/master/examples/index.html)(TBD)

## Motivation

WebGL and WebXR(VR) have been introduced but creating immersive contents requires the knowledge of 3D graphics.
Some tools have appeared to resolve that problem but most of them are very rich and content creators take time to learn.

I think there are a lot of simple use cases where they want very simple interactions and they don't have the knowledge or time to create and maintain a custom application built on top of WebXR frameworks.

`immersive-custom-elements` provides a standard way to create HTML elements for simple functionality that matches expectations of content creators without knowledge of 3D, WebXR or even javascript.

## Usage

### Sample code

```html
<html>
  <head>
    <script src="./build/immersive-custom-elements.js"></script>
  </head>
  <body>
    <img-360 src="./image.jpg" width="640" height="480"></img-360>
  </body>
</html>
```

## Custom element tags

- \<img-360\>
- \<video-360\>
- \<img360-tour\>
- other new elements coming later

### \<img-360\>

```javascript
<img-360 src="imagefile.jpg" width="640" height="480"></img-360>
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

### \<img360-tour\>

```javascript
<img360-tour width="640" height="480">
  <img360 src="imagefile1.jpg"></img360>
  <img360 src="imagefile2.jpg"></img360>
  <img360 src="imagefile3.jpg"></img360>
</img360-tour>
```

\<img360-tour\>

| attribute | type | description |
| ---- | ---- | ---- |
| width | number | element width |
| height | number | element height |

\<img360\>

| attribute | type | description |
| ---- | ---- | ---- |
| src | strings | Path to image file |

![GitHub Logo](screenshots/image360-tour.gif)

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

### How to locally run

```sh
$ npm run start
# local server boots up. Access http://localhost:8080/examples/index.html on your browser.
```

## Similar projects

- [model-viewer](https://github.com/GoogleWebComponents/model-viewer)
- [A-Frame](https://aframe.io/)

## License

Mozilla Public License Version 2.0
