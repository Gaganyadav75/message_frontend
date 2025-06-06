

export function CustomButton({children,className,...props}:React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
   <button {...props} className={"bg-blue-600 hover:bg-blue-700 text-dark-textSecondary font-semibold py-2 px-4  rounded mb-2 transition-all duration-300 ease-in-out disabled:bg-gray-700 "+className}>
        {children}
   </button>

  )
}
