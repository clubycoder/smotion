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

const Takes = require("Takes");
const TakeView = require("TakeView");

module.exports = {
  "drawTakes": function(takes, table) {
    while ((table.rows) && (table.rows.length > 0)) {
      table.deleteRow(0);
    }
    for (let takeNum = 0; takeNum < takes.length; takeNum++) {
      if (takes[takeNum].err) {
        {let row = table.insertRow(-1);
          {let cell = row.insertCell(-1);
            cell.colSpan = 7;
            cell.className = "pane";
            cell.innerHTML = takes[takeNum].err;}
        }
      } else {
        var take = takes[takeNum].take;
        var length = "No frames";
        var firstFrame = "";
        var middleFrame = "";
        var lastFrame = "";
        var video = "";
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
        if (take.video) {
          video = "<video width=\"180\" height=\"110\" controls loop>"
            + "<source src=\"" + TakeView.getVideoURL(take) + "\" type=\"video/mp4\">"
            + "</video>"
          ;
        }
        {let row = table.insertRow(-1);
          {let cell = row.insertCell(-1);
            cell.className = "pane-top-left label";
            cell.innerHTML = "Scene:";}
          {let cell = row.insertCell(-1);
            cell.className = "pane-top";
            cell.innerHTML = take.scene;}
          {let cell = row.insertCell(-1);
            cell.rowSpan = 5;
            cell.valign = "center";
            cell.className = "pane-top pane-bottom left-border right-border";
            cell.style.paddingLeft = "5px";
            cell.style.paddingRight = "5px";
            cell.innerHTML = ""
              + "<button onclick=\"takeListOpen(" + takeNum + ");\" style=\"width: 100%; margin: 0 0 3px 0;\">Open <i class=\"fa fa-external-link\"></i></button><br>"
              + "<button onclick=\"takeListCopy(" + takeNum + ");\" style=\"width: 100%; margin: 0 0 3px 0;\">Copy <i class=\"fa fa-clone\"></i></button><br>"
              + "<button onclick=\"takeListDelete(" + takeNum + ");\" style=\"width: 100%; margin: 0 0 3px 0;\">Delete <i class=\"fa fa-trash\"></i></button><br>"
            ;}
          {let cell = row.insertCell(-1);
            cell.rowSpan = 5;
            cell.valign = "center";
            cell.className = "pane-top pane-bottom";
            cell.innerHTML = firstFrame;}
          {let cell = row.insertCell(-1);
            cell.rowSpan = 5;
            cell.valign = "center";
            cell.className = "pane-top pane-bottom";
            cell.innerHTML = middleFrame;}
          {let cell = row.insertCell(-1);
            cell.rowSpan = 5;
            cell.valign = "center";
            cell.className = "pane-top pane-bottom";
            cell.innerHTML = lastFrame;}
          {let cell = row.insertCell(-1);
            cell.rowSpan = 5;
            cell.valign = "center";
            cell.className = "pane-top-right pane-bottom-right left-border";
            cell.innerHTML = video;}
        }
        {let row = table.insertRow(-1);
          {let cell = row.insertCell(-1);
            cell.className = "pane-left label";
            cell.innerHTML = "Take:";}
          {let cell = row.insertCell(-1);
            cell.innerHTML = take.take;}
        }
        {let row = table.insertRow(-1);
          {let cell = row.insertCell(-1);
            cell.className = "pane-left label";
            cell.innerHTML = "Resolution:";}
          {let cell = row.insertCell(-1);
            cell.innerHTML = take.resolution;}
        }
        {let row = table.insertRow(-1);
          {let cell = row.insertCell(-1);
            cell.className = "pane-left label";
            cell.innerHTML = "Frames Per Second:";}
          {let cell = row.insertCell(-1);
            cell.innerHTML = take.fps;}
        }
        {let row = table.insertRow(-1);
          {let cell = row.insertCell(-1);
            cell.className = "pane-bottom-left label";
            cell.innerHTML = "Length:";}
          {let cell = row.insertCell(-1);
            cell.className = "pane-bottom";
            cell.innerHTML = length;}
        }
      }
    }
  }
}
