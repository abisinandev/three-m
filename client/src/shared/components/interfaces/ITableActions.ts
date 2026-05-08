export interface Action<T> {
    label: React.ReactNode;
    className?: string | ((row: T) => string);
    onClick: (row: T) => void;
}