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
  "primary": function(to, prefix) {
    var i;
    var bar = document.getElementById("navbar" + (prefix ? "-" + prefix : ""));
    var tabs = bar.getElementsByTagName("li");
    for (i = 0; i < tabs.length; i++) {
      var tab = tabs[i];
      if (tab.id == "navitem-" + (prefix ? prefix + "-" : "") + to) {
        $("#" + tab.id).addClass("w3-light-grey");
      } else {
        $("#" + tab.id).removeClass("w3-light-grey");
      }
    }
    var x = document.getElementsByClassName("nav" + (prefix ? "-" + prefix : ""));
    for (i = 0; i < x.length; i++) {
      x[i].style.display = "none";
    }
    document.getElementById((prefix ? prefix + "-" : "") + to).style.display = "block";
  },
  "secondary": function(parent, to) {
    this.primary(to, parent);
  }
};
