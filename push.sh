#!/bin/sh
# COMMENT=$1
# if [ -z "$COMMENT" ];
# then
# 	name1='commit'
# fi 


# name1="$1"
# echo "local files: $name1"
# if [ -z "$name1" ];
# then
# 	name1=*
# else
# 	if [ "$name1"==*/ ];
# 	then
# 		name1=$name1*
# 	fi
# fi

# name2=$2
# echo "remote files:" $name2
# if [ -z "$name2" ];
# then
# 	name2=""
# else
# 	if [ "$name2"==*/ ];
# 	then
# 		name2=$name2
# 	fi
# fi
# echo scp -r ./$name1 binli@192.168.31.127:/home/binli/repos/cayman/$name2

# scp -r ./$name1 binli@192.168.31.127:/home/binli/repos/cayman/$name2


git add -A
git commit -m 'update posts'
git push