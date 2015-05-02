var buildMapsList = function(mode, maps) {
	var $mapList = $('#lstMap');

	// var maps = [];
	// if (mode === 'landing') {
	// 	$.each(expeditions, function(index, expedition) {
	// 		maps.push.apply(maps, expedition.maps);
	// 	});
	// } else {
	// 	maps = ;

	if (maps === undefined) { maps = []; }
	
	// }

	$.each(maps, function(index, value) {
		$mapList.append('<div></div>');

		var $checkbox = $('<input type="checkbox">');
		$checkbox.click(function() {
			$checkbox.trigger('_toggleOverlayVisibility', [value.id]);
		});
		
		var label = $('<label></label>')
		.append($checkbox) 
		.append($('<div>' + value.title + '</div>'));

		if (mode === 'landing' && value.visibleIntro === true) {
			$checkbox[0].checked = true;
			label.appendTo($mapList.children().last());
		} else if (mode === 'expedition') {
			label.appendTo($mapList.children().last());

			if (value.visibleExpedition === true) {
				$checkbox[0].checked = true;
			}
		}				
	});
};

module.exports = buildMapsList;