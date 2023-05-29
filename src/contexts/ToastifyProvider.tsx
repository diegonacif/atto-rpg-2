import { createContext, ReactNode } from "react";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

interface ToastifyContextProps {
  notifySuccess: (message: string) => void;
  notifyError: (message: string) => void;
}

interface ToastifyProviderProps {
  children: ReactNode;
}

export const ToastifyContext = createContext<ToastifyContextProps>({} as ToastifyContextProps);

export const ToastifyProvider: React.FC<ToastifyProviderProps> = ({ children }) => {

  const notifySuccess = (message: string) => toast.success(message);
  const notifyError = (message: string) => toast.error(message);

  return (
    <ToastifyContext.Provider value={{ 
      notifySuccess,
      notifyError
    }}>
      {children}
      <ToastContainer 
        position="bottom-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </ToastifyContext.Provider>
  )
}