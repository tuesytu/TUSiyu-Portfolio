(() => {
    const section = document.querySelector('.about-intro');
    if (!section) return;
    const lines = [...section.querySelectorAll('.about-typed-copy')];
    const block = section.querySelector('.about-typewriter');
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    if (!reduced.matches && 'IntersectionObserver' in window) {
        let timer;
        let started = false;
        let finished = false;
        const records = lines.map(line => {
            const text = line.textContent;
            const source = document.createElement('span');
            source.className = 'about-type-source';
            source.textContent = text;
            const output = document.createElement('span');
            output.className = 'about-type-output';
            output.setAttribute('aria-hidden', 'true');
            line.replaceChildren(source, output);
            return { text, chars: Array.from(text), output, mark: line.previousElementSibling };
        });
        block.classList.add('is-ready');
        const finish = () => {
            finished = true;
            clearTimeout(timer);
            records.forEach(({ text, output, mark }) => {
                mark.classList.add('is-typed');
                output.textContent = text;
                output.classList.remove('is-active');
            });

            section.dataset.typing = 'complete';
        };
        const type = (row, column) => {
            if (finished) return;
            if (row >= records.length) { finish(); return; }
            const record = records[row];
            record.mark.classList.add('is-typed');
            if (column === -1) { timer = setTimeout(() => type(row, 0), 80); return; }
            record.output.classList.add('is-active');
            if (column < record.chars.length) {
                record.output.textContent += record.chars[column];
                const delay = /[，。、；]/.test(record.chars[column]) ? 140 : 36;
                timer = setTimeout(() => type(row, column + 1), delay);
            } else {
                record.output.classList.remove('is-active');
                timer = setTimeout(() => type(row + 1, -1), 220);
            }
        };
        const observer = new IntersectionObserver(entries => {
            if (started || !entries.some(entry => entry.isIntersecting)) return;
            started = true;
            observer.disconnect();

            section.dataset.typing = 'active';
            section.dispatchEvent(new CustomEvent('about-typing-start'));
            type(0, -1);
        }, { threshold: .35 });
        observer.observe(block);

        reduced.addEventListener('change', event => { if (event.matches) finish(); });
    }
})();

// Gentle pointer repulsion plus separation between neighbouring paper tickets.
(() => {
    const area = document.querySelector('.about-software');
    if (!area) return;
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    const fine = matchMedia('(hover: hover) and (pointer: fine)');
    const items = [...area.querySelectorAll('.software-ticket')].map(el => ({ el, x: 0, y: 0 }));
    let pointer = null, frame = 0;
    const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
    function tick() {
        frame = 0;
        const bounds = area.getBoundingClientRect();
        const rects = items.map(item => {
            const r = item.el.getBoundingClientRect();
            return { x: r.left + r.width / 2 - item.x, y: r.top + r.height / 2 - item.y, w: r.width, h: r.height };
        });
        const goals = rects.map(r => {
            if (!pointer || motion.matches || !fine.matches) return { x: 0, y: 0 };
            const dx = r.x - pointer.x, dy = r.y - pointer.y;
            const distance = Math.hypot(dx, dy);
            const force = Math.max(0, 1 - distance / 100) * 26;
            return { x: dx / (distance || 1) * force, y: (distance ? dy / distance : -1) * force };
        });
        if (pointer) {
            for (let pass = 0; pass < 3; pass++) {
                for (let i = 0; i < items.length; i++) for (let j = i + 1; j < items.length; j++) {
                    const a = rects[i], b = rects[j], ga = goals[i], gb = goals[j];
                    const dx = b.x + gb.x - a.x - ga.x, dy = b.y + gb.y - a.y - ga.y;
                    const overlapX = (a.w + b.w) / 2 + 5 - Math.abs(dx);
                    const overlapY = (a.h + b.h) / 2 + 5 - Math.abs(dy);
                    if (overlapX <= 0 || overlapY <= 0) continue;
                    if (overlapX < overlapY) { const push = overlapX * .5 * (Math.sign(dx) || 1); ga.x -= push; gb.x += push; }
                    else { const push = overlapY * .5 * (Math.sign(dy) || 1); ga.y -= push; gb.y += push; }
                }
            }
        }
        let moving = false;
        items.forEach((item, i) => {
            const r = rects[i], g = goals[i];
            g.x = clamp(g.x, Math.max(-29, bounds.left + r.w / 2 - r.x), Math.min(29, bounds.right - r.w / 2 - r.x));
            g.y = clamp(g.y, Math.max(-29, bounds.top + r.h / 2 - r.y), Math.min(29, bounds.bottom - r.h / 2 - r.y));
            item.x += (g.x - item.x) * .16; item.y += (g.y - item.y) * .16;
            if (Math.abs(g.x - item.x) + Math.abs(g.y - item.y) > .1) moving = true;
            const scale = (Number(getComputedStyle(document.documentElement).zoom) || 1) * .5;
            item.el.style.setProperty('--repel-x', `${item.x / scale}px`);
            item.el.style.setProperty('--repel-y', `${item.y / scale}px`);
        });
        if (moving) frame = requestAnimationFrame(tick);
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(tick); };
    area.addEventListener('pointermove', e => {
        if (!fine.matches || motion.matches) return;
        pointer = { x: e.clientX, y: e.clientY }; schedule();
    });
    const reset = () => { pointer = null; schedule(); };
    area.addEventListener('pointerleave', reset);
    window.addEventListener('scroll', reset, { passive: true });
    window.addEventListener('resize', reset);
    motion.addEventListener('change', reset);
})();

// Fall-in is applied to each image, independent of the parent's pointer repulsion.
(() => {
    const section = document.querySelector('.about-intro');
    const area = section?.querySelector('.about-software');
    if (!area) return;
    const items = [...area.querySelectorAll('.software-ticket')];
    const offsets = [[-15,-12,-14],[8,16,12],[18,-18,-8],[-4,6,17],[12,9,-10],[-18,-8,8],[6,20,-16],[16,-14,11],[-9,12,16],[14,-18,-12],[-16,2,9],[5,17,-17],[15,-10,12],[-12,14,-9],[8,-16,15],[-8,5,-12]];
    items.forEach((item, i) => {
        const [x,y,tilt] = offsets[i % offsets.length];
        item.style.setProperty('--scatter-x', `${x}px`);
        item.style.setProperty('--scatter-y', `${y}px`);
        item.style.setProperty('--tilt', `${tilt}deg`);
    });
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    if (reduced.matches || !('IntersectionObserver' in window)) return;
    area.classList.add('icons-awaiting');
    let started = false;
    const animations = [];
    const reveal = () => {
        if (started) return;
        started = true;
        items.forEach((item,i) => {
            const zoom = (Number(getComputedStyle(document.documentElement).zoom) || 1) * .5;
            const seam = section.querySelector('.about-sheet-body').getBoundingClientRect().top;
            const distance = Math.max(0, (item.getBoundingClientRect().top - seam) / zoom);
            const frames = [0, .01, .25, .5, .75, 1].map(t => ({
                offset: t, opacity: t === 0 ? 0 : 1,
                translate: `0px ${-distance * (1-t*t)}px`
            }));
            const animation = item.animate(frames, {
                duration: 480 + Math.sqrt(distance)*12, delay: (i*7 % items.length)*65,
                easing: 'linear', fill: 'both'
            });
            animations.push(animation);
        });
        area.classList.remove('icons-awaiting');
    };
    section.addEventListener('about-typing-start', reveal, { once: true });
    if (section.dataset.typing) reveal();
    reduced.addEventListener('change', event => {
        if (event.matches) { started = true; area.classList.remove('icons-awaiting'); animations.forEach(a => a.cancel()); }
    });
})();

