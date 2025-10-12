import { useState } from "react";
import { Form, type LoginFormData } from "../components/features/login/Form";
import { useForm } from "react-hook-form";

const Login: React.FC = () => {
  const [currState, setCurrState] = useState<"Sign up" | "Log in">("Sign up");
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);

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

    console.log("Form submitted:", data);
  };

  const handleToggleState = () => {
    setCurrState(currState === "Sign up" ? "Log in" : "Sign up");
    setIsDataSubmitted(false);
    reset();
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
    />
  );
};

export default Login;
