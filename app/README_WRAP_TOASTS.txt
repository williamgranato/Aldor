// DICA: para ativar os toasts, envolva sua app com <ToastProvider> no layout raiz.
// Exemplo (app/layout.tsx):
//
// import { ToastProvider } from '@/components/ToastProvider';
//
// export default function RootLayout({ children }){
//   return (
//     <html lang="pt-BR">
//       <body>
//         <ToastProvider>
//           {children}
//         </ToastProvider>
//       </body>
//     </html>
//   );
// }
