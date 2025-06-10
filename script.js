import { initCalendar, isCalendarPage } from './calendar.js';

document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    initLanguageSwitcher();
    initMobileMenu();
    initHeaderScroll();
    updateFooterYear();
    updateActiveNav();
    
    if (isCalendarPage()) {
        initCalendar();
    }
    
    if (document.getElementById('resume-container')) {
        loadMarkdownResume();
    }
});

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
