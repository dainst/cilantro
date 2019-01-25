#!/bin/sh

cd doc

sphinx-apidoc -o . ../
make html
