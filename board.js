(() => {
    const section = document.querySelector('#other-work');
    const works = document.querySelector('#works');
    const board = section.querySelector('.work-pinboard');
    // Inline vector thread: no downloaded assets or pointer interception.
    const photos = [...board.querySelectorAll('.board-photo')];
    const ns = 'http://www.w3.org/2000/svg';
    const threads = document.createElementNS(ns, 'svg');
    threads.classList.add('evidence-threads');
    threads.setAttribute('aria-hidden', 'true');
    board.append(threads);
    let connections = [], threadFrame = 0, followUntil = 0;
    function makeConnections() {
        // Follow the reading order, with a few cross-links rather than a dense web.
        const order = photos.map((card, i) => ({i, y: parseFloat(card.style.top), x: parseFloat(card.style.left)}))
            .sort((a,b) => Math.abs(a.y-b.y) < 30 ? a.x-b.x : a.y-b.y);
        connections = order.slice(1).map((item,i) => [order[i].i,item.i]);
        for (let i=1; i+3<order.length; i+=5) connections.push([order[i].i,order[i+3].i]);
        threads.replaceChildren();
        connections.forEach(() => threads.append(document.createElementNS(ns,'line')));
        photos.forEach(() => {
            const pin = document.createElementNS(ns,'g');
            const head = document.createElementNS(ns,'circle');
            head.setAttribute('r','6'); head.classList.add('pin-head');
            const ring = document.createElementNS(ns,'circle');
            ring.setAttribute('r','3.8'); ring.classList.add('pin-ring');
            pin.append(head,ring); threads.append(pin);
        });
        followThreads();
    }
    function drawThreads() {
        threads.setAttribute('viewBox', `0 0 ${board.clientWidth} ${board.clientHeight}`);
        const points = photos.map((card,i) => {
            const style = getComputedStyle(card);
            const matrix = new DOMMatrix(style.transform === 'none' ? undefined : style.transform);
            const [ox,oy] = style.transformOrigin.split(' ').map(parseFloat);
            const local = new DOMPoint(card.offsetWidth * [.43,.61,.5,.36][i%4] - ox, 7 - oy).matrixTransform(matrix);
            return {x:card.offsetLeft+ox+local.x,y:card.offsetTop+oy+local.y};
        });
        connections.forEach(([a,b],i) => {
            const start=points[a], end=points[b], length=Math.hypot(end.x-start.x,end.y-start.y)||1;
            const dx=(end.x-start.x)/length*6, dy=(end.y-start.y)/length*6;
            const line=threads.children[i];
            for (const [key,value] of Object.entries({x1:start.x+dx,y1:start.y+dy,x2:end.x-dx,y2:end.y-dy})) line.setAttribute(key,value);
        });
        points.forEach((point,i) => {
            const pin=threads.children[connections.length+i];
            pin.setAttribute('transform',`translate(${point.x} ${point.y})`);
        });
    }
    function followThreads() {
        followUntil = performance.now()+260;
        if (threadFrame) return;
        const tick = () => {
            drawThreads();
            threadFrame = performance.now()<followUntil ? requestAnimationFrame(tick) : 0;
        };
        threadFrame=requestAnimationFrame(tick);
    }
    photos.forEach(card => {
        card.addEventListener('pointerenter',followThreads);
        card.addEventListener('pointerleave',followThreads);
        card.querySelector('img').addEventListener('load',followThreads);
    });
    const pencilLayer = document.createElement('div');
    pencilLayer.className = 'board-pencil-doodles';
    pencilLayer.setAttribute('aria-hidden','true');
    board.append(pencilLayer);
    const pencilAssets = [
        ['封面/web/doodles/imgVector9.svg',.72], ['封面/web/doodles/imgVector1.svg',.54],
        ['封面/web/doodles/imgVector11.svg',.90], ['封面/web/doodles/imgFrame2.svg',1.04],
        ['封面/web/doodles/imgVector1.svg',.54], ['封面/web/doodles/imgVector10.svg',.94],
        ['封面/web/doodles/imgVector9.svg',.72], ['封面/web/doodles/imgFrame5.svg',1.22],
        ['封面/web/doodles/imgVector1.svg',.54], ['封面/web/doodles/imgVector11.svg',.90]
    ];
    function placePencilDoodles() {
        pencilLayer.replaceChildren();
        // Search actual free paper, allowing for each photograph's tilted corners.
        const occupied = photos.map(card => {
            const angle = (parseFloat(getComputedStyle(card).getPropertyValue('--tilt'))||0)*Math.PI/180;
            const w=card.offsetWidth, h=card.offsetHeight;
            const bw=Math.abs(w*Math.cos(angle))+Math.abs(h*Math.sin(angle));
            const bh=Math.abs(w*Math.sin(angle))+Math.abs(h*Math.cos(angle));
            const cx=card.offsetLeft+w/2, cy=card.offsetTop+h/2;
            return {x:cx-bw/2-10,y:cy-bh/2-10,w:bw+20,h:bh+20};
        });
        const width=board.clientWidth, height=board.clientHeight;
        pencilAssets.forEach(([file,ratio],i) => {
            const targetX=width*[.05,.52,.95,.30,.68][i%5];
            const targetY=20+(height-40)*(i+.35)/pencilAssets.length;
            let best=null;
            for (const size of [34]) {
                const w=size*ratio,h=size;
                for(let y=12;y+h<height-12;y+=14) for(let x=12;x+w<width-12;x+=14) {
                    if(occupied.some(r=>x<r.x+r.w && x+w>r.x && y<r.y+r.h && y+h>r.y)) continue;
                    const score=Math.abs(y+h/2-targetY)*2+Math.abs(x+w/2-targetX);
                    if(!best||score<best.score) best={x,y,w,h,score};
                }
            }
            if(!best) return;
            const doodle=document.createElement('span');
            doodle.className='board-pencil-mark';
            doodle.style.cssText=`left:${best.x}px;top:${best.y}px;width:${best.w}px;height:${best.h}px;--pencil-image:url("${file}")`;
            pencilLayer.append(doodle);
            occupied.push({x:best.x-18,y:best.y-30,w:best.w+36,h:best.h+60});
        });
    }
    let lastWidth = 0;
    function packPhotos() {
        const width = board.clientWidth;
        if (!width || width === lastWidth) return;
        lastWidth = width;
        const small = width < 500, pad = small ? 26 : 40, gap = small ? 30 : 38;
        const available = width - pad * 2;
        const edge = (available - gap * (small ? 1 : 2)) / (small ? 2 : 2.5625);
        const shortEdge = edge * 9 / 16;
        const rowGap = small ? 22 : 28;
        const lanes = (small ? [edge, edge] : [edge, edge, shortEdge]).map((w,i,all) => ({
            width:w, x:all.slice(0,i).reduce((a,b)=>a+b+gap,0), height:0, cards:[]
        }));
        board.classList.add('is-packed');
        board.querySelectorAll('.board-photo').forEach((card,index) => {
            const img = card.querySelector('img');
            const ratio = Number(img.getAttribute('width')) / Number(img.getAttribute('height'));
            const w = (ratio < 1 ? shortEdge : shortEdge * ratio) * .88;
            const h = (ratio < 1 ? shortEdge / ratio : shortEdge) * .88;
            const forced = !small && index < 6 ? [0,1,0,1,2,2][index] : null;
            const options = lanes.filter(lane => lane.width >= w - .1);
            const lane = forced !== null ? lanes[forced] : options.reduce((a,b)=>a.height<=b.height?a:b);
            lane.cards.push({card,w,h,y:lane.height});
            lane.height += h + rowGap;
        });
        const contentHeight = Math.max(...lanes.map(lane=>lane.height)) - rowGap;
        lanes.forEach(lane => lane.cards.forEach(({card,w,h,y},i) => {
            const spread = lane.cards.length > 1 ? (contentHeight - (lane.height-rowGap)) / (lane.cards.length-1) : 0;
            card.style.left = `${pad + lane.x + (lane.width-w)/2}px`;
            card.style.top = `${pad + y + spread*i}px`;
            card.style.width = `${w}px`;
            card.style.setProperty('--drag-x','0px'); card.style.setProperty('--drag-y','0px');
        }));
        board.style.height = `${contentHeight + pad * 2}px`;
        makeConnections();
        placePencilDoodles();
    }
    new ResizeObserver(packPhotos).observe(board);
    packPhotos();

    let frame;
    function fadeGrid() {
        frame = 0;
        const end = section.getBoundingClientRect().top;
        const distance = Math.min(innerHeight * .8, works.getBoundingClientRect().height * .6);
        const amount = Math.max(0, Math.min(1, (end - innerHeight * .15) / distance));
        document.body.style.setProperty('--grid-line', `rgba(34,34,34,${.08 * amount})`);
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(fadeGrid); };
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    fadeGrid();
    board.querySelectorAll('.board-photo').forEach(card => {
        let drag = null, moved = false, x = 0, y = 0;
        card.addEventListener('pointerdown', event => {
            moved = false;
            // Touch keeps normal page scrolling; tapping plays the page click effect.
            if (event.pointerType !== 'mouse' || event.button !== 0) return;
            x = parseFloat(card.style.getPropertyValue('--drag-x')) || 0;
            y = parseFloat(card.style.getPropertyValue('--drag-y')) || 0;
            const zoom = Number(getComputedStyle(document.documentElement).zoom) || 1;
            drag = { startX: event.clientX, startY: event.clientY, x, y, zoom, card: card.getBoundingClientRect(), board: board.getBoundingClientRect() };
            card.setPointerCapture(event.pointerId);
        });
        card.addEventListener('pointermove', event => {
            if (!drag) return;
            const dx = event.clientX - drag.startX, dy = event.clientY - drag.startY;
            if (!moved && Math.hypot(dx, dy) < 5) return;
            moved = true;
            card.classList.add('is-dragging');
            x = drag.x + Math.max(drag.board.left + 10 - drag.card.left, Math.min(drag.board.right - 10 - drag.card.right, dx)) / drag.zoom;
            y = drag.y + Math.max(drag.board.top + 10 - drag.card.top, Math.min(drag.board.bottom - 10 - drag.card.bottom, dy)) / drag.zoom;
            card.style.setProperty('--drag-x', `${x}px`);
            card.style.setProperty('--drag-y', `${y}px`);
            followThreads();
        });
        const release = () => { drag = null; card.classList.remove('is-dragging'); };
        card.addEventListener('pointerup', release);
        card.addEventListener('pointercancel', release);
        card.addEventListener('click', event => {
            if (moved) { event.stopPropagation(); moved = false; }
        });
    });
})();
