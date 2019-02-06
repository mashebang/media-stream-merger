# media-stream-merger
## Overview
This lib aims to merge two or more MediaStream objects into one. It's useful if you want to play with some canvas effects over a media stream, or just get two inputs from different webcams and use as one;

## Instalation
```
npm install media-stream-merger
```
## Usage

```javascript
    const merger = new SimpleStreamMerger();
    navigator.mediaDevices.getUserMedia({ video: { aspectRatio: 16/9 }, audio: true })
      .then(stream => {
        merger.addStream(stream, {
          size: {
            width: _.first(stream.getVideoTracks()).getSettings().width,
            height: _.first(stream.getVideoTracks()).getSettings().height,
          },
          mute: false // this the audio tracks outputed by this stream will be added on the final stream
        });
      }).catch(e => console.log('error: ', e));

    const canvas = document.getElementById('canvas');
    const paintStream = canvas.captureStream();
    merger.addStream(paintStream, {
      size: { /* you can simply pass these values as numbers, it will be used as pixels inside canvas */
        width: _.first(paintStream.getVideoTracks()).getSettings().width,
        height: _.first(paintStream.getVideoTracks()).getSettings().height,
      },
      coordinates: { /* it will render the coordinates starting in x: 10px and y: 20px */
        x: 10,
        y: 20
      },
      mute: true
    });

    this.merger.start((stream) => {
      /* the start function receives a callback for retrieving the final MediaStream object */
      const mergedVideo = document.getElementById('merged');
      mergedVideo.srcObject = stream;
    });
    
    /* you can retrieve the canvas result by accessing the `result` value,
      but the callback way is more safe. */
    this.merger.result;
```

## API Reference

### merger.addStream(stream, options)
_Add a input MediaStream to the merged stack, with audio or not, based on options_

__stream__: a [MediaStream](https://developer.mozilla.org/en-US/docs/Web/API/MediaStream) object. It can be from a `navigator.mediaDevices.getUserMedia` or `canvas.captureStream` or whatever.

__options__: the options object should have the following pattern:
```javascript
{
  size: {
    width: 200,
    height: 200,
  },
  renderCoordinates: {
    x: 100,
    y: 100,
  },
  mute: true 
}
```

### merger.start(callback)
_Start merging the added MediaStreams. The callback receives one param, that is the result MediaStream_

```javascript
this.merger.start((stream) => {
  /* the start function receives a callback for retrieving the final MediaStream object */
  const mergedVideo = document.getElementById('merged');
  mergedVideo.srcObject = stream;
});
```


### merger.stopTracks()
_Stop all streams and media usage started by merger_

### merger.result
_The same value received on the start callback. The final merged MediaStream_
