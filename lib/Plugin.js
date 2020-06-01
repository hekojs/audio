"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _howler = require("howler");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Audio = /*#__PURE__*/function () {
  function Audio(world, options) {
    _classCallCheck(this, Audio);

    this.world = void 0;
    this.multiplayer = void 0;
    this.howls = {};
    this.world = world; // Only load howls from browser and not from nodejs

    if (typeof window !== 'undefined') {
      this._loadHowls(options.howls);
    }
  }

  _createClass(Audio, [{
    key: "onStart",
    value: function onStart() {
      var _this = this;

      this._detectServerEnvironment();

      if (this.multiplayer === 'client') {
        var multiplayer = this.world.plugins.get('Multiplayer');
        multiplayer.onJoin(function () {
          multiplayer.onMessage('plugin.audio.play-sound', function (name) {
            _this.play(name);
          });
        });
      }
    }
  }, {
    key: "_loadHowls",
    value: function _loadHowls(howls) {
      for (var name in howls) {
        this.howls[name] = new _howler.Howl(howls[name]);
      }
    }
  }, {
    key: "_detectServerEnvironment",
    value: function _detectServerEnvironment() {
      if (this.world.plugins.has('Multiplayer')) {
        if (this.world.plugins.get('Multiplayer').isServer()) {
          this.multiplayer = 'server';
        } else if (this.world.plugins.get('Multiplayer').isClient()) {
          this.multiplayer = 'client';
        }
      }
    }
  }, {
    key: "play",
    value: function play(name) {
      if (this.multiplayer === 'server') {
        this.world.plugins.get('Multiplayer').broadcastMessage('plugin.audio.play-sound', name);
      } else {
        this.howls[name].play();
      }
    }
  }]);

  return Audio;
}();

exports["default"] = Audio;