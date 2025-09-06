import { useIonToast } from "@ionic/react";

export interface IToasterProps {
    message: string;
    duration?: number;
    position: 'top' | 'middle' | 'bottom';
    color: 'success' | 'danger' | 'warning' | 'primary' | 'secondary' | 'tertiary' | 'light' | 'medium' | 'dark';
}
export const useToaster = () => {
    const [present, dismiss] = useIonToast();
    const presentToaster = ({
        message = '',
        duration = 3000,
        position = 'bottom',
        color = 'success',
    }: IToasterProps) => {
        present({ message, duration, position, color });
    };

    const successToaster = (message: string, duration: number = 3000) => {
        presentToaster({ message, duration: duration, position: 'bottom', color: 'success' });
    }
    const dangerToaster = (message: string, duration: number = 3000) => {
        presentToaster({ message, duration: duration, position: 'bottom', color: 'danger' });
    }
    const warningToaster = (message: string, duration: number = 3000) => {
        presentToaster({ message, duration: duration, position: 'bottom', color: 'warning' });
    }
    const primaryToaster = (message: string, duration: number = 3000) => {
        presentToaster({ message, duration: duration, position: 'bottom', color: 'primary' });
    }
    const secondaryToaster = (message: string, duration: number = 3000) => {
        presentToaster({ message, duration: duration, position: 'bottom', color: 'secondary' });
    }
    const tertiaryToaster = (message: string, duration: number = 3000) => {
        presentToaster({ message, duration: duration, position: 'bottom', color: 'tertiary' });
    }
    const lightToaster = (message: string, duration: number = 3000) => {
        presentToaster({ message, duration: duration, position: 'bottom', color: 'light' });
    }
    const mediumToaster = (message: string, duration: number = 3000) => {
        presentToaster({ message, duration: duration, position: 'bottom', color: 'medium' });
    }
    const darkToaster = (message: string, duration: number = 3000) => {
        presentToaster({ message, duration: duration, position: 'bottom', color: 'dark' });
    }
    return { successToaster, dangerToaster, warningToaster, primaryToaster, secondaryToaster, tertiaryToaster, lightToaster, mediumToaster, darkToaster };
}
