from __future__ import print_function, division
import time, traceback
import elasticsearch
__author__ = 'george'

es = elasticsearch.Elasticsearch()
INDEX = "writered"
FILE_TYPE = "pdf"

def insert_file(file_data):
  try:
    file_data['authors'] = [author.strip() for author in file_data['authors'].split(",")]
    file_data['ts'] = time.time()
    es.index(index=INDEX, doc_type=FILE_TYPE, body=file_data)
  except Exception:
    print(traceback.format_exc())
    # TODO throw exception

def get_files():
  try:
    docs = es.search(index=INDEX, doc_type=FILE_TYPE, body={"query": {"match_all": {}}})
    rets = [doc['_source'] for doc in docs['hits']['hits']]
    print(rets)
  except Exception:
    pass



def _setup():
  es.indices.create(index=INDEX)

if __name__ == "__main__":
  #_setup()
  get_files()