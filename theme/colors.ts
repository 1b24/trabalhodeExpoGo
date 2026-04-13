/**
 * theme/colors.ts
 * ────────────────────────────────────────────────────────────────────────────
 * Paleta de cores centralizada do Easy-Ticket.
 * Importar daqui (em vez de escrever hex hardcoded em cada tela) garante que
 * uma mudança aqui reflete em todo o app automaticamente.
 *
 * PERGUNTA DO PROFESSOR: "Por que centralizar as cores?"
 * RESPOSTA: Princípio DRY (Don't Repeat Yourself). Se o cliente pedir para
 * trocar a cor principal de roxo para azul, você muda um único arquivo.
 */
export const CORES = {
  // ── Identidade Visual ──────────────────────────────────────────────────────
  primario: "#5B21B6",           // roxo profundo — cor principal do app
  primarioClaro: "#7C3AED",      // roxo mais claro para hover/gradiente
  acento: "#F97316",             // laranja vibrante — CTAs e destaques
  acentoSuave: "#FFF7ED",        // laranja bem claro para backgrounds

  // ── Backgrounds ───────────────────────────────────────────────────────────
  fundo: "#F5F3FF",              // lilás muito claro — fundo de telas
  branco: "#FFFFFF",
  fundoIcone: "#EDE9FE",         // background de ícones circulares
  fundoPrimarioSuave: "#EDE9FE", // background de cards com destaque

  // ── Textos ────────────────────────────────────────────────────────────────
  textoPrimario: "#1E1B4B",      // roxo escuro quase preto
  textoSecundario: "#6B7280",    // cinza médio
  textoTerciario: "#9CA3AF",     // cinza claro

  // ── Bordas e Separadores ──────────────────────────────────────────────────
  bordaSuave: "#E9D5FF",         // lilás claro para bordas
  bordaMedia: "#DDD6FE",

  // ── Semântico ─────────────────────────────────────────────────────────────
  sucesso: "#10B981",            // verde — bilhete confirmado
  perigo: "#EF4444",             // vermelho — data de destaque / remover
  aviso: "#F59E0B",              // amarelo — avisos

  // ── Tab Bar ───────────────────────────────────────────────────────────────
  tabAtiva: "#5B21B6",
  tabInativa: "#9CA3AF",
  tabBackground: "#FFFFFF",
};
