"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var SimpleStreamMerger = function SimpleStreamMerger(_options) {
  var _this = this;

  _classCallCheck(this, SimpleStreamMerger);

  _defineProperty(this, "addStream", function (stream, options) {
    var streamId = stream.id;
    var video = document.createElement('video');
    video.setAttribute('autoplay', true);
    video.setAttribute('muted', true);
    video.srcObject = stream;
    var size = options.size,
        _options$size = options.size,
        width = _options$size.width,
        height = _options$size.height,
        renderCoordinates = options.renderCoordinates,
        _options$mute = options.mute,
        mute = _options$mute === void 0 ? false : _options$mute;

    if (width > _this.canvas.width || height > _this.canvas.height) {
      _this.canvas.height = height;
      _this.canvas.width = width;
    }

    _this.streams.push({
      video: video,
      size: size,
      renderCoordinates: renderCoordinates
    });

    if (!mute) {
      stream.getAudioTracks().forEach(function (track) {
        return _this.audioTracks.push(track);
      });
    }
  });

  _defineProperty(this, "normalizeRenderCoordinates", function (coordinates, videoSize) {
    var _videoSize$width = videoSize.width,
        width = _videoSize$width === void 0 ? _this.canvas.width : _videoSize$width,
        _videoSize$height = videoSize.height,
        height = _videoSize$height === void 0 ? _this.canvas.height : _videoSize$height;
    var renderCoordinates = {
      startX: 0,
      startY: 0
    }; // centralize videos

    if (!coordinates) {
      if (_this.canvas.width >= width) {
        renderCoordinates.startX = (_this.canvas.width - width) / 2;
      }

      if (_this.canvas.height >= height) {
        renderCoordinates.startY = (_this.canvas.height - height) / 2;
      }

      return renderCoordinates;
    }

    if (coordinates) {
      return {
        startX: coordinates.x,
        startY: coordinates.y
      };
    }
  });

  _defineProperty(this, "injectAudioToStream", function (stream) {
    _this.audioTracks.forEach(function (track) {
      stream.addTrack(track);
    });

    _this.result = stream;
  });

  _defineProperty(this, "clearCanvas", function () {
    _this.context.clearRect(0, 0, _this.canvas.width, _this.canvas.height);

    _this.counter = 0;
  });

  _defineProperty(this, "draw", function () {
    if (!(_this.streams.length > 1)) {
      _this.callback(_this.streams[0].srcObject);

      return;
    }

    if (_this.cleanerCounter > 200) {
      _this.clearCanvas();
    }

    _this.streams.forEach(function (stream) {
      var video = stream.video,
          size = stream.size,
          _stream$size = stream.size,
          width = _stream$size.width,
          height = _stream$size.height,
          renderCoordinates = stream.renderCoordinates;

      var _this$normalizeRender = _this.normalizeRenderCoordinates(renderCoordinates, size),
          startX = _this$normalizeRender.startX,
          startY = _this$normalizeRender.startY;

      _this.context.drawImage(video, startX, startY, width, height);
    });

    if (_this.firstCall) {
      _this.firstCall = false;

      _this.injectAudioToStream(_this.canvas.captureStream());

      if (_this.callback) {
        _this.callback(_this.result);
      }
    }

    _this.cleanerCounter++;
    requestAnimationFrame(_this.draw);
  });

  _defineProperty(this, "start", function (callback) {
    _this.callback = callback;

    _this.draw();
  });

  _defineProperty(this, "stopStreams", function () {
    _this.streams.forEach(function (stream) {
      return stream.video.srcObject.getTracks().forEach(function (track) {
        return track.stop();
      });
    });

    _this.audioTracks.forEach(function (track) {
      return track.stop();
    });
  });

  this.canvas = document.createElement('canvas');
  this.context = this.canvas.getContext('2d');
  this.streams = [];
  this.audioTracks = [];
  this.cleanerCounter = 0;
  this.firstCall = true;
  this.result = null;
};

var _default = SimpleStreamMerger;
exports.default = _default;