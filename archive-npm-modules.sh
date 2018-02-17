#!/bin/bash

npm prune
npm install
npm shrinkwrap --dev
./node_modules/.bin/shrinkpack
