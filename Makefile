# Release helpers. See scripts/release.sh.

.PHONY: release-version
# Prints the next release tag. Changes nothing.
release-version:
	@scripts/release.sh next

.PHONY: release
# Shows what ships, asks, then tags master and pushes the tag.
release:
	@scripts/release.sh release
