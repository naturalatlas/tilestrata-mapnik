# tilestrata-mapnik
[![NPM version](http://img.shields.io/npm/v/tilestrata-mapnik.svg?style=flat)](https://www.npmjs.org/package/tilestrata-mapnik)
[![Build Status](https://travis-ci.org/naturalatlas/tilestrata-mapnik.svg)](https://travis-ci.org/naturalatlas/tilestrata-mapnik)
[![Coverage Status](http://img.shields.io/coveralls/naturalatlas/tilestrata-mapnik/master.svg?style=flat)](https://coveralls.io/r/naturalatlas/tilestrata-mapnik)

A [TileStrata](https://github.com/naturalatlas/tilestrata) plugin for rendering tiles with [mapnik](http://mapnik.org/). This package will use the latest version of [node-mapnik](https://github.com/mapnik/node-mapnik), unless it's already in your dependency tree (which allows you to pin it to a version if needed).

```sh
$ npm install tilestrata-mapnik --save
```

### Sample Usage

```js
var mapnik = require('tilestrata-mapnik');

server.layer('mylayer')
    .route('tile.png').use(mapnik({
        pathname: '/path/to/map.xml',
        scale: 1,
        tileSize: 256
    })
    .route('tile.json').use(mapnik({
        xml: 'string of mapnik xml',
        scale: 1,
        tileSize: 256,
        interactivity: true
    }));
```

## Contributing

Before submitting pull requests, please update the [tests](test) and make sure they all pass.

```sh
$ npm test
```

## License

Copyright &copy; 2014-2015 [Natural Atlas, Inc.](https://github.com/naturalatlas) & [Contributors](https://github.com/naturalatlas/tilestrata-mapnik/graphs/contributors)

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at: http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
