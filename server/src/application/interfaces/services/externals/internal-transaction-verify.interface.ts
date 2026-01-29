export interface IInternalTransactionVerificationService {
    /**
     * Verifies and applies an internal transaction.
     *
     * - Validates hash & signature
     * - Locks wallet
     * - Debits / credits wallet
     * - Marks transaction VERIFIED
     * - Appends to ledger block
     *
     * @param txId - Transaction ID to verify
     * @throws ValidationError, NotFoundError
     */
    verify(txId: string): Promise<void>;
}