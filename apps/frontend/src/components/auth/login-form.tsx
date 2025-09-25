import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@shadcn/card";
import { Button } from "@shadcn/button";
import { Input } from "@shadcn/input";
import { Label } from "@shadcn/label";
import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { login } from "@api/auth";
import { useAuth } from "@context/auth-context";
import { INPUT_PLACEHOLDERS, type LoginRequest } from "@app/shared";

export const LoginForm = () => {
  const { setUser, setAccessToken } = useAuth();
  const [formData, setFormData] = useState<LoginRequest>({
    email: "",
    senha: "",
  });

  const handleChange = ({
    target: { name, value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      const data = await login(formData);
      setUser(data.user);
      setAccessToken(data.accessToken);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card className="max-w-sm w-full mx-auto">
        <CardHeader>
          <CardTitle>Entrar</CardTitle>
          <CardDescription>
            Insira suas credenciais abaixo e acesse sua conta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email:</Label>
              <Input
                id="email"
                type="email"
                name="email"
                placeholder={INPUT_PLACEHOLDERS.EMAIL}
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="senha">Senha:</Label>
              <Input
                id="senha"
                type="password"
                name="senha"
                placeholder={INPUT_PLACEHOLDERS.SENHA}
                value={formData.senha}
                onChange={handleChange}
                required
              />
            </div>
          </div>
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
  );
};
