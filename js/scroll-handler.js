// 滚动交互：分区入场与导航高亮
(function () {
	'use strict';

	const sectionSelector = window.__CONSTANTS__?.SECTION_SELECTOR ?? '.observe';
	const activeClass = window.__CONSTANTS__?.ACTIVE_CLASS ?? 'is-active';
	const visibleClass = 'is-visible';

	const links = Array.from(document.querySelectorAll('.nav__link'));
	const sections = Array.from(document.querySelectorAll(sectionSelector));

	const setActiveById = (id) => {
		links.forEach((a) => {
			const isActive = a.getAttribute('href') === `#${id}`;
			a.classList.toggle(activeClass, Boolean(isActive));
		});
	};

	// 进入视口动画
	const inter = new IntersectionObserver((entries) => {
		for (const e of entries) {
			if (e.isIntersecting) e.target.classList.add(visibleClass);
		}
	}, {
		root: null,
		rootMargin: '0px 0px -15% 0px',
		threshold: 0.15
	});

	// 高亮导航（根据最接近顶部的分区）
	const spy = new IntersectionObserver((entries) => {
		entries.forEach((e) => {
			if (!e.isIntersecting) return;
			const id = e.target.id;
			if (id) setActiveById(id);
		});
	}, {
		root: null,
		threshold: 0.4
	});

	const observeSections = () => {
		sections.forEach((el) => inter.observe(el));
		sections.forEach((el) => spy.observe(el));
	};

	// 平滑滚动（可选：原生行为由浏览器/系统设置决定）
	links.forEach((a) => {
		a.addEventListener('click', (ev) => {
			const href = a.getAttribute('href');
			if (!href || !href.startsWith('#')) return;
			const target = document.querySelector(href);
			if (!target) return;
			ev.preventDefault();
			target.scrollIntoView({ behavior: 'smooth', block: 'start' });
		});
	});

	window.__SCROLLER__ = { observeSections };
})();


