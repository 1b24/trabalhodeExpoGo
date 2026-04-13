/**
 * CartContext.tsx
 * ────────────────────────────────────────────────────────────────────────────
 * Gerencia o estado global do carrinho e dos bilhetes usando React Context +
 * useState. Qualquer tela que precisar ler ou modificar o carrinho importa
 * o hook `useCart()` — não precisa passar props de pai pra filho.
 *
 * PERGUNTA DO PROFESSOR: "Por que usar Context em vez de props?"
 * RESPOSTA: Props drilling ficaria inviável — o carrinho é acessado em 3 telas
 * distintas (Home, Carrinho, Bilhetes). Com Context, centralizamos o estado e
 * qualquer componente na árvore pode consumi-lo sem passar props manualmente.
 */

import React, { createContext, useContext, useState } from "react";
import { Event } from "../types/event";

// ─── Tipos ────────────────────────────────────────────────────────────────────

/** Um item no carrinho tem todos os campos do evento + um id único de instância.
 *  Isso permite adicionar o mesmo evento mais de uma vez (se necessário). */
export type CartItem = Event & { cartId: string };

/** Um bilhete tem os campos do evento + código único gerado na hora da compra. */
export type Ticket = Event & {
  codigoBilhete: string; // ex: TKT-2026-A1B2
  dataCompra: string;    // data formatada da compra
};

interface CartContextType {
  carrinho: CartItem[];
  bilhetes: Ticket[];
  adicionarAoCarrinho: (evento: Event) => void;
  removerDoCarrinho: (cartId: string) => void;
  finalizarCompra: () => void;
  totalCarrinho: number;
}

// ─── Contexto ─────────────────────────────────────────────────────────────────

const CartContext = createContext<CartContextType | undefined>(undefined);

// ─── Gerador de código de bilhete ─────────────────────────────────────────────

/**
 * Gera um código aleatório no formato TKT-2026-XXXX.
 * Math.random().toString(36) converte um número aleatório para base 36 (0-9 + a-z).
 * slice(2, 6) pega 4 caracteres a partir da posição 2 (pula o "0.").
 * toUpperCase() deixa maiúsculo para ficar mais profissional.
 */
function gerarCodigoBilhete(): string {
  const chars = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `TKT-2026-${chars}`;
}

// ─── Provider ─────────────────────────────────────────────────────────────────

/**
 * CartProvider envolve o app inteiro (no _layout.tsx raiz) para que todas as
 * telas tenham acesso ao carrinho e bilhetes.
 */
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [carrinho, setCarrinho] = useState<CartItem[]>([]);
  const [bilhetes, setBilhetes] = useState<Ticket[]>([]);

  /** Adiciona um evento ao carrinho com um id único para permitir remoção individual. */
  function adicionarAoCarrinho(evento: Event) {
    const novoItem: CartItem = {
      ...evento,
      // Date.now() garante unicidade mesmo se o mesmo evento for adicionado duas vezes
      cartId: `${evento.id}-${Date.now()}`,
    };
    setCarrinho((prev) => [...prev, novoItem]);
  }

  /** Remove um item específico do carrinho pelo seu cartId. */
  function removerDoCarrinho(cartId: string) {
    setCarrinho((prev) => prev.filter((item) => item.cartId !== cartId));
  }

  /**
   * Move todos os itens do carrinho para bilhetes, gerando código único para cada um.
   * Depois limpa o carrinho.
   *
   * PERGUNTA DO PROFESSOR: "Como você garante que o código é único?"
   * RESPOSTA: Combinamos timestamp (Date.now) com Math.random, tornando colisão
   * praticamente impossível num app local sem servidor.
   */
  function finalizarCompra() {
    if (carrinho.length === 0) return;

    const dataCompra = new Date().toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    const novosBilhetes: Ticket[] = carrinho.map((item) => ({
      ...item,
      codigoBilhete: gerarCodigoBilhete(),
      dataCompra,
    }));

    setBilhetes((prev) => [...prev, ...novosBilhetes]);
    setCarrinho([]); // limpa o carrinho após a compra
  }

  /**
   * Calcula o total somando apenas itens com preço numérico (ignora "Gratuito").
   * parseFloat remove "R$ " e vírgulas para extrair o número.
   */
  const totalCarrinho = carrinho.reduce((soma, item) => {
    const numero = parseFloat(
      item.preco.replace("R$", "").replace(".", "").replace(",", ".").trim()
    );
    return isNaN(numero) ? soma : soma + numero;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        carrinho,
        bilhetes,
        adicionarAoCarrinho,
        removerDoCarrinho,
        finalizarCompra,
        totalCarrinho,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// ─── Hook de consumo ───────────────────────────────────────────────────────────

/**
 * useCart() é o hook que as telas usam para acessar o contexto.
 * Lança um erro claro se usado fora do CartProvider (evita bugs silenciosos).
 *
 * PERGUNTA DO PROFESSOR: "O que é um custom hook?"
 * RESPOSTA: É uma função que começa com 'use' e encapsula lógica de hooks do React.
 * Aqui ele apenas garante que o contexto existe antes de retorná-lo.
 */
export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart deve ser usado dentro de um CartProvider");
  }
  return context;
}
