#!/usr/bin/env bash

set -euo pipefail

BASEDIR="$( cd "$(dirname "$0")" ; pwd -P )"
INPUT=${1:-'input.txt'}

# zig run main.zig -- "$BASEDIR/$INPUT"

zig build-exe main.zig -O ReleaseFast
./main "$BASEDIR/$INPUT"
