import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  registerSchema,
  INPUT_PLACEHOLDERS,
  type RegisterRequestForm,
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
import { register } from "@api/auth";
import { useAuth } from "@context/auth-context";

export const RegisterForm = () => {
  const { setUser, setAccessToken } = useAuth();
  const form = useForm<RegisterRequestForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      nome: "",
      senha: "",
      confirmarSenha: "",
    },
  });

  const onSubmit = async (values: RegisterRequestForm) => {
    try {
      const data = await register({
        email: values.email,
        nome: values.nome,
        senha: values.senha,
      });
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
            <CardTitle>Cadastrar</CardTitle>
            <CardDescription>
              Entre os seus dados para cadastrar um novo usuário
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 py-3">
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
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome:</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder={INPUT_PLACEHOLDERS.NOME}
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
            <FormField
              control={form.control}
              name="confirmarSenha"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmar Senha:</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder={INPUT_PLACEHOLDERS.SENHA_CONFIRM}
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
              Cadastrar
            </Button>
            <Button type="button" variant="link" className="w-full">
              <Link to="/login">Já tem conta? Entrar</Link>
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};
