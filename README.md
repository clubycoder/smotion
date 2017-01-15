# Stop Motion Animation in a Web Browse

Description
===========

I created this app because I wanted a better free/open-source option for
creating stop motion animation for MacOS.  While looking at my options for
how to build it I decided to go further and make it cross platform by
having it built on [NodeJS](https://nodejs.org/) and run in a regular
web-browser that supports [WebRTC](https://webrtc.org/) web cameras.  This
means my kids can use it too :-).

Functionality
-------------

* Management of projects / takes (New, Open, Copy, Delete)
* 2 virtual screens
* Viewing and capturing from 2 cameras configured per virtual screen
* Configurable resolution (360p, 720p, or 1080p)
* Configurable frame-rate (8, 12, 24, 30, or 60)
* Insert and Remove frames
* Adding notes to frames for planning
* Auto-save take with every change, new frame, removed frame, etc
* Overlay previous frame with configurable transparency (Onion Skinning) per virtual screen
* Switch screen to live playback per virtual screen
* Pause and step forward and backward a frame in playback per virtual screen
* Render to H.264 MP4 using [FFMpeg](https://ffmpeg.org/)

Coming "Soon"
-------------

* Importing external images for frames
* Integrated frame editing in [Gimp](https://www.gimp.org/)
* Marking screen to plan movement between frames
* Multiple planning/storyboard layers for more per frame planning
* Rotoscoping layers
* Prepackaged builds with wrapper apps for MacOS and Windows
* Possibly sound layers starting at frames for roughing out soundtrack and lip-sync using [sox](http://sox.sourceforge.net/)

Instalation
===========

* Install `node` and `npm`.  See [NodeJS](https://nodejs.org/).
* Clone this git repo
* Run `npm install`
* Run `npm start`
* Point your browser at [http://localhost:54321](http://localhost:54321).
* When prompted allow access to your web cameras

Configuration
-------------

The config is managed in [config/config.json](config/config.json).

The primary thing you may want to change is the `takesDir` that points to the
rood directory to store all of your takes.

If you are not using the tools builds from this repo you need to setup
`tools.ffmpeg` pointing to your install of [FFMpeg](https://ffmpeg.org/).

You may also need to change the `port` if the default collides with something
already running on your machine.

Requirements
------------

You will want to have the latest version of your favorite browser installed.
I've using [Chrome](https://www.google.com/chrome/) but I have tried it out
with [Firefox](https://www.mozilla.org/en-US/firefox/products/).

Everything from the [Instalation](#Instalation).

If you are not wanting to use the tools builds from the repo you will need
to grab [FFMpeg](https://ffmpeg.org/).

Open Source License
===================

See [LICENSE.txt](LICENSE.txt).
