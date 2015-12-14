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

function addLegend() {
  var ann_bar = $(".annotator-toolbar");
  var legend = $("<button/>")
            .attr("title", "Legend")
            .attr("name", "show-legend")
            .attr("data-toggle", "modal")
            .attr("data-target", "#legendModal")
            .addClass("annotator-frame-button h-icon-format-list-numbered");
  var li = $("<li/>");
  li.append(legend);
  ann_bar.find("ul").append(li);
}

function addShare() {
  var ann_bar = $(".annotator-toolbar");
  var share = $("<button/>")
            .attr("title", "share")
            .attr("name", "show-share")
            .attr("data-toggle", "modal")
            .attr("data-target", "#shareModal")
            .addClass("annotator-frame-button h-icon-share");
  var li = $("<li/>");
  li.append(share);
  ann_bar.find("ul").append(li);  
}

function addUpload() {
  var ann_bar = $(".annotator-toolbar");
  var file_upload = $("<button/>")
            .attr("title", "upload")
            .attr("name", "show-upload")
            .attr("data-toggle", "modal")
            .attr("data-target", "#uploadModal")
            .addClass("annotator-frame-button fa fa-cloud-upload");
  var li = $("<li/>");
  li.append(file_upload);
  ann_bar.find("ul").append(li); 
}

function addUpdateTags() {
  loadModal("modals/update_tags.html");
  var ann_bar = $(".annotator-toolbar");
  var file_upload = $("<button/>")
            .attr("id", "updateTags")
            .attr("title", "Update Tags on Github")
            .attr("name", "update-tags")
            .attr("data-toggle", "modal")
            .attr("data-target", "#confirmUpdateModal")
            .addClass("annotator-frame-button fa fa-github");
  var li = $("<li/>");
  li.append(file_upload);
  ann_bar.find("ul").append(li);
}

function getLegendModal() {
  loadModal("modals/legend.html");
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

function fetchFile() {
  filepath = queryParameters()["file"].substring(1);
  $.ajax({
    type: "GET",
    url: SERVER + "getfile",
    data:{"file_path": filepath},
    success: function(data, textStatus, jqXHR) {
      $("#fid").val(JSON.parse(data)["id"]);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.error(textStatus);
    }
  });
}

function createModal() {
  // Legend Modal and its functions
  getLegendModal()
  
  // Share Modal and its functions
  getShareModal();
  
  // File Modal and its functions
  getFileModal()
}



function load_extras() {
  fetchFile();
  createModal();
  addLegend();
  addShare();
  addUpload();
  addUpdateTags();
}

window.get_annotations = get_annotations
window.load_extras = load_extras
