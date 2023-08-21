import { zodResolver } from "@hookform/resolvers/zod";
import classNames from "classnames";
import { type GetStaticProps, type InferGetStaticPropsType } from "next";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { type ReactNode } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "react-hot-toast";
import { z } from "zod";
import { InputWithLabel } from "~/components/inputWithLabel";
import { LayoutWithTitle } from "~/components/layoutWithTitle";
import { LinkButton } from "~/components/linkButton";
import {
  registrationFormSchema,
  type RegistrationFormDataType,
} from "~/types/registration";
import { api } from "~/utils/api";

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
