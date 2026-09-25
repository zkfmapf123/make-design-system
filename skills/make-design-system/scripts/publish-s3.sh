#!/usr/bin/env bash
# Optional step 6: zip candidates and upload each candidates/*/index.html to S3 (folders kept).
# usage: publish-s3.sh <candidates-dir> <bucket> [prefix=candidates] [public-domain]
# Never uploads .benchmark/ (reference analysis) — only */index.html is included.
set -euo pipefail
dir=${1:?candidates dir}; bucket=${2:?bucket}; prefix=${3:-candidates}; domain=${4:-}

command -v aws >/dev/null || { echo "ERROR: aws CLI not installed" >&2; exit 1; }
aws sts get-caller-identity >/dev/null || { echo "ERROR: aws credentials not configured" >&2; exit 1; }

zipfile="$(dirname "$dir")/design-candidates.zip"
rm -f "$zipfile"
(cd "$(dirname "$dir")" && zip -rq "$zipfile" "$(basename "$dir")" -i "*/index.html")
echo "zip: $zipfile"

aws s3 cp "$dir" "s3://$bucket/$prefix" --recursive --exclude "*" --include "*/index.html" \
  --content-type "text/html; charset=utf-8" --cache-control "no-cache" --only-show-errors
aws s3 ls "s3://$bucket/$prefix/" --recursive

if [ -n "$domain" ]; then
  for f in "$dir"/*/index.html; do
    name=$(basename "$(dirname "$f")")
    url="https://$domain/$prefix/$name/index.html"
    echo "$(curl -s -o /dev/null -w '%{http_code}' "$url") $url"
  done
fi
