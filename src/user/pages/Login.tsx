import { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useForm, SubmitHandler, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// Hooks
import { useHttpClient } from "../../hooks/Http-hook";

// Context
import { AuthContext } from "../../context/AuthContext";

// Shared Component
import Input from "../../shared/FormElements/Input";
import Button from "../../shared/FormElements/Button";
import Modal from "../../shared/UlElements/Modal";
import LoadingSpinner from "../../shared/UlElements/Loader";

interface FormData {
  email: string;
  password: string;
}

const schema = yup.object().shape({
  email: yup.string().email().required("Email is required"),
  password: yup.string().min(5).required("Password is required"),
});

const Login = () => {
  const [isOpen, setOpen] = useState(false);
  const { error, isLoading, sendReq } = useHttpClient();

  const auth = useContext(AuthContext);
  const methods = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const { handleSubmit, reset } = methods;

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      const responseData = await sendReq(
        "http://localhost:4000/api/user/login",
        "POST",
        // @ts-ignore
        JSON.stringify({ email: data.email, password: data.password }),
        {
          "Content-Type": "application/json",
        }
      );

      auth.isLogin(responseData.userId, responseData.token);
    } catch (err) {}

    reset({ password: "" });
  };

  useEffect(() => {
    if (error) {
      setOpen(true);
    }
  }, [error]);
  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover"
      style={{ backgroundImage: 'url("/bg-2.jpg")' }}
    >
      <FormProvider {...methods}>
        {error && !isLoading && (
          <Modal
            isOpen={isOpen}
            onClose={() => setOpen(false)}
            modalType="error"
          >
            {error}
          </Modal>
        )}{" "}
        {isLoading && <LoadingSpinner asOverlay />}
        <div className="w-full max-w-md px-[50px] pb-[50px] bg-white rounded shadow-md pt-[30px] ">
          <div className="flex items-center justify-center gap-1 ">
            <div className=" w-[70px] h-[70px] ">
              <img src="/logo.svg" className="w-full h-full" alt="logo-img" />
            </div>
            <div className="">
              <h1 className="text-4xl font-bold text-center uppercase text-primary ">
                teamforge
              </h1>
            </div>
          </div>
          <p className="pt-3 pb-5 text-xl font-medium text-center text-gray-700">
            Log in to continue
          </p>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Input
              inputType="input"
              name="email"
              placeholder="Enter your email"
            />
            <Input
              inputType="input"
              name="password"
              type="password"
              placeholder="Enter your password"
            />

            <div className="flex flex-col items-center justify-center pt-5 ">
              <Button type="submit" className="w-full text-white bg-primary">
                continue
              </Button>
              <p className="mt-4 text-blue-600">
                Can't log in?{" "}
                <span className="text-blue-600 ">
                  {" "}
                  <Link to="/signup">Create an account</Link>{" "}
                </span>
              </p>
            </div>
          </form>
        </div>
      </FormProvider>
    </div>
  );
};

export default Login;
