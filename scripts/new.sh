#!/usr/bin/env bash

#cd ../source/_article

[ -z "$1" ] && echo "no title" && exit;
FILE=source/article/${1// /-}

[ -f "$FILE" ] && echo "existed $FILE" && exit;

cd ..
moka n "$1"

if [ -f "$FILE" ]; then
    if ! grep -q -m1 "skip:\s*true" "$FILE"; then
        echo "$FILE will be sent."
    fi
fi