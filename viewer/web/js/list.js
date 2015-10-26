$(document).ready(function() {
  load_all();
});

function load_all() {
  $.ajax({
    type: "GET",
    url: SERVER + "all",
    timeout: 50000,
    success: function(data, textStatus, jqXHR) {
      console.log(data);
      data = JSON.parse(data);
      if (data && data.length)
        makeTiles(data);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.error(textStatus);
    }
  });
}


function makeTiles(files){
  console.log(files[0]);
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
  wrapper.appendTo($(".container"));
}