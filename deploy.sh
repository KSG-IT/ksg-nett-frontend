#!/bin/bash

if [ "$1" = '' ]
then
	echo "Please specify an environment"
fi


if [ "$1" = 'development' ]
then
	aws s3 sync --acl public-read dist/ s3://app.ksg-nett.no

	aws cloudfront create-invalidation --distribution-id E16GL36WMCPKCU --paths "/*"
	exit
fi


if [ "$1" = 'production' ]
then
	aws s3 sync --acl public-read dist/ s3://app-dev.ksg-nett.no

	aws cloudfront create-invalidation --distribution-id E2K4WV02BTO7FQ --paths "/*"
	exit
fi