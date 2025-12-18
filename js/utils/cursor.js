/**
 * 自定义光标管理器
 * 处理鼠标移动、悬停和点击状态的光标切换
 */

window.CustomCursor = class {
    constructor() {
        this.cursor = null;
        this.isHovering = false;
        this.isMouseDown = false;
        this.init();
    }

    init() {
        this.createCursor();
        this.bindEvents();
        this.updateCursorPosition();
    }

    createCursor() {
        // 创建光标元素
        this.cursor = document.createElement('div');
        this.cursor.className = 'cursor cursor__default';
        document.body.appendChild(this.cursor);
    }

    bindEvents() {
        // 鼠标移动事件
        document.addEventListener('mousemove', (e) => {
            this.updateCursorPosition(e.clientX, e.clientY);
        });

        // 鼠标进入视窗
        document.addEventListener('mouseenter', () => {
            this.cursor.classList.remove('cursor--hidden');
        });

        // 鼠标离开视窗
        document.addEventListener('mouseleave', () => {
            this.cursor.classList.add('cursor--hidden');
        });

        // 悬停状态检测
        this.setupHoverDetection();

        // 点击状态
        this.setupClickDetection();
    }

    updateCursorPosition(x = 0, y = 0) {
        if (this.cursor) {
            this.cursor.style.left = x + 'px';
            this.cursor.style.top = y + 'px';
        }
    }

    setupHoverDetection() {
        // 定义可交互元素的选择器
        const interactiveSelectors = [
            'a',
            'button',
            '.btn',
            '.card',
            '.nav__link',
            '.backtop',
            '[tabindex]:not([tabindex="-1"])',
            'input',
            'textarea',
            'select'
        ];

        // 为所有可交互元素添加事件监听
        document.addEventListener('mouseover', (e) => {
            const target = e.target;
            const isInteractive = interactiveSelectors.some(selector =>
                target.matches && target.matches(selector)
            );

            if (isInteractive || this.findParentInteractive(target, interactiveSelectors)) {
                this.setHoverState(true);
            }
        });

        document.addEventListener('mouseout', (e) => {
            const target = e.target;
            const isInteractive = interactiveSelectors.some(selector =>
                target.matches && target.matches(selector)
            );

            if (isInteractive || this.findParentInteractive(target, interactiveSelectors)) {
                // 检查鼠标是否真的离开了交互元素
                setTimeout(() => {
                    const elementAtPoint = document.elementFromPoint(e.clientX, e.clientY);
                    const isStillOverInteractive = interactiveSelectors.some(selector =>
                        elementAtPoint && elementAtPoint.matches && elementAtPoint.matches(selector)
                    ) || this.findParentInteractive(elementAtPoint, interactiveSelectors);

                    if (!isStillOverInteractive) {
                        this.setHoverState(false);
                    }
                }, 10);
            }
        });
    }

    findParentInteractive(element, selectors) {
        let parent = element.parentElement;
        while (parent) {
            const isInteractive = selectors.some(selector =>
                parent.matches && parent.matches(selector)
            );
            if (isInteractive) return true;
            parent = parent.parentElement;
        }
        return false;
    }

    setupClickDetection() {
        document.addEventListener('mousedown', (e) => {
            this.isMouseDown = true;
            this.updateCursorState();
        });

        document.addEventListener('mouseup', (e) => {
            this.isMouseDown = false;
            this.updateCursorState();
        });

        // 防止拖拽时光标状态异常
        document.addEventListener('dragstart', (e) => {
            this.isMouseDown = false;
            this.updateCursorState();
        });
    }

    setHoverState(isHovering) {
        this.isHovering = isHovering;
        this.updateCursorState();
    }

    updateCursorState() {
        if (!this.cursor) return;

        // 移除所有状态类
        this.cursor.classList.remove('cursor__default', 'cursor__hover', 'cursor__active');

        // 根据当前状态添加对应的类
        // 只有在悬停在可交互元素上时，点击才会显示 active 状态
        if (this.isMouseDown && this.isHovering) {
            this.cursor.classList.add('cursor__active');
        } else if (this.isHovering) {
            this.cursor.classList.add('cursor__hover');
        } else {
            this.cursor.classList.add('cursor__default');
        }
    }

    // 公共方法：手动设置状态
    setActive() {
        this.cursor.classList.remove('cursor__default', 'cursor__hover');
        this.cursor.classList.add('cursor__active');

        // 短暂显示active状态后恢复
        setTimeout(() => {
            this.updateCursorState();
        }, 150);
    }

    // 销毁光标
    destroy() {
        if (this.cursor && this.cursor.parentNode) {
            this.cursor.parentNode.removeChild(this.cursor);
        }
        this.cursor = null;
    }
};