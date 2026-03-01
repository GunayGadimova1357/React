import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  title: string;
  message: string;
  icon: LucideIcon | React.ElementType; 
}

export const EmptyState = ({ title, message, icon: Icon }: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center py-10 px-4 rounded-xl bg-[#121212] border border-[#ffffff05] text-center w-full">
    <div className="w-16 h-16 mb-4 rounded-full bg-[#1e1e1e] flex items-center justify-center">
      <Icon size={32} className="text-gray-400" strokeWidth={1.5} />
    </div>
    <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>
    <p className="text-sm text-gray-400 max-w-[250px] leading-relaxed">
      {message}
    </p>
  </div>
);

export const renderSkeleton = () => (
    <div className="flex gap-4 overflow-hidden scrollbar-hide">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="min-w-[180px] animate-pulse">
          <div className="w-[180px] h-[180px] bg-[#282828] rounded-md mb-4" />
          <div className="h-4 bg-[#282828] rounded w-3/4 mb-2" />
          <div className="h-3 bg-[#282828] rounded w-1/2" />
        </div>
      ))}
    </div>
  );