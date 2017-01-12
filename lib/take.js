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

var mkdirp = require("mkdirp");
var fs = require("fs");
var path = require('path');
var execSync = require('child_process').execSync;

function walkDirSync(dir, callback) {
	var files = fs.readdirSync(dir);
	files.forEach(function(file) {
		if (fs.statSync(path.join(dir, file)).isDirectory()) {
			walkDirSync(path.join(dir, file), callback);
		} else {
			callback(path.join(dir, file));
		}
	});
}

module.exports = {
	"getList": function(config) {
		var takes = [];
		walkDirSync(config.takesDir, function(filename) {
			if (path.basename(filename) == "take.json") {
				try {
					var take = JSON.parse(fs.readFileSync(filename, "utf8"));
					takes.push({"take": take});
				} catch (e) {
					console.log("Failed to load " + filename + "! ", e.toString());
					takes.push({"err": "Failed to load " + filename + "! " + e.toString()});
				}
			}
		});
		return takes;
	},
	"getTakeDir": function(take) {
		var takeDir = take.scene + "/" + take.take;
		return takeDir;
	},
	"newTake": function(config, take) {
		var takeDir = this.getTakeDir(take);
		var newTake = take;
		if (!fs.existsSync(config.takesDir + "/" + takeDir)) {
			newTake = this.saveTake(config, take);
		} else {
			throw "Scene and/or Take already exists!";
		}
		return newTake;
	},
	"saveTake": function(config, take) {
		var takeDir = this.getTakeDir(take);
		mkdirp.sync(config.takesDir + "/" + takeDir);
		var filename = config.takesDir + "/" + takeDir + "/take.json";
		fs.writeFileSync(filename, JSON.stringify(take, null, 2), "utf8");
		return take;
	},
	"getDefaultFrame": function() {
		return {
			"image": "/images/frame-default.png",
			"notes": ""
		};
	},
	"fixupFrames": function(config, take) {
		for (var i = 0; i < take.frames.length; i++) {
			var frame = take.frames[i];
			var filename = this.getFrameImageFilename(take, i);
			if ((frame.image.indexOf("frame-default.png") < 0) && (frame.image != filename)) {
				fs.renameSync(config.takesDir + "/" + frame.image, config.takesDir + "/" + filename);
				frame.image = filename;
			}
		}
	},
	"removeCurrentFrame": function(config, take) {
		if (take.currentFrame < take.frames.length) {
			var frame = take.frames[take.currentFrame];
			if ((frame.image.indexOf("frame-default.png") < 0) && (fs.existsSync(config.takesDir + "/" + frame.image))) {
				fs.unlinkSync(config.takesDir + "/" + frame.image);
			}
			take.frames.splice(take.currentFrame, 1);
			this.fixupFrames(config, take);
			this.saveTake(config, take);
		}
		return take;
	},
	"insertAtCurrentFrame": function(config, take) {
		take.frames.splice(take.currentFrame, 0, this.getDefaultFrame());
		this.fixupFrames(config, take);
		this.saveTake(config, take);
		return take;
	},
	"getFrameImageFilename": function(take, frameNum) {
		function pad(num, size) {
			var s = "000000000" + num;
			return s.substr(s.length - size);
		}

		var takeDir = this.getTakeDir(take);
		var imagesDir = takeDir + "/images";
		var filename = imagesDir + "/" + pad(frameNum, 8) + ".png";
		return filename;
	},
	"saveCurrentFrameImage": function(config, take, data) {
		function pad(num, size) {
			var s = "000000000" + num;
			return s.substr(s.length - size);
		}

		var takeDir = this.getTakeDir(take);
		var imagesDir = takeDir + "/images";
		mkdirp.sync(config.takesDir + "/" + imagesDir);
		var filename = this.getFrameImageFilename(take, take.currentFrame);
console.log("FILENAME: ", filename);
		if (data.indexOf("data:image/png;base64,") == 0) {
console.log("PNG: ", data.substr(22, 100));
			var buf = new Buffer(data.substr(22), "base64");
			fs.writeFileSync(config.takesDir + "/" + filename, buf);
			take.frames[take.currentFrame].image = filename;
		} else {
			throw "Unknown image type";
		}
		this.saveTake(config, take);
		return take;
	},
	"render": function(config, take) {
		var takeDir = this.getTakeDir(take);
		mkdirp.sync(config.takesDir + "/" + takeDir);
    var imagesDir = takeDir + "/images";
		var filename = takeDir + "/" + take.scene + " - " + take.take + ".mp4";
    if ((config.tools.ffmpeg) && (fs.existsSync(config.tools.ffmpeg))) {
      var cmd = config.tools.ffmpeg
        + ' -y'
        + ' -framerate ' + take.fps
        + ' -start_number 0'
        + ' -i "' + config.takesDir + "/" + imagesDir + '/%08d.png"'
        + ' -pix_fmt yuv420p'
        + ' "' + config.takesDir + "/" + filename + '"'
      ;
      execSync(cmd);
      take.video = filename;
    } else {
      throw "Can't find ffmpeg";
    }
		this.saveTake(config, take);
		return take;
	}
};
