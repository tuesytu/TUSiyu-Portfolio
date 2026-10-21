(() => {
    const cover = document.querySelector('.cover-hero');
    if (!cover) return;
    const effects = document.createElement('div');
    effects.className = 'cover-click-effects';
    effects.setAttribute('aria-hidden', 'true');
    document.body.append(effects);
    const source = '封面/web/doodles/click-burst.svg';
    const preload = new Image();
    preload.src = source;

    document.addEventListener('click', event => {
        if (event.target.closest('input, textarea, select, [contenteditable]')) return;
        if (window.getSelection()?.toString()) return;
        const bounds = effects.getBoundingClientRect();
        // Convert viewport coordinates to local CSS pixels, including desktop zoom.
        const scale = bounds.width / effects.offsetWidth;
        if (!Number.isFinite(scale) || scale <= 0) return;
        const burst = document.createElement('img');
        burst.className = 'cover-click-burst';
        burst.src = source;
        burst.alt = '';
        burst.draggable = false;
        burst.style.left = `${(event.clientX - bounds.left) / scale}px`;
        burst.style.top = `${(event.clientY - bounds.top) / scale}px`;
        while (effects.childElementCount >= 6) effects.firstElementChild.remove();
        effects.append(burst);
        const cleanup = () => burst.remove();
        burst.addEventListener('animationend', cleanup, { once: true });
        setTimeout(cleanup, 1000);
    });
})();
