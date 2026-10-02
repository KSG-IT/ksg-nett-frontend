#!/bin/bash

if [ "$1" = '' ]
then
	echo "Please specify an environment"
fi

# Files in assets/ have a content hash in the name, so browsers can keep them
# forever. Every other file (index.html, version.json, manifest.json) must be
# checked against the server on each load, or browsers guess a cache lifetime
# and keep running old JavaScript. No --delete: open tabs still load old chunks.
upload() {
	aws s3 sync --acl public-read dist/assets "s3://$1/assets" \
		--cache-control "public, max-age=31536000, immutable"

	aws s3 sync --acl public-read dist/ "s3://$1" \
		--exclude "assets/*" \
		--cache-control "no-cache"

	aws cloudfront create-invalidation --distribution-id "$2" --paths "/*"
}


if [ "$1" = 'development' ]
then
	upload app-dev.ksg-nett.no E16GL36WMCPKCU
	exit
fi


if [ "$1" = 'production' ]
then
	upload app.ksg-nett.no E2K4WV02BTO7FQ
	exit
fi
