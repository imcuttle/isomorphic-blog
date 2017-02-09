#!/usr/bin/env bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $DIR

[ -z "$1" ] && echo "no title" && exit;

name=$(echo $1 | sed -e "s/  */-/g")
name=$(echo $name | tr "[A-Z]" "[a-z]")

FILE=source/article/$name.md

[ -f "$FILE" ] && echo "existed $FILE" && exit;
cd ..
moka n "$name"

if [ -f "$FILE" ]; then
    if ! grep -q -m1 "skip:\s*true" "$FILE"; then
        echo "$FILE will be sent."
    fi
fi