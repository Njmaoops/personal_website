// Three.js 背景：很少、很淡的灰粒子，慢慢转。
// 故意做弱，避免盖过正文。颜色跟浅色页面靠近，不要用亮白大颗粒。
(function () {
	'use strict';

	/** @type {HTMLCanvasElement|null} */
	const canvas = document.getElementById('bg-canvas');
	if (!canvas) {
		console.warn('[three] 未找到 canvas 元素');
		return;
	}

	const renderer = new THREE.WebGLRenderer({
		canvas,
		antialias: true,
		alpha: true
	});
	renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
	renderer.setSize(window.innerWidth, window.innerHeight);

	const scene = new THREE.Scene();
	const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
	camera.position.set(0, 0, 8);

	// 细微环境光
	scene.add(new THREE.AmbientLight(0xffffff, 0.6));

	// 粒子云（简洁）
	const particles = (() => {
		// 数量和大小优先读 settings.js，这里的数字只是兜底
		const count = window.__SETTINGS__?.particles?.count ?? 140;
		const size = window.__SETTINGS__?.particles?.size ?? 0.006;
		const radius = 7.5;
		const geometry = new THREE.BufferGeometry();
		const positions = new Float32Array(count * 3);
		for (let i = 0; i < count; i++) {
			const i3 = i * 3;
			positions[i3 + 0] = (Math.random() - 0.5) * radius * 2;
			positions[i3 + 1] = (Math.random() - 0.5) * radius * 2;
			positions[i3 + 2] = (Math.random() - 0.5) * radius * 2;
		}
		geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
		const material = new THREE.PointsMaterial({
			color: 0x9a9a9a,
			size,
			sizeAttenuation: true,
			transparent: true,
			opacity: 0.28,
			depthWrite: false
		});
		return new THREE.Points(geometry, material);
	})();
	scene.add(particles);

	// 时间
	const clock = new THREE.Clock();

	// 动画循环
	let raf = 0;
	const animate = () => {
		const t = clock.getElapsedTime();
		// 转得很慢，几乎是静止的灰点
		const rotSpeed = 0.012;
		particles.rotation.y = t * rotSpeed;

		const sway = 0.015;
		camera.position.x = Math.sin(t * 0.15) * sway;
		camera.position.y = Math.cos(t * 0.12) * sway;
		camera.lookAt(0, 0, 0);

		renderer.render(scene, camera);
		raf = requestAnimationFrame(animate);
	};

	// 自适应
	const handleResize = () => {
		const w = window.innerWidth;
		const h = window.innerHeight;
		camera.aspect = w / h;
		camera.updateProjectionMatrix();
		renderer.setSize(w, h);
		renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
	};
	window.addEventListener('resize', handleResize);

	// 导出控制
	window.__THREE_SCENE__ = {
		start: () => {
			if (!raf) animate();
		},
		stop: () => {
			if (raf) cancelAnimationFrame(raf);
			raf = 0;
		}
	};
})();


