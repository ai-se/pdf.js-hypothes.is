from __future__ import print_function, division
import traceback, os,sys
sys.path.append(os.path.abspath("."))
__author__ = 'george'
from config import PDF_FOLDER
from werkzeug import secure_filename
import db.elastic as elastic
import json
from utils.lib import decode
import artifacts.artifact as artifact

def upload_file(file_data):
  file_obj = file_data['file']
  file_path = save_file(file_obj)
  if not file_path:
    print("Print File already exists")
    return
  try:
    file_data.pop('file', None)
    file_data['file_path'] = file_path
    elastic.insert_file(file_data)
  except Exception:
    print(traceback.format_exc())
  return "saved"

def save_file(file_obj):
  try:
    filename = secure_filename(file_obj.filename)
    full_path = os.path.join(PDF_FOLDER, filename)
    if not os.path.exists(full_path):
      file_obj.save(os.path.join(PDF_FOLDER, filename))
      return "files/"+filename
    else:
      # TODO throw exception and handle here
      return None
  except Exception:
    print(traceback.format_exc())
  return None

def load_files(query=None):
  if not query:
    return elastic.get_files()
  else:
    query_body = {
      "query" : {
        "bool" : {
          "should" : [
            {"match" : {"title": query}},
            {"match" : {"desc": query}},
            {"match" : {"authors": query}}
          ],
          "minimum_should_match": 1
        }
      }
    }
    return elastic.search(elastic.FILE_TYPE, query_body)

def update_artifacts(file_id):
  if not file_id:
    return
  doc = decode(json.loads(elastic.get(file_id)))
  artifacts = doc.get("artifacts", {})
  artifacts = artifact.save(doc["title"], doc["file_path"], artifacts)
  _id = doc["_id"]
  del doc["_id"]
  doc["artifacts"] = artifacts
  elastic.update_file(_id, doc)

def get_file(file_path):
  return elastic.get_doc_from_path(file_path)