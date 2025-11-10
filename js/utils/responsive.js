// 响应式工具
(function () {
	'use strict';

	const isMobile = () => window.matchMedia('(max-width: 640px)').matches;
	const isTablet = () => window.matchMedia('(max-width: 1024px)').matches && !isMobile();

	window.__RESP__ = { isMobile, isTablet };
})();


