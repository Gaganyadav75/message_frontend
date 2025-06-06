import React from 'react';
import ReactDOM from 'react-dom';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  heading?:string;
  subHeading?:string;
  button1?:{title?:string,onClick:()=>void,className?:string};
  button2?:{title?:string,onClick:()=>void,className?:string};
  query?:string;
}

export const ConfirmDialogBox: React.FC<ConfirmDeleteModalProps> = ({ isOpen,heading,subHeading,button1,button2,query }) => {
  if (!isOpen) return null;
    if (typeof window === 'undefined') return null;

    const element = query?document.querySelector(query):null;

    return (ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg w-full max-w-sm p-6 text-center">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          {heading || "Do you want to continue?"}
        </h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
          {subHeading}
        </p>

        <div className="mt-6 flex justify-end space-x-8">
         {button1 && <button
            onClick={button1?.onClick}
            className={button1.className || "text-blue-600 hover:text-blue-800 transition-colors font-medium"}
          >
            {button1?.title || 'yes'}
          </button>
          }
          {
            button2 && 
            <button
            onClick={button2?.onClick}
            className={button2.className || "text-red-600 hover:text-red-800 transition-colors font-medium"}
            >
            {button2?.title || 'no'}
          </button>
          }
        </div>
      </div>
    </div>,
    (element || document.body)
        )
  );
};
