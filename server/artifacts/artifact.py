from __future__ import print_function, division
import traceback, os,sys
sys.path.append(os.path.abspath("."))
__author__ = 'george'
from utils.lib import *
from config import BASE_URI
import urllib2, json, yaml
from utils.git import Git

HYPOTHESIS_API = "https://hypothes.is/api/search"

ARTIFACTS = {
  "1": "Motivational statements",
  "2": "Hypothesis",
  "3": "Checklists",
  "4": "Related Work",
  "5": "Study Instruments",
  "6": "Statistical Tests",
  "7": "Commentary",
  "8": "Informative Visualizations",
  "9": "Baseline results",
  "10": "Sampling Procedures",
  "11": "Patterns/Anti-Patterns",
  "12": "Negative Results",
  "13": "Tutorial Materials",
  "14": "New Results",
  "15": "Future Work",
  "16": "Data",
  "17": "Scripts",
  "18": "Sample Models",
  "19": "Delivery tools"
}

def fetch(file_path):
  uri = HYPOTHESIS_API + "?uri=" + BASE_URI + file_path
  response = urllib2.urlopen(uri)
  data = response.read()
  json_data = yaml.safe_load(data)
  return json_data


def parse(tags):
  artifacts = {}
  for row in tags['rows']:
    key = ARTIFACTS.get(decode(row["text"]), "Unknown")
    value = decode(row['target'][0]['selector'][1]['exact']).strip()
    artifacts[key] = artifacts.get(key, []) + [value]
  return artifacts


def save(name, path):
  tags = fetch(path)
  artifacts = parse(tags)
  for key, values in artifacts.items():
    title, body = create_issue(name, key, values)
    Git.create_issue(title, body)


def create_issue(paper, artifact, values):
  title = artifact + " - " + paper
  body = "\n".join(values)
  return title, body

def run():
  tags = fetch("/files/cocreport.pdf")
  artifacts = parse(tags)
  print(artifacts)


if __name__ == "__main__":
  save("Negative Results for Software Effort Estimation", "/files/cocreport.pdf")