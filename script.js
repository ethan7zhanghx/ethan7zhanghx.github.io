import { initCalendar, isCalendarPage } from './calendar.js';

document.addEventListener('DOMContentLoaded', () => {
    // 确保 lucide 图标在 DOM 加载后创建
    lucide.createIcons();

    // 调用其他页面初始化函数
    initLanguageSwitcher();
    initMobileMenu();
    initHeaderScroll();
    updateFooterYear();
    updateActiveNav();

    // 根据页面条件加载日历或简历
    if (isCalendarPage()) {
        initCalendar();
    }

    if (document.getElementById('resume-container')) {
        loadMarkdownResume();
    }

    // --- 辅助函数：判断是否为移动设备 ---
    function isMobileDevice() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    // --- 嵌入式 Demo 区域逻辑 ---

    const allDemoButtons = document.querySelectorAll('.open-embedded-demo-btn');

    allDemoButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault(); // 阻止链接默认跳转行为
            console.log("阻止默认行为已执行！"); // 添加调试日志

            // *** 核心修复：根据您最新的 HTML，直接从 href 获取路径 ***
            const realDemoPath = button.getAttribute('href'); // 如果 href 就是实际路径，就用这个

            const projectTitleElement = button.closest('.w-full.md\\:w-2\\/3')?.querySelector('h3');
            const projectTitle = projectTitleElement ? projectTitleElement.textContent : 'Demo 演示';

            if (!realDemoPath) {
                console.error('未找到 Demo 路径。请检查按钮的 href 属性。');
                alert('Demo 路径配置错误，无法加载。');
                return;
            }

            if (isMobileDevice()) {
                console.log(`移动设备检测到，在新页面打开 Demo: ${realDemoPath}`);
                window.open(realDemoPath, '_blank');
            } else {
                openEmbeddedDemo(button, realDemoPath, projectTitle);
            }
        });
    });

    function openEmbeddedDemo(triggerButton, demoPath, title) {
        const projectItem = triggerButton.closest('.project-item');
        if (!projectItem) {
            console.error('openEmbeddedDemo: 未找到项目容器 .project-item。');
            return;
        }

        const embeddedDemoContainer = projectItem.querySelector('.embedded-demo-container');
        const embeddedDemoIframe = projectItem.querySelector('.embedded-demo-iframe');
        const embeddedDemoTitle = projectItem.querySelector('.embedded-demo-title');
        const embeddedLoadingIndicator = projectItem.querySelector('.embedded-loading-indicator');
        const closeEmbeddedDemoButton = projectItem.querySelector('.close-embedded-demo-btn');

        if (!embeddedDemoContainer || !embeddedDemoIframe || !embeddedDemoTitle || !embeddedLoadingIndicator || !closeEmbeddedDemoButton) {
            console.error('openEmbeddedDemo: 当前项目内部的嵌入式 Demo 元素未找到。请检查 portfolio.html 中 .project-item 内部的 HTML 结构。');
            return;
        }

        document.querySelectorAll('.embedded-demo-container').forEach(container => {
            if (container !== embeddedDemoContainer) {
                container.classList.add('hidden');
                const otherIframe = container.querySelector('.embedded-demo-iframe');
                if (otherIframe) {
                    otherIframe.src = '';
                    otherIframe.style.opacity = '0';
                }
                const otherLoadingIndicator = container.querySelector('.embedded-loading-indicator');
                if (otherLoadingIndicator) otherLoadingIndicator.classList.add('hidden');
                const otherTitle = container.querySelector('.embedded-demo-title');
                if (otherTitle) otherTitle.textContent = '项目 Demo 演示';
            }
        });

        // 如果当前 Demo 容器已经显示，则再次点击时关闭它
        if (!embeddedDemoContainer.classList.contains('hidden')) {
            embeddedDemoContainer.classList.add('hidden');
            embeddedDemoIframe.src = '';
            embeddedDemoIframe.style.opacity = '0';
            embeddedLoadingIndicator.classList.add('hidden');
            embeddedDemoTitle.textContent = '项目 Demo 演示';
            return;
        }

        embeddedDemoTitle.textContent = title;
        embeddedLoadingIndicator.classList.remove('hidden');
        embeddedDemoIframe.src = '';

        embeddedDemoIframe.style.opacity = '0';
        embeddedDemoIframe.style.transition = 'opacity 0.3s ease-in-out';

        setTimeout(() => {
            embeddedDemoIframe.src = demoPath;
            console.log(`尝试在 iframe 中加载 Demo: ${demoPath}`);

            embeddedDemoIframe.onload = () => {
                console.log(`Demo 加载成功 (iframe.onload): ${demoPath}`);
                embeddedLoadingIndicator.classList.add('hidden');
                embeddedDemoIframe.style.opacity = '1';
            };
            embeddedDemoIframe.onerror = () => {
                console.error('Demo 加载失败 (iframe.onerror)，来源:', demoPath);
                embeddedLoadingIndicator.textContent = 'Demo 加载失败。请检查路径或稍后再试。';
                embeddedDemoIframe.style.opacity = '0';
            };
        }, 100);

        embeddedDemoContainer.classList.remove('hidden');
        embeddedDemoContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    document.querySelectorAll('.close-embedded-demo-btn').forEach(button => {
        button.addEventListener('click', () => {
            const embeddedDemoContainer = button.closest('.embedded-demo-container');
            if (!embeddedDemoContainer) return;

            const embeddedDemoIframe = embeddedDemoContainer.querySelector('.embedded-demo-iframe');
            const embeddedLoadingIndicator = embeddedDemoContainer.querySelector('.embedded-loading-indicator');
            const embeddedDemoTitle = embeddedDemoContainer.querySelector('.embedded-demo-title');

            embeddedDemoContainer.classList.add('hidden');
            if (embeddedDemoIframe) {
                embeddedDemoIframe.src = '';
                embeddedDemoIframe.style.opacity = '0';
            }
            if (embeddedLoadingIndicator) {
                embeddedLoadingIndicator.classList.add('hidden');
                const originalLoadingText = embeddedLoadingIndicator.getAttribute('data-lang-cn') || 'Demo 加载中...';
                embeddedLoadingIndicator.textContent = originalLoadingText;
            }
            if (embeddedDemoTitle) embeddedDemoTitle.textContent = '项目 Demo 演示';
        });
    });

});

// --- 其他函数定义 (保持不变) ---

async function loadMarkdownResume() {
    const container = document.getElementById('resume-container');
    if (!container) return;

    if (typeof marked === 'undefined') {
        container.innerHTML = '<p data-lang-cn="错误：Markdown 渲染库未加载。" data-lang-en="Error: Markdown rendering library not loaded."></p>';
        updateElementLanguage(container.querySelector('p'));
        return;
    }

    try {
        const response = await fetch('resume_of_quantitative_investment_and_ai_product_specialist.md');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const markdownText = await response.text();
        container.innerHTML = marked.parse(markdownText);
    } catch (error) {
        console.error('Error fetching or parsing resume:', error);
        const p = document.createElement('p');
        p.setAttribute('data-lang-cn', '简历加载失败，请稍后重试。');
        p.setAttribute('data-lang-en', 'Failed to load resume. Please try again later.');
        container.innerHTML = '';
        container.appendChild(p);
        updateElementLanguage(p);
    }
}

function updateElementLanguage(el) {
    const lang = document.documentElement.lang.startsWith('en') ? 'en' : 'cn';
    const text = el.getAttribute(`data-lang-${lang}`);
    if (text) {
        if (el.tagName === 'TITLE') {
            document.title = text;
        } else {
            el.innerText = text;
        }
    }
}

function initLanguageSwitcher() {
    const switcher = document.getElementById('lang-switcher');
    if (!switcher) return;

    const updateTexts = (lang) => {
        document.documentElement.lang = lang === 'cn' ? 'zh-CN' : 'en';
        document.documentElement.classList.toggle('lang-cn', lang === 'cn');
        document.documentElement.classList.toggle('lang-en', lang === 'en');

        const elements = document.querySelectorAll('[data-lang-cn], [data-lang-en]');
        elements.forEach(el => {
            const text = el.getAttribute(`data-lang-${lang}`);
            if (text) {
                updateElementLanguage(el);
            }
        });

        if (lang === 'en') {
            switcher.setAttribute('aria-checked', 'true');
            const span = switcher.querySelector('span');
            if(span) span.style.transform = 'translateX(1.25rem)';
        } else {
            switcher.setAttribute('aria-checked', 'false');
            const span = switcher.querySelector('span');
            if(span) span.style.transform = 'translateX(0)';
        }

        const event = new CustomEvent('languageChanged', { detail: { lang } });
        document.dispatchEvent(event);
    };

    switcher.addEventListener('click', () => {
        const currentLangIsEn = switcher.getAttribute('aria-checked') === 'true';
        const newLang = currentLangIsEn ? 'cn' : 'en';
        localStorage.setItem('language', newLang);
        updateTexts(newLang);
    });

    const savedLang = localStorage.getItem('language') || 'cn';
    updateTexts(savedLang);
}

function initMobileMenu() {
    const menuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    if (!menuButton || !mobileMenu) return;

    menuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });
}

function initHeaderScroll() {
    const header = document.getElementById('header');
    if (!header) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('py-2');
            header.classList.remove('py-4');
        } else {
            header.classList.add('py-4');
            header.classList.remove('py-2');
        }
    });
}

function updateFooterYear() {
    const yearSpan = document.getElementById('footer-year');
    if(yearSpan) {
        yearSpan.innerText = new Date().getFullYear();
    }
}

function updateActiveNav() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';

    document.querySelectorAll('header nav a.nav-link').forEach(link => {
        const linkPath = link.getAttribute('href').split('/').pop();
        if (linkPath === currentPath) {
            link.classList.add('text-blue-600', 'font-bold');
            link.classList.remove('text-gray-600');
        } else {
            link.classList.remove('text-blue-600', 'font-bold');
            link.classList.add('text-gray-600');
        }
    });

    document.querySelectorAll('#mobile-menu a.nav-link').forEach(link => {
        const linkPath = link.getAttribute('href').split('/').pop();
        if (linkPath === currentPath) {
            link.classList.add('text-blue-600', 'font-bold', 'bg-blue-50');
            link.classList.remove('text-gray-600');
        } else {
            link.classList.remove('text-blue-600', 'font-bold', 'bg-blue-50');
            link.classList.add('text-gray-600');
        }
    });
}