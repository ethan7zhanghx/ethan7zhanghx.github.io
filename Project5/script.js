import { staticData } from './data.js';

document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();

    const screens = {
        welcome: document.getElementById('welcome-screen'),
        question: document.getElementById('question-screen'),
        spreadSelect: document.getElementById('spread-select-screen'),
        reading: document.getElementById('reading-screen'),
    };

    const buttons = {
        start: document.getElementById('start-btn'),
        aiAssist: document.getElementById('ai-assist-btn'),
        confirmQuestion: document.getElementById('confirm-question-btn'),
        useAiQuestion: document.getElementById('use-ai-question-btn'),
        threeCardSpread: document.getElementById('three-card-spread-btn'),
        aiDeepAnalysis: document.getElementById('ai-deep-analysis-btn'),
    };

    const elements = {
        questionInput: document.getElementById('question-input'),
        aiAssistModule: document.getElementById('ai-assist-module'),
        aiOptimizedQuestion: document.getElementById('ai-optimized-question'),
        cardArea: document.getElementById('card-area'),
        readingResults: document.getElementById('reading-results'),
        aiDeepAnalysisModule: document.getElementById('ai-deep-analysis-module'),
        aiDeepAnalysisText: document.getElementById('ai-deep-analysis-text'),
        readingPrompt: document.getElementById('reading-prompt'),
    };

    let flippedCardsCount = 0;
    const totalCards = staticData.threeCardSpread.length;
    let currentScreen = null;

    const showScreen = (screenId) => {
        const nextScreen = screens[screenId];
        if (currentScreen === nextScreen) return;

        if (currentScreen) {
            currentScreen.classList.remove('is-visible');
        }
        
        if (nextScreen) {
            nextScreen.classList.add('is-visible');
            currentScreen = nextScreen;
        }
    };
    
    const showModule = (moduleEl) => {
        moduleEl.classList.add('is-visible');
    };
    
    const hideModule = (moduleEl) => {
        moduleEl.classList.remove('is-visible');
    };

    buttons.start.addEventListener('click', () => {
        showScreen('question');
        elements.questionInput.value = staticData.question.initial;
        hideModule(elements.aiAssistModule);
    });

    buttons.aiAssist.addEventListener('click', () => {
        elements.aiOptimizedQuestion.textContent = staticData.question.optimized;
        showModule(elements.aiAssistModule);
    });

    buttons.useAiQuestion.addEventListener('click', () => {
        elements.questionInput.value = staticData.question.optimized;
        hideModule(elements.aiAssistModule);
    });
    
    buttons.confirmQuestion.addEventListener('click', () => {
        hideModule(elements.aiAssistModule);
        showScreen('spreadSelect');
    });

    buttons.threeCardSpread.addEventListener('click', () => {
        showScreen('reading');
        setupReadingScreen();
    });

    buttons.aiDeepAnalysis.addEventListener('click', () => {
        elements.aiDeepAnalysisText.innerHTML = staticData.deepAnalysis;
        showModule(elements.aiDeepAnalysisModule);
        hideModule(buttons.aiDeepAnalysis);
        elements.readingResults.classList.add('de-emphasized');
    });

    const setupReadingScreen = () => {
        elements.cardArea.innerHTML = '';
        elements.readingResults.innerHTML = '';
        elements.readingResults.classList.remove('de-emphasized');
        flippedCardsCount = 0;
        
        hideModule(buttons.aiDeepAnalysis);
        hideModule(elements.aiDeepAnalysisModule);
        elements.readingPrompt.textContent = "点击卡牌以翻转并查看解读";

        staticData.threeCardSpread.forEach(cardData => {
            const cardContainer = document.createElement('div');
            cardContainer.className = 'card-container';

            const cardEl = document.createElement('div');
            cardEl.className = 'card';
            cardEl.dataset.cardId = cardData.id;

            cardEl.innerHTML = `
                <div class="card-face card-back"></div>
                <div class="card-face card-front">
                    <h4 class="text-xl font-bold text-amber-300 font-serif text-center">${cardData.name}</h4>
                    <p class="text-sm text-purple-300 mt-2">${cardData.position}</p>
                </div>
            `;
            
            cardContainer.appendChild(cardEl);
            elements.cardArea.appendChild(cardContainer);

            const interpretationContainer = document.createElement('div');
            interpretationContainer.id = `interp-${cardData.id}`;
            interpretationContainer.className = 'card-interpretation p-4 bg-white/5 rounded-lg text-center';
            interpretationContainer.innerHTML = `
                <h4 class="text-lg font-bold text-amber-300">${cardData.position}: ${cardData.name}</h4>
                <p class="text-gray-300 mt-2">${cardData.interpretation}</p>
            `;
            elements.readingResults.appendChild(interpretationContainer);

            cardEl.addEventListener('click', () => handleCardFlip(cardEl));
        });
    };

    const handleCardFlip = (cardEl) => {
        if (cardEl.classList.contains('flipped')) return;
        
        cardEl.classList.add('flipped');
        flippedCardsCount++;

        const cardId = cardEl.dataset.cardId;
        const interpEl = document.getElementById(`interp-${cardId}`);
        setTimeout(() => {
           interpEl.classList.add('visible');
        }, 300);

        if (flippedCardsCount === totalCards) {
            elements.readingPrompt.textContent = "所有卡牌已揭示";
            setTimeout(() => {
                showModule(buttons.aiDeepAnalysis);
            }, 500);
        }
    };
    
    showScreen('welcome');
});
