from __future__ import print_function, division
import time, traceback
import elasticsearch
from elasticsearch.exceptions import NotFoundError
import json
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
  docs = es.search(index=INDEX, doc_type=FILE_TYPE, body={"query": {"match_all": {}}})
  rets = format_docs(docs)
  return json.dumps(rets)

def search(type, query):
  docs = es.search(index=INDEX, doc_type=type, body=query)
  rets = format_docs(docs)
  return json.dumps(rets)

def format_docs(docs):
  rets = []
  for doc in docs['hits']['hits']:
    doc['_source']['id'] = doc['_id']
    rets.append(doc['_source'])
  return rets

def get_doc_from_path(file_path):
  docs = es.search(index=INDEX, doc_type=FILE_TYPE, body={"query": {"term":{"file_path": file_path}}})
  rets = format_docs(docs)
  if rets:
    return json.dumps(rets[0])
  return None

def get(doc_id):
  try:
    doc = es.get(index=INDEX, doc_type=FILE_TYPE, id=doc_id)
    doc["_source"]["_id"] = doc["_id"]
    return json.dumps(doc["_source"])
  except NotFoundError:
    print("Document not found : %s"%doc_id)
    return None

def update_file(file_id, file_data):
  try:
    es.index(index=INDEX, doc_type=FILE_TYPE, id=file_id, body=file_data)
  except Exception:
    print(traceback.format_exc())

def _setup():
  es.indices.create(index=INDEX, body={
    "mappings": {
      "pdf" : {
        "properties" : {
          "file_path" : {
            "type" : "string",
            "index": "not_analyzed"
          }
        }
      }
    }})

def _delete():
  es.indices.delete(index=INDEX)

def _test():
  docs = es.search(index=INDEX, doc_type=FILE_TYPE, body={"query": {"term":{"file_path": "files/HW3.pdf"}}})
  print(docs)

if __name__ == "__main__":
  _setup()
  #_delete()
