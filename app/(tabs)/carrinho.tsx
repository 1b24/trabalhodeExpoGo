/**
 * carrinho.tsx
 * ────────────────────────────────────────────────────────────────────────────
 * Tela do Carrinho — Requisito 3.
 *
 * PERGUNTA DO PROFESSOR: "Por que FlatList e não map() no ScrollView?"
 * RESPOSTA: FlatList tem virtualização — só renderiza os itens visíveis na tela.
 * Com map() num ScrollView, todos os itens são montados no DOM ao mesmo tempo,
 * o que degrada performance em listas longas. Para listas com potencial de
 * crescimento, FlatList é sempre a escolha correta.
 *
 * PERGUNTA DO PROFESSOR: "Como o total é calculado?"
 * RESPOSTA: No CartContext, o `totalCarrinho` é um valor derivado calculado
 * via Array.reduce() sobre o array `carrinho`. Ele é recalculado automaticamente
 * sempre que o carrinho muda, pois é um valor no estado do contexto.
 */

import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  Alert,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CartItem, useCart } from "../../context/CartContext";
import { CORES } from "../../theme/colors";

export default function CarrinhoScreen() {
  const { carrinho, removerDoCarrinho, finalizarCompra, totalCarrinho } =
    useCart();
  const router = useRouter();

  function handleFinalizarCompra() {
    if (carrinho.length === 0) return;

    Alert.alert(
      "Confirmar Compra",
      `Total: ${
        totalCarrinho > 0
          ? `R$ ${totalCarrinho.toFixed(2).replace(".", ",")}`
          : "Gratuito"
      }\n\nDeseja finalizar a compra?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Confirmar",
          onPress: () => {
            finalizarCompra();
            Alert.alert(
              "Compra Realizada!",
              "Seus bilhetes estão disponíveis na aba Bilhetes.",
              [
                {
                  text: "Ver Bilhetes",
                  onPress: () => router.push("/(tabs)/bilhetes"),
                },
                { text: "OK", style: "cancel" },
              ]
            );
          },
        },
      ]
    );
  }

  // ── Componente de cada item do carrinho ──────────────────────────────────────
  function ItemCarrinho({ item }: { item: CartItem }) {
    return (
      <View style={styles.itemCard}>
        <Image source={{ uri: item.imagem }} style={styles.itemImagem} />
        <View style={styles.itemInfo}>
          <Text style={styles.itemTitulo} numberOfLines={2}>
            {item.titulo}
          </Text>
          <View style={styles.itemMeta}>
            <Ionicons
              name="calendar-outline"
              size={12}
              color={CORES.textoSecundario}
            />
            <Text style={styles.itemMetaTexto}>{item.data}</Text>
          </View>
          <View style={styles.itemMeta}>
            <Ionicons
              name="location-outline"
              size={12}
              color={CORES.textoSecundario}
            />
            <Text style={styles.itemMetaTexto} numberOfLines={1}>
              {item.local}
            </Text>
          </View>
          <View style={styles.itemRodape}>
            <Text style={styles.itemPreco}>{item.preco}</Text>
            {/* Ícone de lixeira — remove o item do carrinho */}
            <Pressable
              onPress={() => removerDoCarrinho(item.cartId)}
              style={styles.botaoRemover}
              hitSlop={8}
            >
              <Ionicons name="trash-outline" size={18} color={CORES.perigo} />
            </Pressable>
          </View>
        </View>
      </View>
    );
  }

  // ── Componente exibido quando o carrinho está vazio ──────────────────────────
  function CarrinhoVazio() {
    return (
      <View style={styles.vazioContainer}>
        <Ionicons name="cart-outline" size={72} color={CORES.bordaMedia} />
        <Text style={styles.vazioTitulo}>Carrinho vazio</Text>
        <Text style={styles.vazioSubtitulo}>
          Explore os eventos e adicione ingressos ao carrinho.
        </Text>
        <Pressable
          style={styles.botaoExplorar}
          onPress={() => router.push("/(tabs)/home")}
        >
          <Text style={styles.botaoExplorarTexto}>Ver Eventos</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* ── Cabeçalho ──────────────────────────────────────────────────────── */}
      <View style={styles.header}>
        <Text style={styles.headerTitulo}>Meu Carrinho</Text>
        {/* Quantidade no formato "X itens" conforme requisito */}
        {carrinho.length > 0 && (
          <Text style={styles.headerContagem}>
            {carrinho.length} {carrinho.length === 1 ? "item" : "itens"}
          </Text>
        )}
      </View>

      {/* ── Lista de itens ─────────────────────────────────────────────────── */}
      <FlatList
        data={carrinho}
        keyExtractor={(item) => item.cartId}
        renderItem={({ item }) => <ItemCarrinho item={item} />}
        ListEmptyComponent={<CarrinhoVazio />}
        contentContainerStyle={[
          styles.lista,
          carrinho.length === 0 && styles.listaVazia,
        ]}
        showsVerticalScrollIndicator={false}
      />

      {/* ── Rodapé com total e botão ────────────────────────────────────────── */}
      {carrinho.length > 0 && (
        <View style={styles.rodape}>
          <View style={styles.totalLinha}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValor}>
              {totalCarrinho > 0
                ? `R$ ${totalCarrinho.toFixed(2).replace(".", ",")}`
                : "Gratuito"}
            </Text>
          </View>
          <Pressable
            style={({ pressed }) => [
              styles.botaoFinalizar,
              pressed && styles.botaoPressionado,
            ]}
            onPress={handleFinalizarCompra}
          >
            <Ionicons name="checkmark-circle-outline" size={20} color="#FFF" />
            <Text style={styles.botaoFinalizarTexto}>Finalizar Compra</Text>
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CORES.fundo,
  },
  // ── Header ──────────────────────────────────────────────────────────────────
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: CORES.branco,
    borderBottomWidth: 1,
    borderBottomColor: CORES.bordaSuave,
  },
  headerTitulo: {
    fontSize: 22,
    fontWeight: "bold",
    color: CORES.textoPrimario,
  },
  headerContagem: {
    fontSize: 14,
    fontWeight: "500",
    color: CORES.textoSecundario,
    marginLeft: 2,
  },
  badge: {
    backgroundColor: CORES.primario,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 5,
  },
  badgeTexto: {
    color: "#FFF",
    fontSize: 11,
    fontWeight: "bold",
  },
  // ── Lista ───────────────────────────────────────────────────────────────────
  lista: {
    padding: 16,
    gap: 12,
  },
  listaVazia: {
    flex: 1,
  },
  // ── Item card ───────────────────────────────────────────────────────────────
  itemCard: {
    backgroundColor: CORES.branco,
    borderRadius: 14,
    flexDirection: "row",
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    marginBottom: 4,
  },
  itemImagem: {
    width: 90,
    height: 110,
  },
  itemInfo: {
    flex: 1,
    padding: 12,
    justifyContent: "space-between",
  },
  itemTitulo: {
    fontSize: 14,
    fontWeight: "700",
    color: CORES.textoPrimario,
    marginBottom: 6,
    lineHeight: 20,
  },
  itemMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 3,
  },
  itemMetaTexto: {
    fontSize: 12,
    color: CORES.textoSecundario,
    flex: 1,
  },
  itemRodape: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 6,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: CORES.bordaSuave,
  },
  itemPreco: {
    fontSize: 13,
    fontWeight: "bold",
    color: CORES.primario,
  },
  botaoRemover: {
    padding: 4,
  },
  // ── Vazio ───────────────────────────────────────────────────────────────────
  vazioContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
    gap: 12,
  },
  vazioTitulo: {
    fontSize: 20,
    fontWeight: "bold",
    color: CORES.textoPrimario,
  },
  vazioSubtitulo: {
    fontSize: 14,
    color: CORES.textoSecundario,
    textAlign: "center",
    lineHeight: 20,
  },
  botaoExplorar: {
    marginTop: 8,
    backgroundColor: CORES.primario,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 28,
  },
  botaoExplorarTexto: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 15,
  },
  // ── Rodapé com total ────────────────────────────────────────────────────────
  rodape: {
    backgroundColor: CORES.branco,
    borderTopWidth: 1,
    borderTopColor: CORES.bordaSuave,
    padding: 16,
    paddingBottom: 24,
    gap: 12,
  },
  totalLinha: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: {
    fontSize: 16,
    color: CORES.textoSecundario,
    fontWeight: "500",
  },
  totalValor: {
    fontSize: 22,
    fontWeight: "bold",
    color: CORES.textoPrimario,
  },
  botaoFinalizar: {
    backgroundColor: CORES.acento,
    borderRadius: 14,
    height: 54,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  botaoPressionado: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  botaoFinalizarTexto: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
