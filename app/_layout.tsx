/**
 * _layout.tsx (raiz)
 * ────────────────────────────────────────────────────────────────────────────
 * Este é o layout raiz do Expo Router. Ele envolve TODO o app com o
 * CartProvider, garantindo que qualquer tela da árvore possa acessar o
 * estado global do carrinho e dos bilhetes via useCart().
 *
 * PERGUNTA DO PROFESSOR: "Por que o Provider fica aqui e não em App.tsx?"
 * RESPOSTA: Com Expo Router, o _layout.tsx raiz substitui o App.tsx como
 * ponto de entrada da árvore de componentes. Colocar o Provider aqui garante
 * que todas as rotas (login, tabs, detalhes) estejam dentro do contexto.
 */

import { Stack } from "expo-router";
import { CartProvider } from "../context/CartContext";

export default function RootLayout() {
  return (
    <CartProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="login" />
        <Stack.Screen name="(tabs)" />
        {/* Rota dinâmica para a tela de detalhes de cada evento */}
        <Stack.Screen name="detalhes/[id]" />
      </Stack>
    </CartProvider>
  );
}
