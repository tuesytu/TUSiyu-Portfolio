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
        const onLightSurface = event.target.closest('.work-pinboard, .about-paper-shadow, .resume-document, .project-stack, #project-detail-overlay');
        if (document.body.classList.contains('theme-black') && !onLightSurface) burst.classList.add('is-on-dark');
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

(() => {
    const status = document.createElement('div');
    status.className = 'copy-status'; status.setAttribute('role','status');
    status.setAttribute('aria-live','polite'); document.body.append(status);
    let timer;
    document.querySelectorAll('[data-copy]').forEach(button => {
        button.addEventListener('click', async () => {
            let copied = false;
            try { await navigator.clipboard.writeText(button.dataset.copy); copied = true; }
            catch {
                const input = document.createElement('textarea');
                input.value = button.dataset.copy;
                input.style.cssText = 'position:fixed;left:-9999px;top:0';
                document.body.append(input); input.select();
                try { copied = document.execCommand('copy'); } catch {}
                input.remove(); button.focus({preventScroll:true});
            }
            clearTimeout(timer);
            status.textContent = copied ? '复制成功' : '复制未成功，请选中文字手动复制';
            status.classList.add('is-visible');
            timer = setTimeout(() => status.classList.remove('is-visible'), 2200);
        });
    });
})();

(() => {
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const items = [...document.querySelectorAll('#about, #works h2.section-hand-title, #works .project-stack, #other-work > .content-wrap, #other-work .work-pinboard, body > footer')].map(element => ({
        element, anchor: element.id === 'about' ? element.querySelector('.about-paper-shadow') : element, visible: false
    }));
    let frame = 0;
    function update() {
        frame = 0;
        items.forEach(item => {
            const {element,anchor} = item;
            if (reduced.matches) { element.classList.remove('scroll-reveal','scroll-reveal-visible'); return; }
            const rect = anchor.getBoundingClientRect();
            const folding = element.id === 'about' && element.closest('.resume-journey').classList.contains('is-turning');
            // Enter later, leave closer to the screen edge: avoid flicker at one shared boundary.
            const visible = folding || element.contains(document.activeElement) || (item.visible
                ? rect.bottom > innerHeight * .08 && rect.top < innerHeight * .94
                : rect.bottom > innerHeight * .18 && rect.top < innerHeight * .80);
            item.visible = visible;
            element.classList.add('scroll-reveal');
            element.classList.toggle('scroll-reveal-visible',visible);
        });
    }
    const schedule = () => { if (!frame) frame=requestAnimationFrame(update); };
    window.addEventListener('scroll',schedule,{passive:true});
    window.addEventListener('resize',schedule);
    window.addEventListener('load',schedule);
    document.addEventListener('focusin',schedule);
    document.addEventListener('focusout',schedule);
    reduced.addEventListener('change',schedule);
    items.forEach(({element})=>element.classList.add('scroll-reveal'));
    requestAnimationFrame(schedule);
})();
