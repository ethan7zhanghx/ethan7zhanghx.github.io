import * as UIManager from './ui_manager.js';

const ICONS = UIManager.ICONS;

let state = {
    active: false,
    preset: null,
    currentNodeId: null,
    variables: {}
};

const previewModal = document.getElementById('preview-modal');
const previewContent = document.getElementById('preview-content');
const previewVariables = document.getElementById('preview-variables');
const closeButton = document.getElementById('preview-close-btn');

function evaluate(val1, op, val2) {
    switch (op) {
        case '==': return val1 == val2;
        case '!=': return val1 != val2;
        case '>': return val1 > val2;
        case '<': return val1 < val2;
        case '>=': return val1 >= val2;
        case '<=': return val1 <= val2;
        default: return false;
    }
}

function applyEffect(effect) {
    const { var: varId, op, val } = effect;
    const currentVal = state.variables[varId];
    switch (op) {
        case '+': state.variables[varId] = currentVal + val; break;
        case '-': state.variables[varId] = currentVal - val; break;
        case '=': state.variables[varId] = val; break;
        default: console.warn(`Unknown effect operator: ${op}`);
    }
}

function renderVariables() {
    if (!state.preset.variables) {
        previewVariables.innerHTML = '';
        return;
    }
    const html = state.preset.variables.map(v => `
        <div class="flex justify-between items-center bg-gray-900/50 p-2 rounded-md">
            <div class="flex items-center gap-2">
                <i data-lucide="${ICONS[v.icon] || 'variable'}" class="w-4 h-4 text-cyan-400"></i>
                <span class="text-sm text-gray-300">${v.name}</span>
            </div>
            <span class="font-mono text-white bg-cyan-900/50 px-2 py-0.5 rounded text-sm">${state.variables[v.id]}</span>
        </div>
    `).join('');
    previewVariables.innerHTML = `<div class="space-y-3">${html}</div>`;
    lucide.createIcons();
}

function renderCurrentNode() {
    const node = state.preset.nodes[state.currentNodeId];
    let contentHtml = '';

    switch (node.type) {
        case 'scene':
            contentHtml = `
                <div class="text-center">
                    <i data-lucide="film" class="w-16 h-16 text-cyan-500/30 mx-auto mb-4"></i>
                    <p class="text-lg text-white max-w-prose mx-auto">${node.content}</p>
                </div>
                <div class="mt-8 text-center">
                    <button class="choice-btn bg-cyan-600 hover:bg-cyan-500 text-white font-medium py-2 px-6 rounded-lg" data-next="${node.next}">继续</button>
                </div>
            `;
            break;
        case 'choice':
            contentHtml = `
                 <div class="text-center">
                    <i data-lucide="git-branch-plus" class="w-16 h-16 text-cyan-500/30 mx-auto mb-4"></i>
                    <p class="text-lg text-white mb-6 max-w-prose mx-auto">${node.content}</p>
                </div>
                <div class="flex flex-col gap-4 items-center">
                    ${node.choices.map(c => {
                        const conditionMet = c.condition ? evaluate(state.variables[c.condition.var], c.condition.op, c.condition.val) : true;
                        const disabled = !conditionMet;
                        const tooltip = disabled ? `需要: ${state.preset.variables.find(v => v.id === c.condition.var).name} ${c.condition.op} ${c.condition.val}` : '';
                        return `
                        <button 
                            class="choice-btn w-full max-w-sm bg-gray-700 hover:bg-cyan-600 hover:text-white transition-colors text-gray-200 font-medium py-3 px-6 rounded-lg border border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-700" 
                            data-choice-index="${node.choices.indexOf(c)}"
                            ${disabled ? 'disabled' : ''}
                            title="${tooltip}">
                            ${c.text}
                        </button>
                        `
                    }).join('')}
                </div>
            `;
            break;
        case 'ending':
             contentHtml = `
                <div class="text-center">
                    <i data-lucide="flag" class="w-16 h-16 text-cyan-500/30 mx-auto mb-4"></i>
                    <p class="text-xl font-bold text-white max-w-prose mx-auto">${node.content}</p>
                </div>
                <div class="mt-8 text-center">
                     <button class="choice-btn bg-gray-600 hover:bg-gray-500 text-white font-medium py-2 px-6 rounded-lg" data-action="restart">重新开始</button>
                </div>
            `;
            break;
    }
    previewContent.innerHTML = contentHtml;
    lucide.createIcons();
    renderVariables();
}

function handleInteraction(e) {
    const target = e.target.closest('.choice-btn');
    if (!target) return;

    if (target.dataset.action === 'restart') {
        startPreview(state.preset);
        return;
    }

    const node = state.preset.nodes[state.currentNodeId];
    let nextNodeId = null;

    if (node.type === 'scene') {
        nextNodeId = node.next;
    } else if (node.type === 'choice') {
        const choiceIndex = parseInt(target.dataset.choiceIndex);
        const choice = node.choices[choiceIndex];
        if (choice.effects) {
            choice.effects.forEach(applyEffect);
        }
        nextNodeId = choice.next;
    }

    if (nextNodeId && state.preset.nodes[nextNodeId]) {
        state.currentNodeId = nextNodeId;
        renderCurrentNode();
    }
}

export function startPreview(preset) {
    state.active = true;
    state.preset = preset;
    state.currentNodeId = 'start';
    state.variables = {};
    if (preset.variables) {
        preset.variables.forEach(v => {
            state.variables[v.id] = v.initialValue;
        });
    }
    previewModal.classList.remove('hidden');
    renderCurrentNode();
}

function closePreview() {
    state.active = false;
    previewModal.classList.add('hidden');
}

export function init() {
    closeButton.addEventListener('click', closePreview);
    previewContent.addEventListener('click', handleInteraction);
}
