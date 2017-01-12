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
  "call": function(route, method, data, onSuccess, onError) {
    $.ajax({
      "url": route,
      "type": method,
      "dataType": "json",
      "success": function (res) {
        if (res.err) {
          onError(res.err);
        } else if (res.take) {
          onSuccess(res.take);
        } else {
          onSuccess(res);
        }
      },
      "contentType": "application/json; charset=utf-8",
      "data": (data ? JSON.stringify(data) : undefined)
    });
  }
};
