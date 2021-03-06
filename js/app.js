app.addModule('autocomplete', function () {
	this.init = function () {
		$("#search_product").autocomplete({
			minLength: 1,
			source: function (request, response) {
				$.ajax({
					method: 'get',
					dataType: "json",
					url: '/file.json',
					data: {
						query: request.term
					},
					success: function (data) {
						/* ДОБАВИТЬ */
						data.push({
							label: 'Показать все результаты поиска',
							last: true,
							url: '/search?query=' + request.term
						});
						/* /ДОБАВИТЬ */
						response(data);
					}
				})
			},
			select: function (event, ui) {
				window.location.href = ui.item.url;
			},
			close: function (el) {
				// el.target.value = '';
			}
		})
		/* ДОБАВИТЬ */
		.data("ui-autocomplete")._renderItem = function (ul, item) {
			var inner_html = '<div class="search_block"><div class="search_image"><img src="https://discsale.ml' + item.image + '" alt=""></div> <span>' + item.label + '</span></div>';
			
			if (item.last === true) {
				var inner_html = '<div class="search_block __last"><span>' + item.label + '</span></div>';
			}
			
			return $("<li></li>")
				.data("ui-autocomplete-item", item)
				.append(inner_html)
				.appendTo(ul);
        };
		/* /ДОБАВИТЬ */
	};
});
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
try {
	ymaps.ready(init);
} catch(e) {}

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

app.addModule('catalog', function () {
	this.init = function () {
		var slider = document.getElementById('filter-price');

		noUiSlider.create(slider, {
			range: {
				min: parseInt($(slider).attr('data-min')),
				max: parseInt($(slider).attr('data-max')),
			},
			step: parseInt($(slider).attr('data-step')),
			start: [parseInt($(slider).attr('data-start')), parseInt($(slider).attr('data-end')),],
			connect: true,
			format: {
				from: function (value) {
					return parseInt(value);
				},
				to: function (value) {
					return parseInt(value);
				}
			}
		});

		slider.noUiSlider.on('update', function (values, handle) {
			var value1 = values[0];
			var value2 = values[1];

			$('#price-min').val(value1);
			$('#price-max').val(value2);
		});

		$('#price-min').on('change', function () {
			html5Slider.noUiSlider.set([parseInt(this.value), null]);
		});
		$('#price-max').on('change', function () {
			html5Slider.noUiSlider.set([null, parseInt(this.value)]);
		});
	};
});

app.addModule('inputmask', function () {
	this.init = function () {
		this.mask();
	};
	
	this.update = function () {
		$('input.tel').inputmask('remove');
		
		this.mask();
	};
	
	this.mask = function () {
		$('input.tel').inputmask('+7 999 999 99 99');
	};
});
app.addModule('main-slider', function () {
	this.init = function () {
		$('.main-slider').slick();
	};
});
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
		$(document).on('change', '.order_checkbox', function () {
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
app.addModule('tab', function () {
	this.init = function () {
		var tabSelect = $('<div />').addClass('tab_select');
		
		var select = $('<select />');
		
		$('.tab').append(tabSelect);
		tabSelect.append(select);
		
		$('.tab_block a').each(function () {
			var val = $(this).html();
			var url = $(this).attr('href');
			
			var option = $('<option>').html(val).val(url);
			
			select.append(option);
			
			if ($(this).hasClass('active')) {
				option.attr('selected', 'selected')
			}
		});
		
		select.on('change', function () {
			location.href = $(this).val();
		})
	};
});
jQuery(function () {
	app.callModules();
});