import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Menu } from '../shared/menu/menu';
import { Footer } from '../shared/footer/footer';
import { Produto } from '../model/produto';
import { ProdutoService } from '../services/produto.service';
import { Router } from '@angular/router';

const vazio = (): Produto => ({ nome: '', categoria: '', preco: 0, imagem: '' });

@Component({
  selector: 'app-produtos',
  standalone: true,
  imports: [FormsModule, Menu, Footer],
  templateUrl: './produtos.html',
  styleUrl: './produtos.css',
})
export class Produtos implements OnInit {
  private router = inject(Router);

  //adcionando as propriedades da imagem
  imagemPreview = '';
  arrastandoImagem = false;
  readonly tamanhoMaximoImagem = 2 * 1024 * 1024;

  // arthur
  private service = inject(ProdutoService);
  private cd = inject(ChangeDetectorRef);
  listaProdutos: Produto[] = [];
  produto = vazio();
  busca = '';
  mensagem = '';
  erroApi = '';
  erroNome = '';
  erroCategoria = '';
  erroPreco = '';
  erroImagem = '';

  ngOnInit(): void {
    this.service.listar().subscribe({
      next: (produtos) => {
        this.listaProdutos = produtos;
        this.cd.markForCheck();
      },
      error: () =>
        this.falha('Não foi possível carregar os produtos. Verifique se a API está ligada.'),
    });
  }

  get produtosFiltrados() {
    const t = this.busca.toLowerCase();
    return this.listaProdutos.filter((p) => (p.nome + ' ' + p.categoria).toLowerCase().includes(t));
  }

  salvarProduto(e: Event) {
    e.preventDefault();

    if (!this.validar()) return;

    const p = { ...this.produto };
    const editando = !!p.id;

    (editando ? this.service.editar(p) : this.service.incluir(p)).subscribe({
      next: (salvo) => {
        this.listaProdutos = editando
          ? this.listaProdutos.map((i) => (i.id === salvo.id ? salvo : i))
          : [...this.listaProdutos, salvo];

        this.msg(`Produto ${salvo.nome} ${editando ? 'alterado' : 'cadastrado'} com sucesso.`);
        this.cancelarEdicao();

        this.router.navigate(['/']).then((navegou) => {
          if (!navegou) {
            this.falha('Não foi possível acessar a tela inicial.');
          }
        });
      },
      error: () => this.falha('Erro ao salvar o produto.'),
    });
  }

  editarProduto(p: Produto) {
    this.cancelarEdicao();
    this.produto = { ...p };

    // Carrega a imagem existente na prévia durante a edição
    this.imagemPreview = p.imagem?.startsWith('data:image/') ? p.imagem : '';
  }

  excluirProduto(p: Produto) {
    if (!p.id || !confirm(`Deseja realmente excluir o produto "${p.nome}"?`)) return;

    this.service.excluir(p.id).subscribe({
      next: () => {
        this.listaProdutos = this.listaProdutos.filter((i) => i.id !== p.id);

        if (this.produto.id === p.id) this.cancelarEdicao();

        this.msg('Produto excluído com sucesso.');
      },
      error: () => this.falha('Erro ao excluir o produto.'),
    });
  }

  cancelarEdicao() {
    this.produto = vazio();
    this.imagemPreview = '';
    this.erroApi = this.erroNome = this.erroCategoria = this.erroPreco = this.erroImagem = '';
  }

  //criando a funçao para selecionar a imagem
  selecionarImagem(event: Event) {
    const input = event.target as HTMLInputElement;
    const arquivo = input.files?.[0];

    //faz a verificaçao de formato
    if (!arquivo) return;

    const formatosPermitidos = ['image/jpeg', 'image/png', 'image/webp'];

    if (!formatosPermitidos.includes(arquivo.type)) {
      this.erroImagem = 'Selecione uma imagem JPG, PNG ou WEBP.';
      input.value = '';
      return;
    }

    //faz a verificaçao de tamanho
    if (arquivo.size > this.tamanhoMaximoImagem) {
      this.erroImagem = 'A imagem deve ter no máximo 2 MB.';
      input.value = '';
      return;
    }

    //chama a funçao FileReader para o navegador ler os arquivos
    const leitor = new FileReader();

    //define o que acontece quando a leitura termina
    leitor.onload = () => {
      // guarda a imagem para fazer uma previa
      const imagem = leitor.result as string;

      this.imagemPreview = imagem;

      // guarda a imagem no produto para salvar na API
      this.produto.imagem = imagem;

      this.erroImagem = '';
      this.cd.markForCheck();
    };

    leitor.onerror = () => {
      this.erroImagem = 'Não foi possível carregar a imagem.';
      this.cd.markForCheck();
    };

    leitor.readAsDataURL(arquivo);
  }

  // Permite arrastar e soltar uma imagem
  aoArrastar(event: DragEvent) {
    event.preventDefault();
    this.arrastandoImagem = true;
  }

  aoSair(event: DragEvent) {
    event.preventDefault();
    this.arrastandoImagem = false;
  }

  soltarImagem(event: DragEvent) {
    event.preventDefault();
    this.arrastandoImagem = false;

    const arquivo = event.dataTransfer?.files?.[0];

    if (!arquivo) return;

    //faz a verificaçao de formato
    const formatosPermitidos = ['image/jpeg', 'image/png', 'image/webp'];

    if (!formatosPermitidos.includes(arquivo.type)) {
      this.erroImagem = 'Selecione uma imagem JPG, PNG ou WEBP.';
      return;
    }

    //faz a verificaçao de tamanho
    if (arquivo.size > this.tamanhoMaximoImagem) {
      this.erroImagem = 'A imagem deve ter no máximo 2 MB.';
      return;
    }

    //chama a funçao FileReader para o navegador ler os arquivos
    const leitor = new FileReader();

    //define o que acontece quando a leitura termina
    leitor.onload = () => {
      // guarda a imagem para fazer uma previa
      const imagem = leitor.result as string;

      this.imagemPreview = imagem;

      // guarda a imagem no produto para salvar na API
      this.produto.imagem = imagem;

      this.erroImagem = '';
      this.cd.markForCheck();
    };

    leitor.onerror = () => {
      this.erroImagem = 'Não foi possível carregar a imagem.';
      this.cd.markForCheck();
    };

    leitor.readAsDataURL(arquivo);
  }

  private validar() {
    const p = this.produto;
    const nome = p.nome.trim().toLowerCase();

    this.erroNome =
      nome.length < 3
        ? 'Informe um nome com pelo menos 3 letras.'
        : this.listaProdutos.some((i) => i.nome.toLowerCase() === nome && i.id !== p.id)
          ? 'Já existe um produto com esse nome.'
          : '';

    this.erroCategoria = p.categoria ? '' : 'Selecione uma categoria.';
    this.erroPreco = p.preco > 0 ? '' : 'Informe um preço maior que zero.';

    this.erroImagem = p.imagem?.startsWith('data:image/')
      ? ''
      : 'Selecione uma imagem para o produto.';

    return !(this.erroNome || this.erroCategoria || this.erroPreco || this.erroImagem);
  }

  private falha(t: string) {
    this.erroApi = t;
    this.cd.markForCheck();
  }

  private msg(t: string) {
    this.mensagem = t;
    this.cd.markForCheck();

    setTimeout(() => {
      this.mensagem = '';
      this.cd.markForCheck();
    }, 3000);
  }
}
