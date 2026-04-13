/**
 * (tabs)/_layout.tsx
 * ────────────────────────────────────────────────────────────────────────────
 * Define a navegação inferior (Tab Bar) com 4 abas.
 * O badge no carrinho mostra dinamicamente a quantidade de itens usando
 * o CartContext — isso é possível porque o CartProvider envolve todo o app
 * no _layout.tsx raiz.
 *
 * PERGUNTA DO PROFESSOR: "Como o badge do carrinho é atualizado em tempo real?"
 * RESPOSTA: O componente _layout acessa `carrinho.length` via useCart(). Quando
 * o estado muda no context, o React re-renderiza automaticamente todos os
 * componentes que consomem aquele contexto — incluindo este layout.
 */

import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useCart } from "../../context/CartContext";
import { CORES } from "../../theme/colors";

export default function TabLayout() {
  const { carrinho, bilhetes } = useCart();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: CORES.tabAtiva,
        tabBarInactiveTintColor: CORES.tabInativa,
        tabBarStyle: {
          backgroundColor: CORES.tabBackground,
          borderTopColor: CORES.bordaSuave,
          height: 60,
          paddingBottom: 8,
          paddingTop: 4,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
        },
      }}
    >
      {/* ── Aba Home ────────────────────────────────────────────────────────── */}
      <Tabs.Screen
        name="home"
        options={{
          title: "Eventos",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "compass" : "compass-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />

      {/* ── Aba Carrinho com badge ───────────────────────────────────────────── */}
      <Tabs.Screen
        name="carrinho"
        options={{
          title: "Carrinho",
          // tabBarBadge mostra um número vermelho sobre o ícone quando > 0
          tabBarBadge: carrinho.length > 0 ? carrinho.length : undefined,
          tabBarBadgeStyle: {
            backgroundColor: CORES.acento,
            fontSize: 10,
          },
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "cart" : "cart-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />

      {/* ── Aba Bilhetes ────────────────────────────────────────────────────── */}
      <Tabs.Screen
        name="bilhetes"
        options={{
          title: "Bilhetes",
          tabBarBadge: bilhetes.length > 0 ? bilhetes.length : undefined,
          tabBarBadgeStyle: {
            backgroundColor: CORES.sucesso,
            fontSize: 10,
          },
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "ticket" : "ticket-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />

      {/* ── Aba Perfil ──────────────────────────────────────────────────────── */}
      <Tabs.Screen
        name="profile"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
