import * as framerMotion from 'https://esm.run/framer-motion';

const { animate } = framerMotion;

export const ICONS = {
    scene: 'clapperboard',
    choice: 'mouse-pointer-click',
    ending: 'flag',
    start: 'play-circle',
    default: 'file-question',
    heart: 'heart',
    search: 'search',
    torch: 'torch',
    key: 'key',
    shield: 'shield',
    users: 'users',
    variable: 'variable'
};

const NODE_TAG_COLORS = {
    scene: 'tag-teal',
    choice: 'tag-purple',
    ending: 'tag-red',
    start: 'tag-green'
};

export function renderConfigPanel(preset, node) {
    const container = document.getElementById('config-panel');
    if (!node) {
        container.innerHTML = `<p class=\"text-gray-500\">在左侧画布中选择一个节点进行配置。</p>`;
        return;
    }

    let variablesHtml = renderVariables(preset.variables);
    let nodeConfigHtml = renderNodeConfig(node);
    
    container.innerHTML = variablesHtml + nodeConfigHtml;
    lucide.createIcons();
    animate(container, { opacity: [0, 1], x: [10, 0] }, { duration: 0.3 });
}

function renderVariables(variables) {
    if (!variables || variables.length === 0) return '';
    return `
        <div class="config-card mb-6">
            <h4 class="font-semibold text-white mb-3 text-base">游戏状态变量</h4>
            <div class="space-y-3">
            ${variables.map(v => `
                <div class="flex justify-between items-center bg-gray-900/50 p-2 rounded-md">
                    <div class="flex items-center gap-2">
                        <i data-lucide="${ICONS[v.icon] || 'variable'}" class="w-4 h-4 text-cyan-400"></i>
                        <span class="text-sm text-gray-300">${v.name}</span>
                    </div>
                    <span class="font-mono text-white bg-cyan-900/50 px-2 py-0.5 rounded text-sm" title="初始值">${v.initialValue}</span>
                </div>
            `).join('')}
            </div>
             <button class="mt-4 w-full flex items-center justify-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 transition-colors p-2 rounded-md bg-cyan-900/30 hover:bg-cyan-900/50">
                <i data-lucide="plus-circle" class="w-4 h-4"></i>
                添加新变量 (模拟)
            </button>
        </div>
    `;
}

function renderNodeConfig(node) {
    const tagColor = node.id === 'start' ? NODE_TAG_COLORS.start : NODE_TAG_COLORS[node.type];
    let contentHtml = `
        <div class="config-card">
            <div class="flex justify-between items-center mb-4">
                <h4 class="font-semibold text-white text-base truncate pr-2" title="${node.id}">节点: ${node.id}</h4>
                <span class="tag ${tagColor} capitalize">${node.id === 'start' ? 'Start' : node.type}</span>
            </div>
            <div>
                <label class="form-label">节点内容 (锁定)</label>
                <textarea class="form-input font-mono" rows="4" readonly>${node.content}</textarea>
            </div>
             <div class="mt-4 border-t border-gray-700 pt-4">
                <button id="ai-generate-btn" class="w-full flex items-center justify-center gap-2 px-3 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-md text-white text-sm font-semibold transition-colors shadow-lg shadow-cyan-500/10">
                    <i data-lucide="sparkles" class="w-4 h-4"></i>
                    <span>AI 生成内容</span>
                </button>
            </div>
        </div>
    `;

    if (node.type === 'choice') {
        contentHtml += node.choices.map((choice, index) => `
            <div class="config-card">
                <h5 class="font-medium text-white mb-3">选项 ${index + 1}</h5>
                <div class="mb-3">
                    <label class="form-label">选项文本 (锁定)</label>
                    <input type="text" class="form-input" value="${choice.text}" readonly>
                </div>
                ${choice.condition ? `
                <div class="mb-3">
                    <label class="form-label">出现条件</label>
                    <div class="bg-gray-900/50 p-2 rounded-md font-mono text-sm text-cyan-300">
                        IF ${choice.condition.var} ${choice.condition.op} ${choice.condition.val}
                    </div>
                </div>` : ''}
                ${choice.effects ? `
                <div>
                    <label class="form-label">选择效果</label>
                    ${choice.effects.map(effect => `
                        <div class="bg-gray-900/50 p-2 rounded-md font-mono text-sm text-green-300 mb-1">
                           ${effect.var} ${effect.op} ${effect.val}
                        </div>
                    `).join('')}
                </div>
                ` : ''}
            </div>
        `).join('');
         contentHtml += `
            <button class="w-full flex items-center justify-center gap-2 text-sm text-gray-400 hover:text-white transition-colors p-2 rounded-md border border-dashed border-gray-600 hover:border-cyan-500">
                <i data-lucide="plus" class="w-4 h-4"></i>
                添加新选项 (模拟)
            </button>
         `;
    }
    
    return contentHtml;
}
