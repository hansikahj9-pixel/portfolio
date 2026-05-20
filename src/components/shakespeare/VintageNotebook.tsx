import { useEffect, useRef, useState, useCallback } from 'react';
import { PageFlip } from 'page-flip';
import pageBg from '../../assets/page.jpg';
import coverCenterpiece from '../../assets/Collection.png';
import romeoJulietImg from '../../assets/Romeo and Juliet\u{1F339}.webp';
import './VintageNotebook.css';

/* ── Romeo & Juliet Quotes ── */
const RJ_QUOTES = [
    "But soft, what light through yonder window breaks?",
    "My bounty is as boundless as the sea, my love as deep.",
    "Good night, good night! Parting is such sweet sorrow.",
    "These violent delights have violent ends.",
    "O Romeo, Romeo, wherefore art thou Romeo?",
    "What's in a name? That which we call a rose by any other name would smell as sweet.",
    "Thus with a kiss I die.",
    "For never was a story of more woe, than this of Juliet and her Romeo.",
    "Love is a smoke raised with the fume of sighs.",
    "Did my heart love till now? Forswear it, sight! For I ne'er saw true beauty till this night.",
    "Wisely and slow; they stumble that run fast.",
    "Under love's heavy burden do I sink.",
    "See how she leans her cheek upon her hand, O that I were a glove upon that hand.",
    "My only love sprung from my only hate.",
    "With love's light wings did I o'erperch these walls.",
    "One fairer than my love? The all-seeing sun ne'er saw her match since first the world begun.",
    "Love goes toward love, as schoolboys from their books.",
    "It is the east, and Juliet is the sun.",
    "A pair of star-cross'd lovers take their life.",
    "The brightness of her cheek would shame those stars.",
];

interface FloatingQuote {
    id: number;
    text: string;
    x: number;
    y: number;
    rotation: number;
    duration: number;
    fontSize: number;
    opacity: number;
}

/* ── Floating Quotes Overlay ── */
const FloatingQuotes: React.FC = () => {
    const [quotes, setQuotes] = useState<FloatingQuote[]>([]);
    const counterRef = useRef(0);
    const usedIndicesRef = useRef<Set<number>>(new Set());

    const getUniqueQuoteIndex = useCallback(() => {
        if (usedIndicesRef.current.size >= RJ_QUOTES.length) {
            usedIndicesRef.current.clear();
        }
        let idx: number;
        do {
            idx = Math.floor(Math.random() * RJ_QUOTES.length);
        } while (usedIndicesRef.current.has(idx));
        usedIndicesRef.current.add(idx);
        return idx;
    }, []);

    useEffect(() => {
        const spawnQuote = () => {
            const id = ++counterRef.current;
            const quoteIdx = getUniqueQuoteIndex();
            const duration = 6000 + Math.random() * 6000; // 6–12 seconds
            const newQuote: FloatingQuote = {
                id,
                text: RJ_QUOTES[quoteIdx],
                x: 5 + Math.random() * 80,   // 5–85% from left
                y: 5 + Math.random() * 80,   // 5–85% from top
                rotation: -8 + Math.random() * 16, // -8° to +8°
                duration,
                fontSize: 0.85 + Math.random() * 0.6, // 0.85–1.45rem
                opacity: 0.15 + Math.random() * 0.35,  // 0.15–0.50
            };

            setQuotes(prev => [...prev, newQuote]);

            // Remove after animation completes
            setTimeout(() => {
                setQuotes(prev => prev.filter(q => q.id !== id));
            }, duration);
        };

        // Spawn first few quickly
        const initialTimers = [
            setTimeout(spawnQuote, 500),
            setTimeout(spawnQuote, 1800),
            setTimeout(spawnQuote, 3200),
        ];

        // Then spawn on interval
        const interval = setInterval(spawnQuote, 3500 + Math.random() * 2000);

        return () => {
            initialTimers.forEach(clearTimeout);
            clearInterval(interval);
        };
    }, [getUniqueQuoteIndex]);

    return (
        <div className="shakespeare-floating-quotes-overlay">
            {quotes.map(q => (
                <span
                    key={q.id}
                    className="shakespeare-floating-quote"
                    style={{
                        left: `${q.x}%`,
                        top: `${q.y}%`,
                        transform: `rotate(${q.rotation}deg)`,
                        animationDuration: `${q.duration}ms`,
                        fontSize: `${q.fontSize}rem`,
                        '--quote-peak-opacity': q.opacity,
                    } as React.CSSProperties}
                >
                    "{q.text}"
                </span>
            ))}
        </div>
    );
};


export const VintageNotebook: React.FC = () => {
    const bookRef = useRef<HTMLDivElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        if (!bookRef.current || !wrapperRef.current) return;

        let flip: any = null;

        const initFlip = () => {
            console.log('INIT_FLIP_START');
            try {
                const container = bookRef.current!;
                console.log('CONTAINER_FOUND:', container);
                while (container.firstChild) container.removeChild(container.firstChild);
                console.log('CONTAINER_CLEARED');

                // 2. Create High-Fidelity Pages (Total: 22 with covers)
                const pagesData: any[] = [
                    { type: 'cover', title: 'Shakespearean\nLove', subtitle: 'A Vintage Collection' },
                    { 
                        type: 'rj-intro',
                        title: 'Romeo & Juliet',
                        subtitle: 'Love, Draped in Renaissance',
                        content: 'A fashion collection born from the eternal passion of Shakespeare\'s star-cross\'d lovers — garments woven with the spirit of Italian Renaissance, where every silhouette whispers of Verona\'s moonlit balconies and forbidden devotion.'
                    },
                    { 
                        type: 'rj-image',
                        imageSrc: romeoJulietImg
                    },
                    { 
                        type: 'sketch', 
                        title: 'The Globe',
                        content: 'A rough sketch of where our stories come alive. The wooden O, holding the universe within its walls.'
                    }
                ];

                // Add blank pages to reach 20 content pages
                for (let i = pagesData.length; i <= 20; i++) {
                    pagesData.push({ type: 'blank' });
                }

                // Add closing and back cover
                pagesData.push({ 
                    type: 'closing', 
                    title: 'Finis',
                    content: 'All the world\'s a stage,\nAnd all the men and women merely players.'
                });
                pagesData.push({ type: 'back', title: 'The End' });

                const pageElements: HTMLElement[] = [];

                pagesData.forEach((data, index) => {
                    const page = document.createElement('div');
                    page.className = 'shakespeare-page';
                    
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
                            <div class="shakespeare-content" style="justify-content: flex-start; align-items: center; text-align: center; padding-top: 55px; width: 100%;">
                                <h1 class="shakespeare-title" style="color: #d4af37; border: none; font-size: 2.2rem; margin-bottom: 0.1rem; line-height: 1.1; letter-spacing: 2px; width: 100%; margin-left: 0; margin-right: 0;">${(data.title || '').replace('\n', '<br>')}</h1>
                                ${data.subtitle ? `<p style="color: #d4af37; opacity: 0.6; font-family: 'Cinzel'; font-size: 0.8rem; letter-spacing: 1px; width: 100%; margin-left: 0; margin-right: 0;">${data.subtitle}</p>` : ''}
                            </div>
                            <div class="shakespeare-spine-crease"></div>
                        `;
                        page.dataset.density = 'hard';
                    } else if (index === pagesData.length - 1) {
                        page.classList.add('shakespeare-cover-back');
                        page.dataset.side = 'left';
                        page.innerHTML = `
                            <div class="shakespeare-leather-texture"></div>
                            <div class="shakespeare-gold-frame"></div>
                            <div class="shakespeare-page-lighting"></div>
                            <div class="shakespeare-content" style="justify-content: center; align-items: center;">
                                <h2 class="shakespeare-title" style="color: #d4af37; border: none;">${data.title || ''}</h2>
                            </div>
                            <div class="shakespeare-spine-crease"></div>
                        `;
                        page.dataset.density = 'hard';
                    } else if (data.type === 'rj-intro') {
                        /* ── Page 1: Romeo & Juliet Intro ── */
                        const side = index % 2 !== 0 ? 'left' : 'right';
                        page.dataset.side = side;
                        page.innerHTML = `
                            <div class="shakespeare-page-bg" style="background-image: url('${pageBg}')"></div>
                            <div class="shakespeare-paper-texture"></div>
                            <div class="shakespeare-page-lighting"></div>
                            <div class="shakespeare-content shakespeare-rj-intro-content">
                                <div class="shakespeare-rj-ornament-top">✦</div>
                                <h2 class="shakespeare-rj-heading">${data.title}</h2>
                                <div class="shakespeare-rj-divider">
                                    <span class="shakespeare-rj-divider-line"></span>
                                    <span class="shakespeare-rj-divider-rose">🌹</span>
                                    <span class="shakespeare-rj-divider-line"></span>
                                </div>
                                <h3 class="shakespeare-rj-subheading">${data.subtitle}</h3>
                                <p class="shakespeare-rj-description">${data.content}</p>
                                <div class="shakespeare-rj-ornament-bottom">— Shakespearean Love —</div>
                                <div class="shakespeare-page-number">${index}</div>
                            </div>
                            <div class="shakespeare-spine-crease"></div>
                        `;
                    } else if (data.type === 'rj-image') {
                        /* ── Page 2: Romeo & Juliet Image ── */
                        const side = index % 2 !== 0 ? 'left' : 'right';
                        page.dataset.side = side;
                        page.innerHTML = `
                            <div class="shakespeare-page-bg" style="background-image: url('${pageBg}')"></div>
                            <div class="shakespeare-paper-texture"></div>
                            <div class="shakespeare-page-lighting"></div>
                            <div class="shakespeare-content shakespeare-rj-image-content">
                                <div class="shakespeare-rj-image-frame">
                                    <img src="${data.imageSrc}" class="shakespeare-rj-image" alt="Romeo and Juliet — Shakespearean Love" />
                                </div>
                                <div class="shakespeare-page-number">${index}</div>
                            </div>
                            <div class="shakespeare-spine-crease"></div>
                        `;
                    } else {
                        const side = index % 2 !== 0 ? 'left' : 'right';
                        page.dataset.side = side;
                        page.innerHTML = `
                            <div class="shakespeare-page-bg" style="background-image: url('${pageBg}')"></div>
                            <div class="shakespeare-paper-texture"></div>
                            <div class="shakespeare-page-lighting"></div>
                            <div class="shakespeare-content">
                                ${data.date ? `<div class="shakespeare-date">${data.date}</div>` : ''}
                                ${data.title ? `<h2 class="shakespeare-title">${data.title}</h2>` : ''}
                                ${data.type === 'poem' ? `<div class="shakespeare-poem">${data.content?.replace(/\n/g, '<br>')}</div>` : ''}
                                ${data.type === 'letter' ? `<div class="shakespeare-letter">${data.content}</div><div class="shakespeare-signature">W.S.</div>` : ''}
                                ${data.type === 'sketch' || data.type === 'closing' ? `<div class="shakespeare-letter" style="text-align: center; margin-top: 40px;">${data.content?.replace(/\n/g, '<br>')}</div>` : ''}
                                ${data.type === 'blank' ? `<div style="flex: 1; display: flex; align-items: center; justify-content: center; opacity: 0.05; font-style: italic;">(this page intentionally left blank)</div>` : ''}
                                <div class="shakespeare-page-number">${index}</div>
                            </div>
                            <div class="shakespeare-spine-crease"></div>
                        `;
                    }

                    container.appendChild(page);
                    pageElements.push(page);
                });


                // 3. Initialize Engine
                flip = new PageFlip(container, {
                    width: 550,
                    height: 680, // Reduced height to fit viewport better
                    size: "stretch",
                    minWidth: 315,
                    maxWidth: 1000,
                    minHeight: 400,
                    maxHeight: 1000, // Capped max height
                    maxShadowOpacity: 0.5,
                    showCover: true,
                    mobileScrollSupport: false
                });

                console.log('LOADING_PAGES:', pageElements.length);
                try {
                    flip.loadFromHTML(pageElements);
                    console.log('FLIP_LOADED_SUCCESSFULLY');
                } catch (loadErr) {
                    console.error('FLIP_LOAD_ERROR:', loadErr);
                    throw loadErr;
                }
                
                if (wrapperRef.current) {
                    wrapperRef.current.style.opacity = '1';
                    console.log('WRAPPER_VISIBLE');
                }

            } catch (err: any) {
                console.error('SHAKESPEARE_ENGINE_CRASH:', err);
                setIsError(true);
            }
        };

        // Small delay to ensure React has finished painting the initial DOM structure
        const timer = setTimeout(initFlip, 100);

        const handleResize = () => {
            if (flip) flip.updateFromHtml(Array.from(bookRef.current?.children || []) as HTMLElement[]);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            clearTimeout(timer);
            window.removeEventListener('resize', handleResize);
            if (flip) {
                try { flip.destroy(); } catch (e) {}
            }
        };
    }, []);

    return (
        <div className="shakespeare-stage">
            {/* ── Floating Quotes Overlay ── */}
            <FloatingQuotes />

            <a href="/" className="shakespeare-nav-link">
                Close Notebook
            </a>
            
            {isError ? (
                <div style={{ border: '1px solid #4a1c14', padding: '40px', background: 'rgba(74, 28, 20, 0.2)', textAlign: 'center', backdropFilter: 'blur(20px)' }}>
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
