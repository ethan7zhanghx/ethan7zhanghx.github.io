import { initCalendar, isCalendarPage } from './calendar.js';

document.addEventListener('DOMContentLoaded', () => {
    // 确保 lucide 图标在 DOM 加载后创建
    lucide.createIcons();
    
    // 调用其他页面初始化函数
    initLanguageSwitcher();
    initMobileMenu(); // 确保函数定义在下面
    initHeaderScroll();
    updateFooterYear(); // 确保函数定义在下面
    updateActiveNav();
    
    // 根据页面条件加载日历或简历
    if (isCalendarPage()) {
        initCalendar();
    }
    
    if (document.getElementById('resume-container')) {
        loadMarkdownResume();
    }
    
    // --- Demo 模态框逻辑 (确保只在这里执行一次) ---
    const openDemoModalBtn = document.getElementById('openDemoModalBtn'); // 体验Demo按钮
    const demoModal = document.getElementById('demoModal'); // 模态框容器
    const closeModalButton = document.getElementById('closeModal'); // 关闭按钮
    const demoIframe = document.getElementById('demoIframe'); // iframe元素
    const modalTitle = document.getElementById('modalTitle'); // 模态框标题
    const loadingIndicator = document.getElementById('loadingIndicator'); // 加载指示器

    // 只有当所有相关元素都成功获取到时，才设置事件监听器
    if (openDemoModalBtn && demoModal && closeModalButton && demoIframe && modalTitle && loadingIndicator) {
        // 点击 "体验Demo" 按钮
        openDemoModalBtn.addEventListener('click', (event) => {
            event.preventDefault(); // 阻止链接默认跳转行为

            const demoPath = openDemoModalBtn.getAttribute('href'); // 获取 Demo 路径
            // 获取项目标题作为模态框标题
            const projectTitleElement = openDemoModalBtn.closest('.w-full.md\\:w-2\\/3').querySelector('h3');
            const projectTitle = projectTitleElement ? projectTitleElement.textContent : 'Demo 演示';

            modalTitle.textContent = projectTitle; // 设置模态框标题

            // 显示加载指示器
            loadingIndicator.classList.remove('hidden');
            demoIframe.src = demoPath; // 设置 iframe 的 src，开始加载 Demo

            // 监听 iframe 加载完成事件
            demoIframe.onload = () => {
                loadingIndicator.classList.add('hidden'); // 隐藏加载指示器
            };

            demoModal.classList.remove('hidden'); // 显示模态框
            document.body.style.overflow = 'hidden'; // 禁止背景页面滚动
        });

        // 点击模态框关闭按钮
        closeModalButton.addEventListener('click', () => {
            demoModal.classList.add('hidden'); // 隐藏模态框
            demoIframe.src = ''; // 清空 iframe 的 src，停止 Demo 运行并释放资源
            document.body.style.overflow = ''; // 恢复背景页面滚动
            loadingIndicator.classList.add('hidden'); // 再次隐藏以防万一
        });

        // 点击模态框背景区域（可选）
        demoModal.addEventListener('click', (event) => {
            if (event.target === demoModal) { // 确保点击的是模态框的背景而不是内容
                demoModal.classList.add('hidden');
                demoIframe.src = '';
                document.body.style.overflow = '';
                loadingIndicator.classList.add('hidden');
            }
        });
    }
});

// --- 函数定义 (这些函数可以放在 DOMContentLoaded 外部，因为它们只是定义，不立即操作 DOM) ---

async function loadMarkdownResume() {
    const container = document.getElementById('resume-container');
    if (!container) return;

    // 假设 marked 库已通过 CDN 或其他方式加载
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

// 移动菜单的函数定义
function initMobileMenu() {
    const menuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    if (!menuButton || !mobileMenu) return;

    menuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });
}

// 头部滚动效果的函数定义
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

// 页脚年份更新的函数定义
function updateFooterYear() {
    const yearSpan = document.getElementById('footer-year');
    if(yearSpan) {
        yearSpan.innerText = new Date().getFullYear();
    }
}

// 导航高亮更新的函数定义
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

    // 注意：你的 HTML 中移动菜单的链接类名是 'nav-link' 而不是 'nav-link-mobile'
    // 如果你希望它们不同，请更新 HTML。这里我保持了你的JS中的选择器
    document.querySelectorAll('#mobile-menu a.nav-link-mobile').forEach(link => {
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