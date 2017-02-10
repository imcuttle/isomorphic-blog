#!/usr/bin/env sh

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $DIR

[ -z "$1" ] && echo "no title" && exit;

name=$(echo $1 | sed -e "s/  */-/g")
name=$(echo $name | tr "[A-Z]" "[a-z]")

FILE=source/article/$name.md

[ -f "$FILE" ] && echo "existed $FILE" && exit;
cd ..
moka n "$name"