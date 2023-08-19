import { zodResolver } from "@hookform/resolvers/zod";
import classNames from "classnames";
import { signIn, signOut, useSession } from "next-auth/react";
import {
  useState,
  type HTMLInputTypeAttribute,
  type ReactNode,
  useEffect,
} from "react";
import {
  useForm,
  type FieldErrors,
  type SubmitHandler,
  type UseFormRegister,
} from "react-hook-form";
import { toast } from "react-hot-toast";
import {
  registrationFormSchema,
  type RegistrationFormDataType,
} from "~/types/registration";
import { api } from "~/utils/api";

export default function Home() {
  const { data: sessionData, status } = useSession();

  console.log(sessionData?.user.email);

  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-start gap-8">
        <h1 className="text-8xl font-bold">
          <span>Notes-</span>
          <span className="bg-gradient-to-r from-blue-700 to-rose-600 bg-clip-text text-transparent">
            Taking
          </span>
        </h1>
        {status === "unauthenticated" && <AuthorizationCard />}
        {status === "authenticated" && (
          <button
            className="border border-slate-900 px-4 py-2 hover:bg-slate-600 hover:text-slate-100"
            onClick={() => signOut()}
          >
            Sign out
          </button>
        )}
      </main>
    </>
  );
}

type AuthorizationTabType = "login" | "register";

function AuthorizationCard() {
  const [authorizationTab, setAuthorizationTab] =
    useState<AuthorizationTabType>("register");

  const changeAuthorizationTab = (tab: AuthorizationTabType) =>
    setAuthorizationTab(tab);
  return (
    <div className="h-96 w-[500px] border-[1px] border-slate-300 bg-white">
      <div className="flex items-center">
        <AuthorizationTab
          active={authorizationTab === "register"}
          onClick={changeAuthorizationTab}
          tab={"register"}
        >
          Register
        </AuthorizationTab>
        <AuthorizationTab
          active={authorizationTab === "login"}
          onClick={changeAuthorizationTab}
          tab={"login"}
        >
          Login
        </AuthorizationTab>
      </div>
      <div className="p-5">
        {authorizationTab === "register" ? <Register /> : <Login />}
      </div>
    </div>
  );
}

function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegistrationFormDataType>({
    resolver: zodResolver(registrationFormSchema),
  });

  const { mutate, isLoading } = api.registration.registerUser.useMutation({
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: async (data, { email, password }, context) => {
      await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
    },
  });
  const onSubmit: SubmitHandler<RegistrationFormDataType> = (data) =>
    mutate(data);

  const formStyles = classNames({
    "opacity-50": isLoading,
  });

  return (
    <div>
      <form noValidate onSubmit={handleSubmit(onSubmit)} className={formStyles}>
        <div className="mb-6 flex flex-col items-start gap-6">
          <InputWithLabel
            name="email"
            placeholder="someone@something.com"
            register={register}
            label="Email"
            type="text"
            errors={errors}
          />
          <InputWithLabel
            name="password"
            placeholder="•••••••••"
            register={register}
            label="Password"
            type="password"
            errors={errors}
          />
          <button
            type="submit"
            className="w-full rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 sm:w-auto"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

function InputWithLabel({
  placeholder,
  type,
  register,
  name,
  label,
  required,
  errors,
}: {
  placeholder: string;
  label: string;
  name: keyof RegistrationFormDataType;
  errors: FieldErrors<RegistrationFormDataType>;
  register: UseFormRegister<RegistrationFormDataType>;
  type?: HTMLInputTypeAttribute;
  required?: boolean;
}) {
  const errorMessage = errors?.[name]?.message;
  return (
    <div className="w-full">
      <label
        className="mb-2 block text-sm font-medium text-gray-900"
        htmlFor={name}
      >
        {label}
      </label>
      <input
        type={type}
        className="w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-blue-500 "
        placeholder={placeholder}
        required={required}
        {...register(name)}
      />
      {Boolean(errorMessage) && (
        <p className="text-xs text-red-500">{errorMessage}</p>
      )}
    </div>
  );
}

function Login() {
  return <div />;
}

function AuthorizationTab({
  active,
  children,
  onClick,
  tab,
}: {
  active: boolean;
  children: ReactNode;
  onClick: (tab: AuthorizationTabType) => void;
  tab: AuthorizationTabType;
}) {
  const styles = classNames(
    "grow cursor-pointer flex justify-center p-3 basis-0",
    {
      "bg-gray-300 text-gray-400": !active,
      "bg-rose-600 text-white": active,
    }
  );

  return (
    <div className={styles} onClick={() => onClick(tab)}>
      {children}
    </div>
  );
}

// function HeadingText(props: {
//   children?: ReactNode;
//   variant?: "black" | "gradient";
// }) {
//   const { variant } = props;
//   const styles = classNames({
//     ["text-transparent bg-clip-text bg-gradient-to-r from-sky-800 to-rose-600"]:
//       variant === "gradient",
//   });
//   return <span className={styles}>{props.children}</span>;
// }

// function AuthShowcase() {
//   const { data: sessionData, status } = useSession();

//   const { data: secretMessage } = api.example.getSecretMessage.useQuery(
//     undefined, // no input
//     { enabled: sessionData?.user !== undefined }
//   );

//   return (
//     <div />
//     // <div className="flex flex-col items-center justify-center gap-4">
//     //   <p className="text-center text-2xl text-white">
//     //     {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
//     //     {secretMessage && <span> - {secretMessage}</span>}
//     //   </p>
//     //   <button
//     //     className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
//     //     onClick={sessionData ? () => void signOut() : () => void signIn()}
//     //   >
//     //     {sessionData ? "Sign out" : "Sign in"}
//     //   </button>
//     // </div>
//   );
// }
