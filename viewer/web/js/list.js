$(document).ready(function() {
  load_files();
});

$('#searchFrm').submit(function(e) {
  e.preventDefault();
  search();
});

function load_files(query) {
  $.ajax({
    type: "GET",
    url: SERVER + "search",
    data : {query: query},
    timeout: 50000,
    success: function(data, textStatus, jqXHR) {
      data = JSON.parse(data);
      clearTiles();
      if (data && data.length) {
        makeTiles(data);
      } else {
        noDataFound();
      }
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.error(textStatus);
    }
  });
}

function search() {
  query = $("#searchTxt").val();
  if (query)
    load_files(query);
}

function makeTiles(files){
  files.forEach(function(file){
    makeTile(file);
  });
}

function escape_slash(str) {
  return str.replace(/\//g, '%2F');
}

BASE_PATH=BASE_PAGE+"?file="

function makeTile(fileObj) {
  var wrapper=$('<div/>')
          .addClass("wrapper")
          .append("<label class='lbl-title'>Title: </label> <a target='_blank' href="+BASE_PATH+escape_slash("/"+fileObj.file_path)+">"+fileObj.title+"</a>")
          .append("<div class='author-wrpr'><label class='author-lbl'>Authors: </label> "+fileObj.authors.toString()+"</div>");
  if (fileObj.desc) {
    wrapper.append("<div class='desc-wrpr'><label class='desc-lbl'>Description: </label> "+fileObj.desc+"</div>");
  }
  wrapper.appendTo($(".results"));
}

function clearTiles() {
  $(".results").html("");
}

function noDataFound() {
  $(".results").append("<div class='no-data'>Oops No Data found for that query !!</div>")
}