#!/bin/sh

(cd client &&
    npm run build)
(cd server &&
    rm -rf build &&
    npm run build)
(rm -rf dist &&
    mkdir dist &&
    mv server/build/main/* dist/ &&
    mkdir dist/static &&
    mv client/dist/* dist/static &&
    cp server/package-lock.json server/package.json dist/ &&
    cd dist &&
    npm i &&
    rm package-lock.json package.json)
