# ioBroker.adapter-core
Core module to be used in ioBroker adapters. Acts as the bridge to js-controller.

This replaces the `utils.js` included in the ioBroker template adapter.

## Usage
1. Add this as a dependency: `npm i iobroker.adapter-core`
2. Replace  
   ```js
   const utils = require(__dirname + '/lib/utils');
   ```
   with
   ```js
   const utils = require('iobroker.adapter-core');
   ```
