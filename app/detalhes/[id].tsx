/**
 * detalhes/[id].tsx
 * ────────────────────────────────────────────────────────────────────────────
 * Tela de Detalhes do Evento — Requisito 2.
 *
 * O [id] no nome do arquivo é uma ROTA DINÂMICA do Expo Router.
 * Quando o usuário navega para /detalhes/1, o Expo Router renderiza este
 * arquivo e disponibiliza o valor "1" via useLocalSearchParams().
 *
 * PERGUNTA DO PROFESSOR: "Como funciona a rota dinâmica?"
 * RESPOSTA: O Expo Router usa convenção de arquivo — colchetes no nome indicam
 * um parâmetro variável na URL, igual ao Next.js. useLocalSearchParams() retorna
 * um objeto com todos os parâmetros da rota atual.
 *
 * PERGUNTA DO PROFESSOR: "Por que ScrollView aqui e FlatList na Home?"
 * RESPOSTA: ScrollView é ideal para conteúdo de tamanho conhecido (uma tela de
 * detalhes). FlatList tem virtualização — renderiza só os itens visíveis — sendo
 * eficiente para listas longas e dinâmicas.
 */

import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCart } from "../../context/CartContext";
import { DADOS_EVENTOS } from "../../mocks/event";
import { CORES } from "../../theme/colors";

export default function DetalhesScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { adicionarAoCarrinho } = useCart();

  // Busca o evento pelo id recebido na rota
  const evento = DADOS_EVENTOS.find((e) => e.id === id);

  // Segurança: se o evento não existir (rota inválida), mostra mensagem de erro
  if (!evento) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.erroTexto}>Evento não encontrado.</Text>
      </SafeAreaView>
    );
  }

  function handleAdicionarAoCarrinho() {
    adicionarAoCarrinho(evento!);
    Alert.alert(
      "Adicionado!",
      `"${evento!.titulo}" foi adicionado ao seu carrinho.`,
      [
        { text: "Ver Carrinho", onPress: () => router.push("/(tabs)/carrinho") },
        { text: "Continuar", style: "cancel" },
      ]
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* ── Cabeçalho com botão voltar ─────────────────────────────────────── */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.botaoVoltar}>
          <Ionicons name="arrow-back" size={24} color={CORES.textoPrimario} />
        </Pressable>
        <Text style={styles.headerTitulo} numberOfLines={1}>
          {evento.titulo}
        </Text>
        {/* Espaço vazio para centralizar o título (técnica de layout simétrico) */}
        <View style={{ width: 44 }} />
      </View>

      {/* ── Conteúdo rolável ───────────────────────────────────────────────── */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Imagem de capa */}
        <Image source={{ uri: evento.imagem }} style={styles.imagemCapa} />

        <View style={styles.corpo}>
          {/* Título */}
          <Text style={styles.titulo}>{evento.titulo}</Text>

          {/* Seção: Informações Rápidas */}
          <Text style={styles.secaoTitulo}>Informações Rápidas</Text>

          {/* Data e hora */}
          <View style={styles.metaLinha}>
            <Ionicons name="calendar-outline" size={16} color={CORES.primario} />
            <Text style={styles.metaTexto}>{evento.data}</Text>
          </View>

          {/* Localização */}
          <View style={styles.metaLinha}>
            <Ionicons name="location-outline" size={16} color={CORES.primario} />
            <Text style={styles.metaTexto}>{evento.local}</Text>
          </View>

          {/* Preço */}
          <View style={styles.precoContainer}>
            <Text style={styles.precoLabel}>Valor do ingresso</Text>
            <Text style={styles.precoValor}>{evento.preco}</Text>
          </View>

          {/* Divisor */}
          <View style={styles.divisor} />

          {/* Sobre o evento */}
          <Text style={styles.secaoTitulo}>Sobre o evento</Text>
          <Text style={styles.descricaoTexto}>{evento.descricao}</Text>
        </View>
      </ScrollView>

      {/* ── Botão fixo na base ─────────────────────────────────────────────── */}
      <View style={styles.rodape}>
        <Pressable
          style={({ pressed }) => [
            styles.botaoGarantir,
            pressed && styles.botaoPressionado,
          ]}
          onPress={handleAdicionarAoCarrinho}
        >
          <Ionicons name="ticket-outline" size={20} color="#FFF" />
          <Text style={styles.botaoTexto}>Garantir Ingresso</Text>
        </Pressable>
      </View>
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
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: CORES.branco,
    borderBottomWidth: 1,
    borderBottomColor: CORES.bordaSuave,
  },
  botaoVoltar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: CORES.fundoIcone,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitulo: {
    fontSize: 17,
    fontWeight: "600",
    color: CORES.textoPrimario,
    flex: 1,
    textAlign: "center",
  },
  // ── Scroll ──────────────────────────────────────────────────────────────────
  scrollContent: {
    paddingBottom: 120, // espaço para o botão fixo não sobrepor o conteúdo
  },
  imagemCapa: {
    width: "100%",
    height: 240,
  },
  corpo: {
    padding: 20,
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    color: CORES.textoPrimario,
    marginBottom: 16,
    lineHeight: 32,
  },
  metaLinha: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  metaTexto: {
    fontSize: 15,
    color: CORES.textoSecundario,
    flex: 1,
  },
  precoContainer: {
    backgroundColor: CORES.fundoPrimarioSuave,
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  precoLabel: {
    fontSize: 13,
    color: CORES.textoSecundario,
    fontWeight: "500",
  },
  precoValor: {
    fontSize: 18,
    fontWeight: "bold",
    color: CORES.primario,
  },
  divisor: {
    height: 1,
    backgroundColor: CORES.bordaSuave,
    marginVertical: 20,
  },
  secaoTitulo: {
    fontSize: 18,
    fontWeight: "700",
    color: CORES.textoPrimario,
    marginBottom: 12,
  },
  descricaoTexto: {
    fontSize: 15,
    color: CORES.textoSecundario,
    lineHeight: 24,
  },
  // ── Rodapé fixo ─────────────────────────────────────────────────────────────
  rodape: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: CORES.branco,
    borderTopWidth: 1,
    borderTopColor: CORES.bordaSuave,
    padding: 16,
    paddingBottom: 28,
  },
  botaoGarantir: {
    backgroundColor: CORES.primario,
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
  botaoTexto: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  // ── Erro ────────────────────────────────────────────────────────────────────
  erroTexto: {
    textAlign: "center",
    marginTop: 40,
    color: CORES.textoSecundario,
    fontSize: 16,
  },
});
