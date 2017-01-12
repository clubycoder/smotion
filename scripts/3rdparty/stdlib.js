"use strict";

/**
 * Minimal node.js compatible require() for the browser.
 *
 * For documentation, see Github:
 *   https://github.com/trausti/TKRequire.js
 *
 * Heavily based on StackOverflow answers by Lucio M. Tato and  Ilya Kharlamov in thread:
 * http://stackoverflow.com/questions/6971583/node-style-require-for-in-browser-javascript
 *
 * Chris Luby MODS:
 * * Added pack path ../ support
 * * Added exportName support to work with TypeScript style/multiple exports
 * * Added inGlobal support to work with classic, global scope JavaScript modules
 * * Changed to use resolved path instead of passed in url for cache
 * * Updated to use //# sourceURL= for Chrome dev tools support
 * * Default path support
 *
 * MIT license.
 */
require.defaultPath = "/scripts";
function require(url, exportName, inGlobal) {
  if (url.toLowerCase().substr(-3)!=='.js') {
    url+='.js';  // To allow loading without js suffix.
  }
  if (!require.cache) {
    require.cache=[];  // Init cache.
  }

  if (!require.relativePath) {
    require.relativePath = '';
    //console.log("TKRequire: initializing relativePath");
  }
  var originalPath = require.relativePath;
  if ("http" === url.substr(0, 4)) {
    // If full href is given, extract relative path, if any.
    var baseDir = window.location.href.substring(0, window.location.href.lastIndexOf('/'));
    var scriptDir = url.substring(0, url.lastIndexOf('/'));
    if (0 == url.indexOf(baseDir)) {
      require.relativePath = scriptDir.substring(baseDir.length + 1) + '/';
      //console.log("TKRequire: extractiong relative path" + require.relativePath);
    }
  } else if ("./" === url.substr(0, 2)) {
    require.relativePath = require.relativePath + url.substring(2, url.lastIndexOf('/') + 1);
    //console.log("TKRequire: Extending Path : " + require.relativePath);
  } else if ("../" == url.substr(0, 3)) {
    //console.log("TKRequire: Backpath: " + url);
    var relativePathParts = require.relativePath.replace(/\/$/, '').split('/');
    var backUrl = url;
    while ("../" == backUrl.substr(0, 3)) {
      if (relativePathParts.length > 0) {
        //console.log('TKRequire: Backpath before: ' + backUrl + ', ', relativePathParts);
        relativePathParts.pop();
        backUrl = backUrl.substr(3);
        //console.log('TKRequire: Backpath after: ' + backUrl + ', ', relativePathParts);
      } else {
        throw new Error("Invalid relative path: " + url);
      }
    }
    var newRelativePath = (relativePathParts.length > 0 ? relativePathParts.join('/') : '');
    newRelativePath += (newRelativePath ? '/' : '');
    var backUrlSlashPos = backUrl.lastIndexOf('/');
    if (backUrlSlashPos >= 0) {
      newRelativePath += backUrl.substr(0, backUrlSlashPos + 1);
    }
    require.relativePath = newRelativePath;
    //console.log("TKRequire: Back Path new relative: " + require.relativePath);
  }
  var scriptName = url.substring(url.lastIndexOf('/') + 1);
  //console.log("TKRequire: scriptName :" + scriptName);

  // Resolve actual path to include
  var fullOrRelativePath = "";
  if ("http" === url.substr(0, 4)) {
    fullOrRelativePath = url;
  } else if ("." == url.substr(0, 1)) {
    fullOrRelativePath = "./" + require.relativePath + scriptName;
  } else {
    fullOrRelativePath = require.defaultPath + "/" + url;
  }
  var exports = require.cache[fullOrRelativePath];  // Get from cache.
  if (!exports) {  // Not cached.
    try {
      exports = {};
      var X = new XMLHttpRequest();
      //console.log("TKRequire: including: " + fullOrRelativePath);
      X.open("GET", fullOrRelativePath, false); // Synchrounous load.
      X.send();
      if (X.status && X.status !== 200) {
        throw new Error(X.statusText);
      }
      var source = X.responseText;
      if (inGlobal) {
        exports = undefined;
        eval.call(window, source);
        require.cache[fullOrRelativePath] = true;
      } else {
        // Fix (if saved form for Chrome Dev Tools)
        if (source.substr(0, 10)==="(function(") {
          var moduleStart = source.indexOf('{');
          var moduleEnd = source.lastIndexOf('})');
          var CDTcomment = source.indexOf('//@ ');
          if (CDTcomment >- 1 && CDTcomment < moduleStart + 6) {
            moduleStart = source.indexOf('\n', CDTcomment);
          }
          source = source.slice(moduleStart + 1, moduleEnd - 1);
        }
        // Fix, add comment to show source on Chrome Dev Tools
        source = "//# sourceURL=" + window.location.origin + fullOrRelativePath + "\n" + source;
        //------
        var module = { id: fullOrRelativePath, uri: fullOrRelativePath, exports: exports }; // According to node.js modules
        // Create a Fn with module code, and 3 params: require, exports & module
        var anonFn = new Function("require", "exports", "module", source);
        anonFn(require, exports, module);  // Call the Fn, Execute the module
        exports.module = module.exports;
        require.cache[fullOrRelativePath] = exports;  // Cache obj exported by module.
      }
    } catch (err) {
      throw new Error("Error loading module " + url + ": " + err);
    }
  }
  // Restore the relative path.
  require.relativePath = originalPath;

  if (inGlobal) {
    return;
  }
  if (exportName == '*') {
    exportName = scriptName.replace(/\.js$/, '');
  } if (typeof exports.default !== 'undefined') {
    exportName = 'default';
  }
  return (exportName ? exports[exportName] : exports.module); // Require returns object exported by module
}

/**
 * Pulled from TypeScript ES3 Generation so I can use noEmitHelpers=true
 * reducing the duplicate code for every class.
 */
function __extends(d, b) {
  for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
  function __() { this.constructor = d; }
  d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}
