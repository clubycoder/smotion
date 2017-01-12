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

module.exports = {
  "cameras": null,
  "getCameras": function(callback) {
    if (this.cameras) {
      callback(this.cameras);
      return;
    }

    function gotDevices(deviceInfos) {
      var cameras = [];
      for (var i = 0; i < deviceInfos.length; i++) {
        var deviceInfo = deviceInfos[i];
        var option = document.createElement("option");
        option.value = deviceInfo.deviceId;
        if (deviceInfo.kind === "videoinput") {
          var cameraInfo = {
            "id": deviceInfo.deviceId,
            "name": deviceInfo.label || "Camera " + (cameras.length + 1),
            "constraints": {
              "video": {"deviceId": deviceInfo.deviceId ? {"exact": deviceInfo.deviceId} : undefined}
            }
          };
          cameraInfoAuto = JSON.parse(JSON.stringify(cameraInfo));
          cameraInfoAuto.id = cameraInfoAuto.id + "-Auto";
          cameraInfoAuto.name = cameraInfoAuto.name + " - Auto";
          cameras.push(cameraInfoAuto);
          cameraInfo720 = JSON.parse(JSON.stringify(cameraInfo));
          cameraInfo720.id = cameraInfo720.id + "-720";
          cameraInfo720.name = cameraInfo720.name + " - 720p";
          cameraInfo720.constraints.video.width = {"exact": 1280};
          cameraInfo720.constraints.video.height = {"exact": 720};
          cameras.push(cameraInfo720);
          cameraInfo1080 = JSON.parse(JSON.stringify(cameraInfo));
          cameraInfo1080.id = cameraInfo1080.id + "-1080";
          cameraInfo1080.name = cameraInfo1080.name + " - 1080p";
          cameraInfo1080.constraints.video.width = {"exact": 1920};
          cameraInfo1080.constraints.video.height = {"exact": 1080};
          cameras.push(cameraInfo1080);
        }
      }
      this.cameras = cameras;
      callback(this.cameras);
    }

    navigator.mediaDevices.enumerateDevices()
      .then(gotDevices)
      .catch(function(err){alert("You need to allow access to your cameras - " + err);});
  },
  "setCameraVideo": function(cameraId, video) {
    function gotStream(stream) {
      video.srcObject = stream;
    }

    this.getCameras(function(cameras) {
      var constraints = null;
      for (var i = 0; i < cameras.length; i++) {
        var cameraInfo = cameras[i];
        if (cameraInfo.id == cameraId) {
          constraints = cameraInfo.constraints;
        }
      }
      if (constraints) {
        navigator.mediaDevices.getUserMedia(constraints)
          .then(gotStream)
          .catch(function(err){alert("Failed to attach to camera - " + err);});
      } else {
        gotStream(undefined);
      }
    });
  },
  "captureFrame": function(video, resolution) {
    var canvas = document.createElement("canvas");
    var width = 1920;
    var height = 1080;
    if (resolution == "360p") {
      width = 640;
      height = 360;
    } else if (resolution == "720p") {
      width = 1280;
      height = 720;
    }
    canvas.width = width;
    canvas.height = height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    var data = canvas.toDataURL();
    return data;
  }
};
