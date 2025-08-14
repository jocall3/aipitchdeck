
import React, { useState } from 'react';
import { Slide } from '../types';

interface SlideCardProps {
  slide: Slide;
  index: number;
}

export const SlideCard: React.FC<SlideCardProps> = ({ slide, index }) => {
  const [copiedStates, setCopiedStates] = useState<{ title: boolean, content: boolean, notes: boolean }>({ title: false, content: false, notes: false });

  const handleCopy = (textToCopy: string, type: 'title' | 'content' | 'notes') => {
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopiedStates(prev => ({ ...prev, [type]: true }));
      setTimeout(() => setCopiedStates(prev => ({ ...prev, [type]: false })), 2000);
    }).catch(err => {
      console.error('Failed to copy text: ', err);
      alert('Failed to copy text. See console for details.');
    });
  };

  const CopyButton: React.FC<{ text: string, onClick: () => void, copied: boolean, areaLabel: string }> = ({ text, onClick, copied, areaLabel }) => (
    <button
      onClick={onClick}
      title={`Copy ${text}`}
      aria-label={`Copy ${areaLabel}`}
      className={`ml-2 p-1.5 rounded-md ${copied ? 'bg-green-600' : 'bg-slate-600 hover:bg-slate-500'} text-white transition-all text-xs`}
    >
      {copied ? (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 4.625v2.625m0 0H12m3.75 0l-3.75-3.75M12 17.25v-2.625" />
        </svg>
      )}
    </button>
  );

  return (
    <div className="bg-slate-700 bg-opacity-80 p-6 rounded-lg shadow-xl hover:shadow-indigo-500/30 transition-shadow duration-300">
      {slide.imageUrl && (
        <div className="mb-4 rounded-md overflow-hidden shadow-lg">
          <img 
            src={slide.imageUrl} 
            alt={`Generated visual for slide: ${slide.title}`} 
            className="w-full h-auto object-cover max-h-72" 
            loading="lazy"
          />
        </div>
      )}
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xl font-semibold text-indigo-300">
          Slide {index + 1}: {slide.title}
        </h3>
        <CopyButton text="Title" onClick={() => handleCopy(slide.title, 'title')} copied={copiedStates.title} areaLabel={`slide ${index + 1} title`} />
      </div>

      <div className="mb-4">
        <div className="flex justify-between items-center">
            <h4 className="text-sm font-medium text-slate-400 uppercase tracking-wider">Content</h4>
            <CopyButton text="Content" onClick={() => handleCopy(slide.content.join('\n'), 'content')} copied={copiedStates.content} areaLabel={`slide ${index + 1} content`} />
        </div>
        <ul className="mt-2 list-disc list-inside space-y-1 text-slate-200 pl-2">
          {slide.content.map((point, i) => (
            <li key={i} className="text-sm leading-relaxed">{point}</li>
          ))}
        </ul>
        {slide.content.length === 0 && <p className="text-sm text-slate-400 italic">No content points generated for this slide.</p>}
      </div>

      <div>
        <div className="flex justify-between items-center">
            <h4 className="text-sm font-medium text-slate-400 uppercase tracking-wider">Speaker Notes</h4>
            <CopyButton text="Speaker Notes" onClick={() => handleCopy(slide.speakerNotes, 'notes')} copied={copiedStates.notes} areaLabel={`slide ${index + 1} speaker notes`} />
        </div>
        <p className="mt-2 text-xs text-slate-300 bg-slate-600 bg-opacity-50 p-3 rounded-md leading-relaxed whitespace-pre-wrap font-mono">
          {slide.speakerNotes || <span className="italic">No speaker notes generated.</span>}
        </p>
      </div>
    </div>
  );
};
