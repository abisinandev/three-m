import React from 'react';

export const Skeleton = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={`animate-pulse rounded bg-[#1f1f1f] ${className ?? ''}`} {...props} />
);
