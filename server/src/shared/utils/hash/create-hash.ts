import crypto from "node:crypto";

export const createRequestHash = (
    body: unknown
): string => {

    return crypto
        .createHash("sha256")
        .update(JSON.stringify(body))
        .digest("hex");
};