from __future__ import print_function, division
import traceback, os,sys
sys.path.append(os.path.abspath("."))
__author__ = 'george'
from config import PDF_FOLDER
from werkzeug import secure_filename
from db.elastic import *

def upload_file(file_data):
  file_obj = file_data['file']
  file_path = save_file(file_obj)
  print(file_path)
  if not file_path:
    print("Print File already exists")
    return
  try:
    file_data.pop('file', None)
    file_data['file_path'] = file_path
    insert_file(file_data)
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
    return get_files()
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
    return search(FILE_TYPE, query_body)
