app.addModule('back', function () {
	this.init = function () {
		$('.back').click(function () {
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