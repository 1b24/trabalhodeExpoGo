/**
 * home.tsx
 * ────────────────────────────────────────────────────────────────────────────
 * Tela principal de listagem de eventos — Requisito 1 (identidade visual).
 *
 * PERGUNTA DO PROFESSOR: "O que é o useRouter?"
 * RESPOSTA: É o hook do Expo Router que expõe métodos de navegação.
 * `router.push('/detalhes/1')` adiciona a tela na pilha (pode voltar).
 * `router.replace(...)` troca a rota sem adicionar à pilha (não pode voltar).
 *
 * PERGUNTA DO PROFESSOR: "Por que o renderizarEvento está fora do componente?"
 * RESPOSTA: Funções declaradas dentro do componente são recriadas a cada
 * render. Fora do componente, ela é criada uma única vez. Para FlatList,
 * mover o renderItem para fora melhora a performance evitando re-renders
 * desnecessários dos itens.
 *
 * NOTA SOBRE ESTADO DE BUSCA: a busca filtra o array DADOS_EVENTOS localmente.
 * Em produção, faríamos um debounce + chamada de API a cada tecla digitada.
 */

import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCart } from "../../context/CartContext";
import { DADOS_EVENTOS } from "../../mocks/event";
import { CORES } from "../../theme/colors";
import { Event } from "../../types/event";

// ─── Sub-componente: Card de Evento ────────────────────────────────────────────
// Recebe o evento e callbacks como props para manter o componente puro
// (sem acessar context diretamente — facilita testes e reuso).
type CardEventoProps = {
  item: Event;
  onPress: () => void;
  onComprar: () => void;
};

function CardEvento({ item, onPress, onComprar }: CardEventoProps) {
  return (
    // Pressable torna o card inteiro clicável para ir à tela de detalhes
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressionado]}
      onPress={onPress}
    >
      <Image source={{ uri: item.imagem }} style={styles.imagemCapa} />

      <View style={styles.infoContainer}>
        {/* Data em destaque — cor de acento para chamar atenção */}
        <Text style={styles.dataTexto}>{item.data}</Text>
        <Text style={styles.tituloTexto} numberOfLines={2}>
          {item.titulo}
        </Text>

        <View style={styles.localLinha}>
          <Ionicons
            name="location-outline"
            size={13}
            color={CORES.textoSecundario}
          />
          <Text style={styles.localTexto} numberOfLines={1}>
            {item.local}
          </Text>
        </View>

        <View style={styles.rodapeCard}>
          <Text style={styles.precoTexto}>{item.preco}</Text>

          {/* Botão de comprar rápido — adiciona direto ao carrinho sem abrir detalhes */}
          <TouchableOpacity style={styles.botaoComprar} onPress={onComprar}>
            <Ionicons name="cart-outline" size={16} color="white" />
            <Text style={styles.textoBotao}>Adicionar</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Seta indicando que o card é clicável */}
      <View style={styles.seta}>
        <Ionicons
          name="chevron-forward"
          size={16}
          color={CORES.textoTerciario}
        />
      </View>
    </Pressable>
  );
}

// ─── Tela Principal ────────────────────────────────────────────────────────────
export default function HomeScreen() {
  const router = useRouter();
  const { adicionarAoCarrinho, carrinho } = useCart();
  const [busca, setBusca] = useState("");

  // Filtra eventos com base no texto digitado (case-insensitive)
  const eventosFiltrados = busca.trim()
    ? DADOS_EVENTOS.filter(
        (e) =>
          e.titulo.toLowerCase().includes(busca.toLowerCase()) ||
          e.local.toLowerCase().includes(busca.toLowerCase())
      )
    : DADOS_EVENTOS;

  function handleCompraRapida(evento: Event) {
    adicionarAoCarrinho(evento);
    // Feedback visual mínimo — vibração ou toast seriam melhorias futuras
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* ── Cabeçalho ────────────────────────────────────────────────────── */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerSub}>Olá, bem-vindo 👋</Text>
            <Text style={styles.headerTitulo}>Descubra Eventos</Text>
          </View>

          {/* Ícone do carrinho no header com badge */}
          <Pressable
            style={styles.headerCarrinho}
            onPress={() => router.push("/(tabs)/carrinho")}
          >
            <Ionicons name="cart-outline" size={24} color={CORES.primario} />
            {carrinho.length > 0 && (
              <View style={styles.headerBadge}>
                <Text style={styles.headerBadgeTexto}>{carrinho.length}</Text>
              </View>
            )}
          </Pressable>
        </View>

        {/* Campo de busca funcional */}
        <View style={styles.buscaContainer}>
          <Ionicons name="search-outline" size={18} color={CORES.textoTerciario} />
          <TextInput
            style={styles.inputBusca}
            placeholder="Buscar eventos, shows, cursos..."
            placeholderTextColor={CORES.textoTerciario}
            value={busca}
            onChangeText={setBusca}
          />
          {/* Botão limpar busca — aparece só quando há texto */}
          {busca.length > 0 && (
            <Pressable onPress={() => setBusca("")}>
              <Ionicons
                name="close-circle"
                size={18}
                color={CORES.textoTerciario}
              />
            </Pressable>
          )}
        </View>
      </View>

      {/* ── Contador de resultados ──────────────────────────────────────────── */}
      <View style={styles.resultadosHeader}>
        <Text style={styles.resultadosTexto}>
          {eventosFiltrados.length}{" "}
          {eventosFiltrados.length === 1 ? "evento encontrado" : "eventos encontrados"}
        </Text>
      </View>

      {/* ── Lista de Eventos ─────────────────────────────────────────────────── */}
      <FlatList
        data={eventosFiltrados}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CardEvento
            item={item}
            // Navega para a tela de detalhes passando o id como parâmetro de rota
            onPress={() => router.push(`/detalhes/${item.id}`)}
            onComprar={() => handleCompraRapida(item)}
          />
        )}
        contentContainerStyle={styles.listaContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.vazioContainer}>
            <Ionicons name="search-outline" size={48} color={CORES.bordaMedia} />
            <Text style={styles.vazioTexto}>Nenhum evento encontrado</Text>
          </View>
        }
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
    backgroundColor: CORES.branco,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: CORES.bordaSuave,
    gap: 14,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerSub: {
    fontSize: 13,
    color: CORES.textoSecundario,
    marginBottom: 2,
  },
  headerTitulo: {
    fontSize: 26,
    fontWeight: "bold",
    color: CORES.textoPrimario,
  },
  headerCarrinho: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: CORES.fundoIcone,
    justifyContent: "center",
    alignItems: "center",
  },
  headerBadge: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: CORES.acento,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 3,
  },
  headerBadgeTexto: {
    color: "#FFF",
    fontSize: 9,
    fontWeight: "bold",
  },
  buscaContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: CORES.fundo,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 10,
    borderWidth: 1,
    borderColor: CORES.bordaSuave,
  },
  inputBusca: {
    flex: 1,
    fontSize: 15,
    color: CORES.textoPrimario,
    padding: 0, // remove padding padrão do Android
  },
  // ── Contador de resultados ──────────────────────────────────────────────────
  resultadosHeader: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  resultadosTexto: {
    fontSize: 13,
    color: CORES.textoSecundario,
    fontWeight: "500",
  },
  // ── Lista ───────────────────────────────────────────────────────────────────
  listaContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 14,
  },
  // ── Card ────────────────────────────────────────────────────────────────────
  card: {
    backgroundColor: CORES.branco,
    borderRadius: 16,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  cardPressionado: {
    opacity: 0.92,
    transform: [{ scale: 0.99 }],
  },
  imagemCapa: {
    width: "100%",
    height: 170,
  },
  infoContainer: {
    padding: 14,
  },
  dataTexto: {
    color: CORES.perigo,
    fontWeight: "700",
    fontSize: 12,
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  tituloTexto: {
    fontSize: 17,
    fontWeight: "bold",
    color: CORES.textoPrimario,
    marginBottom: 8,
    lineHeight: 23,
  },
  localLinha: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 12,
  },
  localTexto: {
    fontSize: 13,
    color: CORES.textoSecundario,
    flex: 1,
  },
  rodapeCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: CORES.bordaSuave,
    paddingTop: 12,
  },
  precoTexto: {
    fontSize: 15,
    fontWeight: "bold",
    color: CORES.textoPrimario,
  },
  botaoComprar: {
    backgroundColor: CORES.primario,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  textoBotao: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 13,
  },
  seta: {
    position: "absolute",
    top: 14,
    right: 14,
    backgroundColor: CORES.branco,
    borderRadius: 12,
    padding: 2,
    opacity: 0.9,
  },
  // ── Vazio ───────────────────────────────────────────────────────────────────
  vazioContainer: {
    paddingTop: 60,
    alignItems: "center",
    gap: 12,
  },
  vazioTexto: {
    fontSize: 16,
    color: CORES.textoSecundario,
  },
});
