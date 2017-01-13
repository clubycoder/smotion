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

var API = require("API");

module.exports = {
  "getEmptyTake": function(scene, takeName, resolution, fps) {
    return {
      "scene": (scene ? scene : ""),
      "take": (takeName ? takeName : ""),
      "resolution": (resolution ? resolution : "720p"),
      "fps": (fps ? fps : 24),
      "currentFrame": 0,
      "frames": []
    };
  },
  "newTake": function(scene, takeName, resolution, fps, takeToCopy, onNewTake, onError) {
    var take = this.getEmptyTake(scene, takeName, resolution, fps);
    API.call("/take", "put", {
      "take": take,
      "takeToCopy": (takeToCopy ? takeToCopy : undefined)
    }, onNewTake, onError);
  },
  "saveTake": function(take, onUpdate, onError) {
    API.call("/take", "post", {
      "take": take
    }, onUpdate, onError);
  },
  "deleteTake": function(take, onDelete, onError) {
    API.call("/take", "delete", {
      "take": take
    }, onDelete, onError);
  },
  "getDefaultFrame": function() {
    return {
      "image": "/images/frame-default.png",
      "notes": ""
    }
  },
  "removeCurrentFrame": function(take, onUpdate, onError) {
    API.call("/take/frame", "delete", {
      "take": take
    }, onUpdate, onError);
  },
  "insertAtCurrentFrame": function(take, onUpdate, onError) {
    API.call("/take/frame", "put", {
      "take": take
    }, onUpdate, onError);
  },
  "saveCurrentFrameImage": function(take, data, onUpdate, onError) {
    if (take.currentFrame >= take.frames.length) {
      take.frames.push(this.getDefaultFrame());
    }
    API.call("/take/frame/image", "post", {
      "take": take,
      "data": data
    }, onUpdate, onError);
  },
  "render": function(take, onUpdate, onError) {
    API.call("/take/render", "post", {
      "take": take
    }, onUpdate, onError);
  }
};
