class MediaStreamMerger {
  constructor(options) {
    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');
    this.streams = [];
    this.audioTracks = [];
    this.cleanerCounter = 0;
    this.firstCall = true;
    this.result = null;
  }

  addStream = (stream, options) => {
    const streamId = stream.id;
    const video = document.createElement('video');
    video.setAttribute('autoplay', true);
    video.setAttribute('muted', true);
    video.srcObject = stream;
    const {
      size, size: { width, height },
      renderCoordinates, mute = false
    } = options;

    if (width > this.canvas.width || height > this.canvas.height) {
      this.canvas.height = height;
      this.canvas.width = width;
    }

    this.streams.push({ video, size, renderCoordinates });

    if (!mute) {
      stream.getAudioTracks().forEach(track => this.audioTracks.push(track));
    }
  }

  normalizeRenderCoordinates = (coordinates, videoSize) => {
    const {
      width = this.canvas.width,
      height = this.canvas.height
    } = videoSize;
    const renderCoordinates = { startX: 0, startY: 0 };

    // centralize videos
    if (!coordinates) {
      if (this.canvas.width >= width) {
        renderCoordinates.startX = (this.canvas.width - width) / 2;
      }

      if (this.canvas.height >= height) {
        renderCoordinates.startY = (this.canvas.height - height) / 2;
      }

      return renderCoordinates;
    }

    if (coordinates) {
      return { startX: coordinates.x, startY: coordinates.y };
    }
  }

  injectAudioToStream = (stream) => {
    this.audioTracks.forEach(track => {
      stream.addTrack(track);
    });

    this.result = stream;
  }

  clearCanvas = () => {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.counter = 0;
  }

  draw = () => {
    if (!(this.streams.length > 1)) {
      this.callback(this.streams[0].srcObject);
      return;
    }

    if (this.cleanerCounter > 200) {
      this.clearCanvas();
    }

    this.streams.forEach(stream => {
      const {
        video, size,
        size: { width, height },
        renderCoordinates
      } = stream;
      const {
        startX, startY
      } = this.normalizeRenderCoordinates(renderCoordinates, size);

      this.context.drawImage(video, startX, startY, width, height);
    });

    if (this.firstCall) {
      this.firstCall = false;
      this.injectAudioToStream(this.canvas.captureStream());

      if (this.callback) {
        this.callback(this.result);
      }
    }

    this.cleanerCounter++;
    requestAnimationFrame(this.draw);
  }

  start = (callback) => {
    this.callback = callback;
    this.draw();
  }

  stopStreams = () => {
    this.streams.forEach(stream =>
      stream.video.srcObject.getTracks().forEach(track => track.stop())
    );
    this.audioTracks.forEach(track => track.stop());
  }
}

export default MediaStreamMerger;
