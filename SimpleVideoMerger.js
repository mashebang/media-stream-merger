class SimpleStreamMerger {
  constructor(options) {
    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');
    this.streams = [];
    this.counter = 0;
    this.firstCall = true;
  }

  addStream = (stream, options) => {
    const streamId = stream.id;
    const video = document.createElement('video');
    video.autoplay = true;
    video.srcObject = stream;
    const { size, size: { width, height }, renderCoordinates } = options;
    if (width > this.canvas.width || height > this.canvas.height) {
      this.canvas.height = height;
      this.canvas.width = width;
    }
    this.streams.push({ video, size, renderCoordinates});
  }

  normalizeRenderCoordinates = (coordinates, videoSize) => {
    const { width, height } = videoSize;
    const renderCoordinates = {};
    if (!coordinates) {
      if (this.canvas.width > width) {
        renderCoordinates.startX = (this.canvas.width - width)/2;
      }

      if (this.canvas.height > height) {
        renderCoordinates.startY = (this.canvas.height - height)/2;
      }

      return renderCoordinates;
    }

    if (coordinates) {
      return coordinates;
    }
  }

  draw = () => {
    if (!(this.streams.length > 1)) {
      this.callback(this.streams[0].srcObject);
      return;
    }

    if (this.counter > 200) {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.counter = 0;
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
      this.context.drawImage(video, 0, 0, width, height);
    });

    if (this.firstCall) {
      this.firstCall = false;
      this.callback(this.canvas.captureStream());
    }

    this.counter++;
    requestAnimationFrame(this.draw);
  }

  start = (callback) => {
    this.callback = callback;
    this.draw();
  }
}
