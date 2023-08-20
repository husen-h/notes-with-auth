import { zodResolver } from "@hookform/resolvers/zod";
import classNames from "classnames";
import { type GetStaticProps, type InferGetStaticPropsType } from "next";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  type PropsWithChildren,
  type HTMLInputTypeAttribute,
  type ReactNode,
} from "react";
import {
  useForm,
  type FieldErrors,
  type SubmitHandler,
  type UseFormRegister,
} from "react-hook-form";
import { toast } from "react-hot-toast";
import { z } from "zod";
import { LayoutWithTitle } from "~/components/layoutWithTitle";
import { LinkButton } from "~/components/linkButton";
import {
  registrationFormSchema,
  type RegistrationFormDataType,
} from "~/types/registration";
import { api } from "~/utils/api";
import { HiArrowLongLeft, HiArrowLongRight } from "react-icons/hi2";

const querySchema = z.union([z.literal("login"), z.literal("register")]);
type QuerySchemaType = z.infer<typeof querySchema>;

export default function Auth(
  props: InferGetStaticPropsType<typeof getStaticProps>
) {
  const { authLink } = props;
  return (
    <LayoutWithTitle title="Introduce yourself">
      <div className="flex items-start gap-8">
        {/* <LinkButton href="/">
        <HiArrowLongLeft size={24} />
        Go back
      </LinkButton> */}
        <div className="w-[500px] border-[1px] border-slate-300 bg-white">
          <div className="flex items-center">
            <AuthorizationTab active={authLink === "register"} tab="register">
              Register
            </AuthorizationTab>
            <AuthorizationTab active={authLink === "login"} tab="login">
              Login
            </AuthorizationTab>
          </div>
          <div className="p-5">
            {authLink === "register" ? <Register /> : <Login />}
          </div>
        </div>
      </div>
    </LayoutWithTitle>
  );
}

export const getStaticPaths = () => {
  return {
    paths: [
      { params: { authLink: "login" } },
      { params: { authLink: "register" } },
    ],
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<{ authLink: QuerySchemaType }> = ({
  params,
}) => {
  const { authLink } = params as { authLink: QuerySchemaType };
  const validation = querySchema.safeParse(authLink);
  if (validation.success) {
    return {
      props: {
        authLink,
      },
    };
  }

  return {
    notFound: true,
  };
};

function AuthorizationTab({
  active,
  children,
  tab,
}: {
  active: boolean;
  children: ReactNode;
  tab: QuerySchemaType;
}) {
  const styles = classNames(
    "grow cursor-pointer flex justify-center p-3 basis-0 font-bold",
    {
      "bg-gray-300 text-gray-400": !active,
      "bg-rose-600 text-white": active,
    }
  );

  return (
    <Link href={`/auth/${tab}/`} className={styles}>
      {children}
    </Link>
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
    onSuccess: async (data, { email, password }) => {
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
          <LinkButton type="submit">Submit</LinkButton>
          {/* <button
            type="submit"
            className="w-full rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 sm:w-auto"
          >
            Submit
          </button> */}
        </div>
      </form>
    </div>
  );
}

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegistrationFormDataType>({
    resolver: zodResolver(registrationFormSchema),
  });

  const { query } = useRouter();
  const loginError = query.error as string;
  //   const fullErrors: FieldErrors<RegistrationFormDataType> = {
  //     ...errors,
  //     password: {
  //       ...errors.password,
  //       message: errors.password?.message || loginError,
  //     },
  //   };

  const onSubmit: SubmitHandler<RegistrationFormDataType> = async (data) =>
    await signIn("credentials", {
      email: data.email,
      password: data.password,
      callbackUrl: "/notes",
    });

  const formStyles = classNames({
    "opacity-50": false,
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
          <LinkButton type="submit">Login</LinkButton>
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
      {Boolean(errorMessage) && <ErrorText message={errorMessage} />}
    </div>
  );
}

function ErrorText(props: { message?: string }) {
  return <p className="text-xs text-red-500">{props.message}</p>;
}
