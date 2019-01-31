class SimpleStreamMerger {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');
    this.streams = [];
    this.width = this.canvas.width;
    this.height = this.canvas.height;
  }

  addStream = (stream) => {
    const streamId = stream.id;
    const video = document.createElement('video');
    video.autoplay = true;
    video.srcObject = stream;
    this.streams.push(video);
  }

  draw = () => {
    this.context.clearRect(0, 0, this.width, this.height);
    this.streams.forEach(str => {
      this.context.drawImage(str, 0, 0, this.width, this.height);
    });

    this.result = this.canvas.captureStream();
    requestAnimationFrame(this.draw);
  }

  start = () => {
    this.draw();
  }
}

export default SimpleStreamMerger;
