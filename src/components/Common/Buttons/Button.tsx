import { IonButton, IonSpinner } from "@ionic/react";
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
    showLoader?: boolean;
}
const PadaiButton: React.FC<IPadaiButtonProps> = ({ children, onClick, disabled, className, color, size, type, shape, fill, expand,showLoader }) => {
    return (
        <IonButton 
            onClick={onClick}
            disabled={disabled || showLoader}
            className={`${className} ${size === "large" ? "padAIbuttonLarge" : ""} padAIdefaultButtonDesign`}
            color={color}
            size={size}
            type={type}
            shape={shape}
            fill={fill}
            expand={expand}
            
        >
            {showLoader ? <IonSpinner name="crescent" /> : children}
        </IonButton>
    );
};

export default PadaiButton;
