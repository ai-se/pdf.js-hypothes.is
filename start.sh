# Run basic bash scripts
source ~/.bashrc

# Run Server
python server/run.py &
echo $! >> pids.txt

# Run Elastic Search
~/elasticsearch-1.7.2/bin/elasticsearch &
echo $! >> pids.txt
