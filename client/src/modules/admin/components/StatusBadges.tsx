import type { KycUser } from "@shared/types/user/KycUserType";

export const StatusBadge = ({ status }: { status: KycUser["status"] }) => {
  switch (status) {
    case "verified":
      return (
        <span className="inline-block px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-white bg-green-600 rounded">
          Approved
        </span>
      );

    case "pending":
      return (
        <span className="inline-block px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-white bg-orange-500 rounded">
          Pending
        </span>
      );

    case "rejected":
      return (
        <span className="inline-block px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-white bg-red-600 rounded">
          Rejected
        </span>
      );

    default:
      return (
        <span className="inline-block px-2.5 py-1 text-[11px] font-medium text-gray-400">
          —
        </span>
      );
  }
};