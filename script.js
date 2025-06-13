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
    
    // --- 嵌入式 Demo 区域逻辑 ---
    // 获取新的嵌入式 Demo 元素
    const embeddedDemoContainer = document.getElementById('embeddedDemoContainer');
    const embeddedDemoIframe = document.getElementById('embeddedDemoIframe');
    const embeddedDemoTitle = document.getElementById('embeddedDemoTitle');
    const embeddedLoadingIndicator = document.getElementById('embeddedLoadingIndicator');
    const closeEmbeddedDemoButton = document.getElementById('closeEmbeddedDemo'); // 新增关闭按钮元素

    // 通用函数：打开嵌入式 Demo 区域
    function openEmbeddedDemo(demoPath, title) {
        if (!embeddedDemoContainer || !embeddedDemoIframe || !embeddedDemoTitle || !embeddedLoadingIndicator) {
            console.error('Embedded demo elements not found.');
            return;
        }

        // 滚动到 Demo 区域，提升用户体验
        embeddedDemoContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });

        embeddedDemoTitle.textContent = title; // 设置 Demo 区域标题
        embeddedLoadingIndicator.classList.remove('hidden'); // 显示加载指示器
        embeddedDemoIframe.src = ''; // 先清空 iframe 的 src，防止旧内容残留

        // 延迟设置 iframe src，给加载指示器一个显示的机会
        setTimeout(() => {
            embeddedDemoIframe.src = demoPath; // 设置 iframe 的 src，开始加载 Demo

            // 监听 iframe 加载完成事件
            embeddedDemoIframe.onload = () => {
                embeddedLoadingIndicator.classList.add('hidden'); // 隐藏加载指示器
            };
            // 监听 iframe 加载错误事件
            embeddedDemoIframe.onerror = () => {
                embeddedLoadingIndicator.textContent = 'Demo加载失败。请检查路径或稍后再试。';
                console.error('Failed to load demo from:', demoPath);
            };
        }, 100); // 短暂延迟，让加载指示器可见

        embeddedDemoContainer.classList.remove('hidden'); // 显示嵌入式 Demo 容器
    }

    // 通用函数：关闭嵌入式 Demo 区域
    function closeEmbeddedDemo() {
        if (!embeddedDemoContainer || !embeddedDemoIframe || !embeddedLoadingIndicator) return;

        embeddedDemoContainer.classList.add('hidden'); // 隐藏嵌入式 Demo 容器
        embeddedDemoIframe.src = ''; // 清空 iframe 的 src，停止 Demo 运行并释放资源
        embeddedLoadingIndicator.classList.add('hidden'); // 隐藏加载指示器
        embeddedDemoTitle.textContent = '项目 Demo 演示'; // 恢复默认标题
    }

    // 为关闭按钮添加事件监听器
    if (closeEmbeddedDemoButton) {
        closeEmbeddedDemoButton.addEventListener('click', closeEmbeddedDemo);
    }

    // 为所有 "体验Demo" 按钮添加事件监听器
    const allDemoButtons = document.querySelectorAll('a[id^="openDemoModalBtn"]');

    allDemoButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault(); // 阻止链接默认跳转行为

            const demoPath = button.getAttribute('href'); // 获取 Demo 路径
            
            // 获取项目标题：从最近的父级 `.w-full.md\:w-2\/3` 中查找 `h3` 标签
            const projectTitleElement = button.closest('.w-full.md\\:w-2\\/3')?.querySelector('h3');
            const projectTitle = projectTitleElement ? projectTitleElement.textContent : 'Demo 演示';

            openEmbeddedDemo(demoPath, projectTitle); // 调用通用函数打开嵌入式 Demo 区域
        });
    });
});


// --- 其他函数定义 (保持不变) ---

async function loadMarkdownResume() {
    const container = document.getElementById('resume-container');
    if (!container) return;

    if (typeof marked === 'undefined') {
        container.innerHTML = '<p>Error loading resume content.</p>';
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
        el.innerText = text;
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
                if (el.tagName === 'TITLE') {
                    document.title = text;
                } else {
                    el.innerText = text;
                }
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

        const event = new CustomEvent('languageChange', { detail: { lang } });
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