from __future__ import print_function, division
import traceback, os,sys
sys.path.append(os.path.abspath("."))
__author__ = 'george'
from utils.lib import *
from config import BASE_URI
import urllib2, json, yaml

HYPOTHESIS_API = "https://hypothes.is/api/search"

def fetch_tags(file_path):
  uri = HYPOTHESIS_API + "?uri=" + BASE_URI + file_path
  response = urllib2.urlopen(uri)
  data = response.read()
  json_data = yaml.safe_load(data)
  return json_data


def parse_tags(tags):
  artifacts = {}
  for row in tags['rows']:
    key = decode(row["text"])
    value = decode(row['target'][0]['selector'][1]['exact']).strip()
    artifacts[key] = artifacts.get(key, []) + [value]
  return artifacts

def run():
  tags = fetch_tags("/files/cocreport.pdf")
  artifacts = parse_tags(tags)

if __name__ == "__main__":
  run()