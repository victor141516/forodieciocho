#!/bin/sh

Xvfb :100 -ac &
export DISPLAY=:100
exec npm start
