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

var path       = require("path");
var express    = require("express");
var bodyParser = require('body-parser');
var handlebars = require('express-handlebars');

var package = require("./package.json");
var config = require("./config/config.json");
var Take = require("./lib/Take.js");

// HTTP Server
var httpServer = express();
httpServer.use(bodyParser.json({limit: "100mb"}));
httpServer.engine("handlebars", handlebars({
  "defaultLayout": "main",
  "helpers": {
    "toJSON": function(o) {
      return JSON.stringify(o, null, 2);
    }
  }
}));
httpServer.set("view engine", "handlebars");

httpServer.use("/styles", express.static(path.join(__dirname, "styles")));
httpServer.use("/images", express.static(path.join(__dirname, "images")));
httpServer.use("/scripts", express.static(path.join(__dirname, "scripts")));
httpServer.use(["/favicon*", "/apple-touch-icon-*", "/mstile-*"], function (req, res) {
  res.sendFile(path.join(__dirname, "images/favicon" + req.originalUrl));
});

httpServer.get("/", function(req, res) {
  var data = {
    "title": package.description
  };
  res.render("home", data);
});

httpServer.use("/takes", express.static(config.takesDir));

httpServer.get("/take/list", function(req, res) {
	res.send(Take.getList(config));
});

httpServer.put("/take", function(req, res) {
	var take = req.body.take;
	var takeToCopy = req.body.takeToCopy;
	console.log("IN: ", JSON.stringify(take, null, 2));
  if (takeToCopy) {
	   console.log("COPY: ", JSON.stringify(takeToCopy, null, 2));
  }
	try {
		var newTake = Take.newTake(config, take, takeToCopy);
		console.log("OUT: ", JSON.stringify(newTake, null, 2));
		res.send({"take": newTake});
	} catch (e) {
		console.log("ERR: ", e.toString());
		res.send({"err": e.toString()});
	}
});

httpServer.delete("/take/frame", function(req, res) {
	var take = req.body.take;
	console.log("IN: ", JSON.stringify(take, null, 2));
	try {
		var newTake = Take.removeCurrentFrame(config, take);
		console.log("OUT: ", JSON.stringify(newTake, null, 2));
		res.send({"take": newTake});
	} catch (e) {
		console.log("ERR: ", e.toString());
		res.send({"err": e.toString()});
	}
});

httpServer.put("/take/frame", function(req, res) {
	var take = req.body.take;
	console.log("IN: ", JSON.stringify(take, null, 2));
	try {
		var newTake = Take.insertAtCurrentFrame(config, take);
		console.log("OUT: ", JSON.stringify(newTake, null, 2));
		res.send({"take": newTake});
	} catch (e) {
		console.log("ERR: ", e.toString());
		res.send({"err": e.toString()});
	}
});

httpServer.post("/take/frame/image", function(req, res) {
	var take = req.body.take;
	var data = req.body.data;
	console.log("IN: ", JSON.stringify(take, null, 2));
	console.log(data.substr(0,100));
	try {
		var newTake = Take.saveCurrentFrameImage(config, take, data);
		console.log("OUT: ", JSON.stringify(newTake, null, 2));
		res.send({"take": newTake});
	} catch (e) {
		console.log("ERR: ", e.toString());
		res.send({"err": e.toString()});
	}
});

httpServer.post("/take/render", function(req, res) {
	var take = req.body.take;
	console.log("IN: ", JSON.stringify(take, null, 2));
	try {
		var newTake = Take.render(config, take);
		console.log("OUT: ", JSON.stringify(newTake, null, 2));
		res.send({"take": newTake});
	} catch (e) {
		console.log("ERR: ", e.toString());
		res.send({"err": e.toString()});
	}
});

httpServer.listen(config.port);

console.log(`${package.description} listening on ${config.port}`);
console.log("CONFIG: ", JSON.stringify(config, null, 2));
