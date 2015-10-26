from __future__ import print_function, division
import traceback
from flask import Flask
from flask_cors import CORS, cross_origin
from utils.lib import *
import api.file_manager as file_manager
from config import ORIGIN, MODE
app = Flask(__name__)
app.config['SECRET_KEY'] = 'the quick brown fox jumps over the lazy   dog'
app.config['CORS_HEADERS'] = 'Content-Type'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024

cors = CORS(app, resources={
  r"/upload": {"origins": ORIGIN},
  r"/": {"origins": ORIGIN}
  })

@app.route("/")
#@cross_origin(origin=ORIGIN,headers=['Content- Type','Authorization'])
@crossdomain(origin=ORIGIN)
def hello_world():
  return "Hello World"

@app.route("/upload", methods=['POST', 'OPTIONS'])
@cross_origin(origin=ORIGIN)
def upload():
  if request.method == 'POST':
    f = request.files['file']
    title = request.form.get("title", "No Title")
    authors = request.form.get("authors", "No Authors")
    desc = request.form.get("desc", None)
    file_data = O(
      file = f,
      title = title,
      authors = authors,
      desc = desc
    ).has()
    file_manager.upload_file(file_data)
    return "Done"
  return '''
    <!doctype html>
    <title>Upload new File</title>
    <h1>Upload new File</h1>
    <form action="" method=post enctype=multipart/form-data>
      <p><input type=file name=file>
         <input type=submit value=Upload>
    </form>
    '''

@app.route("/search", methods=['GET'])
@cross_origin(origin=ORIGIN)
def load_files():
  query = request.args.get("query")
  files = file_manager.load_files(query=query)
  return str(files)

if __name__ == "__main__":
  if MODE == "prod":
    app.run(host='0.0.0.0')
  else:
    app.run()
