var loadVMExpedition = function(index, poisList, contentSwiper) {
	if (index === undefined) { index = 0; }
	var poi = poisList[index];
	var currentExpedition = 'vening-meinesz';

	var path = 'data/' + currentExpedition + '/pois/' + poi[1].prefix + ' ' + poi[1].title;

	$.get(path + '.htm', {async: false})
	.done(function(data) {
		// console.log(path);
		var columns = $('<div class="columns"><p class="VM-attribution">Text: TU Delft / Bart Root en Rozemarijn Vlijm</p></div>');
		var $data = $(data);
		var images = $data.find('img');

		$.each(images, function(index, value) {
			//resize images so they fit in column width
			var urlPieces = $(value).prop('src').split('/'),					
				file = urlPieces[urlPieces.length - 1],
				folder = urlPieces[urlPieces.length - 2];

			var imageUrl = 'data/' + currentExpedition + '/pois/' + folder + '/' + file;

			$image = $(value);
			$image.prop('src', imageUrl);

			var height = $image.prop('height'),
				width = $image.prop('width'),
				// ratio = width/height,
				ratio = height/width,
				columnWidth = 300,
				maxHeight = 400;
			
			// $image.prop('height', columnWidth * ratio);
			// $image.prop('width', columnWidth);

			// console.log(ratio);
			if (ratio > 1) {
				$image.prop('height', maxHeight);
				$image.prop('width', maxHeight / ratio);
			} else {
				// console.log(columnWidth * ratio);
				$image.prop('height', columnWidth * ratio);
				$image.prop('width', columnWidth);
			}
			
			var largeFile = 'image00' + (parseInt(file.split('0')[2].split('.')[0]) - 1) + '.jpg';
			var imageUrlLarge = 'data/' + currentExpedition + '/pois/' + folder + '/' + largeFile;
			var $fancybox = $('<a class="fancybox" href="' + imageUrlLarge + '"></a>');
			$fancybox.appendTo($image.parent());
			$image.detach().appendTo($fancybox);
		});

		// $data.find('span').each(function(i, v) { if (v.textContent === "") { $(v).remove(); } });
		//$data.find('span').each(function(i,v) { if ($(v).children.length > 0) { $(v).remove(); } });
		// $($data.find('p')[0]).remove();

		var $embed = $data.find('iframe');

		if ($embed.length > 0) {
			var embedSrc = $embed.prop('src') + '?autoplay=1';
			var p = $embed.parent();
			$embed.remove();

			var embedUrl = path + '_files/embed.png';
			p.append($('<a class="fancybox" data-fancybox-type="iframe" href="' + embedSrc + '"><img src="' + embedUrl + '"></a>'));	
		}	

		columns.append($data);

		// console.log(columns[0]);

		var slide = contentSwiper.createSlide(columns[0].outerHTML);
		slide.append();

		if (index < poisList.length - 1) {
			loadVMExpedition(index + 1, poisList, contentSwiper);
		}
	});
};

module.exports = loadVMExpedition;