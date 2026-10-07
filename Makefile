# Release helpers. See scripts/release.sh.

.PHONY: release-version
# Next release tag. ACTION=bump writes the version files, ACTION=tag creates the tag here.
release-version:
	@scripts/release.sh $(ACTION)

.PHONY: push-release
# Pushes the newest tag that origin does not have, after you type its name.
push-release:
	@scripts/release.sh push
