document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();

    const newProjectBtn = document.getElementById('new-project-btn');
    const newProjectModal = document.getElementById('new-project-modal');
    const cancelModalBtn = document.getElementById('cancel-modal-btn');
    const newProjectForm = document.getElementById('new-project-form');
    const projectTitle = document.getElementById('project-title');

    const openModal = () => newProjectModal.classList.remove('hidden');
    const closeModal = () => newProjectModal.classList.add('hidden');

    if (newProjectBtn) {
        newProjectBtn.addEventListener('click', openModal);
    }
    if (cancelModalBtn) {
        cancelModalBtn.addEventListener('click', closeModal);
    }
    
    if (newProjectModal) {
        newProjectModal.addEventListener('click', (e) => {
            if (e.target === newProjectModal) {
                closeModal();
            }
        });
    }

    if (newProjectForm) {
        newProjectForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const novelNameInput = document.getElementById('novel-name');
            const novelName = novelNameInput.value.trim();
            
            if (novelName && projectTitle) {
                projectTitle.textContent = `项目: 《${novelName}》`;
                alert(`新项目 "${novelName}" 已创建。\n在真实应用中，此处的看板将刷新为新项目的内容。`);
            }
            closeModal();
            newProjectForm.reset();
        });
    }

    const characterBtn = document.getElementById('character-management-btn');
    const styleBtn = document.getElementById('global-style-btn');

    if (characterBtn) {
        characterBtn.addEventListener('click', () => {
            alert('“角色管理”功能允许您定义主要角色，上传参考图，确保AI生成时的人物形象一致性。(功能开发中)');
        });
    }

    if (styleBtn) {
        styleBtn.addEventListener('click', () => {
            alert('“全局风格”功能让您可以在多种艺术风格（如日式少年漫、水墨国风等）中选择，并应用到整个项目中，确保视觉统一。(功能开发中)');
        });
    }

    const cards = document.querySelectorAll('.kanban-card');
    const dropzones = document.querySelectorAll('.kanban-dropzone');

    let draggedItem = null;

    const updateColumnCounts = () => {
        dropzones.forEach(zone => {
            const column = zone.closest('.kanban-column');
            if (column) {
                const countSpan = column.querySelector('.column-count');
                if (countSpan) {
                    countSpan.textContent = zone.children.length;
                }
            }
        });
    };

    cards.forEach(card => {
        card.addEventListener('dragstart', () => {
            draggedItem = card;
            setTimeout(() => {
                card.classList.add('dragging');
            }, 0);
        });

        card.addEventListener('dragend', () => {
            if (draggedItem) {
                draggedItem.classList.remove('dragging');
            }
            draggedItem = null;
        });
    });

    dropzones.forEach(zone => {
        zone.addEventListener('dragover', e => {
            e.preventDefault();
            zone.classList.add('drag-over');
        });

        zone.addEventListener('dragleave', () => {
            zone.classList.remove('drag-over');
        });

        zone.addEventListener('drop', (e) => {
            e.preventDefault();
            zone.classList.remove('drag-over');
            if (draggedItem) {
                const currentZone = draggedItem.parentElement;
                if (currentZone !== zone) {
                    zone.appendChild(draggedItem);
                    updateColumnCounts();
                }
            }
        });
    });
    
    updateColumnCounts();
});
