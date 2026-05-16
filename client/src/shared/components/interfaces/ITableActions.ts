export interface Action<T> {
    label: React.ReactNode | ((row: T) => React.ReactNode);
    className?: string | ((row: T) => string);
    onClick: (row: T) => void;
}