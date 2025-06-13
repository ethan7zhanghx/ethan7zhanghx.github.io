import { userData } from './user_data.js';
import { createFocusChart, createWeeklyChart, createTeamChart } from './chart_config.js';
import { AIEngine } from './ai_engine.js';

class FocusAI {
    constructor() {
        this.state = {
            currentTask: null,
            sessionActive: false,
            currentView: 'welcome',
            focusLevel: 85,
            timer: null,
            timeRemaining: 25 * 60,
            charts: {},
            activePanel: 'analytics',
            sessionStartTime: null,
            pausedTime: 0,
            breakTimer: null,
            breakTimeRemaining: 0,
            currentTaskData: null,
            distractionCount: 0,
            pomodorosCompleted: 0,
            completedTasks: [],
            interventionTimer: null,
            sessionData: {
                focusScores: [],
                distractions: [],
                taskType: null
            }
        };
        
        this.elements = {};
        this.aiEngine = new AIEngine();
        this.init();
    }

    init() {
        this.cacheDOMElements();
        this.bindEvents();
        this.initializeCharts();
        this.setupTimerUpdate();
        this.loadUserData();
    }

    cacheDOMElements() {
        const elementIds = [
            'task-input', 'priority-select', 'category-select', 'analyze-task-btn',
            'analysis-container', 'analysis-loading', 'analysis-results',
            'suggested-pomodoros', 'cognitive-load', 'subtasks-list',
            'environment-suggestions', 'start-session-btn', 'priority-recommendation',
            'ai-priority-suggestion', 'welcome-state', 'focus-session', 'break-session',
            'review-session', 'current-task-name', 'timer-display', 'current-focus-level',
            'predicted-distraction', 'pause-btn', 'distracted-btn', 'distraction-test-btn',
            'complete-session-btn', 'break-icon', 'break-title', 'break-description',
            'break-duration', 'break-reasoning', 'start-break-btn', 'skip-break-btn',
            'session-focus-score', 'session-efficiency', 'session-distraction-count',
            'ai-insights', 'optimization-suggestions', 'finish-review-btn',
            'analytics-tab', 'insights-tab', 'team-tab', 'analytics-panel',
            'insights-panel', 'team-panel', 'personal-insight', 'settings-btn',
            'notifications-btn', 'intervention-modal', 'settings-modal',
            'health-modal', 'celebration-modal', 'intervention-message',
            'accept-intervention-btn', 'dismiss-intervention-btn', 'close-settings-btn',
            'save-settings-btn', 'cancel-settings-btn', 'close-health-btn',
            'close-celebration-btn'
        ];

        elementIds.forEach(id => {
            this.elements[id] = document.getElementById(id);
        });
    }

    bindEvents() {
        this.elements['analyze-task-btn'].addEventListener('click', () => this.analyzeTask());
        this.elements['start-session-btn'].addEventListener('click', () => this.startFocusSession());
        this.elements['pause-btn'].addEventListener('click', () => this.togglePause());
        this.elements['distracted-btn'].addEventListener('click', () => this.handleDistraction());
        this.elements['distraction-test-btn'].addEventListener('click', () => this.triggerAIIntervention());
        this.elements['complete-session-btn'].addEventListener('click', () => this.completeSession());
        this.elements['start-break-btn'].addEventListener('click', () => this.startBreak());
        this.elements['skip-break-btn'].addEventListener('click', () => this.skipBreak());
        this.elements['finish-review-btn'].addEventListener('click', () => this.resetToWelcome());
        
        this.elements['analytics-tab'].addEventListener('click', () => this.switchPanel('analytics'));
        this.elements['insights-tab'].addEventListener('click', () => this.switchPanel('insights'));
        this.elements['team-tab'].addEventListener('click', () => this.switchPanel('team'));
        
        this.elements['settings-btn'].addEventListener('click', () => this.showModal('settings-modal'));
        this.elements['notifications-btn'].addEventListener('click', () => this.showHealthReminder());
        
        this.elements['accept-intervention-btn'].addEventListener('click', () => this.acceptIntervention());
        this.elements['dismiss-intervention-btn'].addEventListener('click', () => this.dismissIntervention());
        
        this.elements['close-settings-btn'].addEventListener('click', () => this.hideModal('settings-modal'));
        this.elements['save-settings-btn'].addEventListener('click', () => this.saveSettings());
        this.elements['cancel-settings-btn'].addEventListener('click', () => this.hideModal('settings-modal'));
        
        this.elements['close-health-btn'].addEventListener('click', () => this.hideModal('health-modal'));
        this.elements['close-celebration-btn'].addEventListener('click', () => {
            this.hideModal('celebration-modal');
            this.showReview();
        });

        document.addEventListener('click', (e) => {
            if (e.target.closest('.modal-overlay') && !e.target.closest('.modal-content')) {
                const modals = ['intervention-modal', 'settings-modal', 'health-modal', 'celebration-modal'];
                modals.forEach(modalId => {
                    if (!this.elements[modalId].classList.contains('hidden')) {
                        this.hideModal(modalId);
                    }
                });
            }
        });

        setInterval(() => this.updateFocusLevel(), 5000);
    }

    switchView(viewName) {
        const views = ['welcome-state', 'focus-session', 'break-session', 'review-session'];
        views.forEach(view => {
            const element = this.elements[view];
            if (element) {
                if (view === viewName) {
                    element.classList.remove('hidden');
                    element.classList.add('animate-fade-in');
                } else {
                    element.classList.add('hidden');
                    element.classList.remove('animate-fade-in');
                }
            }
        });
        this.state.currentView = viewName;
    }

    switchPanel(panelName) {
        const panels = ['analytics', 'insights', 'team'];
        const tabs = ['analytics-tab', 'insights-tab', 'team-tab'];
        
        panels.forEach((panel, index) => {
            const panelElement = this.elements[`${panel}-panel`];
            const tabElement = this.elements[tabs[index]];
            
            if (panel === panelName) {
                panelElement.classList.remove('hidden');
                tabElement.classList.add('active');
            } else {
                panelElement.classList.add('hidden');
                tabElement.classList.remove('active');
            }
        });
        
        this.state.activePanel = panelName;
    }

    analyzeTask() {
        const taskText = this.elements['task-input'].value.trim();
        if (!taskText) {
            alert('请输入任务描述');
            return;
        }

        this.elements['analysis-loading'].classList.remove('hidden');
        this.elements['analysis-results'].classList.add('hidden');

        setTimeout(() => {
            const analysis = this.aiEngine.analyzeTask(taskText);
            this.state.currentTaskData = analysis;
            this.populateAnalysisResults(analysis);
            this.elements['analysis-loading'].classList.add('hidden');
            this.elements['analysis-results'].classList.remove('hidden');
        }, 1500);
    }

    populateAnalysisResults(analysis) {
        this.elements['suggested-pomodoros'].textContent = analysis.suggestedPomodoros;
        this.elements['cognitive-load'].textContent = analysis.cognitiveLoad;
        
        if (analysis.priorityRecommendation) {
            this.elements['priority-recommendation'].textContent = analysis.priorityRecommendation;
            this.elements['ai-priority-suggestion'].classList.remove('hidden');
        } else {
            this.elements['ai-priority-suggestion'].classList.add('hidden');
        }
        
        this.elements['subtasks-list'].innerHTML = '';
        analysis.subtasks.forEach((subtask, index) => {
            const li = document.createElement('li');
            li.className = 'task-item flex items-center justify-between mb-2';
            li.innerHTML = `
                <div class="flex items-center">
                    <div class="w-6 h-6 rounded-full border-2 border-blue-500 flex items-center justify-center mr-3">
                        <span class="text-xs font-bold text-blue-500">${index + 1}</span>
                    </div>
                    <span class="text-gray-700">${subtask.name}</span>
                </div>
                <div class="text-xs text-gray-500">
                    <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded">${subtask.estimatedTime}</span>
                </div>
            `;
            this.elements['subtasks-list'].appendChild(li);
        });

        this.elements['environment-suggestions'].innerHTML = '';
        analysis.environmentSuggestions.forEach(suggestion => {
            const div = document.createElement('div');
            div.className = 'flex items-center p-3 bg-green-50 border border-green-200 rounded-lg mb-2';
            div.innerHTML = `
                <i data-lucide="${suggestion.icon}" class="w-5 h-5 text-green-600 mr-3"></i>
                <div>
                    <p class="font-medium text-green-900 text-sm">${suggestion.title}</p>
                    <p class="text-green-700 text-xs">${suggestion.description}</p>
                </div>
            `;
            this.elements['environment-suggestions'].appendChild(div);
        });

        lucide.createIcons();
    }

    startFocusSession() {
        this.state.sessionActive = true;
        this.state.currentTask = this.elements['task-input'].value || "未命名任务";
        this.state.timeRemaining = 25 * 60;
        this.state.sessionStartTime = Date.now();
        this.state.pausedTime = 0;
        this.state.distractionCount = 0;
        this.state.sessionData = {
            focusScores: [],
            distractions: [],
            taskType: this.elements['category-select'].value
        };
        
        this.switchView('focus-session');
        this.elements['current-task-name'].textContent = this.state.currentTask;
        this.elements['pause-btn'].innerHTML = '<i data-lucide="pause" class="mr-2 w-4 h-4"></i>暂停';
        lucide.createIcons();
        
        this.startTimer();
        this.startFocusMonitoring();
        
        if (this.state.interventionTimer) clearTimeout(this.state.interventionTimer);
        const randomInterventionTime = (Math.random() * (15 - 5) + 5) * 60 * 1000;
        this.state.interventionTimer = setTimeout(() => {
            if (this.state.sessionActive && this.state.timer) {
                this.triggerAIIntervention();
            }
        }, randomInterventionTime);

        if (!this.state.charts.realtime) {
            this.state.charts.realtime = createFocusChart(userData.focusData);
        }
    }

    startTimer() {
        if (this.state.timer) return;
        this.state.timer = setInterval(() => {
            this.state.timeRemaining--;
            this.updateTimerDisplay();
            
            if (this.state.timeRemaining <= 0) {
                this.completeSession();
            }
        }, 1000);
    }

    togglePause() {
        if (this.state.timer) {
            clearInterval(this.state.timer);
            this.state.timer = null;
            elements['pause-btn'].innerHTML = '<i data-lucide="play" class="mr-2 w-4 h-4"></i>继续';
            lucide.createIcons();
        } else {
            this.startTimer();
            this.elements['pause-btn'].innerHTML = '<i data-lucide="pause" class="mr-2 w-4 h-4"></i>暂停';
            lucide.createIcons();
        }
    }

    updateTimerDisplay() {
        const minutes = Math.floor(this.state.timeRemaining / 60);
        const seconds = this.state.timeRemaining % 60;
        this.elements['timer-display'].textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    handleDistraction() {
        this.state.distractionCount++;
        this.state.sessionData.distractions.push({
            time: Date.now() - this.state.sessionStartTime,
            type: 'user_reported'
        });
        this.triggerAIIntervention();
    }

    startFocusMonitoring() {
        const focusInterval = setInterval(() => {
            if (!this.state.sessionActive) {
                clearInterval(focusInterval);
                return;
            }
            this.state.focusLevel = Math.max(60, Math.min(95, this.state.focusLevel + (Math.random() - 0.5) * 8));
            this.elements['current-focus-level'].textContent = `${Math.round(this.state.focusLevel)}%`;
            const predictedTime = Math.floor(Math.random() * 10) + 3;
            this.elements['predicted-distraction'].textContent = `${predictedTime}分钟后`;
        }, 4000);
    }

    triggerAIIntervention() {
        if (!this.state.sessionActive) return;
        const interventionMessage = this.aiEngine.getDistractionIntervention();
        this.elements['intervention-message'].textContent = interventionMessage;
        this.showModal('intervention-modal');
    }

    acceptIntervention() {
        this.hideModal('intervention-modal');
        this.state.focusLevel = Math.min(95, this.state.focusLevel + 15);
        this.elements['current-focus-level'].textContent = `${Math.round(this.state.focusLevel)}%`;
    }

    dismissIntervention() {
        this.hideModal('intervention-modal');
    }

    completeSession() {
        if (this.state.timer) {
            clearInterval(this.state.timer);
            this.state.timer = null;
        }
        if (this.state.interventionTimer) {
            clearTimeout(this.state.interventionTimer);
            this.state.interventionTimer = null;
        }
        
        this.state.sessionActive = false;
        this.state.pomodorosCompleted++;
        this.state.completedTasks.push({ name: this.state.currentTask, duration: 25 });
        
        setTimeout(() => {
            this.showModal('celebration-modal');
        }, 500);
    }

    showBreakSuggestion() {
        const breakSuggestion = this.aiEngine.getBreakSuggestion(this.state.pomodorosCompleted);
        this.elements['break-icon'].setAttribute('data-lucide', breakSuggestion.icon);
        this.elements['break-title'].textContent = breakSuggestion.title;
        this.elements['break-description'].textContent = breakSuggestion.description;
        this.elements['break-duration'].textContent = `建议时长: ${breakSuggestion.duration}`;
        this.elements['break-reasoning'].textContent = breakSuggestion.reasoning;
        this.switchView('break-session');
        lucide.createIcons();
    }

    startBreak() {
        const breakDuration = 5 * 60;
        this.state.breakTimeRemaining = breakDuration;
        this.elements['start-break-btn'].innerHTML = '<i data-lucide="clock" class="mr-2 w-4 h-4"></i>休息中 5:00';
        lucide.createIcons();
        
        this.state.breakTimer = setInterval(() => {
            this.state.breakTimeRemaining--;
            const minutes = Math.floor(this.state.breakTimeRemaining / 60);
            const seconds = this.state.breakTimeRemaining % 60;
            this.elements['start-break-btn'].innerHTML = 
                `<i data-lucide="clock" class="mr-2 w-4 h-4"></i>休息中 ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            lucide.createIcons();
            
            if (this.state.breakTimeRemaining <= 0) {
                clearInterval(this.state.breakTimer);
                this.state.breakTimer = null;
                this.elements['start-break-btn'].innerHTML = '<i data-lucide="check" class="mr-2 w-4 h-4"></i>休息完成';
                lucide.createIcons();
                setTimeout(() => this.showReview(), 1000);
            }
        }, 1000);
    }

    skipBreak() {
        this.showReview();
    }

    showReview() {
        const focusDuration = Math.round((25 * 60 - this.state.timeRemaining) / 60);
        const sessionReportData = {
            task: this.state.currentTask,
            focusDuration: focusDuration,
            distractionCount: this.state.distractionCount
        };
        const reviewData = this.aiEngine.generateReviewInsights(sessionReportData);
        
        this.elements['session-focus-score'].textContent = `${reviewData.focusScore}%`;
        this.elements['session-efficiency'].textContent = reviewData.efficiency;
        this.elements['session-distraction-count'].textContent = this.state.distractionCount.toString();
        this.elements['ai-insights'].textContent = reviewData.insights;
        this.elements['optimization-suggestions'].textContent = reviewData.suggestions;
        
        this.switchView('review-session');
    }

    resetToWelcome() {
        this.switchView('welcome-state');
        this.resetSession();
    }

    resetSession() {
        this.elements['task-input'].value = '';
        this.elements['analysis-results'].classList.add('hidden');
        this.elements['ai-priority-suggestion'].classList.add('hidden');
        this.state.currentTask = null;
        this.state.sessionActive = false;
        this.state.timeRemaining = 25 * 60;
        this.state.currentTaskData = null;
        this.state.distractionCount = 0;
        this.state.pomodorosCompleted = 0;
        this.state.completedTasks = [];
        
        if (this.state.timer) { clearInterval(this.state.timer); this.state.timer = null; }
        if (this.state.breakTimer) { clearInterval(this.state.breakTimer); this.state.breakTimer = null; }
        if (this.state.interventionTimer) { clearTimeout(this.state.interventionTimer); this.state.interventionTimer = null; }
        
        this.elements['start-break-btn'].innerHTML = '<i data-lucide="play" class="mr-2 w-4 h-4"></i>开始休息';
        lucide.createIcons();
    }

    updateFocusLevel() {
        if (this.state.sessionActive) {
            this.state.focusLevel += (Math.random() - 0.5) * 3;
            this.state.focusLevel = Math.max(60, Math.min(95, this.state.focusLevel));
        }
    }

    showHealthReminder() { this.showModal('health-modal'); }

    saveSettings() {
        this.hideModal('settings-modal');
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
        notification.textContent = '设置已保存';
        document.body.appendChild(notification);
        setTimeout(() => { notification.remove(); }, 3000);
    }

    initializeCharts() {
        if (!this.state.charts.weekly) {
            const weeklyCtx = document.getElementById('weekly-chart');
            if (weeklyCtx) { this.state.charts.weekly = createWeeklyChart(userData.weeklyData); }
        }
        if (!this.state.charts.team) {
             const teamCtx = document.getElementById('team-chart');
             if (teamCtx) { this.state.charts.team = createTeamChart(userData.teamData); }
        }
    }

    loadUserData() {
        if (this.elements['personal-insight']) {
            this.elements['personal-insight'].textContent = userData.insights.personal;
        }
    }
    
    setupTimerUpdate() {
        setInterval(() => {
            if (this.state.sessionActive && this.state.charts.realtime) {
                this.updateRealtimeChart();
            }
        }, 6000);
    }

    updateRealtimeChart() {
        const chart = this.state.charts.realtime;
        if (chart && chart.data && chart.data.datasets && chart.data.datasets.length > 0) {
            const newData = this.state.focusLevel;
            const data = chart.data.datasets[0].data;
            if (data.length >= 20) { data.shift(); chart.data.labels.shift(); }
            const elapsed = (Date.now() - this.state.sessionStartTime) / 1000;
            const elapsedMinutes = Math.floor(elapsed / 60);
            const elapsedSeconds = Math.floor(elapsed % 60);
            data.push(newData);
            chart.data.labels.push(`${elapsedMinutes}:${elapsedSeconds.toString().padStart(2, '0')}`);
            chart.update('none');
        }
    }

    showModal(modalId) {
        const modal = this.elements[modalId];
        if (modal) {
            modal.classList.remove('hidden');
            setTimeout(() => modal.classList.add('visible'), 10);
        }
    }

    hideModal(modalId) {
        const modal = this.elements[modalId];
        if (modal) {
            modal.classList.remove('visible');
            setTimeout(() => modal.classList.add('hidden'), 300);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new FocusAI();

    const celebrationModal = document.getElementById('celebration-modal');
    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                const isHidden = celebrationModal.classList.contains('hidden');
                const wasVisible = mutation.oldValue && mutation.oldValue.includes('visible');
                if (isHidden && wasVisible) {
                    const app = window.focusAIApp;
                    if(app && app.state.currentView === 'focus-session') {
                         app.showBreakSuggestion();
                    }
                }
            }
        }
    });
    observer.observe(celebrationModal, { attributes: true, attributeOldValue: true });
    window.focusAIApp = new FocusAI();
});
