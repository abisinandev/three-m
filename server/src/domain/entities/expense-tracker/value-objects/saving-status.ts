import { SavingsState } from "../types/expense-tracker.types";

export class SavingsStatus {
    private readonly _targetAmount: number;
    private readonly _actualAmount: number;
    private readonly _gapAmount: number;
    private readonly _status: SavingsState;

    public constructor(
        target: number,
        actual: number,
        gap: number,
        status: SavingsState
    ) {
        this._targetAmount = target;
        this._actualAmount = actual;
        this._gapAmount = gap;
        this._status = status;
    }

    static empty(target: number): SavingsStatus {
        return new SavingsStatus(target, 0, target, 'MISSED');
    }

    static fromActual(target: number, actual: number): SavingsStatus {
        if (actual >= target) {
            return new SavingsStatus(
                target,
                actual,
                actual - target,
                actual === target ? 'MET' : 'EXCEEDED'
            );
        }

        return new SavingsStatus(
            target,
            actual,
            target - actual,
            'MISSED'
        );
    }

    get targetAmount(): number {
        return this._targetAmount;
    }

    get actualAmount(): number {
        return this._actualAmount;
    }

    get gapAmount(): number {
        return this._gapAmount;
    }

    get status(): SavingsState {
        return this._status;
    }
}
