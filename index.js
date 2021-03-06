const semver  = require('semver');
const fs      = require('fs');
const cmdArgs = require('command-line-args');
const chalk   = require('chalk');

let args = {};
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
catch (e) {}

function extractIncArgs(options) {
  let incArgs = args['semver-extended-webpack-plugin-inc-args'];
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

  this.options           = options || {};
  this.options.files     = this.options.files || [];
  this.options.console   = this.options.console || false;
  this.options.buildDate = this.options.buildDate || false;
  this.options.version   = this.options.version || '';

  writeOptions = this.options;

  let incArgs = extractIncArgs(this.options);
  let files   = this.options.files;
  if (files.length === 0) {
    throw new Error('`files` must have at least one file');
  }

  let done    = this.options.done;
  let outMap  = new Map();

  let newVers = '';
  let error   = false;

  files.forEach((file) => {
    let f = require(file);
    let v = f.version;
    incArgs.unshift(f.version);

    f.version = semver.inc.apply(this, incArgs);

    if (this.options.version.length > 0) {
      f.version = this.options.version;
    }

    if (incArgs.length <= 1) {
      console.log(chalk.bold.red('  ==> Invalid semver attributes, should contain one or more arguments (see args property)'));
      f.version = v;
      error = true;
    }

    newVers   = f.version;
    if (writeOptions.buildDate) {
      f.buildDate = new Date();
    }
    outMap.set(file, f);
    fs.writeFileSync(file, JSON.stringify(f, null, 2));
    (typeof done === 'function') && done(f);
  });

  if ((this.options.console) && (!error)){
    console.log(chalk.bold.green('  ==> Updated Version to ') + chalk.bold.cyan(newVers));
  }

  this.outMap = outMap;
}

SemverWebpackPlugin.prototype.apply = (compiler) => {
  if (args['semver-extended-webpack-plugin-disable']) {
    return;
  }

  let outMap = this.outMap;
  // compiler.plugin("emit", (compilation, callback) ={
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
