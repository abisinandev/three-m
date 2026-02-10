export const NewsSkeleton = () => {
    return (
        <div className="space-y-4 w-full">
            {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex flex-col sm:flex-row gap-5 p-5 bg-black rounded-2xl border border-[#2d2d2d] animate-pulse">
                    {/* Image Skeleton */}
                    <div className="w-full sm:w-44 h-32 sm:h-32 flex-shrink-0 bg-[#111111] rounded-xl" />

                    <div className="flex flex-col flex-grow py-1">
                        {/* Meta Skeleton */}
                        <div className="flex items-center gap-2 mb-3">
                            <div className="h-4 w-20 bg-[#111111] rounded" />
                            <div className="h-4 w-16 bg-[#111111] rounded" />
                        </div>

                        {/* Title Skeleton */}
                        <div className="h-5 w-full bg-[#111111] rounded mb-3" />
                        <div className="h-5 w-3/4 bg-[#111111] rounded mb-4" />

                        {/* Description Skeleton */}
                        <div className="h-3 w-full bg-[#111111] rounded mb-2 opacity-50" />
                        <div className="h-3 w-2/3 bg-[#111111] rounded opacity-50" />
                    </div>
                </div>
            ))}
        </div>
    );
};

export const SidebarSkeleton = () => {
    return (
        <div className="space-y-6 w-full animate-pulse">
            <div className="h-40 bg-black border border-[#2d2d2d] rounded-2xl" />
            <div className="h-60 bg-black border border-[#2d2d2d] rounded-2xl" />
            <div className="h-32 bg-black border border-[#2d2d2d] rounded-2xl" />
        </div>
    );
};
