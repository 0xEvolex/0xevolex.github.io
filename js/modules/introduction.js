export function initializeIntroduction() {
    const introductionButton = document.getElementById('btn-introduction');
    const introductionModal = document.getElementById('introduction-modal');
    const introductionClose = document.querySelector('.introduction-close');

    introductionButton.addEventListener('click', () => {
        introductionModal.style.display = 'block';
    });

    introductionClose.addEventListener('click', () => {
        introductionModal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === introductionModal) {
            introductionModal.style.display = 'none';
        }
    });
}