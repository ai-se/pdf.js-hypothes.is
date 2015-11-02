from __future__ import print_function, division
__author__ = 'george'
from lib import O
from config import GIT_TOKEN, MODE
import requests, json


OWNER = "ai-se"
REPO = "Artifacts-test" if MODE == "dev" else "Artifacts-test" # TODO change to prod


class Git:
  token = None
  def __init__(self):
    pass

  @staticmethod
  def auth():
    if not Git.token:
      Git.token = GIT_TOKEN
    return Git.token

  @staticmethod
  def clear_auth():
    Git.token = None

  @staticmethod
  def get_auth_header():
    return {"Authorization" : "token "+Git.auth()}

  @staticmethod
  def create_issue(title, body):
    url = 'https://api.github.com/repos/%s/%s/issues' % (OWNER, REPO)
    data = {
      'title' : title,
      'body' : body
    }
    r = requests.post(url, data=json.dumps(data), headers = Git.get_auth_header())
    print(r)
    print("*****************")
    print(r.text)
    print("*****************")
    print(r.status_code)


