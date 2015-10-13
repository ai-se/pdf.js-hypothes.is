/*
npm install -g browserify
npm install dom-anchor-text-quote
npm install dom-seek
npm install jquery
npm install xpath-range
browserify anchor.js -o anchor-bundle.js
*/


/*
<script src="./anchor-bundle.js"></script>
<script>
get_annotations();
</script>
*/


function attach_annotation(tag, text, exact, prefix) {
	var TextQuoteAnchor = require ('dom-anchor-text-quote')
	var XPathRange = require('xpath-range')			       
	var root = $('body')[0];
	var tqa = new TextQuoteAnchor(root, exact, {'prefix':prefix});
	var range = tqa.toRange();
	nodes = XPathRange.Range.sniff(range).normalize().textNodes()
	$(nodes).wrap('<span style="background-color:' + tag + '" title="' + text + '"></span>')
}

function get_annotations() {
	url = 'https://hypothes.is/api/search?uri=' + location.href;
	$.ajax({
		url: url,
		success: attach_annotations
	});
}

function attach_annotations(data) {
	var rows = data['rows']
	for ( var i=0; i < rows.length; i++ ) {
		var row = rows[i];
		if ( ! row.hasOwnProperty('target') )
			continue;
		var selectors = row['target'][0]['selector'];
		var selector = null;
		for (var j=0; j<selectors.length; j++) {
			if ( selectors[j].hasOwnProperty('exact') ) 
				selector = selectors[j];
		}
		if ( selector == null )
			continue;
		var exact = selector['exact'];
		var prefix = selector['prefix'];
		var text = row['text'];
		var tags = row['tags'];
		if ( tags.length ) {
            tag = tags[0];			
		}
		attach_annotation(tag, text, exact, prefix);
	}
}

function add_legend() {
  var ann_bar = $(".annotator-toolbar");
  var legend = $("<button/>")
            .attr("title", "Legend")
            .attr("name", "show-legend")
            .attr("data-toggle", "modal")
            .attr("data-target", "#legendModal")
            .addClass("h-icon-format-list-numbered");
  var li = $("<li/>");
  li.append(legend);
  ann_bar.find("ul").append(li);
}

function add_share() {
  var ann_bar = $(".annotator-toolbar");
  var share = $("<button/>")
            .attr("title", "share")
            .attr("name", "show-share")
            .attr("data-toggle", "modal")
            .attr("data-target", "#shareModal")
            .addClass("h-icon-share");
  var li = $("<li/>");
  li.append(share);
  ann_bar.find("ul").append(li);  
}

function add_upload() {
  var ann_bar = $(".annotator-toolbar");
  var file_upload = $("<button/>")
            .attr("title", "upload")
            .attr("name", "show-upload")
            .attr("data-toggle", "modal")
            .attr("data-target", "#uploadModal")
            .addClass("fa fa-cloud-upload");
  var li = $("<li/>");
  li.append(file_upload);
  ann_bar.find("ul").append(li); 
}

function loadModal(modal, callback) {
  $.get(modal, function(data) {
    $('body').append(data);
    callback && callback();
  });
}

function getLegendModal() {
  loadModal("modals/legend.html")
}

function getShareModal() {
  callback = function(){
    pageURL = window.location.href;
    $("#shareURL").val(pageURL);
    $("#twitterURL").attr("href", "https://twitter.com/intent/tweet?url=" + pageURL);
    $("#facebookURL").attr("href", "https://www.facebook.com/sharer/sharer.php?u=" + pageURL);
    $("#googlePlusURL").attr("href", "https://plus.google.com/share?url=" + pageURL);
    $("#mailTo").attr("href", "mailto?subject=Annotations&body=" + pageURL);
  };
  loadModal("modals/share.html", callback);
}

function getFileModal() {
  callback = function(){
    $(document).on('change', '#fileSelect', function(e) {
      print(e);
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

function create_modal() {
  // Legend Modal and its functions
  getLegendModal()
  
  // Share Modal and its functions
  getShareModal();
  
  // File Modal and its functions
  getFileModal()
}

function load_extras() {
  create_modal();
  add_legend();
  add_share();
  add_upload();
}

window.get_annotations = get_annotations
window.load_extras = load_extras
