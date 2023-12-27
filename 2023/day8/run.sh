#!/usr/bin/env bash

set -euo pipefail

BASEDIR="$( cd "$(dirname "$0")" ; pwd -P )"
INPUT="input.sample2.txt"

zig run main.zig -- "$BASEDIR/$INPUT"

# zig build-exe main.zig -O ReleaseSmall
# ./main "$BASEDIR/$INPUT"
