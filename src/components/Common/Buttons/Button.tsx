import { IonButton } from "@ionic/react";
import './Button.css';
export interface IPadaiButtonProps {
    children: React.ReactNode;
    onClick: (e: any) => void;
    disabled?: boolean;
    className?: string;
    color?: 'primary' | 'secondary' | 'tertiary' | 'success' | 'warning' | 'danger' | 'light' | 'medium' | 'dark' ;
    size?: "small" | "large" | "default" | undefined;
    type?: 'button' | 'submit' | 'reset';
    shape?: 'round';
    fill?: 'solid' | 'outline' | 'clear';
    expand?: 'block' | 'full';
}
const PadaiButton: React.FC<IPadaiButtonProps> = ({ children, onClick, disabled, className, color, size, type, shape, fill, expand }) => {
    return (
        <IonButton
            onClick={onClick}
            disabled={disabled}
            className={`${className} ${size === "large" ? "padAIbuttonLarge" : ""} padAIdefaultButtonDesign`}
            color={color}
            size={size}
            type={type}
            shape={shape}
            fill={fill}
            expand={expand}
        >
            {children}
        </IonButton>
    );
};

export default PadaiButton;
