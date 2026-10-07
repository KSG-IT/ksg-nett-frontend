# Release procedure

A release is a tag on `master`. Nothing is edited or committed to make one. CI builds, deploys and creates the GitHub Release.

## Environments

| Environment                    | Trigger                                            |
| ------------------------------ | -------------------------------------------------- |
| Dev (`app-dev.ksg-nett.no`)    | Every merge to `master` (`deploy_development.yml`) |
| Production (`app.ksg-nett.no`) | A tag `v*` (`deploy_production.yml`)               |

## Release

1. `git checkout master && git pull`
2. `yarn release:preview` prints the next tag. It changes nothing.
3. `yarn release` lists the merged PRs since the last tag. Type the tag name to confirm. It creates the tag and pushes it.
4. Open the run in GitHub Actions and approve the deployment to the `production` environment, after the tests pass.
5. CI deploys and creates the GitHub Release with notes from the merged PRs.

Tags are versions in the form `v<year>.<month>.<number>`, for example `v2026.10.4`. Only an admin can create a tag, and a tag cannot be moved or deleted. The workflow refuses a tag that is not on `master`.

The version in the app badge comes from the tag. A dev build shows `dev-<commit>`.

## Rules

- Release the backend first when the release needs a new backend. See `release_procedure.md` in the backend repo.
- The "What's new" notification (`src/components/WhatsNewNotification/WhatsNewNotification.tsx`) is written by hand. Update it in a PR before the release, when the release needs an announcement.
- Features that are not ready stay behind a feature flag, since every merge to `master` can go in the next release.

## Roll back

Open the run of the older tag in GitHub Actions, use "Re-run all jobs" and approve. Production then builds the older commit. The last job, which creates the GitHub Release, fails because that release exists. This is harmless.

## Hotfix

The workflow refuses a tag that is not on `master`. Merge the fix to `master` in a PR, then make a normal release. Keep unfinished work behind a feature flag so that `master` is always safe to ship.
