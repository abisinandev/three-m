
interface FeaturePointProps {
  text: string;
}


export const FeaturePoint: React.FC<FeaturePointProps> = ({ text }) => (
  <div className="flex items-center space-x-3 group">
    <div className="w-2 h-2 bg-teal-green rounded-full group-hover:scale-125 transition-transform duration-200"></div>
    <span className="text-cool-white/90 group-hover:text-teal-green transition-colors duration-200">
      {text}
    </span>
  </div>
);