Prise
=====
A utility that finds plugins for NPM based frameworks.


## Usage

Prise takes three arguments:

  - a folder (that contains a *node_modules*-folder)
  - a prefix for node modules to look for
  - a callback function that receives an error element as its first element, and a result array as it second that will contain a list of found modules

### Example

```js
// file: test.js
var prise = require('prise');

prise('/tmp/node_modules', 'buster-', function(err, packages) {
    if (err) {
        // handle error
        console.error(err.stack);
        return;
    }

    // Do stuff with the module, like...
    packages.forEach(function(package) {
        console.log(package.name, package.version);
    });
});
```

If we run a `npm install buster-sinon buster-amd gulp-util` in the */tmp/*-folder, and execute the aforementioned script, we should get the following output:

```sh
> node test.js
buster-amd 0.3.1 /tmp/node_modules/buster-amd/lib/buster-amd
buster-sinon 0.7.1 /tmp/node_modules/buster-sinon/lib/buster-sinon
```

Notice that everything starting with **buster-dash** got returned and gulp-util got ignored.


## Algorithm

  1. first it will list the folders of the given path.
  2. then it will filter out the folders that does not start with the given prefix.
  3. then it will look for a *package.json* file in the resulting folders.
    - If found it will run it through the same parser that NPM uses and return a bunch of meta-data. If not found it will create a minimal package object, containing only a name (the name of the folder) and use this as the "package" file.
    - if the package does not contain a main key, it will look for an *index.js*-file in the folder, and set this to main if it exists.
    - If there is no main file at this point, the package will be removed from results.
  4. then it will return the list of found modules to the callback function.


## Install

Get the latest version from NPM.

```sh
npm install prise --save
```


## License

The MIT License (MIT)

Copyright (c) 2014 Martin Gausby and contributors

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
