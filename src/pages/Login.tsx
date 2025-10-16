import { useContext, useState } from "react";
import { Form, type LoginFormData } from "../components/features/login/Form";
import { useForm } from "react-hook-form";
import { AuthContext } from "../context/AuthContext";

const Login: React.FC = () => {
  const [currState, setCurrState] = useState<"Sign up" | "Log in">("Sign up");
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);
  const authContext = useContext(AuthContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<LoginFormData>({
    mode: "onSubmit",
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      bio: "",
    },
  });

  const onSubmit = (data: LoginFormData) => {
    if (currState === "Sign up" && !isDataSubmitted) {
      setIsDataSubmitted(true);
      return;
    }

    console.log("Form submitted:", data, authContext);
    authContext?.login(currState === "Sign up" ? "register" : "login", data);
  };

  const handleToggleState = () => {
    const newState = currState === "Sign up" ? "Log in" : "Sign up";
    setCurrState(newState);
    setIsDataSubmitted(false);

    if (newState === "Sign up") {
      reset();
    }
  };

  return (
    <Form
      currState={currState}
      isDataSubmitted={isDataSubmitted}
      onSubmit={onSubmit}
      onToggleState={handleToggleState}
      register={register}
      handleSubmit={handleSubmit}
      errors={errors}
      watch={watch}
      data-testid="login-form"
    />
  );
};

export default Login;
