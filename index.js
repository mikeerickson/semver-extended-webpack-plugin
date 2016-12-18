var semver  = require('semver');
var fs      = require('fs');
var cmdArgs = require('command-line-args');
var chalk   = require('chalk');

var args = {};
try {
  args = cmdArgs([
    {
      name: 'semver-extended-webpack-plugin-disable',
      type: Boolean,
      defaultValue: false
    }, {
      name: 'semver-extended-webpack-plugin-inc-args',
      type: String
    }
  ]).parse();
}
catch (e) {
  console.error('An error occured reading CLI arguments');
}

function extractIncArgs(options) {
  var incArgs = args['semver-extended-webpack-plugin-inc-args'];
  if (incArgs) {
    incArgs = incArgs.split(',');
  }
  incArgs = incArgs || options.incArgs || [];
  if (incArgs.length > 2) {
    throw new Error('`incArgs` must have one or two params');
  }
  return incArgs;
}

function SemverWebpackPlugin(options) {
  let writeOptions;

  if (args['semver-extended-webpack-plugin-disable']) {
    return;
  }

  this.options = options || {};
  this.options.files = this.options.files || [];
  this.options.console = this.options.console || false;
  this.options.buildDate = this.options.buildDate || false;

  writeOptions = this.options;

  var incArgs = extractIncArgs(this.options);
  var files = this.options.files;
  if (files.length === 0) {
    throw new Error('`files` must have at least one file');
  }

  var done = this.options.done;
  var outMap = new Map();

  let newVers = '';

  files.forEach(function (file) {
    var f = require(file);
    incArgs.unshift(f.version);
    f.version = semver.inc.apply(this, incArgs);
    newVers = f.version;
    if (writeOptions.buildDate) {
      f.buildDate = new Date();
    }
    outMap.set(file, f);
    fs.writeFileSync(file, JSON.stringify(f, null, 2));
    (typeof done === 'function') && done(f);
  });

  if (this.options.console) {
    console.log(chalk.bold.green('  ==> Updating Version to ') + chalk.bold.cyan(newVers));
  }

  this.outMap = outMap;
}

SemverWebpackPlugin.prototype.apply = function (compiler) {
  if (args['semver-extended-webpack-plugin-disable']) {
    return;
  }

  var outMap = this.outMap;
  // compiler.plugin("emit", function (compilation, callback) {
  //   outMap.forEach((json, file) => {
  //     compilation.assets[file] = {
  //       source: function () {return new Buffer(JSON.stringify(json, null, 2));},
  //       size: function () {return Buffer.byteLength(this.source(), 'utf8'); }
  //     };
  //   });
  //   callback();
  // });
};

module.exports = SemverWebpackPlugin;
