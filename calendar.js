let currentDate = new Date();
let currentLang = localStorage.getItem('language') || 'cn';

const langData = {
    cn: {
        months: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
        days: ['日', '一', '二', '三', '四', '五', '六'],
    },
    en: {
        months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    }
};

const busyDaysPlaceholder = [5, 6, 15, 16, 25, 26];

function renderCalendar() {
    const container = document.getElementById('calendar-container');
    if (!container) return;

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDayIndex = firstDay.getDay();

    const today = new Date();
    const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;

    let html = `
        <div class="flex items-center justify-between mb-4">
            <button id="prev-month" class="p-2 rounded-full hover:bg-gray-100 transition-colors"><i data-lucide="chevron-left" class="w-6 h-6"></i></button>
            <h3 class="text-xl font-bold text-gray-800">${langData[currentLang].months[month]} ${year}</h3>
            <button id="next-month" class="p-2 rounded-full hover:bg-gray-100 transition-colors"><i data-lucide="chevron-right" class="w-6 h-6"></i></button>
        </div>
        <div class="grid grid-cols-7 gap-1 text-center font-medium text-gray-500">
            ${langData[currentLang].days.map(day => `<div class="py-2 text-sm">${day}</div>`).join('')}
        </div>
        <div class="grid grid-cols-7 gap-1 mt-2">
    `;

    for (let i = 0; i < startDayIndex; i++) {
        html += `<div></div>`;
    }

    for (let day = 1; day <= daysInMonth; day++) {
        let classes = 'calendar-day flex items-center justify-center h-10 w-10 rounded-full transition-colors duration-200 text-sm';
        
        if(isCurrentMonth && day === today.getDate()) {
            classes += ' today';
        } else if (busyDaysPlaceholder.includes(day)) {
            classes += ' busy';
        } else {
            classes += ' available';
        }

        html += `<div class="${classes}">${day}</div>`;
    }

    html += `</div>`;
    
    html += `
        <div class="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-6 pt-4 border-t text-sm text-gray-600">
            <div class="flex items-center"><span class="w-3 h-3 rounded-full bg-green-100 mr-2 border border-green-300"></span><span data-lang-cn="可用" data-lang-en="Available">可用</span></div>
            <div class="flex items-center"><span class="w-3 h-3 rounded-full bg-gray-200 mr-2 border border-gray-300"></span><span data-lang-cn="繁忙" data-lang-en="Busy">Busy</span></div>
            <div class="flex items-center"><span class="w-3 h-3 rounded-full bg-blue-600 mr-2 border border-blue-700"></span><span data-lang-cn="今天" data-lang-en="Today">Today</span></div>
        </div>
    `;

    container.innerHTML = html;
    lucide.createIcons();
    updateLegendLanguage();

    document.getElementById('prev-month').addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });

    document.getElementById('next-month').addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });
}

function updateLegendLanguage() {
    const elements = document.querySelectorAll('#calendar-container [data-lang-cn]');
    elements.forEach(el => {
        el.textContent = el.getAttribute(`data-lang-${currentLang}`);
    });
}


export function isCalendarPage() {
    return !!document.getElementById('calendar-container');
}

export function initCalendar() {
    renderCalendar();
    document.addEventListener('languageChange', (e) => {
        currentLang = e.detail.lang;
        renderCalendar();
    });
}
