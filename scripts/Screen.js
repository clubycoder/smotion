var TakeView = require("TakeView");

function Screen(canvas, video) {
  this.canvas = canvas;
  this.ctx = this.canvas.getContext("2d");
  this.video = video;

  this.videoEnabled = false;

  this.playbackEnabled = false;
  this.frameNum = 0;
  this.playing = false;

  this.lastFrameTrans = 20;
  this.marksTrans = 80;

  this.startDrawing();
}

Screen.prototype.enableVideo = function() {
  this.videoEnabled = true;
};

Screen.prototype.disableVideo = function() {
  this.videoEnabled = false;
};

Screen.prototype.prevFrame = function() {
  if ((window.currentTake) && (currentTake.frames)) {
    this.frameNum--;
    if (this.frameNum < 0) {
      this.frameNum = (currentTake.frames.length - 1);
    }
  }
};

Screen.prototype.nextFrame = function(frameNum) {
  if ((window.currentTake) && (currentTake.frames)) {
    this.frameNum++;
    if (this.frameNum >= currentTake.frames.length) {
      this.frameNum = 0;
    }
  }
};

Screen.prototype.enablePlayback = function() {
  this.playbackEnabled = true;
};

Screen.prototype.disablePlayback = function() {
  this.playbackEnabled = false;
};

Screen.prototype.isPlaying = function() {
  return this.playing;
};

Screen.prototype.play = function() {
  this.playing = true;
};

Screen.prototype.pause = function() {
  this.playing = false;
};

Screen.prototype.setLastFrameTrans = function(trans) {
  this.lastFrameTrans = parseInt(trans);
};
Screen.prototype.getLastFrameTrans = function() {
  return this.lastFrameTrans;
};

Screen.prototype.setMarksTrans = function(trans) {
  this.marksTrans = parseInt(trans);
};
Screen.prototype.getMarksTrans = function() {
  return this.marksTrans;
};

Screen.prototype.draw = function() {
  this.ctx.save();
  this.ctx.setTransform(1, 0, 0, 1, 0, 0);
  this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  this.ctx.restore();
  if (this.playbackEnabled) {
    var frameImageObject = TakeView.getFrameImageObject(currentTake, this.frameNum);
    if (frameImageObject) {
      this.ctx.drawImage(frameImageObject, 0, 0, this.canvas.width, this.canvas.height);
    }
  } else {
    if (this.videoEnabled) {
      this.ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
    } else {
      var frameImageObject = TakeView.getFrameImageObject(currentTake, currentTake.currentFrame);
      if (frameImageObject) {
        this.ctx.drawImage(frameImageObject, 0, 0, this.canvas.width, this.canvas.height);
      }
    }
    if ((currentTake.currentFrame > 0) && (this.lastFrameTrans)) {
      var frameImageObject = TakeView.getFrameImageObject(currentTake, (currentTake.currentFrame - 1));
      if (frameImageObject) {
        this.ctx.save();
        this.ctx.globalAlpha = (this.lastFrameTrans / 100);
        this.ctx.drawImage(frameImageObject, 0, 0, this.canvas.width, this.canvas.height);
        this.ctx.restore();
      }
    }
  }
};

Screen.prototype.startDrawing = function() {
  var screen = this;
  function redraw() {
    if ((window.currentTake) && (currentTake.frames)) {
      if (screen.frameNum >= currentTake.frames.length) {
        screen.frameNum = 0;
      }
      screen.draw();
      if (screen.playing) {
        screen.frameNum++;
      }
    }

    var fps = 30;
    if ((window.currentTake) && (currentTake.fps)) {
      fps = currentTake.fps;
    }
    setTimeout(redraw, (1000 / fps));
  }
  redraw();
};

module.exports = Screen;
