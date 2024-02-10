import { useFormContext } from "react-hook-form";

interface InputProps {
  label?: string;
  inputType?: "textarea" | "input";
  name: string;
  type?: string;
  placeholder?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  inputType,
  name,
  type,
  placeholder,
  ...rest
}) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const errorMessage = errors[name]?.message;
  return (
    <div className="mb-5">
      <label className="text-gray-600 font-semibold text-[16px] ">
        {label}
      </label>
      {inputType === "input" ? (
        <input
          {...rest}
          {...register(name)}
          type={type}
          placeholder={placeholder}
          className={
            errorMessage
              ? `block  p-[8px] w-full  focus:border-red-600  focus:outline-none mt-2 mb-1 text-[17px]   border-[2px] rounded-[2px] border-gray-300 text-red-600`
              : `block  p-[8px] w-full  focus:border-blue-400  focus:outline-none mt-2 mb-1 text-[15px]   border-[2px] rounded-[2px] border-gray-300 text-gray-500`
          }
        />
      ) : (
        <textarea
          {...register(name)}
          className="h-[100px] block resize-none  p-[8px] w-full  focus:border-blue-400  focus:outline-none mt-2 mb-1 text-[15px]   border-[2px] rounded-[2px] border-gray-300 text-gray-500"
        />
      )}
      {errorMessage && (
        <p className="text-red-600">{errorMessage.toString()}</p>
      )}
    </div>
  );
};

export default Input;
