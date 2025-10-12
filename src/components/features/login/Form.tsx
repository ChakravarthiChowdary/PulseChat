import type {
  FieldErrors,
  UseFormHandleSubmit,
  UseFormRegister,
  UseFormWatch,
} from "react-hook-form";
import assets from "../../../assets/assets";

export interface LoginFormData {
  fullName?: string;
  email: string;
  password: string;
  bio?: string;
}

interface LoginPresenterProps {
  currState: "Sign up" | "Log in";
  isDataSubmitted: boolean;
  onSubmit: (data: LoginFormData) => void;
  onToggleState: () => void;
  register: UseFormRegister<LoginFormData>;
  handleSubmit: UseFormHandleSubmit<LoginFormData, LoginFormData>;
  errors?: FieldErrors<LoginFormData>;
  watch?: UseFormWatch<LoginFormData>;
}

export const Form: React.FC<LoginPresenterProps> = ({
  currState,
  isDataSubmitted,
  onSubmit,
  onToggleState,
  register,
  handleSubmit,
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-black">
      <div className="w-full max-w-md p-8 space-y-8 bg-gray-900 rounded-xl shadow-2xl backdrop-blur-sm bg-opacity-70">
        <div className="text-center">
          <img
            className="mx-auto h-12 w-auto"
            src={assets.logo}
            alt="PulseChat Logo"
          />
          <h2
            className="mt-6 text-3xl font-extrabold"
            style={{
              background: "linear-gradient(to right, #FF00FF, #00BFFF)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            {currState === "Sign up" ? "Join PulseChat" : "Welcome Back"}
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            {currState === "Sign up"
              ? "Create your account."
              : "Sign in to continue."}
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            {currState === "Sign up" && (
              <input
                type="text"
                placeholder="Full Name"
                {...register("fullName", {
                  required: currState === "Sign up",
                })}
                className="appearance-none relative block w-full px-3 py-3 border border-gray-700 bg-gray-800 text-white placeholder-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 sm:text-sm transition duration-150 ease-in-out"
              />
            )}

            <input
              type="email"
              placeholder="Email address"
              {...register("email", { required: true })}
              className="appearance-none relative block w-full px-3 py-3 border border-gray-700 bg-gray-800 text-white placeholder-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 sm:text-sm transition duration-150 ease-in-out"
            />

            <input
              type="password"
              placeholder="Password"
              {...register("password", { required: true })}
              className="appearance-none relative block w-full px-3 py-3 border border-gray-700 bg-gray-800 text-white placeholder-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out"
            />

            {currState === "Sign up" && isDataSubmitted && (
              <textarea
                placeholder="Tell us about yourself (Bio)"
                {...register("bio", { required: isDataSubmitted })}
                rows={3}
                className="appearance-none relative block w-full px-3 py-3 border border-gray-700 bg-gray-800 text-white placeholder-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm transition duration-150 ease-in-out resize-none"
              />
            )}
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-pink-600 via-purple-700 to-blue-600 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300 ease-in-out transform hover:scale-[1.02] shadow-lg shadow-purple-900/50"
            >
              {currState === "Sign up" && !isDataSubmitted
                ? "Continue"
                : currState === "Sign up"
                  ? "Sign Up"
                  : "Sign In"}
            </button>
          </div>
        </form>

        <div className="text-center text-sm text-gray-400">
          {currState === "Sign up"
            ? "Already have an account?"
            : "Don't have an account?"}
          <span
            className="font-medium text-blue-400 hover:text-blue-300 transition duration-150 ease-in-out cursor-pointer ml-1"
            onClick={onToggleState}
          >
            {currState === "Sign up" ? "Log in" : "Sign up"}
          </span>
        </div>
      </div>
    </div>
  );
};
