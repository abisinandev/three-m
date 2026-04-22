import React from 'react';

export function renderMarkdown(text: string) {
    const lines = text.split('\n');
    const elements: React.ReactNode[] = [];

    lines.forEach((line, i) => {
        const key = i;

        const numberedMatch = line.match(/^(\d+)\.\s+(.+)/);
        if (numberedMatch) {
            elements.push(
                <div key={key} className="flex gap-2 mt-1.5 first:mt-0">
                    <span className="text-green-500 font-bold text-[10px] shrink-0 mt-0.5">{numberedMatch[1]}.</span>
                    <span className="text-[10px] leading-relaxed" dangerouslySetInnerHTML={{ __html: boldify(numberedMatch[2]) }} />
                </div>
            );
            return;
        }

        const bulletMatch = line.match(/^[-•]\s+(.+)/);
        if (bulletMatch) {
            elements.push(
                <div key={key} className="flex gap-2 mt-1 first:mt-0">
                    <span className="text-neutral-500 text-[10px] shrink-0 mt-0.5">•</span>
                    <span className="text-[10px] leading-relaxed" dangerouslySetInnerHTML={{ __html: boldify(bulletMatch[1]) }} />
                </div>
            );
            return;
        }

        if (/^\*\*.*\*\*$/.test(line.trim())) {
            elements.push(
                <p key={key} className="text-[10px] font-bold text-neutral-200 mt-3 first:mt-0 uppercase tracking-wide">
                    {line.replace(/\*\*/g, '')}
                </p>
            );
            return;
        }

        if (line.trim() === '') {
            elements.push(<div key={key} className="h-1" />);
            return;
        }

        elements.push(
            <p key={key} className="text-[10px] leading-relaxed" dangerouslySetInnerHTML={{ __html: boldify(line) }} />
        );
    });

    return <>{elements}</>;
}

function boldify(text: string): string {
    return text.replace(/\*\*(.+?)\*\*/g, '<strong class="text-neutral-100 font-semibold">$1</strong>');
}
