/**
 * bilhetes.tsx
 * ────────────────────────────────────────────────────────────────────────────
 * Tela de Bilhetes — Requisito 4.
 * Exibe os ingressos confirmados após a finalização da compra no carrinho.
 *
 * PERGUNTA DO PROFESSOR: "De onde vêm os dados dos bilhetes?"
 * RESPOSTA: Do CartContext. Quando o usuário clica em "Finalizar Compra",
 * a função `finalizarCompra()` move os itens do array `carrinho` para o
 * array `bilhetes`, gerando um código único para cada um. Essa tela apenas
 * lê o array `bilhetes` via useCart().
 *
 * PERGUNTA DO PROFESSOR: "O que é o código do bilhete e como é gerado?"
 * RESPOSTA: É gerado pela função `gerarCodigoBilhete()` no CartContext usando
 * Math.random().toString(36) + toUpperCase(). Num sistema real, esse código
 * viria do servidor e seria armazenado no banco de dados para validação.
 */

import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ticket, useCart } from "../../context/CartContext";
import { CORES } from "../../theme/colors";

export default function BilhetesScreen() {
  const { bilhetes } = useCart();
  const router = useRouter();

  // ── Card de bilhete confirmado ───────────────────────────────────────────────
  function CardBilhete({ item }: { item: Ticket }) {
    return (
      <View style={styles.card}>
        {/* Imagem do evento */}
        <Image source={{ uri: item.imagem }} style={styles.cardImagem} />

        <View style={styles.cardCorpo}>
          {/* Carimbo de confirmado */}
          <View style={styles.confirmadoBadge}>
            <Ionicons name="checkmark-circle" size={13} color={CORES.sucesso} />
            <Text style={styles.confirmadoTexto}>Confirmado</Text>
          </View>

          {/* Título */}
          <Text style={styles.cardTitulo} numberOfLines={2}>
            {item.titulo}
          </Text>

          {/* Data */}
          <View style={styles.metaLinha}>
            <Ionicons
              name="calendar-outline"
              size={13}
              color={CORES.primario}
            />
            <Text style={styles.metaTexto}>{item.data}</Text>
          </View>

          {/* Local */}
          <View style={styles.metaLinha}>
            <Ionicons
              name="location-outline"
              size={13}
              color={CORES.primario}
            />
            <Text style={styles.metaTexto} numberOfLines={1}>
              {item.local}
            </Text>
          </View>

          {/* Divisor tracejado — visual de ingresso */}
          <View style={styles.divisorTracejado} />

          {/* Código do bilhete */}
          <View style={styles.codigoContainer}>
            <View>
              <Text style={styles.codigoLabel}>Código do Bilhete</Text>
              <Text style={styles.codigoValor}>{item.codigoBilhete}</Text>
            </View>
            <Ionicons name="qr-code-outline" size={28} color={CORES.primario} />
          </View>

          {/* Data da compra */}
          <Text style={styles.dataCompra}>Comprado em {item.dataCompra}</Text>
        </View>
      </View>
    );
  }

  // ── Tela vazia ───────────────────────────────────────────────────────────────
  function BilhetesVazios() {
    return (
      <View style={styles.vazioContainer}>
        <Ionicons name="ticket-outline" size={72} color={CORES.bordaMedia} />
        <Text style={styles.vazioTitulo}>Nenhum bilhete ainda</Text>
        <Text style={styles.vazioSubtitulo}>
          Finalize uma compra no carrinho para ver seus bilhetes aqui.
        </Text>
        <Pressable
          style={styles.botaoIr}
          onPress={() => router.push("/(tabs)/home")}
        >
          <Text style={styles.botaoIrTexto}>Explorar Eventos</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* ── Cabeçalho ──────────────────────────────────────────────────────── */}
      <View style={styles.header}>
        <Text style={styles.headerTitulo}>Meus Bilhetes</Text>
        {/* Quantidade no formato "X bilhetes" conforme requisito */}
        {bilhetes.length > 0 && (
          <Text style={styles.headerContagem}>
            {bilhetes.length} {bilhetes.length === 1 ? "bilhete" : "bilhetes"}
          </Text>
        )}
      </View>

      {/* ── Lista de bilhetes ──────────────────────────────────────────────── */}
      <FlatList
        data={bilhetes}
        // Usamos codigoBilhete como key pois é único por bilhete
        keyExtractor={(item) => item.codigoBilhete}
        renderItem={({ item }) => <CardBilhete item={item} />}
        ListEmptyComponent={<BilhetesVazios />}
        contentContainerStyle={[
          styles.lista,
          bilhetes.length === 0 && styles.listaVazia,
        ]}
        showsVerticalScrollIndicator={false}
      />
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
    backgroundColor: CORES.sucesso,
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
    gap: 16,
  },
  listaVazia: {
    flex: 1,
  },
  // ── Card bilhete ────────────────────────────────────────────────────────────
  card: {
    backgroundColor: CORES.branco,
    borderRadius: 16,
    overflow: "hidden",
    elevation: 3,
    shadowColor: CORES.primario,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    marginBottom: 4,
    // Borda esquerda colorida — estética de ingresso
    borderLeftWidth: 4,
    borderLeftColor: CORES.primario,
  },
  cardImagem: {
    width: "100%",
    height: 140,
  },
  cardCorpo: {
    padding: 16,
  },
  confirmadoBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 8,
  },
  confirmadoTexto: {
    fontSize: 12,
    color: CORES.sucesso,
    fontWeight: "600",
  },
  cardTitulo: {
    fontSize: 17,
    fontWeight: "bold",
    color: CORES.textoPrimario,
    marginBottom: 10,
    lineHeight: 24,
  },
  metaLinha: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 5,
  },
  metaTexto: {
    fontSize: 13,
    color: CORES.textoSecundario,
    flex: 1,
  },
  // Divisor tracejado simula a "linha de corte" de um ingresso físico
  divisorTracejado: {
    height: 1,
    borderWidth: 1,
    borderColor: CORES.bordaMedia,
    borderStyle: "dashed",
    marginVertical: 14,
  },
  codigoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: CORES.fundoPrimarioSuave,
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  codigoLabel: {
    fontSize: 11,
    color: CORES.textoSecundario,
    fontWeight: "500",
    marginBottom: 3,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  codigoValor: {
    fontSize: 18,
    fontWeight: "bold",
    color: CORES.primario,
    letterSpacing: 1.5,
    fontVariant: ["tabular-nums"],
  },
  dataCompra: {
    fontSize: 11,
    color: CORES.textoTerciario,
    textAlign: "right",
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
  botaoIr: {
    marginTop: 8,
    backgroundColor: CORES.primario,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 28,
  },
  botaoIrTexto: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 15,
  },
});
