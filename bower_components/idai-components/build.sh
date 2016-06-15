#!/bin/bash
# Author: Daniel M. de Oliveira

rm dest/*js
grunt html2js
sed -e 's/\.\.\/src\/partials/partials/g' -e 's/templates-main/idai\.components/g' dest/templates.js > dest/templates.seded.js
grunt uglify