from flask import Flask
from flask_cors import CORS, cross_origin
from utils.lib import *
app = Flask(__name__)
app.config['SECRET_KEY'] = 'the quick brown fox jumps over the lazy   dog'
app.config['CORS_HEADERS'] = 'Content-Type'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024

cors = CORS(app, resources={
  r"/upload": {"origins": "*"},
  r"/": {"origins": "localhost"}
  })

@app.route("/")
@cross_origin(origin='*',headers=['Content- Type','Authorization'])
def hello_world():
  return "Hello World"

@app.route("/upload", methods=['POST'])
@cross_origin(origin='*')
def upload():
  if request.method == 'POST':
    f = request.files['file']
    print(f)
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

if __name__ == "__main__":
  app.run()