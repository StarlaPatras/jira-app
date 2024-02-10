// import { ButtonHTMLAttributes } from "react";

// interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
//   variant?: "dashboard" | "header" | "danger" | "cancel";
//   children: React.ReactNode;
//   className?: string;
//   onClick?: () => void;
// }

// const Button: React.FC<ButtonProps> = ({
//   children,
//   variant,
//   className,
//   onClick,
//   ...rest
// }) => {
//   let variantClasses;
//   if (variant === "header") {
//     variantClasses =
//       " px-4 text-base bg-primary hover:bg-primary_light text-white flex items-center justify-center ";
//   } else if (variant === "dashboard") {
//     variantClasses =
//       "w-full hover:bg-gray-300  text-lg font-medium text-gray-700  flex items-center gap-2 justify-start ";
//   } else if (variant === "cancel") {
//     variantClasses =
//       "px-5 text-base bg-gray-200 hover:bg-gray-300 text-gray-700  ";
//   } else if (variant === "danger") {
//     variantClasses =
//       "bg-red-500 hover:bg-red-600 text-white text-base  bg-primary ";
//   }

//   return (
//     <button
//       {...rest}
//       className={` px-4 text-base py-2 rounded-[2px]   ${variantClasses} ${className} `}
//     >
//       {children}
//     </button>
//   );
// };

// export default Button;

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  variant?: "dashboard";
}
const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant,
  ...props
}) => {
  let variantClasses;
  if (variant === "dashboard") {
    variantClasses =
      "w-full hover:bg-gray-200  text-lg font-medium text-gray-700  flex items-center gap-2 justify-start ";
  }

  return (
    <button
      {...props}
      className={`${className} py-2 rounded-[2px] px-5 text-base  ${variantClasses}  `}
    >
      {children}
    </button>
  );
};

export default Button;
