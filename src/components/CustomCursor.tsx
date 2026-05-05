import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import gsap from 'gsap';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const pos = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });
  const isHovering = useRef(false);
  const isHome = location.pathname === '/';

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    // Reset cursor shape when route changes
    if (isHome) {
      gsap.to(cursor, {
        width: 14,
        height: 28,
        borderRadius: '0%',
        backgroundColor: 'transparent',
        borderColor: 'rgba(255,255,255,1)',
        duration: 0.6,
        ease: 'expo.out'
      });
    } else {
      gsap.to(cursor, {
        width: 20,
        height: 20,
        borderRadius: '50%',
        backgroundColor: 'transparent',
        borderColor: 'rgba(255,255,255,1)',
        duration: 0.6,
        ease: 'expo.out'
      });
    }

    const onMouseMove = (e: MouseEvent) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
    };

    const animate = () => {
      pos.current.x += (target.current.x - pos.current.x) * 0.12;
      pos.current.y += (target.current.y - pos.current.y) * 0.12;

      gsap.set(cursor, {
        x: pos.current.x,
        y: pos.current.y,
        // Add subtle rotation for the rectangular cursor on home
        rotate: isHome ? (target.current.x - pos.current.x) * 0.5 : 0
      });

      requestAnimationFrame(animate);
    };

    const onMouseEnterLink = () => {
      if (isHovering.current) return;
      isHovering.current = true;
      gsap.to(cursor, {
        width: isHome ? 40 : 60,
        height: isHome ? 40 : 60,
        borderRadius: isHome ? '4px' : '50%',
        backgroundColor: 'rgba(255,255,255,0.9)',
        borderColor: 'rgba(255,255,255,0.9)',
        duration: 0.4,
        ease: 'power3.out',
      });
    };

    const onMouseLeaveLink = () => {
      isHovering.current = false;
      gsap.to(cursor, {
        width: isHome ? 14 : 20,
        height: isHome ? 28 : 20,
        borderRadius: isHome ? '0%' : '50%',
        backgroundColor: 'transparent',
        borderColor: 'rgba(255,255,255,1)',
        duration: 0.4,
        ease: 'power3.out',
      });
    };

    window.addEventListener('mousemove', onMouseMove);
    const rafId = requestAnimationFrame(animate);

    const addHoverListeners = () => {
      const clickables = document.querySelectorAll(
        'a, button, .project-item-name, [data-cursor-hover], .project-item, .monolith-frame'
      );
      clickables.forEach((el) => {
        el.addEventListener('mouseenter', onMouseEnterLink);
        el.addEventListener('mouseleave', onMouseLeaveLink);
      });
      return clickables;
    };

    let clickables = addHoverListeners();

    const observer = new MutationObserver(() => {
      clickables.forEach((el) => {
        el.removeEventListener('mouseenter', onMouseEnterLink);
        el.removeEventListener('mouseleave', onMouseLeaveLink);
      });
      clickables = addHoverListeners();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(rafId);
      observer.disconnect();
      clickables.forEach((el) => {
        el.removeEventListener('mouseenter', onMouseEnterLink);
        el.removeEventListener('mouseleave', onMouseLeaveLink);
      });
    };
  }, [isHome]); // Re-run when switching between home and other routes

  return <div ref={cursorRef} className="custom-cursor" />;
}
