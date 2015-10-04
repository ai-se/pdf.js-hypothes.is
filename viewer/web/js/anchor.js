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

var $=require("jquery");
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
	var $ = require('jQuery');
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

function create_modal() {
  var legendModal = '\
  <div id="legendModal" class="modal fade" role="dialog">\
    <div class="modal-dialog">\
      <!-- Modal content-->\
      <div class="modal-content">\
        <div class="modal-header">\
          <button type="button" class="close" data-dismiss="modal">&times;</button>\
          <h4 class="modal-title">Artifacts Legend</h4>\
        </div>\
        <div class="modal-body">\
          <table class="table table-striped">\
            <thead>\
              <tr>\
                <th>Index</th>\
                <th>Name</th>\
                <th>Description</th>\
              </tr>\
            </thead>\
            <tbody>\
              <tr>\
                <td>1</td>\
                <td><tb>Motivational statements</tb></td>\
                <td>Reports or challenge statements or lists of open issues that prompt an analysis</td>\
              </tr>\
              <tr>\
                <td>2</td>\
                <td><tb>Hypothesis</tb></td>\
                <td>Expected effects in some area</td>\
              </tr>\
              <tr>\
                <td>3</td>\
                <td><tb>Checklists</tb></td>\
                <td>Used to design the analysis(see also, the <a href="http://atulgawande.com/book/the-checklist-manifesto/">Checklist Manifesto</a>)</td>\
              </tr>\
              <tr>\
                <td>4</td>\
                <td><tb>Related Work</tb></td>\
                <td>Comprehensive, annotated, and insightful (e.g. showing the development or open areas in a field)</td>\
              </tr>\
              <tr>\
                <td>5</td>\
                <td><tb>Study instruments</tb></td>\
                <td>e.g. surveys interview scripts, etc</td>\
              </tr>\
              <tr>\
                <td>6</td>\
                <td><tb>Statistical tests</tb></td>\
                <td>Mathematical tools to analyze results (along with some notes explaining why or when this test is necessary)</td>\
              </tr>\
              <tr>\
                <td>7</td>\
                <td><tb>Commentary</tb></td>\
                <td>About the scripts used in the analysis</td>\
              </tr>\
              <tr>\
                <td>8</td>\
                <td><tb>Informative visualizations</tb></td>\
                <td>eg <a href="http://www.edwardtufte.com/bboard/q-and-a-fetch-msg?msgid=0001OR">Sparklines</a></td>\
              </tr>\
              <tr>\
                <td>9</td>\
                <td><tb>Baseline results</tb></td>\
                <td>Results against which new work can be compared</td>\
              </tr>\
              <tr>\
                <td>10</td>\
                <td><tb>Sampling procedures</tb></td>\
                <td>e.g. "how did you choose the projects you studied?"</td>\
              </tr>\
              <tr>\
                <td>11</td>\
                <td><tb>Patterns/Anti-patterns</tb></td>\
                <td>Describing best practices for performing this kind of analysis / Describing cautionary tales of "gotchas" to avoid when doing this kind of work</td>\
              </tr>\
              <tr>\
                <td>12</td>\
                <td><tb>Negative results</tb></td>\
                <td>Anti-patterns, backed up by empirical results</td>\
              </tr>\
              <tr>\
                <td>13</td>\
                <td><tb>Tutorial materials</tb></td>\
                <td>Guides to help newcomers become proficient in the area. Some of these tutorial materials may be generated by the researcher and others may be collected from other sources</td>\
              </tr>\
              <tr>\
                <td>14</td>\
                <td><tb>New results</tb></td>\
                <td>Guidance on how to best handle future problems</td>\
              </tr>\
              <tr>\
                <td>15</td>\
                <td><tb>Future work</tb></td>\
                <td>Based on the results, speculations about open issues of future issues that might become the motivation for the next round of research</td>\
              </tr>\
              <tr>\
                <td>16</td>\
                <td><tb>Data</tb></td>\
                <td>Used in an analysis; either raw from a project; or some derived product</td>\
              </tr>\
              <tr>\
                <td>17</td>\
                <td><tb>Scripts</tb></td>\
                <td>Used to perform the analysis (the main analysis or the subsequent statistical tests or visualizations; e.g. the <a href="https://pypi.python.org/pypi/pysparklines">Python Sparklines generator</a> or code for a fast <a href="https://gist.github.com/timm/a6e759eb7d9b5f05b468">a12</a> test. Scripts can also implement some of the patterns identified by the paper</td>\
              </tr>\
              <tr>\
                <td>18</td>\
                <td><tb>Sample models</tb></td>\
                <td>Can generate exemplar data; or which offer an executable form of current hypotheses. Or, these models could be a set of standard problems everyone shares (e.g.the verification comminity and optimization community have libraries of standard models (or models ported from commercial apps) that they all use to baseline their tools)</td>\
              </tr>\
              <tr>\
                <td>19</td>\
                <td><tb>Delivery tools</tb></td>\
                <td>Things that let other people automatically rerun the analysis; e.g. + Config management files that can + build the system/ paper from raw material and/or + update the relevant files using some package manager + Virtual machines containing all the above scripts, data, etc, pre-configured such that a newcomer can automatically run the old analysis.</td>\
              </tr>\
            </tbody>\
          </table>\
        </div>\
        <div class="modal-footer">\
          <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>\
        </div>\
      </div>\
    </div>\
  </div>';
  $('body').append(legendModal);
  pageURL = window.location.href;
  twitterURL = "https://twitter.com/intent/tweet?url=" + pageURL;
  facebookURL = "https://www.facebook.com/sharer/sharer.php?u=" + pageURL;
  googlePlusURL = "https://plus.google.com/share?url=" + pageURL;
  mailTo = "mailto?subject=Annotations&body=" + pageURL;
  var shareModal = '\
    <div id="shareModal" class="modal fade" role="dialog">\
      <div class="modal-dialog">\
        <!-- Modal content-->\
        <div class="modal-content">\
          <div class="modal-header">\
            <button type="button" class="close" data-dismiss="modal">&times;</button>\
            <h4 class="modal-title">Share the Annotated</h4>\
          </div>\
          <div class="modal-body">\
            <p>Share the link below to show anyone these annotations and invite them to contribute their own.</p>\
            <p><input id="shareURL" type="text" readonly value="'+pageURL+'"/></p>\
            <p class="share-links">\
              <a href="'+twitterURL+'" title="Tweet link" class="h-icon-twitter"> </a>\
              <a href="'+facebookURL+'" title="Share on Facebook" class="h-icon-facebook"> </a>\
              <a href="'+googlePlusURL+'" title="Post on Google Plus" class="h-icon-google-plus"> </a>\
              <a href="'+mailTo+'" title="Share via email" class="h-icon-mail"> </a>\
            </p>\
          </div>\
        </div>\
      </div>\
    </div>\
  ';
  $('body').append(shareModal);
  
  var fileModal ='\
    <div id="uploadModal" class="modal fade" role="dialog">\
      <div class="modal-dialog">\
        <!-- Modal content-->\
        <div class="modal-content">\
          <div class="modal-header">\
            <button type="button" class="close" data-dismiss="modal">&times;</button>\
            <h4 class="modal-title">Upload File</h4>\
          </div>\
          <div class="modal-body">\
            <form id="fileForm" action="#" method="POST">\
              <input type="file" id="file-select" name="photos[]" class="file" data-preview-file-type="text"/>\
              <button type="submit" id="upload-button">Upload</button>\
            </form>\
          </div>\
        </div>\
      </div>\
    </div>\
  ';
  $('body').append(fileModal);
  $("#fileForm").submit(function(e){
    alert("Hello World");
    e.preventDefault()
  });
}

function load_extras() {
  create_modal();
  add_legend();
  add_share();
  add_upload();
}

window.get_annotations = get_annotations
window.load_extras = load_extras
window.$ = $
