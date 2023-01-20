#!/bin/bash

if [ "$1" = '' ]
then
	echo "Please specify a release name"
fi

# Create a release
sentry-cli releases new $1
sentry-cli releases files $1 upload-sourcemaps ./dist
sentry-cli releases finalize $1
