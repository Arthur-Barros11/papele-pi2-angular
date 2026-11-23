
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './menu.html',
  styleUrl: './menu.css'
})
export class Menu implements OnInit {

  usuarioLogado: any = null;

  constructor(private router: Router) {}

  ngOnInit() {
    const usuario = localStorage.getItem('usuarioLogado');

    if (usuario) {
      this.usuarioLogado = JSON.parse(usuario);
    }
  }

  sair() {
    localStorage.removeItem('usuarioLogado');
    this.usuarioLogado = null;
    this.router.navigate(['/']);
  }
}
