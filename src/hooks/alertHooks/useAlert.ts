import { useIonAlert } from "@ionic/react";

export interface IAlertProps {
    message: string;
    header: string;
    buttons: Function[];
    onDidDismiss?: Function;
    confirmButtonText?: string;
    cancelButtonText?: string;
}
export const defaultAlertProps: IAlertProps = {
    message: '',
    header: '',
    buttons: [],
    onDidDismiss: () => {},
    confirmButtonText: 'OK',
    cancelButtonText: 'Cancel',
}
export const useAlert = () => {
    const [present, dismiss] = useIonAlert();
    const presentAlert = ({
        message = '',
        header = '',
        buttons = [],
        onDidDismiss = () => {},
        confirmButtonText = 'OK',
        cancelButtonText = 'Cancel',
    }: IAlertProps) => {
        present({
            header: header,
            message: message,
            buttons: buttons.length > 1 ? [
              {
                text: confirmButtonText,
                htmlAttributes: {
                  'aria-label': 'close',
                },
                role: 'confirm',
                handler: () => {
                  buttons[0]();
                },
              },
              {
                text: cancelButtonText,
                htmlAttributes: {
                  'aria-label': 'close',
                },
                role: 'cancel',
                handler: () => {
                  buttons[1]();
                },
              },
            ]:[
              {
                text: cancelButtonText,
                htmlAttributes: {
                  'aria-label': 'close',
                },
                role: 'cancel',
                handler: () => {
                  buttons[0]();
                },
              },
            ],
        });
    };
     
    return { presentAlert, dismiss };
}