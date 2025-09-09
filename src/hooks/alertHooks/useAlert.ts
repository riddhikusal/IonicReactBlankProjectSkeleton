import { useIonAlert } from "@ionic/react";

export interface IAlertProps {
    message: string;
    header: string;
    buttonsActions: Function[];
    onDidDismiss?: Function;
    confirmButtonText?: string;
    cancelButtonText?: string;
}
export const defaultAlertProps: IAlertProps = {
    message: '',
    header: '',
    buttonsActions: [],
    onDidDismiss: () => {},
    confirmButtonText: 'OK',
    cancelButtonText: 'Cancel',
}
export const useAlert = () => {
    const [present, dismiss] = useIonAlert();
    const presentAlert = ({
        message = '',
        header = '',
        buttonsActions = [],
        onDidDismiss = () => {},
        confirmButtonText = 'OK',
        cancelButtonText = 'Cancel',
    }: IAlertProps) => {
        present({
            header: header,
            message: message,
            buttons: buttonsActions.length > 1 ? [
              {
                text: confirmButtonText,
                htmlAttributes: {
                  'aria-label': 'close',
                },
                role: 'confirm',
                handler: () => {
                  buttonsActions[0]();
                },
              },
              {
                text: cancelButtonText,
                htmlAttributes: {
                  'aria-label': 'close',
                },
                role: 'cancel',
                handler: () => {
                  buttonsActions[1]();
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
                  buttonsActions[0]();
                },
              },
            ],
        });
    };
     
    return { presentAlert, dismiss };
}