export interface Action<T> {
    label: any;
    className?: string | ((row: T) => string);
    onClick: (row: T) => void;
}