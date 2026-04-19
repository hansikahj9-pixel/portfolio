import { useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { cn } from '../utils/cn';

interface Project {
  name: string;
  details: string;
  color: string;
}

const projects: Project[] = [
  { name: 'AXIOME', details: 'SS 2025–2026', color: '#C3C1B9' },
  { name: 'Shakespearean Love', details: 'Collection', color: '#A89F91' },
  { name: '3D Design', details: 'Norse Mythology', color: '#8B8579' },
  { name: 'The Art of Abstract', details: 'Visual Study', color: '#9C9587' },
  {
    name: 'Fashion Styling',
    details: 'My Mother is a Biker & Stages of Grief',
    color: '#B5AFA3',
  },
  {
    name: 'Visual Merchandising',
    details: 'Loewe Pop-Up & Guo Pei',
    color: '#AEA89C',
  },
  { name: 'The Cosmic Beach', details: 'Creative Direction', color: '#C3C1B9' },
];

interface ProjectListProps {
  onHover: (project: Project | null, mouseX: number, mouseY: number) => void;
}

export default function ProjectList({ onHover }: ProjectListProps) {
  const navigate = useNavigate();
  const listRef = useRef<HTMLUListElement>(null);
  const itemsRef = useRef<HTMLLIElement[]>([]);

  const setItemRef = useCallback(
    (el: HTMLLIElement | null, index: number) => {
      if (el) itemsRef.current[index] = el;
    },
    []
  );

  useEffect(() => {
    const items = itemsRef.current;

    // Stagger entrance animation
    gsap.fromTo(
      items,
      { y: 60, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: undefined,
        delay: 1.5,
      }
    );
  }, []);

  return (
    <section className="projects-section">
      <div className="projects-header">
        <h2>Selected Works</h2>
      </div>
      <ul className="projects-list" ref={listRef}>
        {projects.map((project, i) => (
          <li
            key={project.name}
            ref={(el) => setItemRef(el, i)}
            className="project-item-wrapper"
          >
            <button
              className={cn(
                "project-item w-full text-left outline-none focus-visible:ring-2 focus-visible:ring-accent/50",
                project.name === 'AXIOME' ? "cursor-pointer" : "cursor-default"
              )}
              data-cursor-hover
              aria-label={`View project: ${project.name}, ${project.details}`}
              onClick={() => {
                if (project.name === 'AXIOME') {
                  navigate('/axiome');
                }
              }}
              onMouseEnter={(e) => onHover(project, e.clientX, e.clientY)}
              onMouseMove={(e) => onHover(project, e.clientX, e.clientY)}
              onMouseLeave={() => onHover(null, 0, 0)}
            >
              <span className="project-item-index" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="project-item-name">{project.name}</span>
              <span className="project-item-details">{project.details}</span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

export type { Project };
