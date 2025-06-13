import { presets } from './data.js';
import * as UIManager from './ui_manager.js';
import * as NodeEditor from './node_editor.js';
import * as GamePreview from './game_preview.js';
import * as GenerationWorkflow from './generation_workflow.js';
import * as framerMotion from 'https://esm.run/framer-motion';

document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();

    let currentPreset = null;
    let selectedNodeId = 'start';

    const presetSelector = document.getElementById('preset-selector');
    const previewBtn = document.getElementById('preview-btn');
    const rightPanel = document.getElementById('right-panel');

    function initialize() {
        populatePresetSelector();
        setupEventListeners();
        
        NodeEditor.init(
            document.getElementById('editor-viewport'),
            document.getElementById('node-canvas'),
            onNodeSelect
        );
        GamePreview.init();
        GenerationWorkflow.init();

        loadInitialPreset();
    }

    function populatePresetSelector() {
        presets.forEach((preset) => {
            const option = document.createElement('option');
            option.value = preset.id;
            option.textContent = `${preset.title} (${preset.type})`;
            presetSelector.appendChild(option);
        });
    }

    function setupEventListeners() {
        presetSelector.addEventListener('change', (e) => {
            loadPreset(e.target.value);
        });
        
        previewBtn.addEventListener('click', () => {
            if (currentPreset) {
                GamePreview.startPreview(currentPreset);
            }
        });

        rightPanel.addEventListener('click', (e) => {
            if (e.target.closest('#ai-generate-btn')) {
                GenerationWorkflow.showModal();
            }
        });
    }

    function onNodeSelect(nodeId) {
        selectedNodeId = nodeId;
        NodeEditor.selectNode(nodeId);
        const selectedNode = currentPreset.nodes[selectedNodeId];
        UIManager.renderConfigPanel(currentPreset, selectedNode);
    }

    function loadInitialPreset() {
        if (presets.length > 0) {
            loadPreset(presets[0].id);
        }
    }

    function loadPreset(presetId) {
        currentPreset = presets.find(p => p.id === presetId);
        if (currentPreset) {
            selectedNodeId = 'start';
            framerMotion.animate("#app-container", { opacity: [0, 1] }, { duration: 0.5 });
            
            NodeEditor.load(currentPreset);
            
            const selectedNode = currentPreset.nodes[selectedNodeId];
            UIManager.renderConfigPanel(currentPreset, selectedNode);
        }
    }

    initialize();
});
