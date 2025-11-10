// 动画与工具函数（可扩展）
(function () {
	'use strict';

	const addVisible = (el) => el.classList.add('is-visible');
	const removeVisible = (el) => el.classList.remove('is-visible');

	window.__ANIM__ = { addVisible, removeVisible };
})();


