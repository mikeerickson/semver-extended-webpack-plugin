# semver-extended-webpack-plugin
A webpack plugic to do [semver](http://semver.org)

### Archives
- npm: [semver-extended-webpack-plugin](https://www.npmjs.com/package/semver-extended-webpack-plugin)
- git: [semver-extended-webpack-plugin](https://github.com/mikeerickson/semver-extended-webpack-plugin)

## Features
- Bump up `version` using function `semver.inc` fields in json files, ex: `package.json`, `bower.json`
- Support command line `arguments` or `config`
- Enable/disable by `arguments`
- Console update (see options)
- Add `buildDate` (see options)

## Installation
```bash
npm install semver-extended-webpack-plugin --save-dev
```

## Webpack example
- webpack.config.js
``` javascript
var SemverWebpackPlugin = require('semver-extended-webpack-plugin');

module.exports = {
  plugins: [
      new SemverWebpackPlugin({
        files: [path.resolve(__dirname, 'package.json')],
        incArgs: ['patch'],
        console: true,
        buildDate: true,
        version: '1.8'  // optional if you want to set the desired version
      })
    ]
}
```



## Usage
### Webpack config
```javascript
new SemverWebpackPlugin({options})
```

| Options   | Properties                                                                                                   |
| --------- | ------------------------------------------------------------------------------------------------------------ |
| files     | list of input files, should are absolute paths                                                               |
| incArgs   | `arguments` will be passed to function `semver.inc()`, see [node-semver](https://github.com/npm/node-semver) |
| console   | show console output of version update (default: false)                                                       |
| buildDate | add `buildDate` key to package.json (default: false)                                                         |
| version   | set version to a specific version (default: null)                                                            |

### Arguments
- `--semver-extended-webpack-plugin-inc-args` arguments passed to function `semver.inc` (in `csv` format), ex: `webpack --semver-extended-webpack-plugin-inc-args=prelease,beta`
- `--semver-extended-webpack-plugin-disable` this is useful to `bumpup` version in sometime, see example section above for more info
  - `true` then the Plugin will not run
  - Default is `false`

## License
http://www.opensource.org/licenses/mit-license.php

## Credits

semver-extended-webpack-plugin written by Mike Erickson

E-Mail: [codedungeon@gmail.com](mailto:codedungeon@gmail.com)

Twitter: [@codedungeon](http://twitter.com/codedungeon)

Website: [codedungeon.org](http://codedungeon.org)

Additional Attribution:

[semver-webpack-plugin](https://www.npmjs.com/package/semver-webpack-plugin)
