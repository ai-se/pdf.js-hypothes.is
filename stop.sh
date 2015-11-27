#! /bin/bash

while read pid
do
   kill -9 $pid
done < pids.txt
