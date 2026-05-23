interface BlockchainFeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export const BlockchainFeature: React.FC<BlockchainFeatureProps> = ({ icon, title, description }) => (
  <div className="text-center group">
    <div className="w-12 h-12 bg-teal-green/20 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-teal-green/30 transition-colors duration-200">
      {icon}
    </div>
    <h4 className="font-semibold mb-2 group-hover:text-teal-green transition-colors duration-200">
      {title}
    </h4>
    <p className="text-cool-white/70 text-sm">{description}</p>
  </div>
);