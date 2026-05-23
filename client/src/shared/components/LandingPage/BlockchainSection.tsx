import { ArrowRight, CheckCircle, Eye, Lock } from "lucide-react";
import { BlockchainStep } from "./BlockchainStep";
import { BlockchainFeature } from "./BlockchainFeature";

export const BlockchainSection: React.FC = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-card-dark/30">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-6">
          Trusted by Transparency. Secured by <span className="text-teal-green">Blockchain</span>.
        </h2>
        <p className="text-xl text-cool-white/80 mb-12 max-w-3xl mx-auto">
          Every transaction is recorded on an <span className="text-teal-green font-semibold">immutable</span> blockchain ledger, ensuring complete transparency and security for your financial data.
        </p>
        <div className="relative max-w-4xl mx-auto">
          <div className="flex items-center justify-center space-x-4 overflow-x-auto pb-4">
            <BlockchainStep number="1" label="Transaction" value="₹10,000 SIP" />
            <ArrowRight className="text-teal-green flex-shrink-0" />
            <BlockchainStep number="2" label="Verification" value="Encrypted" />
            <ArrowRight className="text-teal-green flex-shrink-0" />
            <BlockchainStep number="3" label="Immutable" value="Ledger" />
          </div>
          <div className="mt-8 grid md:grid-cols-3 gap-6">
            <BlockchainFeature
              icon={<Lock className="w-6 h-6 text-teal-green" />}
              title="Unbreakable Security"
              description="256-bit encryption with decentralized verification"
            />
            <BlockchainFeature
              icon={<Eye className="w-6 h-6 text-teal-green" />}
              title="Complete Transparency"
              description="Every transaction visible and verifiable"
            />
            <BlockchainFeature
              icon={<CheckCircle className="w-6 h-6 text-teal-green" />}
              title="Immutable Records"
              description="Permanent, tamper-proof transaction history"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
