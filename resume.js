(() => {
    const journey = document.querySelector('.resume-journey');
    if (!journey) return;
    const track = journey.querySelector('.resume-turn-track');
    const about = journey.querySelector('#about');
    const paper = about.querySelector('.about-paper-shadow');
    const ink = [...about.querySelectorAll('.about-sheet-top, .about-sheet-body, .about-sheet-bottom')];
    const sheet = journey.querySelector('#resume-sheet');
    const documentPaper = sheet.querySelector('.resume-document');
    const folds = [...sheet.querySelectorAll('.resume-fold')];
    const slots = folds.map(fold => {
        const slot = document.createElement('div');
        slot.className = 'resume-fold-slot';
        fold.before(slot);
        slot.append(fold);
        return slot;
    });
    const entry = about.querySelector('.about-resume-link');
    const back = sheet.querySelector('.resume-fold-back');
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const desktop = matchMedia('(min-width: 901px)');
    const clamp = value => Math.max(0, Math.min(1, value));
    const smooth = value => { const t = clamp(value); return t * t * (3 - 2 * t); };
    function updateBackground(amount, scrubbing = false) {
        const from = [249, 211, 113], to = [232, 160, 138];
        const rgb = from.map((value, i) => Math.round(value + (to[i] - value) * amount));
        document.body.style.setProperty('--resume-scroll-background', `rgb(${rgb.join(', ')})`);
        document.body.classList.toggle('is-resume-color-turning', scrubbing);
    }

    let animations = [];
    let metrics;
    let frame = 0;
    let measureFrame = 0;
    let autoFrame = 0;

    // Paused keyframe animations are scrubbed by scroll position in both directions.
    function keyframes(element, frames) {
        const animation = element.animate(frames, { duration: 1000, fill: 'both' });
        animation.pause();
        animation.currentTime = 0;
        animations.push(animation);
        return animation;
    }

    function measure() {
        measureFrame = 0;
        documentPaper.classList.remove('is-unfolded');
        animations.forEach(animation => animation.cancel());
        animations = [];
        journey.classList.remove('has-scroll-turn', 'is-turning');
        sheet.style.transform = '';
        sheet.style.opacity = '';
        sheet.inert = false;
        about.inert = false;
        paper.style.visibility = '';
        slots.forEach(slot => slot.style.transform = '');
        folds.forEach(fold => { fold.style.transform = ''; fold.style.opacity = ''; fold.style.removeProperty('--fold-shade'); });
        const zoom = Number(getComputedStyle(document.documentElement).zoom) || 1;
        const nav = document.querySelector('nav').getBoundingClientRect().height;
        const mode = !reduced.matches && desktop.matches && 'animate' in paper;
        metrics = { zoom, nav, mode };
        if (mode) {
            const stageHeight = about.getBoundingClientRect().height;
            const distance = Math.max(400, Math.min(620, innerHeight * .72));
            const inset = parseFloat(getComputedStyle(about).paddingTop);
            journey.style.setProperty('--turn-track-height', `${(stageHeight + distance) / zoom}px`);
            journey.style.setProperty('--turn-stage-height', `${stageHeight / zoom}px`);
            journey.style.setProperty('--turn-nav-top', `${nav / zoom}px`);
            journey.style.setProperty('--turn-paper-inset', `${inset}px`);
            journey.classList.add('has-scroll-turn');
            const rect = paper.getBoundingClientRect();
            const targetWidth = sheet.querySelector('.resume-document').getBoundingClientRect().width;
            const scale = Math.min(1.35, targetWidth / rect.height);
            const shift = (rect.width * scale - rect.height) / (2 * zoom);
            metrics.distance = distance;
            metrics.start = track.getBoundingClientRect().top + scrollY - nav;
            keyframes(paper, [
                { offset: 0, transform: 'translateY(0px) rotate(0deg) scale(1)', opacity: 1 },
                { offset: .06, transform: 'translateY(0px) rotate(0deg) scale(1)', opacity: 1 },
                { offset: .22, transform: `translateY(${shift * .2}px) rotate(-43deg) scale(.68)`, opacity: 1 },
                { offset: .40, transform: `translateY(${shift}px) rotate(-90deg) scale(${scale})`, opacity: 1 },
                { offset: .54, transform: `translateY(${shift}px) rotate(-90deg) scale(${scale})`, opacity: 0 },
                { offset: 1, transform: `translateY(${shift}px) rotate(-90deg) scale(${scale})`, opacity: 0 }
            ]);
            ink.forEach(element => keyframes(element, [
                { offset: 0, opacity: 1 }, { offset: .22, opacity: 1 },
                { offset: .45, opacity: 0 }, { offset: 1, opacity: 0 }
            ]));
            metrics.heights = slots.map(slot => slot.getBoundingClientRect().height / zoom);

        }
        update();
    }

    function update() {
        frame = 0;
        if (!metrics) return;
        if (metrics.mode) {
            const progress = clamp((scrollY - metrics.start) / metrics.distance);
            documentPaper.classList.toggle('is-unfolded', progress >= 1);
            updateBackground(smooth((progress - .06) / .34), progress > .06 && progress < 1);
            animations.forEach(animation => { animation.currentTime = progress * 1000; });
            const remaining = Math.max(0, metrics.start + metrics.distance - scrollY);
            sheet.style.transform = `translateY(${-remaining / metrics.zoom}px)`;
            sheet.style.opacity = String(smooth((progress - .40) / .14));
            // All hinges share one 3D space. Each next panel starts exactly at
            // the preceding panel's lower edge, alternating mountain/valley folds.
            const unfold = smooth((progress - .40) / .60);
            let edgeY = 0, edgeZ = 0, layoutY = 0;
            slots.forEach((slot, i) => {
                const angle = (i % 2 ? 1 : -1) * 82 * (1 - unfold);
                const radians = angle * Math.PI / 180;
                slot.style.transform = `translate3d(0, ${edgeY - layoutY}px, ${edgeZ}px) rotateX(${angle}deg)`;
                folds[i].style.setProperty('--fold-shade', String((1 - unfold) * (i % 2 ? .28 : .09)));
                const height = metrics.heights[i];
                edgeY += height * Math.cos(radians);
                edgeZ += height * Math.sin(radians);
                layoutY += height;
            });
            sheet.inert = progress < .98;
            about.inert = progress > .18;
            paper.style.visibility = progress >= .9 ? 'hidden' : '';
            journey.classList.toggle('is-turning', progress > 0 && progress < 1);
            journey.dataset.foldProgress = progress.toFixed(3);
        } else if (!reduced.matches) {
            const sheetTop = sheet.getBoundingClientRect().top;
            updateBackground(smooth((innerHeight * .7 - sheetTop) / (innerHeight * .5)));
            documentPaper.classList.remove('is-unfolded');
            // Keep a continuous readable sheet on small screens.
            documentPaper.classList.add('is-unfolded');
            folds.forEach(fold => { fold.style.transform = ''; fold.style.opacity = ''; fold.style.setProperty('--fold-shade', '0'); });
        } else {
            documentPaper.classList.add('is-unfolded');
            updateBackground(sheet.getBoundingClientRect().top <= innerHeight * .5 ? 1 : 0);
            folds.forEach(fold => { fold.style.transform = ''; fold.style.opacity = ''; });
        }
    }

    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const scheduleMeasure = () => { if (!measureFrame) measureFrame = requestAnimationFrame(measure); };
    const cancelAuto = () => { cancelAnimationFrame(autoFrame); autoFrame = 0; };
    function goTo(target, onComplete) {
        cancelAuto();
        if (reduced.matches) { window.scrollTo({ top: target, behavior: 'instant' }); onComplete?.(); return; }
        const start = scrollY;
        const started = performance.now();
        const duration = metrics.mode ? 950 : 700;
        function tick(now) {
            const p = clamp((now - started) / duration);
            window.scrollTo({ top: start + (target - start) * smooth(p), behavior: 'instant' });
            if (p < 1) autoFrame = requestAnimationFrame(tick);
            else { autoFrame = 0; update(); onComplete?.(); }
        }
        autoFrame = requestAnimationFrame(tick);
    }

    entry.addEventListener('click', event => {
        event.preventDefault();
        const target = metrics.mode ? metrics.start + metrics.distance : sheet.getBoundingClientRect().top + scrollY - metrics.nav;
        goTo(target, () => {
            sheet.inert = false;
            const heading = document.querySelector('#resume-sheet-title');
            heading.tabIndex = -1;
            heading.focus({ preventScroll: true });
            history.replaceState(null, '', '#resume-sheet');
        });
    });
    back.addEventListener('click', event => {
        event.preventDefault();
        const target = metrics.mode ? metrics.start : about.getBoundingClientRect().top + scrollY - metrics.nav;
        goTo(target, () => { about.inert = false; entry.focus({ preventScroll: true }); history.replaceState(null, '', '#about'); });
    });
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', scheduleMeasure);
    window.addEventListener('wheel', cancelAuto, { passive: true });
    window.addEventListener('touchstart', cancelAuto, { passive: true });
    document.querySelectorAll('.nav-link, .nav-brand, .cover-scroll').forEach(link => link.addEventListener('click', cancelAuto, { capture: true }));
    window.addEventListener('keydown', event => { if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(event.key)) cancelAuto(); });
    reduced.addEventListener('change', scheduleMeasure);
    desktop.addEventListener('change', scheduleMeasure);
    about.querySelectorAll('img').forEach(img => { if (!img.complete) img.addEventListener('load', scheduleMeasure, { once: true }); });
    document.fonts.ready.then(scheduleMeasure);
    measure();
})();
