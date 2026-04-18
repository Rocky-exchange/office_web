'use client';

import { useEffect, useId, useRef, useState } from 'react';

import { faqItems } from '@/content/homepage';

type FaqItemProps = {
  answer: string;
  index: number;
  isOpen: boolean;
  question: string;
  onToggle: () => void;
};

function FaqItem({ answer, index, isOpen, question, onToggle }: FaqItemProps) {
  const contentId = useId();
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(index === 0 ? 'auto' : '0px');

  useEffect(() => {
    const element = contentRef.current;

    if (!element) {
      return;
    }

    if (isOpen) {
      const currentHeight = element.getBoundingClientRect().height;
      const nextHeight = element.scrollHeight;

      if (Math.abs(currentHeight - nextHeight) < 1) {
        setHeight('auto');
        return;
      }

      setHeight(`${currentHeight}px`);

      const animationFrame = requestAnimationFrame(() => {
        setHeight(`${nextHeight}px`);
      });

      const handleTransitionEnd = () => {
        setHeight('auto');
      };

      element.addEventListener('transitionend', handleTransitionEnd, {
        once: true,
      });

      return () => {
        cancelAnimationFrame(animationFrame);
        element.removeEventListener('transitionend', handleTransitionEnd);
      };
    }

    const currentHeight = element.getBoundingClientRect().height;

    if (currentHeight === 0) {
      setHeight('0px');
      return;
    }

    setHeight(`${currentHeight}px`);

    const animationFrame = requestAnimationFrame(() => {
      setHeight('0px');
    });

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [isOpen]);

  return (
    <div className={`faq-item${isOpen ? ' is-open' : ''}`}>
      <button
        type="button"
        className="faq-question"
        aria-expanded={isOpen}
        aria-controls={contentId}
        onClick={onToggle}
      >
        {question}
      </button>

      <div
        id={contentId}
        ref={contentRef}
        className="faq-answer"
        style={{ height }}
      >
        <div className="faq-answer__inner">
          <p>{answer}</p>
        </div>
      </div>
    </div>
  );
}

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faq" className="faq-section">
      <div className="section-intro">
        <p className="eyebrow">FAQ</p>
        <h2>Frequently Asked Questions</h2>
      </div>

      <div className="faq-list">
        {faqItems.map((item, index) => (
          <FaqItem
            key={item.question}
            index={index}
            question={item.question}
            answer={item.answer}
            isOpen={openIndex === index}
            onToggle={() =>
              setOpenIndex((currentIndex) =>
                currentIndex === index ? -1 : index,
              )
            }
          />
        ))}
      </div>
    </section>
  );
}
