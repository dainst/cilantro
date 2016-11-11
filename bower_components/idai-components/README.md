# idai-components

Components library for use in other angular based dai projects. 

## Demo application and usage documentation

A sample application can get started via

```bash
gulp server
```

The demo app is then served on port 1235. 
It documents and shows the libraries facilities in action.

Changes to partials and js of the library (src/**) as well as of the
demo application files will automatically trigger a
rebuild and also a reload in active browser windows.

## Development and deployment

### Preparative steps

In order to make additions to the library, these preparative steps are necessary:

```bash
npm install
npm install -g bower gulp
bower install
```

### Building and testing

If changes to the library code are beeing made, 

```bash
gulp
```

has to be called after changing the source code. This will run the tests
and all necessary build steps which results in the follwing files:

```bash
dist/idai-components.js # full js library without depencies
dist/idai-components.min.js # minified full js library without dependencies
dist/idai-components-deps.js # concatenated and minified dependencies
dist/idai-components-no-tpls.js # js library without the templates
dist/idai-components-tpls.js # angular templates
dist/css/idai-components.css # full css including bootstrap
dist/css/idai-components.min.css # minified full css including bootstrap
```

In most cases only `idai-components.min.js` and `idai-components.min.css` need
to be referenced by applications making use of idai-components.

### Deployment and versioning

The resulting files under dist are to be pushed to GitHub, together with the changes to the source code.
These are the resulting libraries which clients can get via bower, adding a dependency
in their local bower.json:

```bash
bower install codarchlab/idai-components --save
```

Bower and GitHub play well together so that bower will know to fetch the library automatically from GitHub.

When pushing the changes to GitHub, a new release has
to be created in order to make the changes available to clients as a new library version.

The new tag should follow the guidelines for [semantic versioning](http://semver.org/), which means basically
that for functional additions to the library the middle digit gets incremented and for API breaking changes the first digit gets incremented.

