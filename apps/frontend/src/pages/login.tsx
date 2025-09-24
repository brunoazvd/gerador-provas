import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@shadcn/card";
import { Button } from "@shadcn/button";
import { Input } from "@shadcn/input";
import { Label } from "@shadcn/label";
import { useState } from "react";
import { Link } from "react-router-dom";

export const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [senha, setSenha] = useState<string>("");

  console.log(email);

  return (
    <>
      <form>
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
                  placeholder="Seu email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="senha">Senha:</Label>
                <Input
                  id="senha"
                  type="password"
                  placeholder="Sua senha"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <Button type="submit" className="w-full">
              Login
            </Button>
            <Button type="button" variant="link" className="w-full">
              <Link to="/register">Não tem conta? Cadastre-se</Link>
            </Button>
          </CardFooter>
        </Card>
      </form>
    </>
  );
};
