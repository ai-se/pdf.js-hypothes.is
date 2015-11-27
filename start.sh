#! /bin/bash

# Run basic bash scripts
source ~/.bashrc

# Remove Existing PIDs File
rm -rf pids.txt

# Run Server
python server/run.py > logs/server.log &
echo $! >> pids.txt

# Run Elastic Search
~/elasticsearch-1.7.2/bin/elasticsearch > logs/elastic.log &
echo $! >> pids.txt
