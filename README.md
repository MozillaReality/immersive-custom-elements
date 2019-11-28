# Immersive Custom Elements

`immersive-custom-elements` is a set of web components to embed immersive (VR & AR) content into 
your web page by using custom element tags. It currently includes components for

* 360 images
* 360 video
<!-- * 360 image tours -->


[Demo](https://mixedreality.mozilla.org/immersive-custom-elements/examples/index.html) / 
[Blog post](https://blog.mozvr.com/custom-elements-for-the-immersive-web/)

## Usage

### Sample code

Add the link to `immersive-custom-elements.js` with `<script>` tag. You can download the file from this repository or use the link to the CDN.

```html
<html>
  <head>
    <script src="https://rawcdn.githack.com/MozillaReality/immersive-custom-elements/v0.2.0/build/immersive-custom-elements.js"></script>
  </head>
  <body>
    <img-360 src="360-landscape.jpg" width="640" height="360"></img-360>
  </body>
</html>
```

## Custom element tags

- [\<img-360\>](#img-360)
- [\<video-360\>](#video-360)

### \<img-360\>

Displays an interactive 360 degree photo.

```javascript
<img-360 src="imagefile.jpg" width="640" height="360"></img-360>
```

| attribute | type | required | description |
| ---- | ---- | ---- | ---- |
| src | strings | yes | Path to image file |
| width | number | yes | element width |
| height | number | yes | element height |

![GitHub Logo](screenshots/img-360.gif)

### \<video-360\>

Plays an interactive 360 degree video. Click video to start playing.

```javascript
<video-360 src="video.mp4" width="640" height="360" loop></video>
```

| attribute | type | required | description |
| ---- | ---- | ---- | ---- |
| src | strings | yes | Path to video file |
| width | number | yes | element width |
| height | number | yes | element height |
| loop | - | no | video loops if defined |
| muted | - | no | the audio output of the video is muted if defined |
| autoplay | - | no | video automatically starts playing if defined |

![GitHub Logo](screenshots/video-360.gif)

## Immersive (VR) mode

You can enter immersive mode by clicking "ENTER VR" button if you have a VR headset.

![GitHub Logo](screenshots/immersive.gif)

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

## License

Mozilla Public License Version 2.0
