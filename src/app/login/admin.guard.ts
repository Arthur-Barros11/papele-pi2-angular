import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

// Só deixa entrar na rota quem está logado como administrador
export const adminGuard: CanActivateFn = () => {

  const router = inject(Router);

  let perfil: string | undefined;

  try {
    const dados = localStorage.getItem('usuarioLogado');
    perfil = dados ? JSON.parse(dados).perfil : undefined;
  } catch {
    perfil = undefined;
  }

  if (perfil === 'admin') {
    return true;
  }

  alert('Acesso restrito a administradores. Faça login como administrador.');

  return router.createUrlTree(['/login']);

};