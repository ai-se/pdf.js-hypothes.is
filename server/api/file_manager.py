from __future__ import print_function, division
import traceback, os
__author__ = 'george'
from config import PDF_FOLDER
from werkzeug import secure_filename

def upload_file(file_data):
  file_obj = file_data['file']
  file_path = save_file(file_obj)
  print(file_path)
  if not file_path:
    print("Print File already exists")
    # TODO handle exception here
    return
  # TODO - Save file to elasticsearch
  pass

def save_file(file_obj):
  filename =secure_filename(file_obj.filename)
  try:
    full_path = os.path.join(PDF_FOLDER, filename)
    if not os.path.exists(full_path):
      file_obj.save(os.path.join(PDF_FOLDER, filename))
    else:
      # TODO throw exception and handle here
      return None
  except Exception:
    print(traceback.format_exc())

  return "files/"+filename