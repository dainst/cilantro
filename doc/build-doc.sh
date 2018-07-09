#!/bin/sh
set -e

# TODO create variable where all non docu folder are configured
# GH_PAGES_SOURCES = service test utils workers run_service.py

# Switch to docu branch and pull in the sources from the master
git config --replace-all remote.origin.fetch +refs/heads/*:refs/remotes/origin/*
git fetch
git checkout gh-pages
git pull origin gh-pages
git checkout master service test utils workers run_service.py doc
git reset HEAD

# Generate docu
cd doc

# Generate rst files from sources
sphinx-apidoc -o . ../

mkdir _static

# Python modules are imported for reading the docstrings, therefore some
# environment variables are needed
BROKER_HOST=broker BROKER_USER=user BROKER_PASSWORD=password \
DB_HOST=db \
CONFIG_DIR=/config RESOURCE_DIR=test/resources WORKING_DIR=/data/workspace \
REPOSITORY_DIR=/data/repository STAGING_DIR=/data/staging \
make html

cd ..

rm -R _modules
rm -R _static

# Move generated HTML files to root so github pages can consume them
mv -fv doc/_build/html/* ./

# Remove non-docu files
sudo rm -rf config service test utils workers run_service.py doc _sources __pycache__ data redis-data

# Add files for bypassing jekyll in github pages
touch .nojekyll
touch _static/.nojekyll
touch _modules/.nojekyll

# Push docu to docu-branch and go back to master
git add -A
set +e
git commit -m "Generated gh-pages for `git log master -1 --pretty=short --abbrev-commit`"
set -e
git push https://${GITHUB_TOKEN}@github.com/dainst/cilantro.git gh-pages -f  # TODO
git checkout master
