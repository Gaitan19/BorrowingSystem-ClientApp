import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
}

export const Button = ({ className = '', variant = 'primary', ...props }: ButtonProps) => {
  const baseStyles = 'px-4 py-2 rounded-md focus:outline-none focus:ring-2 ';
  
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-blue-500'
  };

  return (
    <button
      {...props}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    />
  );
};