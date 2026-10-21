(() => {
    const keywords = {
        haiyuntian: ['Enterprise UX', 'EdTech', 'AI Review'],
        cofly: ['Human–AI', 'Smart Dispatch', 'Air Mobility'],
        popmind: ['AI Co-design', 'Spatial UX', 'Design Workflow'],
        xiaohongshu: ['AI Reading', 'Semantic Linking', 'Community'],
        pawards: ['Pet Enrichment', 'Phygital UX', 'Co-creation'],
        mycloy: ['Sustainability', 'Learning by Doing', 'Co-creation']
    };
    const lettering = {"Enterprise UX": "fonts/figma-hand-bold/tags/00.svg", "EdTech": "fonts/figma-hand-bold/tags/01.svg", "AI Review": "fonts/figma-hand-bold/tags/02.svg", "Human–AI": "fonts/figma-hand-bold/tags/03.svg", "Smart Dispatch": "fonts/figma-hand-bold/tags/04.svg", "Air Mobility": "fonts/figma-hand-bold/tags/05.svg", "AI Co-design": "fonts/figma-hand-bold/tags/06.svg", "Spatial UX": "fonts/figma-hand-bold/tags/07.svg", "Design Workflow": "fonts/figma-hand-bold/tags/08.svg", "AI Reading": "fonts/figma-hand-bold/tags/09.svg", "Semantic Linking": "fonts/figma-hand-bold/tags/10.svg", "Community": "fonts/figma-hand-bold/tags/11.svg", "Pet Enrichment": "fonts/figma-hand-bold/tags/12.svg", "Phygital UX": "fonts/figma-hand-bold/tags/13.svg", "Co-creation": "fonts/figma-hand-bold/tags/14.svg", "Sustainability": "fonts/figma-hand-bold/tags/15.svg", "Learning by Doing": "fonts/figma-hand-bold/tags/16.svg", "FIXING": "fonts/figma-hand-bold/tags/17.svg"};
    const letteringSize = {"Enterprise UX": [98.66666666666667, 14.0], "EdTech": [52.333333333333336, 12.333333333333334], "AI Review": [72.66666666666667, 10.666666666666666], "Human\u2013AI": [79.66666666666667, 11.0], "Smart Dispatch": [116.33333333333333, 15.333333333333334], "Air Mobility": [82.0, 15.666666666666666], "AI Co-design": [93.0, 14.0], "Spatial UX": [76.33333333333333, 15.333333333333334], "Design Workflow": [120.66666666666667, 14.666666666666666], "AI Reading": [81.33333333333333, 14.0], "Semantic Linking": [124.66666666666667, 14.666666666666666], "Community": [77.0, 15.333333333333334], "Pet Enrichment": [116.66666666666667, 12.666666666666666], "Phygital UX": [91.0, 14.666666666666666], "Co-creation": [75.66666666666667, 11.333333333333334], "Sustainability": [97.66666666666667, 15.666666666666666], "Learning by Doing": [130.66666666666666, 13.666666666666666], "FIXING": [57.333333333333336, 11.0]};
    const cards = [...document.querySelectorAll('#works .project-stack')];
    cards.forEach(card => {
        const tags = document.createElement('div');
        tags.className = 'project-keywords';
        tags.setAttribute('aria-label', '项目关键词');
        (keywords[card.dataset.project] || []).forEach((word, i) => {
            const tag = document.createElement('span');
            tag.className = 'project-keyword';
            tag.style.setProperty('--tag-index', i);
            tag.style.setProperty('--tag-tilt', `${[-5, 3, -2][i]}deg`);
            const label = document.createElement('img');
            label.className = 'project-keyword-text';
            label.src = lettering[word];
            label.alt = word;
            label.style.setProperty('--letter-w', letteringSize[word][0]);
            label.style.setProperty('--letter-h', letteringSize[word][1]);
            label.draggable = false;
            tag.append(label);
            tags.append(tag);
        });
        card.querySelector('.project-stack-visual').append(tags);
        card.setAttribute('aria-label', card.querySelector('.project-name').textContent);
    });
    let frame = 0;
    function update() {
        frame = 0;
        const focusY = innerHeight * .52;
        let active = null, distance = Infinity;
        for (const card of cards) {
            const rect = card.getBoundingClientRect();
            const center = rect.top + rect.height / 2;
            const d = Math.abs(center - focusY);
            if (rect.bottom > innerHeight * .25 && rect.top < innerHeight * .75 && d < distance) {
                active = card; distance = d;
            }
        }
        cards.forEach(card => card.classList.toggle('is-project-current', card === active));
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    update();
})();
