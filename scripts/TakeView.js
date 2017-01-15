/*
 * SMotion - Stop Motion Animation in a Web Browser
 * Copyright (C) 2017 Chris Luby <clubycoder@gmail.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
"use strict";

const Take = require("Take");

module.exports = {
  "getFrameImageURL": function(take, frame) {
    let imageURL = frame.image;
    if (imageURL.indexOf("frame-default.png") < 0) {
      imageURL = "/takes/" + take.dir + "/" + imageURL + "?rnd=" + Math.random();
    }
    return imageURL;
  },
  "getFrameImageObject": function(take, frameNum) {
    const imageObjectSelector = $("#take-frame-" + frameNum);
    let imageObject = undefined;
    if (imageObjectSelector) {
      imageObject = imageObjectSelector[0];
    } else if ((take.frames) && (take.frames.length > frameNum)) {
      imageObject = new Image();
      imageObject.src = this.getFrameImageURL(take, take.frames[frameNum]);
    }
    return imageObject;
  },
  "buildTimeLabel": function(time) {
    function pad(num, size) {
      const s = "000000000" + num;
      return s.substr(s.length - size);
    }
    const min = Math.floor(time / (60 * 1000));
    const timeSec = (time - (min * 60 * 1000));
    const sec = Math.floor(timeSec / 1000);
    const mil = Math.floor(timeSec - (sec * 1000));
    const timeLabel = pad(min, 2) + ":" + pad(sec, 2) + "." + pad(mil, 4);
    return timeLabel;
  },
  "drawFrames": function(take, timelineRow, imagesRow, notesRow, onClick, noteOnChange) {
    const timeStep = (1000 / take.fps);
    let time = 0;
    let timelineCell = timelineRow.firstChild;
    let imageCell = imagesRow.firstChild;
    let noteCell = notesRow.firstChild;
    for (let frameNum = 0; frameNum <= take.frames.length; frameNum++) {
      let frame = null;
      if (frameNum < take.frames.length) {
        frame = take.frames[frameNum];
      } else {
        frame = Take.getDefaultFrame();
      }

      const timeLabel = this.buildTimeLabel(time);

      if (!timelineCell) {
        timelineCell = document.createElement("TD");
        timelineCell.align = "center";
        timelineCell.style.cursor = "pointer";
        timelineCell.onclick = function() {
          onClick(frameNum);
        }
        timelineRow.appendChild(timelineCell);
      }
      if (frameNum == take.currentFrame) {
        timelineCell.style.backgroundColor = "#999999";
      } else {
        timelineCell.style.backgroundColor = "";
      }
      timelineCell.innerHTML = timeLabel;
      timelineCell = timelineCell.nextSibling;

      if (!imageCell) {
        imageCell = document.createElement("TD");
        imageCell.align = "center";
        imageCell.style.cursor = "pointer";
        imageCell.onclick = function() {
          onClick(frameNum);
        };
        imagesRow.appendChild(imageCell);
      }
      if (frameNum == take.currentFrame) {
        imageCell.style.backgroundColor = "#999999";
      } else {
        imageCell.style.backgroundColor = "";
      }
      imageCell.innerHTML = ""
        + "<img id=\"take-frame-" + frameNum + "\" src=\"" + this.getFrameImageURL(take, frame) + "\" width=\"160\" height=\"90\" />"
      ;
      imageCell = imageCell.nextSibling;

      if (!noteCell) {
        noteCell = document.createElement("TD");
        noteCell.align = "left";
        notesRow.appendChild(noteCell);
      }
      while (noteCell.firstChild) {
        noteCell.removeChild(noteCell.firstChild);
      }
      let note = document.createElement("textarea");
      note.value = frame.note;
      note.onchange = function() {
        noteOnChange(frameNum, this.value);
      }
      noteCell.appendChild(note);
      noteCell = noteCell.nextSibling;

      time += timeStep;
    }
    while (timelineCell) {
      let nextCell = timelineCell.nextSibling;
      timelineRow.removeChild(timelineCell);
      timelineCell = nextCell;
    }
    while (imageCell) {
      let nextCell = imageCell.nextSibling;
      imagesRow.removeChild(imageCell);
      imageCell = nextCell;
    }
    while (noteCell) {
      let nextCell = noteCell.nextSibling;
      notesRow.removeChild(noteCell);
      noteCell = nextCell;
    }
  },
  "getVideoURL": function(take) {
    const videoURL = "/takes/" + take.dir + "/" + take.video + "?rnd=" + Math.random();
    return videoURL;
  },
};
