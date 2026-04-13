/**
 * Tipagem TypeScript do evento.
 * Adicionar campos aqui garante que qualquer arquivo que usar Event
 * receba autocomplete e erro em tempo de compilação se esquecer um campo.
 */
export type Event = {
  id: string;
  titulo: string;
  data: string;       // ex: "Sáb, 14 Mar • 09:00"
  local: string;
  preco: string;      // ex: "R$ 150,00" ou "Gratuito para aluno unialfa"
  imagem: string;     // URL da imagem de capa
  descricao: string;  // Texto longo exibido na tela de detalhes
};
