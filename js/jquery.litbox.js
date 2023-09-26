'use strict';
/*!
Litbox 1.0.0
	license: MIT
	http://mustimpress.com/litbox
	Copyright 2023 Marc Hudson

Based on Colorbox 1.6.4
	license: MIT
	http://jacklmoore.com/colorbox
*/
/*
* Thanks to the brilliant creator of Colorbox, Jack Moore, which Litbox is based on.
* This is a responsive, CSS-based version with a few additional features and styling options.

* Permission is hereby granted, free of charge, to any person obtaining a copy of this software
* and associated documentation files (the “Software”), to deal in the Software without
* restriction, including without limitation the rights to use, copy, modify, merge, publish,
* distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom
* the Software is furnished to do so, subject to the following conditions:
	* The above copyright notice and this permission notice shall be included in all copies or
	* substantial portions of the Software.

* THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING
* BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
* NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
* DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
(function ($, document, window) {
	var
	defaultBreakpoints = {xxs: 0, xs: 479, sm: 768, md: 992, lg: 1342},

	defaults = {
		// data sources
		html: false,
		image: false,
		iframe: false,
		inline: false,

		// behavior and appearance
		saveUpdates: false,// Should changes to options be saved or lost when re-opening a Litbox after using $.litbox.update().
		bodyClasses: '',
		speed: false,// Slide fade-in/out transition speed in milliseconds.
		fadeOut: 300,
		scrolling: true,
		preloading: true,
		className: false,
		overlayClose: true,
		escKey: true,
		arrowKey: true,
		data: undefined,
		closeButton: true,
		fastIframe: true,
		open: false,
		loop: true,
		slideshow: false,
		slideshowAuto: true,
		slideshowSpeed: 2500,
		slideshowStart: "Start slideshow",
		slideshowStop: "Stop slideshow",
		imageRegex: /\.(gif|png|jp(e|g|eg)|bmp|ico|webp|jxr|svg)((#|\?).*)?$/i,
		breakpoints: defaultBreakpoints,
		css: {
			xxs: {
				// Overlay.
				overlayColor: '#000',
				opacity: 0.4,

				// Box.
				width: false,// Can be used to set a fixed width. Better to use width: 100% and a px maxWidth to maintain responsiveness.
				minWidth: 60,
				maxWidth: false,
				height: false,// Can be used to set a fixed height.
				minHeight: 60,// Caution: Setting a value that's larger than the Litbox element's height can result in content being out of view.
				maxHeight: false,
				offset: 0,// Litbox offset from the pages edge (like a margin).
				borderRadius: 20,
				boxHalign: 'center',
				boxValign: 'center',
				
				// Content.
				contentOuterPadding: 20,// Padding outside of the scroll window and scroll bar.
				contentInnerPadding: 0,// Padding inside the scroll window.
				contentMaxWidth: false,// Use for a max-width on the content.
				contentMaxHeight: false,// Should rename "contentMaxHeight" (set on the scroll window DIV).
				contentHalign: 'center'// A contentValign option wasn't compatable with content that needs a scrollbar.
			}
		},

		// alternate image paths for high-res displays
		retinaImage: false,
		retinaUrl: false,
		retinaSuffix: '@2x.$1',

		// internationalization
		current: "{current} of {total}",
		previous: "Previous",
		next: "Next",
		close: "Close",
		xhrError: "Content failed to load",
		imgError: "Image failed to load",

		// accessbility
		returnFocus: true,
		trapFocus: true,

		// callbacks
		onOpen: false,
		onLoad: false,
		onComplete: false,
		onCleanup: false,
		onClosed: false,

		rel: function() {
			return this.rel;
		},
		href: function() {
			// using this.href would give the absolute url, when the href may have been intended as a selector (e.g. '#container')
			return $(this).attr('href');
		},
		title: function() {
			return this.title;
		},
		createImg: function() {
			var img = new Image(),
				attrs = $(this).data(prefix +'-img-attrs');

			if (typeof attrs === 'object') {
				$.each(attrs, function(key, val) {
					img[key] = val;
				});
			}
			return img;
		},
		createIframe: function() {
			var iframe = document.createElement('iframe'),
				attrs = $(this).data(prefix +'-iframe-attrs');

			if (typeof attrs === 'object') {
				$.each(attrs, function(key, val) {
					iframe[key] = val;
				});
			}

			if ('frameBorder' in iframe) {
				iframe.frameBorder = 0;
			}
			if ('allowTransparency' in iframe) {
				iframe.allowTransparency = "true";
			}
			iframe.name = (new Date()).getTime(); // give the iframe a unique name to prevent caching
			iframe.allowFullscreen = true;

			return iframe;
		}
	},

	// Abstracting the HTML and event identifiers for easy rebranding
	litbox = 'litbox',
	prefix = 'lbox',
	boxElement = prefix + 'Element',

	// Events
	event_open = prefix + '_open',
	event_load = prefix + '_load',
	event_complete = prefix + '_complete',
	event_cleanup = prefix + '_cleanup',
	event_closed = prefix + '_closed',
	event_purge = prefix + '_purge',

	// Cached jQuery Object Variables
	$overlay,
	$box,
	$wrapper,
	$content,
	$related,
	$window,
	$loaded,
	$contentWrap,
	$loadingGraphic,
	$loadingBay,
	$title,
	$current,
	$slideshow,
	$next,
	$prev,
	$close,
	$groupControls,
	$events = $('<a/>'), // $({}) would be preferred, but there is an issue with jQuery 1.4.2

	// Variables for cached values or use across multiple functions
	settings,
	index,
	image,
	open,
	active,
	refresh,// Should CSS and other things be regenerated or are we just switching content in the same relgroup.
	closing,
	loadingTimer,
	publicMethod,
	div = "div",
	requests = 0,
	init;


	// ****************
	// HELPER FUNCTIONS
	// ****************

	// Convenience function for creating new jQuery objects
	const $tag = (tag, id, css) => $(`<${tag}/>`, {
		id: id ? prefix+id : null,
		style: css
	});


	function Settings(element, options) {
		if (options !== Object(options)) {
			options = {};
		}
		this.cache = {};
		this.el = element;

		this.value = function(key) {
			var dataAttr;

			if (this.cache[key] === undefined) {
				dataAttr = $(this.el).attr(`data-${prefix}-${key}`);

				if (dataAttr !== undefined) {
					this.cache[key] = dataAttr;
				}
				else if (options[key] !== undefined) {
					this.cache[key] = options[key];
				}
				else if (defaults[key] !== undefined) {
					this.cache[key] = defaults[key];
				}
			}
			return this.cache[key];
		};
		this.get = function(key) {
			var value = this.value(key);
			return typeof value === "function" ? value.call(this.el, this) : value;
		};
	}


	// Convert bool String values to actual Booleans in an Object.
	const fixBooleanStr = (obj) => {
		for (let key in obj) {
			if (typeof obj[key] === 'object') {
				fixBooleanStr(obj[key]);
			}
			else if (obj[key] === 'true' || obj[key] === 'false') {
				obj[key] = obj[key] === 'true';
			}
		}
		return obj;
	};


	// Determine the next and previous members in a group.
	function getIndex(increment) {
		var max = $related.length,
			newIndex = (index + increment) % max;
		return (newIndex < 0) ? max + newIndex : newIndex;
	}


	// Add CSS friendly 'px' string to the end of integers
	function px(value) {
		return (value.toString().indexOf('px') < 0) ? `${value}px` : value;
	}


	// Checks a href to see if it is an image.
	// There is a force image option (image: true) for hrefs that cannot be matched by the regex.
	function isImage(settings, url) {
		return settings.get('image') || settings.get('imageRegex').test(url);
	}


	function retinaUrl(settings, url) {
		return settings.get('retinaUrl') && window.devicePixelRatio > 1 ? url.replace(settings.get('imageRegex'), settings.get('retinaSuffix')) : url;
	}


	function trapFocus(e) {
		if ('contains' in $box[0] && !$box[0].contains(e.target) && e.target !== $overlay[0]) {
			e.stopPropagation();
			$box.focus();
		}
	}


	function hexToRgb(hex) {
		// Convert #F60 HEX code to #FF6600.
		hex = hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, function(m, r, g, b) {
	        return '#'+r+r+g+g+b+b;
	    });
	    // Convert HEX to RGB.
		return ['0x' + hex[1] + hex[2] | 0, '0x' + hex[3] + hex[4] | 0, '0x' + hex[5] + hex[6] | 0];
	}


	function setClass(str) {
		if (setClass.str !== str) {
			$overlay.removeClass(setClass.str).addClass(str);
			setClass.str = str;
		}
	}


	function getRelated(rel) {
		index = 0;

		if (rel && rel !== false && rel !== 'nofollow') {
			$related = $('.' + boxElement).filter(function() {
				var options = $.data(this, litbox),
					settings = new Settings(this, options);
				return (settings.get('rel') === rel);
			});
			index = $related.index(settings.el);

			// Check direct calls to Litbox.
			if (index === -1) {
				$related = $related.add(settings.el);
				index = $related.length - 1;
			}
		}
		else {
			$related = $(settings.el);
		}
	}


	function trigger(event) {
		// for external use
		$(document).trigger(event);
		// for internal use
		$events.triggerHandler(event);
	}


	var slideshow = (function() {
		var active,
			className = "slideshow-",
			click = "click." + prefix,
			timeOut;

		function clear() {
			clearTimeout(timeOut);
		}

		function set() {
			if (settings.get('loop') || $related[index + 1]) {
				clear();
				timeOut = setTimeout(publicMethod.next, settings.get('slideshowSpeed'));
			}
		}

		function start() {
			$slideshow
				.text(settings.get('slideshowStop'))
				.unbind(click)
				.one(click, stop);

			$events
				.bind(event_complete, set)
				.bind(event_load, clear);

			$box.removeClass(className + "off").addClass(className + "on");
		}

		function stop() {
			clear();

			$events
				.unbind(event_complete, set)
				.unbind(event_load, clear);

			$slideshow
				.text(settings.get('slideshowStart'))
				.unbind(click)
				.one(click, function() {
					publicMethod.next();
					start();
				});

			$box.removeClass(className + "on").addClass(className + "off");
		}

		function reset() {
			active = false;
			$slideshow.hide();
			clear();
			$events
				.unbind(event_complete, set)
				.unbind(event_load, clear);
			$box.removeClass(className + "off " + className + "on");
		}

		return function() {
			if (active) {
				if (!settings.get('slideshow')) {
					$events.unbind(event_cleanup, reset);
					reset();
				}
			}
			else {
				if (settings.get('slideshow') && $related[1]) {
					active = true;
					$events.one(event_cleanup, reset);
					if (settings.get('slideshowAuto')) {
						start();
					} else {
						stop();
					}
					$slideshow.show();
				}
			}
		};
	}());


	// Generate CSS within mediaqueries.
	function updateStyles(css) {
		if (!css) return;

		var bpValues = settings.get('breakpoints'),
			responsiveCSS = '',

			styles = (selector, obj) => {
				var styles = {};
				$.each(obj, function(prop, value) {
					// Fix bug where 0 (Integer) values don't get set using .css()
					if (value === 0) value = px(value);

					styles[prop] = value || '';
				});
				var el = $("<div>").css(styles);
				return el.attr('style') ? `${selector}{${el.attr('style')}}` : '';
			};

		$.each(css, function (breakpoint, options) {
			if ($.inArray(breakpoint, Object.keys(bpValues)) < 0) return;// Ignore invalid breakpoint values.

			// Make sure Overlay style is set correctly for smallest (XXS) breakpoint.
			if (breakpoint === 'xxs') {
				options.opacity = options.opacity || css.xxs.opacity;
				options.overlayColor = options.overlayColor || css.xxs.overlayColor;
			}

			var overlayBg = options.opacity && options.overlayColor ?
				'rgba(' + hexToRgb(options.overlayColor) + ',' + options.opacity + ')' : '',

				responsiveStyles = [
					styles(`#${prefix}Overlay`, {
						background: overlayBg,
						padding: options.offset,
						justifyContent: options.boxHalign,
	    				alignItems: options.boxValign
					}),
					styles("#litbox", {
						width: options.width,
						maxWidth: options.maxWidth,
						height: options.height,
						maxHeight: options.maxHeight
					}),
					styles(`#${prefix}Wrapper`, {
						'border-radius': options.borderRadius
					}),
					styles(`#${prefix}Content`, {
						padding: options.contentOuterPadding
					}),
					styles(`#${prefix}LoadedContent`, {
						justifyContent: options.contentHalign
					}),
					styles(`#${prefix}ContentWrap`, {
						padding: options.contentInnerPadding,
						minWidth: options.minWidth,
						minHeight: options.minHeight,
						maxWidth: options.contentMaxWidth,
						maxHeight: options.contentMaxHeight
					})
				].filter(Boolean).join('');

			if (responsiveStyles) {
				responsiveCSS += (breakpoint === 'xxs') ?
					responsiveStyles :
					`@media only screen and (min-width:${px(bpValues[breakpoint])}){${responsiveStyles}}`;
			}
		});
		// Add responsive styles.
		if (responsiveCSS) {
			$('style.litbox-css').remove();
			$('body').append( $('<style type="text/css" class="litbox-css" />').text(responsiveCSS) );
		}
	}


	function launch(element) {
		var options;

		if (!closing) {
			options = $(element).data(litbox);
			settings = new Settings(element, options);

			getRelated(settings.get('rel'));

			if (!open) {
				open = active = true; // Prevents the page-change action from queuing up if the visitor holds down the left or right keys.

				setClass(settings.get('className'));
				$box.css({opacity: ''});
				
				$contentWrap = $tag(div, 'ContentWrap');
				$content.append(
					$loaded = $tag(div, 'LoadedContent').append( $contentWrap )
				);

				// Allows for general code within an event listener. Eg: $(document).on('lbox_open', function() { alert("Litbox has opened") });
				trigger(event_open);
				settings.get('onOpen');

				if (settings.get('trapFocus')) {
					// Confine focus to the modal
					// Uses event capturing that is not supported in IE8-
					if (document.addEventListener) {
						document.addEventListener('focus', trapFocus, true);

						$events.one(event_closed, function() {
							document.removeEventListener('focus', trapFocus, true);
						});
					}
				}

				// Return focus on closing
				if (settings.get('returnFocus')) {
					$events.one(event_closed, function() {
						$(settings.el).focus();
					});
				}
			}

			if (refresh) {
				$('body').addClass(litbox +'-show').removeClass(options.removeBodyClasses).addClass(settings.get('bodyClasses'));

				updateStyles(settings.get('css'));
				
				var title = settings.get('title');
				$title.toggle(!!title).text(title);
				$box.focus().toggleClass('has-title', !!title);
				
				$overlay.css({
					cursor: settings.get('overlayClose') ? 'pointer' : ''
				});

				if (settings.get('closeButton')) {
					// $close.text(settings.get('close')).appendTo($content);
					$close.text(settings.get('close')).prependTo($wrapper);
				}
				else {
					$close.appendTo('<div/>');// Replace with .detach() when dropping jQuery < 1.4
				}
			}
			load();
		}
	}


	// Litbox's markup needs to be added to the DOM prior to being called
	// so that the browser will go ahead and load the CSS background images.
	function appendHTML() {
		if (!$box) {
			init = false;
			$window = $(window);

			$overlay = $tag(div, "Overlay").append(
				$box = $tag(div).attr({
					id: litbox,
					class: $.support.opacity === false ? prefix + 'IE' : '',// Class for optional IE8 & lower targeted CSS.
					role: 'dialog',
					tabindex: '-1'
				}).append(
					$wrapper = $tag(div, "Wrapper").append(
						$current = $tag(div, "Current"),
						$prev = $('<button type="button"/>').attr({class: prefix+'Control prevnext', id:prefix+'Prev'}),
						$next = $('<button type="button"/>').attr({class: prefix+'Control prevnext', id:prefix+'Next'}),
						$slideshow = $('<button type="button"/>').attr({class: prefix+'Control', id:prefix+'Slideshow'}),
						$close = $('<button type="button"/>').attr({class: prefix+'Control', id:prefix+'Close'}),

						$title = $tag(div, "Title"),
						$content = $tag(div, "Content").append(
							$loadingGraphic = $tag(div, "LoadingGraphic")
						)
					),
					$loadingBay = $tag(div, "LoadingBay")
				)
			);
			$groupControls = $next.add($prev).add($current).add($slideshow);
		}
		if (document.body && !$overlay.parent().length) {
			$(document.body).append($overlay);
		}
	}


	// Add Litbox's event bindings
	function addBindings() {
		function clickHandler(e) {
			// ignore non-left-mouse-clicks and clicks modified with ctrl / command, shift, or alt.
			// See: http://jacklmoore.com/notes/click-events/
			if (!(e.which > 1 || e.shiftKey || e.altKey || e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				launch(this);
			}
		}

		if (!$box) return false;

		if (!init) {
			init = true;

			// Anonymous functions here keep the public method from being cached, thereby allowing them to be redefined on the fly.
			$next.click(function() {
				publicMethod.next();
			});
			$prev.click(function() {
				publicMethod.prev();
			});
			$close.click(function() {
				publicMethod.close();
			});
			$overlay.click(function (e) {
				if (settings.get('overlayClose')) {
					// Prevent clicks on overlay child elements from triggering close().
					if (e.target !== e.currentTarget) return;

					publicMethod.close();
				}
			});

			// Key Bindings
			$(document).bind('keydown.' + prefix, function (e) {
				var key = e.keyCode;
				if (open && settings.get('escKey') && key === 27) {
					e.preventDefault();
					publicMethod.close();
				}
				if (open && settings.get('arrowKey') && $related[1] && !e.altKey) {
					if (key === 37) {
						e.preventDefault();
						$prev.click();
					}
					else if (key === 39) {
						e.preventDefault();
						$next.click();
					}
				}
			});

			if (typeof $.fn.on === "function") {
				// For jQuery 1.7+
				$(document).on('click.'+prefix, '.'+boxElement, clickHandler);
			}
			else {
				// For jQuery 1.3.x -> 1.6.x
				// This code is never reached in jQuery 1.9, so do not contact me about 'live' being removed.
				// This is not here for jQuery 1.9, it's here for legacy users.
				$('.'+boxElement).live('click.'+prefix, clickHandler);
			}
		}
		return true;
	}


	// Don't do anything if Litbox already exists.
	if ($[litbox]) {
		return;
	}

	// Append the HTML when the DOM loads
	$(appendHTML);



	// ****************
	// PUBLIC FUNCTIONS
	// Usage format: $.litbox.close();
	// Usage from within an iframe: parent.jQuery.litbox.close();
	// ****************

	publicMethod = $.fn[litbox] = $[litbox] = function(options, callback) {
		var settings,
			currentSettings = $.litbox.settings(),
			$obj = this;

		refresh = true;
		options = options || {};

		if (typeof $obj === "function") {// Assume a call to $.litbox().
			$obj = $('<a/>');
			options.open = true;
		}

		// If Litbox is already open, get the current bodyClasses to remove them.
		if (currentSettings) {
			options.removeBodyClasses = currentSettings.get('bodyClasses');
		}

		// Merge options with defaults.
		var optionsAll = $.extend(true, {}, defaults, options);
		
		if (!$obj[0]) {// litbox being applied to empty collection
			return $obj;
		}

		appendHTML();

		if (addBindings()) {
			if (callback) {
				optionsAll.onComplete = callback;
			}

			$obj.each(function() {
				var old = $.data(this, litbox) || {};
				$.data(this, litbox, $.extend(old, optionsAll));
			}).addClass(boxElement);

			settings = new Settings($obj[0], optionsAll);

			if (settings.get('open')) {
				launch($obj[0]);
			}
		}
		return $obj;
	};

	
	publicMethod.update = (options = {}) => {
		if (!open) return;
		
		options = fixBooleanStr(options);

		// Merge options with existing settings.
		const
			el = settings.el,
			old = $.data(el, litbox) || {},
			optionsObj = $.extend(true, {}, old, options);

		if (options.saveUpdates) {
			$.data(el, litbox, optionsObj);
		}

		settings = new Settings(el, optionsObj);

		const { bodyClasses } = optionsObj;

		// Update and replace existing CSS.
		updateStyles(optionsObj.css);

		// Update the title.
		$title.toggle(!!optionsObj.title).text(optionsObj.title);
		$box.focus().toggleClass('has-title', !!optionsObj.title);

		// Update body classes.
		$('body').removeClass(old.bodyClasses).addClass(bodyClasses);
		
		// Update Overlay cursor.
		$overlay.css({ cursor: options.overlayClose ? 'pointer' : '' });
	};


	publicMethod.prep = (object) => {
		if (!open) return;

		var callback,
			change,
			speed = settings.get('speed') || 0;

		change = function() {
			$loaded.remove();
			$loaded = $tag(div, 'LoadedContent', 'opacity: 0').append(
				$contentWrap = $tag(div, 'ContentWrap').append(object)
			);
			$content.prepend($loaded.appendTo($loadingBay));

			// floating the IMG removes the bottom line-height and fixed a problem where IE miscalculates the width of the parent element as 100% of the document width.
			$(image).css({'float': 'none'});

			setClass(settings.get('className'));
		};
		
		callback = function() {
			var total = $related.length,
				iframe,
				complete;

			if (!open) return;

			function removeFilter() { // Needed for IE8 in versions of jQuery prior to 1.7.2
				if ($.support.opacity === false) {
					$loaded.style.removeAttribute('filter');
				}
			}

			complete = function() {
				clearTimeout(loadingTimer);
				$loadingGraphic.hide();
				trigger(event_complete);
				settings.get('onComplete');
			};

			if (total > 1) { // handle grouping
				if (typeof settings.get('current') === "string") {
					$current.text(settings.get('current').replace('{current}', index + 1).replace('{total}', total)).show();
				}

				$next[(settings.get('loop') || index < total - 1) ? "show" : "hide"]().text(settings.get('next'));
				$prev[(settings.get('loop') || index) ? "show" : "hide"]().text(settings.get('previous'));

				slideshow();

				// Preloads images within a rel group
				if (settings.get('preloading')) {
					$.each([getIndex(-1), getIndex(1)], function() {
						var img,
							i = $related[this],
							settings = new Settings(i, $.data(i, litbox)),
							src = settings.get('href');

						if (src && isImage(settings, src)) {
							src = retinaUrl(settings, src);
							img = document.createElement('img');
							img.src = src;
						}
					});
				}
			}
			else {
				$groupControls.hide();
			}

			if (settings.get('iframe')) {
				iframe = settings.get('createIframe');

				if (!settings.get('scrolling')) {
					iframe.scrolling = "no";
				}

				$(iframe)
					.attr({
						src: settings.get('href'),
						'class': prefix + 'Iframe'
					})
					.one('load', complete)
					.appendTo($contentWrap.addClass('iframe'));

				$events.one(event_purge, function() {
					iframe.src = "//about:blank";
				});

				if (settings.get('fastIframe')) {
					$(iframe).trigger('load');
				}
			}
			else {
				complete();
			}

			$loaded.fadeTo(speed, 1, removeFilter);
		};

		active = false;

		$loaded.fadeTo(speed, 0, function() {
			change();
			callback();
		});
	};


	function load() {
		var href,
			prep = publicMethod.prep,
			$inline,
			request = ++requests;

		active = true;
		image = false;

		trigger(event_purge);
		trigger(event_load);
		settings.get('onLoad');

		href = settings.get('href');

		loadingTimer = setTimeout(function() {
			$loadingGraphic.show();
		}, 100);

		if (settings.get('inline')) {
			var $target = $(href).eq(0);
			// Inserts an empty placeholder where inline content is being pulled from.
			// An event is bound to put inline content back when Litbox closes or loads new content.
			$inline = $('<div>').hide().insertBefore($target);

			$events.one(event_purge, function() {
				$inline.replaceWith($target);
			});

			prep($target);
		}
		else if (settings.get('iframe')) {
			// IFrame element won't be added to the DOM until it is ready to be displayed,
			// to avoid problems with DOM-ready JS that might be trying to run in that iframe.
			prep(" ");
		}
		else if (settings.get('html')) {
			prep(settings.get('html'));
		}
		else if (isImage(settings, href)) {
			href = retinaUrl(settings, href);
			image = settings.get('createImg');
			var retinaClass = settings.get('retinaImage') ? ' retinaImage' : '';

			$(image)
			.addClass(prefix + 'Image'+retinaClass)
			.bind('error.'+prefix,function() {
				prep($tag(div, 'Error').text(settings.get('imgError')));
			})
			.one('load', function() {
				if (request !== requests) {
					return;
				}

				// A small pause because some browsers will occasionally report a
				// img.width and img.height of zero immediately after the img.onload fires
				setTimeout(function() {
					if (settings.get('retinaImage') && window.devicePixelRatio > 1) {
						image.width = image.width / window.devicePixelRatio;
					}

					if ($related[1] && (settings.get('loop') || $related[index + 1])) {
						image.style.cursor = 'pointer';

						$(image).bind('click.'+prefix, function() {
							publicMethod.next();
						});
					}

					image.style.width = px(image.width);
					prep(image);
				}, 1);
			});
			image.src = href;
		}
		else if (href) {
			$loadingBay.load(href, settings.get('data'), function (data, status) {
				if (request === requests) {
					prep(status === 'error' ? $tag(div, 'Error').text(settings.get('xhrError')) : $(this).contents());
				}
			});
		}
	}


	// Navigates to the next page/image in a set.
	publicMethod.next = () => {
		if (!active && $related[1] && (settings.get('loop') || $related[index + 1])) {
			refresh = false;
			index = getIndex(1);
			launch($related[index]);
		}
	};


	publicMethod.prev = () => {
		if (!active && $related[1] && (settings.get('loop') || index)) {
			refresh = false;
			index = getIndex(-1);
			launch($related[index]);
		}
	};


	// Note: to use this within an iframe use the following format: parent.jQuery.litbox.close();
	publicMethod.close = () => {
		if (open && !closing) {
			closing = true;
			open = false;
			refresh = true;
			trigger(event_cleanup);
			settings.get('onCleanup');
			$window.unbind('.' + prefix);
			$overlay.fadeTo(settings.get('fadeOut') || 0, 0);

			$box.stop().fadeTo(settings.get('fadeOut') || 0, 0, function() {
				$('body').removeClass([litbox +'-show', settings.get('bodyClasses')]);
				trigger(event_purge);
				$loaded.remove();
				$('style.litbox-css').remove();
				$overlay.css('opacity', '');

				setTimeout(function() {
					closing = false;
					trigger(event_closed);
					settings.get('onClosed');
				}, 10);
			});
		}
	};


	// Removes changes Litbox made to the document, but does not remove the plugin.
	publicMethod.remove = () => {
		if (!$box) return;

		$box.stop();
		$[litbox].close();
		$overlay.remove();
		closing = false;
		$box = null;
		$('.' + boxElement)
			.removeData(litbox)
			.removeClass(boxElement);
		$('style.litbox-css').remove();

		$(document).unbind('click.'+prefix).unbind('keydown.'+prefix);
	};


	// A method for fetching the current element Litbox is referencing.
	// returns a jQuery object.
	publicMethod.element = () => {// TODO: this doesn't work?
		return open ? $(settings.el) : false;
	};


	publicMethod.defaults = () => {
		return defaults;
	};


	publicMethod.settings = () => {
		return open ? settings : false;
	};
}(jQuery, document, window));



