export interface Action<T> {
    label: string | ((row: T) => string);
    className?: string | ((row: T) => string);
    onClick: (row: T) => void;
}