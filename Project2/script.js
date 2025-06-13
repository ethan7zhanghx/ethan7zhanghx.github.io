document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();

    const accordionTriggers = document.querySelectorAll('.ai-card-trigger');

    accordionTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const content = trigger.nextElementSibling;
            const isOpen = trigger.classList.contains('active');
            
            trigger.classList.toggle('active', !isOpen);
            content.classList.toggle('open', !isOpen);
        });
    });
});
