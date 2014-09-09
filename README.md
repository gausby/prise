Prise
=====
A utility that finds plugins for NPM based frameworks.


## Usage
Prise takes three arguments:

  - a folder (that contains a *node_modules*-folder)
  - a prefix for node modules to look for
  - a callback function that receives an error element as its first element, and a result array as it second that will contain a list of found modules

```js
var prise = require('prise');

prise('~/.someProject/', 'some-', function(err, modules) {
    if (err) {
        // handle error
        return;
	}

    // Do stuff with the module
    console.log(modules);
});
```

## Algorithm

1. first it will list the folders in the *node_modules* folder of the given path.
2. then it will filter out the folders that does not start with the given prefix.
3. then it will look for a *package.json* file in the resulting folders.
  - If found it will look for a main-file in the package data.
  - if that does not exist, or the package does not exist, it will look for an *index.js*-file in the folder.
  - if found it will use the folder name as the name of the package.
  - If not found it will remove the folder from the results.
4. then it will return the list of found modules to the callback function.


## Install
Get the latest version from NPM.

```sh
npm install prise --save
```


## License
The MIT License (MIT)

Copyright (c) 2014 Martin Gausby

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
