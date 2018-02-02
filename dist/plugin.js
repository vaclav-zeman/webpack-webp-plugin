'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var glob = require('glob');
var webp = require('webp-converter');
var path = require('path');

var WebpackWebpPlugin = function () {
  function WebpackWebpPlugin(options) {
    _classCallCheck(this, WebpackWebpPlugin);

    this.options = {
      path: options.path,
      quality: options.quality || 90
    };

    this.startTime = Date.now();
    this.prevTimestamps = {};
    this.changedFiles = [];
  }

  _createClass(WebpackWebpPlugin, [{
    key: 'apply',
    value: function apply(compiler) {
      var _this = this;

      compiler.plugin('emit', function (compilation, callback) {
        return _this.convertToWebp(compilation, callback);
      });

      compiler.plugin('done', function () {
        console.log('WebP successfully generated.');
      });
    }
  }, {
    key: 'convertToWebp',
    value: function convertToWebp(compilation, callback) {
      var _this2 = this;

      var changedFiles = Object.keys(compilation.fileTimestamps).filter(function (watchfile) {
        return (_this2.prevTimestamps[watchfile] || _this2.startTime) < (compilation.fileTimestamps[watchfile] || Infinity);
      });

      var convert = function convert(file) {
        var fileName = file.split('.')[0];

        webp.cwebp(file, fileName + '.webp', '-q ' + _this2.options.quality, function () {
          return false;
        });
      };

      glob(path.resolve(this.options.path), {}, function (err, images) {
        images.filter(function (file) {
          return !changedFiles.includes(file);
        }).map(convert);
      });

      callback();
      this.prevTimestamps = compilation.fileTimestamps;
    }
  }]);

  return WebpackWebpPlugin;
}();

exports.default = WebpackWebpPlugin;