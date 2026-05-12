import { useEffect, useRef, useState } from 'react';
import { PageFlip } from 'page-flip';
import pageBg from '../../assets/page.jpg';
import coverCenterpiece from '../../assets/Collection.png';
import './VintageNotebook.css';

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
                        type: 'poem', 
                        title: 'Sonnet 18', 
                        content: 'Shall I compare thee to a summer’s day?\nThou art more lovely and more temperate:\nRough winds do shake the darling buds of May,\nAnd summer’s lease hath all too short a date...' 
                    },
                    { 
                        type: 'letter', 
                        date: 'April 23, 1609',
                        content: 'Dearest Love,\n\nIn the quiet of my chamber, your image remains the brightest light. Every word I pen is but a pale reflection of the beauty you possess.\n\nEver Yours,\nW.S.' 
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
                    content: 'All the world’s a stage,\nAnd all the men and women merely players.'
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
                                <p style="color: #d4af37; opacity: 0.6; font-family: 'Cinzel'; font-size: 0.8rem; letter-spacing: 1px; width: 100%; margin-left: 0; margin-right: 0;">${data.subtitle || ''}</p>
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
