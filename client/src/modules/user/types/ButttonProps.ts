export type ButtonProps = {
    text: string;
    onClick?: () => void;
    disabled?: boolean;
    loading?: boolean;
    type?: "button" | "submit";
}
