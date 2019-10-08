(function () {
    try{
        var links = document.querySelectorAll('a.external');

        for (var i = 0; i < links.length; ++i) {
            links[i].onclick = function() {
                ga('send', 'event', 'outbound', 'click', this.href);
            };
        }

        window.addEventListener('error', function(e) {
            ga('send', 'exception', {
                'exDescription': e.message,
                'exFatal': false
            });
        });
    }catch(e){
        ga('send', 'exception', {
            'exDescription': err.message,
            'exFatal': false
        });
    }
})();
/*! instant.page v1.2.2 - (C) 2019 Alexandre Dieulot - https://instant.page/license */


(function () {

  let urlToPreload
  let mouseoverTimer
  let lastTouchTimestamp

  const prefetcher = document.createElement('link')
  const isSupported = prefetcher.relList && prefetcher.relList.supports && prefetcher.relList.supports('prefetch')
  const isDataSaverEnabled = navigator.connection && navigator.connection.saveData
  const allowQueryString = 'instantAllowQueryString' in document.body.dataset
  const allowExternalLinks = 'instantAllowExternalLinks' in document.body.dataset

  if (isSupported && !isDataSaverEnabled) {
    prefetcher.rel = 'prefetch'
    document.head.appendChild(prefetcher)

    const eventListenersOptions = {
      capture: true,
      passive: true,
    }
    document.addEventListener('touchstart', touchstartListener, eventListenersOptions)
    document.addEventListener('mouseover', mouseoverListener, eventListenersOptions)
  }

  function touchstartListener(event) {
    /* Chrome on Android calls mouseover before touchcancel so `lastTouchTimestamp`
     * must be assigned on touchstart to be measured on mouseover. */
    lastTouchTimestamp = performance.now()

    const linkElement = event.target.closest('a')

    if (!isPreloadable(linkElement)) {
      return
    }

    linkElement.addEventListener('touchcancel', touchendAndTouchcancelListener, {passive: true})
    linkElement.addEventListener('touchend', touchendAndTouchcancelListener, {passive: true})

    urlToPreload = linkElement.href
    preload(linkElement.href)
  }

  function touchendAndTouchcancelListener() {
    urlToPreload = undefined
    stopPreloading()
  }

  function mouseoverListener(event) {
    if (performance.now() - lastTouchTimestamp < 1100) {
      return
    }

    const linkElement = event.target.closest('a')

    if (!isPreloadable(linkElement)) {
      return
    }

    linkElement.addEventListener('mouseout', mouseoutListener, {passive: true})

    urlToPreload = linkElement.href

    mouseoverTimer = setTimeout(() => {
      preload(linkElement.href)
      mouseoverTimer = undefined
    }, 65)
  }

  function mouseoutListener(event) {
    if (event.relatedTarget && event.target.closest('a') == event.relatedTarget.closest('a')) {
      return
    }

    if (mouseoverTimer) {
      clearTimeout(mouseoverTimer)
      mouseoverTimer = undefined
    }
    else {
      urlToPreload = undefined
      stopPreloading()
    }
  }

  function isPreloadable(linkElement) {
    if (!linkElement || !linkElement.href) {
      return
    }

    if (urlToPreload == linkElement.href) {
      return
    }

    const preloadLocation = new URL(linkElement.href)

    if (!allowExternalLinks && preloadLocation.origin != location.origin && !('instant' in linkElement.dataset)) {
      return
    }

    if (!['http:', 'https:'].includes(preloadLocation.protocol)) {
      return
    }

    if (preloadLocation.protocol == 'http:' && location.protocol == 'https:') {
      return
    }

    if (!allowQueryString && preloadLocation.search && !('instant' in linkElement.dataset)) {
      return
    }

    if (preloadLocation.hash && preloadLocation.pathname + preloadLocation.search == location.pathname + location.search) {
      return
    }

    if ('noInstant' in linkElement.dataset) {
      return
    }

    return true
  }

  function preload(url) {
    prefetcher.href = url
  }

  function stopPreloading() {
    prefetcher.removeAttribute('href')
  }
})();
/*
	disqusLoader.js v1.0
	A JavaScript plugin for lazy-loading Disqus comments widget.
	-
	By Osvaldas Valutis, www.osvaldas.info
	Available for use under the MIT License
*/


;( function( window, document, index )
{
	'use strict';

	var extendObj = function( defaults, options )
		{
			var prop, extended = {};
			for( prop in defaults )
				if( Object.prototype.hasOwnProperty.call( defaults, prop ))
					extended[ prop ] = defaults[ prop ];

			for( prop in options )
				if( Object.prototype.hasOwnProperty.call( options, prop ))
					extended[ prop ] = options[ prop ];

			return extended;
		},
		getOffset = function( el )
		{
			var rect = el.getBoundingClientRect();
			return { top: rect.top + document.body.scrollTop, left: rect.left + document.body.scrollLeft };
		},
		loadScript = function( url, callback )
		{
			var script	 = document.createElement( 'script' );
			script.src	 = url;
			script.async = true;
			script.setAttribute( 'data-timestamp', +new Date());
			script.addEventListener( 'load', function()
			{
				if( typeof callback === 'function' )
					callback();
			});
			( document.head || document.body ).appendChild( script );
		},
		throttle		= function(a,b){var c,d;return function(){var e=this,f=arguments,g=+new Date;c&&g<c+a?(clearTimeout(d),d=setTimeout(function(){c=g,b.apply(e,f)},a)):(c=g,b.apply(e,f))}},

		throttleTO		= false,
		laziness		= false,
		disqusConfig	= false,
		scriptUrl		= false,

		scriptStatus	= 'unloaded',
		instance		= false,

		init = function()
		{
			if( !instance || !document.body.contains( instance ) || instance.disqusLoaderStatus == 'loaded' )
				return true;

			var winST	= window.pageYOffset,
				offset	= getOffset( instance ).top;

			// if the element is too far below || too far above
			if( offset - winST > window.innerHeight * laziness || winST - offset - instance.offsetHeight - ( window.innerHeight * laziness ) > 0 )
				return true;

			var tmp = document.getElementById( 'disqus_thread' );
			if( tmp ) tmp.removeAttribute( 'id' );
			instance.setAttribute( 'id', 'disqus_thread' );
			instance.disqusLoaderStatus = 'loaded';

			if( scriptStatus == 'loaded' )
			{
				DISQUS.reset({ reload: true, config: disqusConfig });
			}
			else // unloaded | loading
			{
				window.disqus_config = disqusConfig;
				if( scriptStatus == 'unloaded' )
				{
					scriptStatus = 'loading';
					loadScript( scriptUrl, function()
					{
						scriptStatus = 'loaded';
					});
				}
			}
		};

	window.addEventListener( 'scroll', throttle( throttleTO, init ));
	window.addEventListener( 'resize', throttle( throttleTO, init ));

	window.disqusLoader = function( element, options )
	{
		options = extendObj(
		{
			laziness:		1,
			throttle:		250,
			scriptUrl:		false,
			disqusConfig:	false,

		}, options );

		laziness		= options.laziness + 1;
		throttleTO		= options.throttle;
		disqusConfig	= options.disqusConfig;
		scriptUrl		= scriptUrl === false ? options.scriptUrl : scriptUrl; // set it only once

		if( typeof element === 'string' )				instance = document.querySelector( element );
		else if( typeof element.length === 'number' )	instance = element[ 0 ];
		else											instance = element;

		if (instance) instance.disqusLoaderStatus = 'unloaded';

		init();
	};

}( window, document, 0 ));
// Google Analytics
(function(i, s, o, g, r, a, m) {
  i["GoogleAnalyticsObject"] = r;
  (i[r] =
    i[r] ||
    function() {
      (i[r].q = i[r].q || []).push(arguments);
    }),
    (i[r].l = 1 * new Date());
  (a = s.createElement(o)), (m = s.getElementsByTagName(o)[0]);
  a.async = 1;
  a.src = g;
  m.parentNode.insertBefore(a, m);
})(window, document, "script", "//www.google-analytics.com/analytics.js", "ga");

ga("create", "UA-XXXXXXXX-X", "engineering.trio.dev");
ga("send", "pageview");





// Lazy load Disqus comments
try {
  disqusLoader("#disqus_thread", {
    scriptUrl: "https://usetrio.disqus.com/embed.js"
  });
} catch (e) {
  console.error(e);
}
;
