// Um item dentro do carrinho (produto + quantidade)
export interface ItemCarrinho {
  id: number;
  nome: string;
  categoria: string;
  preco: number;
  imagem: string;
  quantidade: number;
}

// Um pedido finalizado, guardado na API
export interface Pedido {
  id?: string;
  clienteId: string;
  clienteNome: string;
  itens: ItemCarrinho[];
  total: number;
  data: string;
  status: string;
}