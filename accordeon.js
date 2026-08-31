const accordionRows = document.querySelectorAll('.services__row, .case-steps__row');

const setAccordionState = (row, isOpen) => {
    row.classList.toggle('is-open', isOpen);

    const descId = row.id
        ? row.id
            .replace('services__row_', 'services__desc_')
            .replace('case-steps__row_', 'case-steps__desc_')
        : null;

    if (!descId) return;

    const desc = document.getElementById(descId);
    if (!desc) return;

    desc.classList.toggle('services__desc_hidden', !isOpen);
    desc.classList.toggle('case-steps__desc_hidden', !isOpen);
};

accordionRows.forEach((row) => {
    row.addEventListener('click', () => {
        const shouldOpen = !row.classList.contains('is-open');

        accordionRows.forEach((otherRow) => {
            if (otherRow !== row && otherRow.classList.contains('is-open')) {
                setAccordionState(otherRow, false);
            }
        });

        setAccordionState(row, shouldOpen);
    });
});