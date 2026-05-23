import { StatusBadge } from "@shared/components/buttons/StatusStyle";
import type { Column } from "@shared/components/interfaces/ITableColumn"
import type { User } from "@shared/components/interfaces/IUserTable"

export const columns: Column<User>[] = [
    { header: "User ID", accessor: "userCode" },
    { header: "Name", accessor: "fullName" },
    { header: "Email", accessor: "email" },
    {
        header: "Status",
        accessor: "isBlocked",
        render: (user) => (
            <StatusBadge status={user.isBlocked ? "Blocked" : "Active"} />
        ),
    },
    {
        header: "Verified",
        accessor: "isVerified",
        render: (user) => (user.isVerified ? "Verified" : "Not verified"),
    },
    { header: "Joined", accessor: "createdAt" },
];