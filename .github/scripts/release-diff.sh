#!/usr/bin/env bash
# Write what a deploy changes to the job summary: the commits on the first-parent
# line, a diffstat and a compare link. Usage: release-diff.sh <base> <head>
set -euo pipefail

base="${1:-}"
head="${2:?head is required}"
summary="${GITHUB_STEP_SUMMARY:-/dev/stdout}"

{
  echo "## Changes in this deploy"
  if [ -z "$base" ] || ! git cat-file -e "${base}^{commit}" 2>/dev/null; then
    echo
    echo "No previous release found to compare with."
  else
    echo
    echo "\`${base:0:7}\` → \`${head:0:7}\`: ${GITHUB_SERVER_URL:-https://github.com}/${GITHUB_REPOSITORY:-}/compare/${base}...${head}"
    echo
    echo "### Commits"
    git log --first-parent --format='- `%h` %s' "${base}..${head}"
    echo
    echo "### Files"
    echo '```'
    git diff --shortstat "$base" "$head"
    echo '```'
    changed="$(git diff --name-only "$base" "$head" -- package.json yarn.lock)"
    if [ -n "$changed" ]; then
      echo "Dependencies changed: $(echo "$changed" | paste -sd, -)"
    fi
  fi
} >> "$summary"
