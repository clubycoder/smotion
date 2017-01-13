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

var Takes = require("Takes");
var TakeView = require("TakeView");

module.exports = {
  "drawTakes": function(takes, list) {
    while (list.firstChild) {
      list.removeChild(list.firstChild);
    }
    for (var i = 0; i < takes.length; i++) {
      var li = document.createElement("LI");
      if (takes[i].err) {
        li.innerHTML = takes[i].err;
      } else {
        var take = takes[i].take;
        var length = "No frames";
        var firstFrame = "";
        var middleFrame = "";
        var lastFrame = "";
        if ((take.frames) && (take.frames.length > 0)) {
          var time = ((1000 / take.fps) * take.frames.length);
          length = TakeView.buildTimeLabel(time) + " / " + take.frames.length + " frames";
          if (take.frames[0].image) {
            firstFrame = "<img src=\"" + TakeView.getFrameImageURL(take, take.frames[0]) + "\" width=\"160\" height=\"90\" />";
          }
          var middleFrameNum = Math.ceil(take.frames.length / 2);
          if ((take.frames.length > 2) && (take.frames[middleFrameNum].image)) {
            middleFrame = "<img src=\"" + TakeView.getFrameImageURL(take, take.frames[middleFrameNum]) + "\" width=\"160\" height=\"90\" />";
          }
          var lastFrameNum = (take.frames.length - 1);
          if ((take.frames.length > 1) && (take.frames[lastFrameNum].image)) {
            lastFrame = "<img src=\"" + TakeView.getFrameImageURL(take, take.frames[lastFrameNum]) + "\" width=\"160\" height=\"90\" />";
          }
        }
        li.innerHTML = "<table border=\"0\" cellpadding=\"2\" cellspacing=\"0\">"
        + "	<tr>"
        + "		<td class=\"label\">Scene: </td><td>" + take.scene + "</td>"
        + "		<td rowspan=\"5\" valign=\"center\" class=\"left-border right-border\" style=\"padding-left: 5px; padding-right: 5px;\">"
        + "			<button onclick=\"takeListOpen(" + i + ");\" style=\"margin: 0 0 3px 0;\">Open <i class=\"fa fa-external-link\"></i></button><br>"
        + "			<button onclick=\"takeListCopy(" + i + ");\" style=\"margin: 0 0 3px 0;\">Copy <i class=\"fa fa-clone\"></i></button><br>"
        + "			<button onclick=\"takeListDelete(" + i + ");\" style=\"margin: 0 0 3px 0;\">Delete <i class=\"fa fa-trash\"></i></button><br>"
        + "		</td>"
        + "		<td rowspan=\"5\" valign=\"center\">" + firstFrame + "</td>"
        + "		<td rowspan=\"5\" valign=\"center\">" + middleFrame + "</td>"
        + "		<td rowspan=\"5\" valign=\"center\">" + lastFrame + "</td>"
        + "	</tr>"
        + "	<tr><td class=\"label\">Take: </td><td>" + take.take + "</td></tr>"
        + "	<tr><td class=\"label\">Resolution: </td><td>" + take.resolution + "</td></tr>"
        + "	<tr><td class=\"label\">Frames Per Second: </td><td>" + take.fps + "</td></tr>"
        + "	<tr><td class=\"label\">Length: </td><td>" + length + "</td></tr>"
        + "	</tr>"
        + "</table>";
      }
      list.appendChild(li);
    }
  },
}
