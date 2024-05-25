# Adapter-Core

Core module to be used in ioBroker adapters. Acts as the bridge to js-controller.

This replaces the `utils.js` included in the ioBroker template adapter.

## Usage

1. Add this as a dependency: `npm i @iobroker/adapter-core`
2. Replace
    ```js
    const utils = require(__dirname + "/lib/utils");
    ```
    with
    ```js
    const utils = require("@iobroker/adapter-core");
    ```
3. Create an adapter instance as usual:
    ```js
    // old style
    const adapter = utils.adapter(/* options */);
    // new style (classes). See https://github.com/ioBroker/ioBroker.template/ for a more detailed usage
    class MyAdapter extends utils.Adapter {...}
    ```

## Utility methods

Compared to the old `utils.js`, some utility methods were added.

### `getAbsoluteDefaultDataDir`

```js
const dataDir = utils.getAbsoluteDefaultDataDir();
```

This returns the absolute path of the data directory for the current host. On linux, this is usually `/opt/iobroker/iobroker-data`

### `getAbsoluteInstanceDataDir`

```js
// old style
const instanceDataDir = utils.getAbsoluteInstanceDataDir(adapter);
// new style (classes)
const instanceDataDir = utils.getAbsoluteInstanceDataDir(this);
```

Returns the absolute path of the data directory for the current adapter instance.
On linux, this is usually `/opt/iobroker/iobroker-data/<adapterName>.<instanceNr>`

### `EXIT_CODES`

```js
adapter.terminate(
	"for some reason",
	utils.EXIT_CODES.ADAPTER_REQUESTED_TERMINATION,
);
```

Use standardized exit codes if your adapter needs to terminate.

### `commonTools`

A collection of various utility methods and modules from JS-Controller. Prefer this over trying to find `lib/tools.js` and similar internal modules from the controller yourself!

Currently, the following **methods** are available:

-   `commonTools.pattern2RegEx` - Converts a pattern to match object IDs into a RegEx string that can be used in `new RegExp(...)`
-   `commonTools.getAdapterDir` - Finds the adapter directory of a given adapter
-   `commonTools.getInstalledInfo` - Get list of all installed adapters and controller version on this host

And the following **modules** are exposed:

-   `commonTools.password` - Previously exposed as `lib/password.js` in JS-Controller.
-   `commonTools.letsEncrypt` - Previously exposed as `lib/letsencrypt.js` in JS-Controller. Note that `letsEncrypt` has a capital `E`!
-   `commonTools.session` - Previously exposed as `lib/session.js` in JS-Controller.
-   `commonTools.zipFiles` - Previously exposed as `lib/zipFiles.js` in JS-Controller.
-   `commonTools.isDocker` - Checks if we are running inside a docker container

## Automatic backup of data files

ioBroker has the ability to include files written by adapters in its backups. To enable that, you need to add the following to `io-package.json`:

```json
{
	// ...
	"common": {
		// ...
		"dataFolder": "path/where/your/files/are"
	}
}
```

This path is relative to the path returned by `getAbsoluteDefaultDataDir()`. The placeholder `%INSTANCE%` is automatically replaced by the instance number of each adapter, for example `"dataFolder": "my-adapter.%INSTANCE%"`.

## Tips while working on this module

-   `npm run build` creates a clean rebuild of the module. This is done automatically before every build
-   `npm run lint` checks for linting errors
-   `npm run watch` creates an initial build and then incrementally compiles the changes while working.

## Errors in the definitions?

If you find errors in the definitions, e.g. function calls that should be allowed but aren't, please open an issue here or over at https://github.com/DefinitelyTyped/DefinitelyTyped and make sure to mention @AlCalzone.

## Changelog

<!--
	Placeholder for the next version (at the beginning of the line):
	### **WORK IN PROGRESS**
-->
### 2.6.12 (2024-05-25)
* (foxriver76) removed `@types/iobroker`

### 2.6.11 (2024-05-18)
* (foxriver76) removed letsEncrypt support as next controller won't support it anymore (use `@iobroker/webserver` instead)

### 2.6.9 (2024-03-24)
- (foxriver76) compatibility with next controller with new esm/cjs exports

### 2.6.8 (2023-03-24)
-   (Apollon77) Expose more JS-Controller internals under the `commonTools` export

### 2.6.7 (2022-10-08)
-   (Apollon77) Expose more JS-Controller internals under the `commonTools` export

### 2.6.6 (2022-09-13)

-   (AlCalzone) Expose more JS-Controller internals under the `commonTools` export

### 2.6.2 (2022-09-07)

-   (AlCalzone) Fix: Restore compatibility with JS-Controller < 4.1

### 2.6.1 (2022-09-06)

-   (AlCalzone) Fix: detecting JS-Controller now finds the correct directory and not a subdirectory.

### 2.6.0 (2022-02-20)

-   (AlCalzone) Updated core declarations to `v4.0.1` for support with JS-Controller 4.x

### 2.5.1 (2021-07-22)

-   (AlCalzone) Updated core declarations to `v3.3.4`.

### 2.5.0 (2021-05-19)

-   (AlCalzone) Add fallback solution to detect js-controller if require.resolve fails in dev situations with symlinks
-   (AlCalzone) Use release-script for releases
-   (AlCalzone) Updated core declarations to `v3.3.0` to be up to date with JS-Controller 3.3.x.

### v2.4.0 (2020-05-03)

-   (AlCalzone) Updated core declarations to v3.0.6.
-   (AlCalzone) Expose the predefined collection of adapter exit codes as `utils.EXIT_CODES`

### v2.3.1 (2020-04-17)

-   (AlCalzone) Updated core declarations to v3.0.4.

### v2.3.0 (2020-04-15)

-   (AlCalzone) Updated core declarations to v3.0.2. This includes support for new methods in JS-Controller 3.0

### v2.2.1 (2020-01-27)

-   (AlCalzone) Included typings for the objects and states cache in the adapter class

### v2.0.0 (2019-12-27)

-   (AlCalzone) Updated core declarations to v2.0.0. This removes access to `adapter.objects` and `adapter.states`. You must use the new methods `adapter.getObjectView` and `adapter.getObjectList` instead of their counterparts from `objects`.

### v1.0.3 (2019-01-06)

-   (AlCalzone) Updated core declarations
-   (AlCalzone) Fix included declarations to allow creating adapter instances with `new`.

### v1.0.0 (2018-27-11)

-   (AlCalzone) Initial version

## MIT License

Copyright (c) 2018-2024 AlCalzone

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
