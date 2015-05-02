var fetchWikiExcerpt = function(url, imageUrl, numWords, columns, contentSwiper) {
		var $contentImage = $('<div class="expedition-text-image"></div>');
			// $contentImage.css('background-image', "url('" + imageUrl + "')");
			// $('.expedition-text-image').css('background-image', "url('" + imageUrl + "')");
			// console.log(imageUrl);

			// $image.load(function() { console.log('image loaded correctly'); })
			// .error(function() { console.log('image failed to load'); })
			// .prop('src', imageUrl);
			// console.log(imageUrl);

			// document.getElementById('tessst').setAttribute('src', imageUrl);
		 // });
		
		try {
			wikiUrl = url.split('/');
			title = wikiUrl[wikiUrl.length - 1];
			var wikiApiUrl = 'http://nl.wikipedia.org/w/api.php?action=query&prop=extracts&format=json&',
		    numOfChars = 'exchars=' + numWords + '&',
		    articleTitle ='titles=' + title,
		    requestUrl = wikiApiUrl + numOfChars + articleTitle;

		    var $content = $('<div class="expedition-text-content"></div>'), 
		    	$contentElem = $('<div></div>'),
		    	$wikiText = $('<div class="wiki-attribution"><p>Text: Wikipedia, de vrije encyclopedie</p></div>');
		    	$content.append($('<div class="wiki-leesmeer"><a href="'+ url + '" target="_blank">Lees meer op Wikipedia...</a></div>'));
		    	$contentElem.append($content);
		    	$contentElem.append($contentImage);

		    $.ajax({
   				url: requestUrl,
 			    jsonp: "callback",
			    dataType: "jsonp"
			})
			.done(function(data) {
					var pages = data.query.pages;
					for (var page in pages) { break; }
									
					$wikiText.append($(pages[page].extract).filter('p'));
					var last = $wikiText.children().last();
					last.text(last.text() + ' ...');
					$content.append($wikiText);
					
					console.log(imageUrl);
					if (imageUrl !== '') {
						fetchWikiImage(imageUrl, 1000, function(url) {
							$('<img>')
							.attr('src', url)
		    				.appendTo($contentImage);
							
							var slide = contentSwiper.createSlide($contentElem[0].outerHTML);
							slide.append();	
						});
					} else {
						var slide = contentSwiper.createSlide($contentElem[0].outerHTML);
						slide.append();
					}
			});			
		}
		catch (err) {
			var message = "<div>Deze expeditie heeft nog geen Wikipedia lemma. \n Help mee en schrijf er &eacute&eacuten!</div>";
			contentElem.addClass('columns-none');
			contentElem.css('font-size', '1.5em');
			contentElem.append(message);
			var slide = contentSwiper.createSlide(contentElem[0].outerHTML);
			slide.append();
		}

};

var fetchWikiImage = function(url, size, callback, currentExpedition) {
		var imageName = url.split("File:")[1];
		var requestUrl = constructWikiImageUrl(imageName, size) + '&format=json';
		var imageUrl;

		$.ajax({
   				url: requestUrl,
 			    jsonp: "callback",
			    dataType: "jsonp",
			    beforeSend: function() {
			    	// put spinner on slide page
			    },
			    success: function(data) {
			    	try {
						imageUrl = data.query.pages['-1'].imageinfo[0].thumburl;
			    	}
			    	catch (err) {
			    		console.log("Warning, failed to fetch Wikipedia Image");
			    		console.log("Assuming local image...");

			    		imageUrl = 'data/' + currentExpedition + '/images/' + url;

			    	}
			    	callback(imageUrl);
			    }
		});
};

var constructWikiImageUrl = function(imageName, h) {
	var title = 'titles=File:' + imageName + '&',
		height = 'iiurlheight=' + h;

	return 'http://en.wikipedia.org/w/api.php?action=query&prop=imageinfo&iiprop=url&' + title + height;
};

exports.fetchWikiExcerpt = fetchWikiExcerpt;
exports.fetchWikiImage = fetchWikiImage;
exports.constructWikiImageUrl = constructWikiImageUrl;