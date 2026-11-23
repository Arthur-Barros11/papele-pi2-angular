
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PedidoService } from '../services/pedido.service';
import { Pedido } from '../carrinho/pedido';
import { Menu } from '../shared/menu/menu';
import { Footer } from '../shared/footer/footer';

@Component({
  selector: 'app-meus-pedidos',
  standalone: true,
  imports: [CommonModule, Menu, Footer],
  templateUrl: './meus-pedidos.html',
  styleUrl: './meus-pedidos.css'
})

export class MeusPedidos implements OnInit {

  private pedidoService = inject(PedidoService);

  pedidos: Pedido[] = [];
  usuarioLogado: any = null;
  mensagem = '';

  ngOnInit() {
    this.carregarPedidos();
  }

  // esse metodo verifica o id do usuario busca na api todos os pedidos por id e guarda os resultados na vaiavel pedidos
  carregarPedidos() {
    const usuario = localStorage.getItem('usuarioLogado');

    if (!usuario) {
      this.mensagem = 'Você precisa fazer login para visualizar seus pedidos.';
      return;
    }

    this.usuarioLogado = JSON.parse(usuario);

    this.pedidoService.buscarPedidosPorCliente(String(this.usuarioLogado.id)).subscribe({
  next: (resposta) => {
    console.log('ID do usuário:', this.usuarioLogado.id);
    console.log('Pedidos recebidos da API:', resposta);

    this.pedidos = resposta;

    if (this.pedidos.length === 0) {
      this.mensagem = 'Você ainda não possui pedidos.';
    }
  },
  error: (erro) => {
    console.error('Erro ao buscar pedidos:', erro);
    this.mensagem = 'Erro ao carregar seus pedidos.';
  }
});
}}
