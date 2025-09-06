// import { useIonAlert } from "@ionic/react";

// export interface IAlertProps {
//     message: string;
//     header: string;
//     buttons: Function[];
//     onDidDismiss: Function;
//     confirmButtonText: string;
//     cancelButtonText: string;
// }
// export const useAlert = ({
//     message,
//     header,
//     buttons,
//     onDidDismiss,
//     confirmButtonText,
//     cancelButtonText = 'Cancel',
// }: IAlertProps) => {
//     const [present, dismiss] = useIonAlert();
//      present({
//         header: header,
//         message: message,
//         buttons: buttons.length > 1 ? [
//           {
//             text: confirmButtonText,
//             htmlAttributes: {
//               'aria-label': 'close',
//             },
//             role: 'confirm',
//             handler: () => {
//               buttons[0]();
//             },
//           },
//           {
//             text: cancelButtonText,
//             htmlAttributes: {
//               'aria-label': 'close',
//             },
//             role: 'cancel',
//             handler: () => {
//               buttons[1]();
//             },
//           },
//         ]:[
//           {
//             text: cancelButtonText,
//             htmlAttributes: {
//               'aria-label': 'close',
//             },
//             role: 'cancel',
//             handler: () => {
//               buttons[0]();
//             },
//           },
//         ],
//     });
//     return { present, dismiss };
// }