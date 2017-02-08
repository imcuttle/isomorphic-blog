#!/usr/bin/env bash

#cd ../source/_article

[ -z "$1" ] && echo "no title" && exit;
echo $PWD-$1
cd ..
moka n "$1"