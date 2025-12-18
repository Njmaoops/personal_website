// 入口：初始化年份、Three 场景与滚动观察
(function () {
	'use strict';

	const setYear = () => {
		const yearEl = document.getElementById('year');
		if (!yearEl) return;
		yearEl.textContent = String(new Date().getFullYear());
	};

	const init = () => {
		setYear();
		// 初始化自定义光标
		if (window.CustomCursor) {
			window.__CURSOR__ = new window.CustomCursor();
		}
		window.__THREE_SCENE__?.start(); // 启动 Three.js 动画循环
		window.__SCROLLER__?.observeSections(); // 启动可视观察与导航高亮
	};

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init, { once: true });
	} else {
		init();
	}
})();


