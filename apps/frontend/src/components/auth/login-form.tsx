import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  loginSchema,
  INPUT_PLACEHOLDERS,
  type LoginRequest,
} from "@app/shared";
import { Button } from "@shadcn/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@shadcn/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@shadcn/card";
import { Input } from "@shadcn/input";
import { Link } from "react-router-dom";
import { login } from "@api/auth";
import { useAuth } from "@context/auth-context";

export const LoginForm = () => {
  const { setUser, setAccessToken } = useAuth();
  const form = useForm<LoginRequest>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      senha: "",
    },
  });

  const onSubmit = async (values: LoginRequest) => {
    try {
      const data = await login(values);
      setUser(data.user);
      setAccessToken(data.accessToken);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card className="max-w-sm w-full mx-auto">
          <CardHeader>
            <CardTitle>Entrar</CardTitle>
            <CardDescription>
              Insira suas credenciais abaixo e acesse sua conta
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email:</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder={INPUT_PLACEHOLDERS.EMAIL}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="senha"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha:</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder={INPUT_PLACEHOLDERS.SENHA}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <Button type="submit" className="w-full">
              Entrar
            </Button>
            <Button type="button" variant="link" className="w-full">
              <Link to="/register">Não tem conta? Cadastre-se</Link>
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};
