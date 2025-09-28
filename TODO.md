# To-Do List

## DONE - Improve PrivateRoute Frontend Guard

Atualmente o PrivateRoute apenas checa pela existência de um user dentro do estado do AuthContext, o que pode ser facilmente burlado se utilizarmos react developer tools. A solução ideal envolve fazer um request `GET auth/me` e, caso retorne 200, libermarmos o `<Outlet />`. Enquanto isso acontece, nós exibimos o loader.

Para isso precisamos de:

- Adicionar uma função que faz essa call (GET auth/me) no api.
- Importar loader, função supracitada e useEffect em PrivateRoute
- Adicionar um effect que faz a call do API, seta loading pra true, e no final decide se liberamos ou não Outlet e remove o loading. Caso falhe nós redirecionamos para login.

## DONE - Só chamar refreshToken quando necessário

Atualmente quando eu dou reload na homepage, uma rota publica, estou vendo o log que refreshToken foi unauthorized, mesmo quando não tenho nenhum cookie salvo.

Preciso fazer com que ele só aconteça caso exista cookie.
