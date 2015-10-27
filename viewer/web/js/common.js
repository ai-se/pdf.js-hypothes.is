function loadModal(modal, callback) {
  $.get(modal, function(data) {
    $('body').append(data);
    callback && callback();
  });
}

function getFileModal() {
  callback = function(){
    $(document).on('change', '#fileSelect', function(e) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      var file_name = $(this).val().replace(/\\/g, '/').replace(/.*\//, '');
      $("#fileName").val(file_name);
    });
    $("#fileForm").submit(function(e){
        e.preventDefault();
        file = $("#fileSelect")[0].files[0];
        if (file && file.type=="application/pdf") {
          send_file(file);
        }
    });
  };
  loadModal("modals/upload.html", callback);
}

function send_file(file) {
  var data = new FormData();
  data.append("file", file);
  data.append("title", $("#title").val());
  data.append("authors", $("#authors").val());
  data.append("desc", $("#desc").val());
  $.ajax({
    type: "POST",
    url: SERVER + "upload",
    data: data,
    timeout: 50000,
    processData: false,
    crossDomain: true,
    contentType: false,
    jsonp: false,
    success: function(data, textStatus, jqXHR) {
      clear_upload();
      $("#uploadModal").modal('hide');
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.error(textStatus);
    }
  });
}

function clear_upload() {
  $("#title").val("");
  $("#authors").val("");
  $("#desc").val("");
  $("#fileSelect").replaceWith($("#fileSelect").clone());
  $("#fileName").val("");
}