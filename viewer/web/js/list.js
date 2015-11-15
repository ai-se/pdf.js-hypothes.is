$(document).ready(function() {
  getFileModal();
  $("#toggleUpload").off("click").on("click", function(e){
    e.preventDefault();
    toggleUpload();
    return false;
  });
  load_files();
  $('.update-tags').click(function(e) {
    alert($(this).attr('fileId'));
  });
  $('#searchFrm').submit(function(e) {
    search();
    return false;
  });
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
  var updateButton = "<button onclick='triggerTagUpdate(\""+fileObj.id+"\")' fileId='"+fileObj.id+"' class='btn btn-sm btn-primary update-tags'>Update Tags</button>";
  wrapper.append("<div class='desc-wrpr'>"+updateButton+"</div>");
  wrapper.appendTo($(".results"));
}

function triggerTagUpdate(fid) {
  $('.update-tags[fileId='+fid+']').attr("disabled", true);
  updateTags(fid, function(){
    $('.update-tags[fileId='+fid+']').attr("disabled", false);
  });
}


function clearTiles() {
  $(".results").html("");
}

function noDataFound() {
  $(".results").append("<div class='no-data'>Oops No Data found for that query !!</div>")
}

function toggleUpload(){
  $("#uploadModal").modal("toggle");
}