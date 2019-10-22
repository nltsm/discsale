app.addModule('back', function () {
	this.init = function () {
		$(document).on('click', '.back', function() {
			$('html, body').animate({
				scrollTop: 0
			}, 700);
		});
		
		$(window).on('scroll', function () {
			if ($(document).scrollTop() > 100) {
				$('.back').addClass('active');
			} else {
				$('.back').removeClass('active');
			}
		});
	};
});
ymaps.ready(init);

function init() {
	var myMap = new ymaps.Map("map", {
		center: [55.76, 37.64],
		zoom: 10
	});
	
	ymaps.geocode('Волгоград', {results: 1})
		.then(function (res) {
			changePlace(res);
			
			// Создать ajax запрос
			// сохранить данные в переменной placeMarks
			// вызвать функцию changeCity
			var placeMarks = [
				{
					coords: [45.071684, 38.967354],
					address: 'Краснодар, улица такая-то'
				},

				{
					coords: [45.061687, 38.981362],
					address: 'Краснодар, улица такая-то 2'
				},
			];
			
			changeCity(placeMarks);
		});
	
	
	$(document).on('change', '#cities', function () {
		ymaps.geocode($(this).val(), {results: 1})
		.then(function (res) {
			changePlace(res);
			
			
			// Создать ajax запрос
			// сохранить данные в переменной placeMarks
			// вызвать функцию changeCity

			var placeMarks = [
				{
					coords: [45.071684, 38.967354],
					address: 'Краснодар, улица такая-то'
				},

				{
					coords: [45.061687, 38.981362],
					address: 'Краснодар, улица такая-то 2'
				},
			];
			
			changeCity(placeMarks);
		});
	});

	$(document).on('click', '.cart_address-check', function () {
		var text = $(this).closest('.cart_balloon-content').find('.cart_balloon-address').text();

		myMap.balloon.close();

		$('.cart_map-address').html(text);
		$('#cart-map-address').val(text);
	});
	
	function changeCity(coords) {
		coords.forEach(function (value) {
			myMap.geoObjects
			.add(new ymaps.Placemark(value['coords'], {
				balloonContent: '<div class="cart_balloon-content"><div class="cart_balloon-address">' + value['address'] + '</div> <br><button class="cart_address-check">Выбрать</button></div>'
			}, {
				preset: 'islands#icon',
				iconColor: '#0095b6'
			}));
		});
	}
	
	function changePlace(res) {
		var firstGeoObject = res.geoObjects.get(0);
		var coords = firstGeoObject.geometry.getCoordinates();
		var bounds = firstGeoObject.properties.get('boundedBy');

		firstGeoObject.options.set('preset', 'islands#darkBlueDotIconWithCaption');
		firstGeoObject.properties.set('iconCaption', firstGeoObject.getAddressLine());
		
		myMap.setBounds(bounds, {
			checkZoomRange: true,
		}).then(function () {
			myMap.setZoom(9)
		});
	}
}

app.addModule('mobile-header', function () {
	this.init = function () {
		$('.mobile-header_button').click(function () {
			$(this).toggleClass('active');
			$('.mobile-header_content').toggleClass('active');
		});
	};
});
app.addModule('mobile-load', function () {
	this.init = function () {
		$('[data-clone-id]').each(function () {
			var element = $('#' + $(this).attr('data-clone-id'));
			
			if (element.length) {
				$(this).append(
					element.clone(true, true).removeAttr('id').addClass('__cloned')
				);
			}
			
			$(this).removeAttr('data-clone-id');
		});
	};
});
app.addModule('order', function () {
	this.init = function () {
		$('.order_checkbox').on('change', function () {
			var next;
			
			$(this).closest('.order_item-block').addClass('active');
			$(this).closest('.order_item').find('.order_label').removeClass('active');
			$(this).closest('.order_label').addClass('active');
			
			var allNext = $(this).closest('.order_item-block').nextAll();
			allNext.removeClass('active').find('.order_label').removeClass('active');
			
			if ($(this).attr('data-next')) {
				next = $('#' + $(this).attr('data-next'));
			} else {
				next = $(this).closest('.order_item-block').next()
			}
		
			next.addClass('active')
		});
	};
});
app.addModule('ordered', function () {
	this.init = function () {
		$('.ordered_button').click(function () {
			window.print();
		});
	};
});
app.addModule('product-add-popup', function () {
	this.init = function () {
		$(document).on('click', '.product-add-popup_close', function () {
			$('.product-add-popup').removeClass('active')
		});
	};
});
app.addModule('sort-block', function () {
	this.init = function () {
		var links = $('.sort-block_right a');
		
		var select = $('<select>').addClass('sort-block_select');
		
		links.each(function () {
			var option = $('<option>').html($(this).html());
			option.attr('value', $(this).attr('href'));
			select.append(option);
		});
		
		select.on('change', function () {
			location.href = $(this).val();
		});
		
		select.appendTo('.sort-block_right')
	};
});
jQuery(function () {
	app.callModules();
});