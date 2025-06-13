let state = {
    preset: null,
    selectedNodeId: null,
    viewBox: { x: 0, y: 0, width: 1000, height: 1000 },
    panning: false,
    dragging: false,
    draggedNodeId: null,
    lastMousePos: { x: 0, y: 0 },
};

let containerEl, canvasEl;
let onNodeSelectCallback;

const NODE_COLORS = {
    scene: { bg: '#115e59', border: '#14b8a6' }, // teal-800, teal-500
    choice: { bg: '#86198f', border: '#e879f9' }, // purple-800, fuchsia-400
    ending: { bg: '#b91c1c', border: '#f87171' }, // red-800, red-400
    start: { bg: '#166534', border: '#4ade80' }, // green-800, green-400
};

const NODE_DIMS = { width: 220, height: 60 };

function getNextNodeIds(node) {
    if (node.next) return [node.next];
    if (node.choices) return node.choices.map(c => c.next);
    return [];
}

function drawBezier(startPos, endPos) {
    const dx = Math.abs(startPos.x - endPos.x);
    const c1x = startPos.x + dx * 0.6;
    const c1y = startPos.y;
    const c2x = endPos.x - dx * 0.6;
    const c2y = endPos.y;
    return `M ${startPos.x} ${startPos.y} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${endPos.x} ${endPos.y}`;
}

function render() {
    if (!canvasEl || !state.preset) return;
    canvasEl.innerHTML = ''; 

    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    defs.innerHTML = `
        <marker id="arrowhead" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#4b5563"></path>
        </marker>
    `;
    canvasEl.appendChild(defs);

    const nodes = Object.values(state.preset.nodes);

    nodes.forEach(node => {
        const nextIds = getNextNodeIds(node);
        nextIds.forEach(nextId => {
            const nextNode = state.preset.nodes[nextId];
            if (!nextNode) return;

            const startPos = { x: node.position.x + NODE_DIMS.width, y: node.position.y + NODE_DIMS.height / 2 };
            const endPos = { x: nextNode.position.x, y: nextNode.position.y + NODE_DIMS.height / 2 };

            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('d', drawBezier(startPos, endPos));
            path.setAttribute('stroke', '#4b5563');
            path.setAttribute('stroke-width', '2');
            path.setAttribute('fill', 'none');
            path.setAttribute('marker-end', 'url(#arrowhead)');
            canvasEl.appendChild(path);
        });
    });

    nodes.forEach(node => {
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        g.setAttribute('transform', `translate(${node.position.x}, ${node.position.y})`);
        g.setAttribute('class', 'node-group cursor-pointer');
        g.dataset.nodeId = node.id;

        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        const color = node.id === 'start' ? NODE_COLORS.start : NODE_COLORS[node.type];
        rect.setAttribute('width', NODE_DIMS.width);
        rect.setAttribute('height', NODE_DIMS.height);
        rect.setAttribute('rx', '8');
        rect.setAttribute('fill', color.bg);
        rect.setAttribute('stroke', node.id === state.selectedNodeId ? '#06b6d4' : color.border);
        rect.setAttribute('stroke-width', node.id === state.selectedNodeId ? '3' : '1.5');
        if (node.id === state.selectedNodeId) {
             rect.style.filter = 'drop-shadow(0 0 10px rgba(6, 182, 212, 0.7))';
        }
        g.appendChild(rect);

        const typeText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        typeText.setAttribute('x', '12');
        typeText.setAttribute('y', '20');
        typeText.setAttribute('fill', '#a5f3fc');
        typeText.setAttribute('font-size', '12px');
        typeText.setAttribute('class', 'font-mono uppercase');
        typeText.textContent = node.type;
        g.appendChild(typeText);

        const titleText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        const title = node.id === 'start' ? 'Start' : (node.content.substring(0, 20) + '...');
        titleText.setAttribute('x', '12');
        titleText.setAttribute('y', '45');
        titleText.setAttribute('fill', 'white');
        titleText.setAttribute('font-size', '14px');
        titleText.textContent = title;
        g.appendChild(titleText);
        
        canvasEl.appendChild(g);
    });
}

function handleMouseDown(e) {
    state.lastMousePos = { x: e.clientX, y: e.clientY };
    const nodeGroup = e.target.closest('.node-group');
    if (nodeGroup) {
        state.dragging = true;
        state.draggedNodeId = nodeGroup.dataset.nodeId;
        onNodeSelectCallback(state.draggedNodeId);
    } else {
        state.panning = true;
    }
}

function handleMouseMove(e) {
    if (state.dragging && state.draggedNodeId) {
        const dx = e.clientX - state.lastMousePos.x;
        const dy = e.clientY - state.lastMousePos.y;
        const node = state.preset.nodes[state.draggedNodeId];
        node.position.x += dx;
        node.position.y += dy;
        state.lastMousePos = { x: e.clientX, y: e.clientY };
        render();
    } else if (state.panning) {
        const dx = e.clientX - state.lastMousePos.x;
        const dy = e.clientY - state.lastMousePos.y;
        state.viewBox.x -= dx;
        state.viewBox.y -= dy;
        canvasEl.setAttribute('viewBox', `${state.viewBox.x} ${state.viewBox.y} ${state.viewBox.width} ${state.viewBox.height}`);
        state.lastMousePos = { x: e.clientX, y: e.clientY };
    }
}

function handleMouseUp() {
    state.dragging = false;
    state.panning = false;
    state.draggedNodeId = null;
}

export function init(container, canvas, onNodeSelect) {
    containerEl = container;
    canvasEl = canvas;
    onNodeSelectCallback = onNodeSelect;
    
    containerEl.addEventListener('mousedown', handleMouseDown);
    containerEl.addEventListener('mousemove', handleMouseMove);
    containerEl.addEventListener('mouseup', handleMouseUp);
    containerEl.addEventListener('mouseleave', handleMouseUp);
}

export function load(preset) {
    state.preset = JSON.parse(JSON.stringify(preset)); // Deep copy to avoid modifying original data
    state.selectedNodeId = 'start';
    

    const startNode = state.preset.nodes['start'];
    state.viewBox.width = containerEl.clientWidth;
    state.viewBox.height = containerEl.clientHeight;
    state.viewBox.x = startNode.position.x - state.viewBox.width / 2 + NODE_DIMS.width / 2;
    state.viewBox.y = startNode.position.y - state.viewBox.height / 2 + NODE_DIMS.height / 2;
    canvasEl.setAttribute('viewBox', `${state.viewBox.x} ${state.viewBox.y} ${state.viewBox.width} ${state.viewBox.height}`);

    render();
}

export function selectNode(nodeId) {
    state.selectedNodeId = nodeId;
    render();
}
