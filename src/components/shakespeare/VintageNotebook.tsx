import { useEffect, useRef, useState } from 'react';
import { PageFlip } from 'page-flip';
import pageBg from '../../assets/page.jpg';
import coverCenterpiece from '../../assets/Collection.png';
import romeoJulietImg from '../../assets/Romeo and Juliet\u{1F339}.webp';
import moodboardImg from '../../assets/moodboard.jpg';
import './VintageNotebook.css';

/* ── Romeo & Juliet Quotes ── */
const RJ_QUOTES = [
    'But soft, what light through yonder window breaks?',
    'My bounty is as boundless as the sea, my love as deep.',
    'Good night, good night! Parting is such sweet sorrow.',
    'These violent delights have violent ends.',
    'O Romeo, Romeo, wherefore art thou Romeo?',
    "What's in a name? That which we call a rose by any other name would smell as sweet.",
    'Thus with a kiss I die.',
    'For never was a story of more woe, than this of Juliet and her Romeo.',
    'Love is a smoke raised with the fume of sighs.',
    "Did my heart love till now? Forswear it, sight! For I ne'er saw true beauty till this night.",
    'Wisely and slow; they stumble that run fast.',
    "Under love's heavy burden do I sink.",
    'See how she leans her cheek upon her hand, O that I were a glove upon that hand.',
    'My only love sprung from my only hate.',
    "With love's light wings did I o'erperch these walls.",
    "One fairer than my love? The all-seeing sun ne'er saw her match since first the world begun.",
    'Love goes toward love, as schoolboys from their books.',
    'It is the east, and Juliet is the sun.',
    "A pair of star-cross'd lovers take their life.",
    'The brightness of her cheek would shame those stars.',
];

/* ── DOM-level quote injector — runs INSIDE the page 2 image frame only ── */
function startPageQuotes(quotesLayer: HTMLElement): () => void {
    let counter = 0;
    const usedIndices = new Set<number>();
    const timers: ReturnType<typeof setTimeout>[] = [];

    const getNextIndex = () => {
        if (usedIndices.size >= RJ_QUOTES.length) usedIndices.clear();
        let idx: number;
        do { idx = Math.floor(Math.random() * RJ_QUOTES.length); }
        while (usedIndices.has(idx));
        usedIndices.add(idx);
        return idx;
    };

    const spawnQuote = () => {
        const span = document.createElement('span');
        span.className = 'shakespeare-page-quote';
        span.id = `pq-${++counter}`;

        // Random position inside page bounds (keep text well within the frame)
        const left = 4 + Math.random() * 60;   // 4–64 %
        const top  = 4 + Math.random() * 72;   // 4–76 %
        const rot  = -7 + Math.random() * 14;  // ±7°
        const dur  = 5000 + Math.random() * 5000; // 5–10 s

        span.style.left = `${left}%`;
        span.style.top  = `${top}%`;
        span.style.setProperty('--pq-rot', `${rot}deg`);
        span.style.animationDuration = `${dur}ms`;
        span.textContent = `\u201c${RJ_QUOTES[getNextIndex()]}\u201d`;

        quotesLayer.appendChild(span);

        // Self-remove after animation
        const removeTimer = setTimeout(() => { span.remove(); }, dur + 100);
        timers.push(removeTimer);
    };

    // Seed a few immediately, then keep a rolling interval
    const t1 = setTimeout(spawnQuote, 600);
    const t2 = setTimeout(spawnQuote, 2000);
    const t3 = setTimeout(spawnQuote, 3600);
    timers.push(t1, t2, t3);

    // Recurring spawner — use recursive setTimeout so the gap varies slightly
    let recurTimer: ReturnType<typeof setTimeout>;
    const schedule = () => {
        recurTimer = setTimeout(() => {
            spawnQuote();
            schedule();
        }, 3200 + Math.random() * 2400);
        timers.push(recurTimer);
    };
    schedule();

    // Return cleanup fn
    return () => { timers.forEach(clearTimeout); };
}


export const VintageNotebook: React.FC = () => {
    const bookRef    = useRef<HTMLDivElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        if (!bookRef.current || !wrapperRef.current) return;

        let flip: any = null;
        let cleanupQuotes: (() => void) | null = null;

        const initFlip = () => {
            try {
                const container = bookRef.current!;
                while (container.firstChild) container.removeChild(container.firstChild);

                /* ── Page definitions ── */
                const pagesData: any[] = [
                    { type: 'cover',    title: 'Shakespearean\nLove', subtitle: 'A Vintage Collection' },
                    {
                        type: 'rj-intro',
                        title: 'Romeo & Juliet',
                        subtitle: 'Love, Draped in Renaissance',
                        content: "A fashion collection born from the eternal passion of Shakespeare\u2019s star-cross\u2019d lovers \u2014 garments woven with the spirit of Italian Renaissance, where every silhouette whispers of Verona\u2019s moonlit balconies and forbidden devotion.",
                    },
                    { type: 'rj-image', imageSrc: romeoJulietImg },
                    {
                        type: 'rj-themes',
                        title: 'The Collection',
                        content: 'Romance, tragedy, fate, passion, rebellion \u2014 these are the threads that weave through Romeo and Juliet. While the play is often remembered for its tragic ending, love remains its most enduring force. Through this collection, I have explored the themes of love and passion, translated into fabric, colour, and silhouette.\n\nThe romantic and sensuous nature of the garments is met with quiet rebellion: Italian Renaissance elements \u2014 rich fabrics, ornamental prints, period forms \u2014 juxtaposed with modern, flowing, off-shoulder silhouettes.\n\nContrasting colours mirror two rival families; pleats echo the twists and turns of their story. I chose to forgo corsets \u2014 though synonymous with the era \u2014 because love, my central theme, speaks of comfort, not constraint.',
                    },
                    { type: 'moodboard-image', imageSrc: moodboardImg },
                ];

                for (let i = pagesData.length; i <= 20; i++) pagesData.push({ type: 'blank' });
                pagesData.push({ type: 'closing', title: 'Finis', content: "All the world\u2019s a stage,\nAnd all the men and women merely players." });
                pagesData.push({ type: 'back', title: 'The End' });

                const pageElements: HTMLElement[] = [];
                let quotesLayerEl: HTMLElement | null = null;

                pagesData.forEach((data, index) => {
                    const page = document.createElement('div');
                    page.className = 'shakespeare-page';

                    /* ── Front cover ── */
                    if (index === 0) {
                        page.classList.add('shakespeare-cover-front');
                        page.dataset.side = 'right';
                        page.innerHTML = `
                            <div class="shakespeare-leather-texture"></div>
                            <div class="shakespeare-gold-frame"></div>
                            <div class="shakespeare-gold-inner-frame"></div>
                            <div class="shakespeare-cover-image-container">
                                <img src="${coverCenterpiece}" class="shakespeare-cover-image" alt="Centerpiece" />
                            </div>
                            <div class="shakespeare-page-lighting"></div>
                            <div class="shakespeare-content" style="justify-content:flex-start;align-items:center;text-align:center;padding-top:55px;width:100%;">
                                <h1 class="shakespeare-title" style="color:#d4af37;border:none;font-size:2.2rem;margin-bottom:0.1rem;line-height:1.1;letter-spacing:2px;width:100%;margin-left:0;margin-right:0;">${(data.title || '').replace('\n', '<br>')}</h1>
                                ${data.subtitle ? `<p style="color:#d4af37;opacity:0.6;font-family:'Cinzel';font-size:0.8rem;letter-spacing:1px;width:100%;margin-left:0;margin-right:0;">${data.subtitle}</p>` : ''}
                            </div>
                            <div class="shakespeare-spine-crease"></div>
                        `;
                        page.dataset.density = 'hard';

                    /* ── Back cover ── */
                    } else if (index === pagesData.length - 1) {
                        page.classList.add('shakespeare-cover-back');
                        page.dataset.side = 'left';
                        page.innerHTML = `
                            <div class="shakespeare-leather-texture"></div>
                            <div class="shakespeare-gold-frame"></div>
                            <div class="shakespeare-page-lighting"></div>
                            <div class="shakespeare-content" style="justify-content:center;align-items:center;">
                                <h2 class="shakespeare-title" style="color:#d4af37;border:none;">${data.title || ''}</h2>
                            </div>
                            <div class="shakespeare-spine-crease"></div>
                        `;
                        page.dataset.density = 'hard';

                    /* ── Page 1: R&J intro ── */
                    } else if (data.type === 'rj-intro') {
                        page.dataset.side = index % 2 !== 0 ? 'left' : 'right';
                        page.innerHTML = `
                            <div class="shakespeare-page-bg" style="background-image:url('${pageBg}')"></div>
                            <div class="shakespeare-paper-texture"></div>
                            <div class="shakespeare-page-lighting"></div>
                            <div class="shakespeare-content shakespeare-rj-intro-content">
                                <div class="shakespeare-rj-ornament-top">\u2726</div>
                                <h2 class="shakespeare-rj-heading">${data.title}</h2>
                                <div class="shakespeare-rj-divider">
                                    <span class="shakespeare-rj-divider-line"></span>
                                    <span class="shakespeare-rj-divider-rose">\uD83C\uDF39</span>
                                    <span class="shakespeare-rj-divider-line"></span>
                                </div>
                                <h3 class="shakespeare-rj-subheading">${data.subtitle}</h3>
                                <p class="shakespeare-rj-description">${data.content}</p>
                                <div class="shakespeare-rj-ornament-bottom">\u2014 Shakespearean Love \u2014</div>
                                <div class="shakespeare-page-number">${index}</div>
                            </div>
                            <div class="shakespeare-spine-crease"></div>
                        `;

                    /* ── Page 2: R&J image  +  quotes layer ── */
                    } else if (data.type === 'rj-image') {
                        page.dataset.side = index % 2 !== 0 ? 'left' : 'right';
                        page.innerHTML = `
                            <div class="shakespeare-page-bg" style="background-image:url('${pageBg}')"></div>
                            <div class="shakespeare-paper-texture"></div>
                            <div class="shakespeare-page-lighting"></div>
                            <div class="shakespeare-content shakespeare-rj-image-content">
                                <div class="shakespeare-rj-image-frame">
                                    <img src="${data.imageSrc}" class="shakespeare-rj-image" alt="Romeo and Juliet \u2014 Shakespearean Love" />
                                    <!-- Quotes live ONLY here -->
                                    <div class="shakespeare-page-quotes-layer" id="shakespeare-quotes-layer"></div>
                                </div>
                                <div class="shakespeare-page-number">${index}</div>
                            </div>
                            <div class="shakespeare-spine-crease"></div>
                        `;
                        // Grab the quotes layer right after setting innerHTML
                        quotesLayerEl = page.querySelector('#shakespeare-quotes-layer');

                    /* ── Page 3: Themes & philosophy text ── */
                    } else if (data.type === 'rj-themes') {
                        page.dataset.side = index % 2 !== 0 ? 'left' : 'right';
                        page.innerHTML = `
                            <div class="shakespeare-page-bg" style="background-image:url('${pageBg}')"></div>
                            <div class="shakespeare-paper-texture"></div>
                            <div class="shakespeare-page-lighting"></div>
                            <div class="shakespeare-content shakespeare-rj-themes-content">
                                <div class="shakespeare-rj-themes-rule-top"></div>
                                <h2 class="shakespeare-rj-themes-heading">${data.title}</h2>
                                <div class="shakespeare-rj-themes-body">${data.content.replace(/\n/g, '<br>')}</div>
                                <div class="shakespeare-rj-themes-rule-bottom"></div>
                                <div class="shakespeare-page-number">${index}</div>
                            </div>
                            <div class="shakespeare-spine-crease"></div>
                        `;

                    /* ── Page 4: Mood board image ── */
                    } else if (data.type === 'moodboard-image') {
                        page.dataset.side = index % 2 !== 0 ? 'left' : 'right';
                        page.innerHTML = `
                            <div class="shakespeare-page-bg" style="background-image:url('${pageBg}')"></div>
                            <div class="shakespeare-paper-texture"></div>
                            <div class="shakespeare-page-lighting"></div>
                            <div class="shakespeare-content shakespeare-moodboard-content">
                                <div class="shakespeare-moodboard-label">Mood Board</div>
                                <div class="shakespeare-moodboard-frame">
                                    <img src="${data.imageSrc}" class="shakespeare-moodboard-image" alt="Mood Board \u2014 Shakespearean Love" />
                                </div>
                                <div class="shakespeare-page-number">${index}</div>
                            </div>
                            <div class="shakespeare-spine-crease"></div>
                        `;

                    /* ── All other pages ── */
                    } else {
                        page.dataset.side = index % 2 !== 0 ? 'left' : 'right';
                        page.innerHTML = `
                            <div class="shakespeare-page-bg" style="background-image:url('${pageBg}')"></div>
                            <div class="shakespeare-paper-texture"></div>
                            <div class="shakespeare-page-lighting"></div>
                            <div class="shakespeare-content">
                                ${data.date  ? `<div class="shakespeare-date">${data.date}</div>` : ''}
                                ${data.title ? `<h2 class="shakespeare-title">${data.title}</h2>` : ''}
                                ${data.type === 'poem'    ? `<div class="shakespeare-poem">${data.content?.replace(/\n/g, '<br>')}</div>` : ''}
                                ${data.type === 'letter'  ? `<div class="shakespeare-letter">${data.content}</div><div class="shakespeare-signature">W.S.</div>` : ''}
                                ${data.type === 'sketch' || data.type === 'closing' ? `<div class="shakespeare-letter" style="text-align:center;margin-top:40px;">${data.content?.replace(/\n/g, '<br>')}</div>` : ''}
                                ${data.type === 'blank'   ? `<div style="flex:1;display:flex;align-items:center;justify-content:center;opacity:0.05;font-style:italic;">(this page intentionally left blank)</div>` : ''}
                                <div class="shakespeare-page-number">${index}</div>
                            </div>
                            <div class="shakespeare-spine-crease"></div>
                        `;
                    }

                    container.appendChild(page);
                    pageElements.push(page);
                });

                /* ── Init PageFlip engine ── */
                flip = new PageFlip(container, {
                    width: 550,
                    height: 680,
                    size: 'stretch',
                    minWidth: 315,
                    maxWidth: 1000,
                    minHeight: 400,
                    maxHeight: 1000,
                    maxShadowOpacity: 0.5,
                    showCover: true,
                    mobileScrollSupport: false,
                });

                flip.loadFromHTML(pageElements);

                if (wrapperRef.current) wrapperRef.current.style.opacity = '1';

                /* ── Start quotes ONLY inside page 2's image frame ── */
                if (quotesLayerEl) {
                    cleanupQuotes = startPageQuotes(quotesLayerEl);
                }

            } catch (err: any) {
                console.error('SHAKESPEARE_ENGINE_CRASH:', err);
                setIsError(true);
            }
        };

        const timer = setTimeout(initFlip, 100);

        const handleResize = () => {
            if (flip) flip.updateFromHtml(Array.from(bookRef.current?.children || []) as HTMLElement[]);
        };
        window.addEventListener('resize', handleResize);

        return () => {
            clearTimeout(timer);
            window.removeEventListener('resize', handleResize);
            if (cleanupQuotes) cleanupQuotes();
            if (flip) { try { flip.destroy(); } catch (e) {} }
        };
    }, []);

    return (
        <div className="shakespeare-stage">
            <a href="/" className="shakespeare-nav-link">Close Notebook</a>

            {isError ? (
                <div style={{ border: '1px solid #4a1c14', padding: '40px', background: 'rgba(74,28,20,0.2)', textAlign: 'center', backdropFilter: 'blur(20px)' }}>
                    <h2 style={{ color: '#d4af37', fontFamily: 'Cinzel', marginBottom: '20px' }}>Sanctuary Breached</h2>
                    <p style={{ color: '#fff', opacity: 0.8, marginBottom: '30px' }}>The physics engine failed to manifest.</p>
                    <a href="/" className="shakespeare-nav-link" style={{ position: 'static', transform: 'none' }}>Escape to Reality</a>
                </div>
            ) : (
                <div ref={wrapperRef} className="shakespeare-wrapper">
                    <div ref={bookRef} className="shakespeare-book"></div>
                </div>
            )}
        </div>
    );
};
