import { Routes } from '@angular/router';
import { adminGuard } from './login/admin.guard';
import { MeusPedidos } from './meus-pedidos/meus-pedidos';
import { Home } from './home/home';
import { Login } from './login/login';
import { Clientes } from './clientes/clientes';
import { Produtos } from './produtos/produtos';
import { Carrinho } from './carrinho/carrinho';


export const routes: Routes = [

  {
    path: '',
    component: Home
  },

  {
    path: 'login',
    component: Login
  },
  
  {
    path: 'meus-pedidos',
    component: MeusPedidos
 },

  {
    path: 'clientes',
    component: Clientes
  },

   {
    path: 'produtos',
    component: Produtos,
    canActivate: [adminGuard]
  },

  {
    path: 'carrinho',
    component: Carrinho
  }

];