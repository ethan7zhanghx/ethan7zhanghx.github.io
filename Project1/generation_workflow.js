const AI_MODAL_ID = 'ai-generation-modal';
const MODAL_CLOSE_BTN_ID = 'ai-modal-close-btn';
const STEP_1_ID = 'ai-step-1-refine';
const STEP_2_ID = 'ai-step-2-search';
const STEP_3_ID = 'ai-step-3-generate';

const NEXT_TO_STEP2_BTN_ID = 'ai-next-step2-btn';
const NEXT_TO_STEP3_BTN_ID = 'ai-next-step3-btn';
const FINISH_BTN_ID = 'ai-finish-btn';

const IMAGE_GRID_ID = 'ai-reference-image-grid';
const PROGRESS_BAR_ID = 'ai-generation-progress-bar';
const PROGRESS_TEXT_ID = 'ai-generation-status-text';
const PROGRESS_CONTAINER_ID = 'ai-progress-container';
const VIDEO_PLACEHOLDER_ID = 'ai-video-placeholder';


let modalElement, closeBtn, step1, step2, step3;
let nextToStep2Btn, nextToStep3Btn, finishBtn;
let imageGrid, progressBar, progressText, progressContainer, videoPlaceholder;
let progressInterval = null;

export function init() {
    modalElement = document.getElementById(AI_MODAL_ID);
    closeBtn = document.getElementById(MODAL_CLOSE_BTN_ID);
    step1 = document.getElementById(STEP_1_ID);
    step2 = document.getElementById(STEP_2_ID);
    step3 = document.getElementById(STEP_3_ID);

    nextToStep2Btn = document.getElementById(NEXT_TO_STEP2_BTN_ID);
    nextToStep3Btn = document.getElementById(NEXT_TO_STEP3_BTN_ID);
    finishBtn = document.getElementById(FINISH_BTN_ID);
    
    imageGrid = document.getElementById(IMAGE_GRID_ID);
    progressBar = document.getElementById(PROGRESS_BAR_ID);
    progressText = document.getElementById(PROGRESS_TEXT_ID);
    progressContainer = document.getElementById(PROGRESS_CONTAINER_ID);
    videoPlaceholder = document.getElementById(VIDEO_PLACEHOLDER_ID);

    setupEventListeners();
}

function setupEventListeners() {
    closeBtn.addEventListener('click', hideModal);
    finishBtn.addEventListener('click', hideModal);

    nextToStep2Btn.addEventListener('click', () => goToStep(2));
    nextToStep3Btn.addEventListener('click', () => {
        goToStep(3);
        startGenerationSimulation();
    });

    imageGrid.addEventListener('click', (e) => {
        const targetImage = e.target.closest('.reference-image');
        if (targetImage) {

            const allImages = imageGrid.querySelectorAll('.reference-image');
            allImages.forEach(img => img.classList.remove('ring-4', 'ring-cyan-500'));
            

            targetImage.classList.add('ring-4', 'ring-cyan-500');
        }
    });
}

export function showModal() {
    resetModal();
    modalElement.classList.remove('hidden');
    modalElement.classList.add('flex');
}

function hideModal() {
    modalElement.classList.add('hidden');
    modalElement.classList.remove('flex');
    if(progressInterval) {
        clearInterval(progressInterval);
    }
}

function resetModal() {

    goToStep(1);


    const allImages = imageGrid.querySelectorAll('.reference-image');
    allImages.forEach(img => img.classList.remove('ring-4', 'ring-cyan-500'));


    progressContainer.classList.remove('hidden');
    videoPlaceholder.classList.add('hidden');
    progressText.textContent = '...';
    progressBar.style.width = '0%';
}

function goToStep(stepNumber) {
    step1.classList.add('hidden');
    step2.classList.add('hidden');
    step3.classList.add('hidden');

    switch (stepNumber) {
        case 1:
            step1.classList.remove('hidden');
            break;
        case 2:
            step2.classList.remove('hidden');
            break;
        case 3:
            step3.classList.remove('hidden');
            break;
    }
}

function startGenerationSimulation() {
    let progress = 0;
    progressBar.style.width = '0%';
    progressText.textContent = '正在生成视频片段... (0%)';
    progressContainer.classList.remove('hidden');
    videoPlaceholder.classList.add('hidden');
    finishBtn.classList.add('hidden');

    progressInterval = setInterval(() => {
        progress += Math.round(Math.random() * 5) + 1;
        if (progress > 100) {
            progress = 100;
        }
        progressBar.style.width = `${progress}%`;
        progressText.textContent = `正在生成视频片段... (${progress}%)`;

        if (progress >= 100) {
            clearInterval(progressInterval);
            progressInterval = null;
            setTimeout(() => {
                progressContainer.classList.add('hidden');
                progressText.textContent = '生成成功！';
                videoPlaceholder.classList.remove('hidden');
                finishBtn.classList.remove('hidden');
            }, 500);
        }
    }, 150);
}
