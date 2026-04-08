import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });
  const isHovering = useRef(false);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

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
      });

      requestAnimationFrame(animate);
    };

    const onMouseEnterLink = () => {
      if (isHovering.current) return;
      isHovering.current = true;
      gsap.to(cursor, {
        width: 60,
        height: 60,
        backgroundColor: 'rgba(255,255,255,0.9)',
        borderColor: 'rgba(255,255,255,0.9)',
        duration: 0.4,
        ease: 'power3.out',
      });
    };

    const onMouseLeaveLink = () => {
      isHovering.current = false;
      gsap.to(cursor, {
        width: 20,
        height: 20,
        backgroundColor: 'transparent',
        borderColor: 'rgba(255,255,255,1)',
        duration: 0.4,
        ease: 'power3.out',
      });
    };

    window.addEventListener('mousemove', onMouseMove);
    animate();

    // Observe DOM for clickable elements
    const addHoverListeners = () => {
      const clickables = document.querySelectorAll(
        'a, button, .project-item-name, [data-cursor-hover]'
      );
      clickables.forEach((el) => {
        el.addEventListener('mouseenter', onMouseEnterLink);
        el.addEventListener('mouseleave', onMouseLeaveLink);
      });
      return clickables;
    };

    // Initial + observe mutations
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
      observer.disconnect();
      clickables.forEach((el) => {
        el.removeEventListener('mouseenter', onMouseEnterLink);
        el.removeEventListener('mouseleave', onMouseLeaveLink);
      });
    };
  }, []);

  return <div ref={cursorRef} className="custom-cursor" />;
}
