import { Dispatch, ReactNode, SetStateAction, useEffect, useRef } from 'react';

interface MenuDropDowntype {
    children:ReactNode,
    open:boolean,
    setOpen:Dispatch<SetStateAction<boolean>>,
    menuButton:ReactNode,
    className?:string
    mainMenuClass?:string
}

export default function MenuDropdown({menuButton,children,open,setOpen,className,mainMenuClass}:MenuDropDowntype) {

  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [setOpen]);

  return (
    <div className={"relative inline-block text-left "+mainMenuClass} ref={menuRef}>
     
        {menuButton}

      {/* Menu Panel */}
      <div
        className={`${
          open ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
        } absolute origin-top-right rounded-md top-0 transition transform duration-200 ease-out z-20 ${className}`}
      >
        {children}
      </div>
    </div>
  );
}
