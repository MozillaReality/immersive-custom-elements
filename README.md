# immersive-custom-elements

`immersive-custom-elements` is a set of web components. You can easily place immersive (VR) contents into your web page.

Demo(TBD) / Documentation(TBD)

![GitHub Logo](screenshots/img-360.gif)

## Custom element tags

- \<img-360\>
- \<video-360\>
- other new elements coming later

## Immersive mode

You can enter immersive mode by clicking "ENTER VR" button if you have a HMD.

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
