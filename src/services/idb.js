import { openDB } from "idb";

const DB_NAME = "fiscalizacao-db";
const DB_VERSION = 4;

// Função para conectar/criar o banco de dados
async function getDB() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Cria store para usuários, se não existir
      if (!db.objectStoreNames.contains("users")) {
        db.createObjectStore("users", { keyPath: "id" });
      }

      // Cria store para targets, se não existir
      if (!db.objectStoreNames.contains("targets")) {
        db.createObjectStore("targets", { keyPath: "id" });
      }
      // ✅ Adicione o store para 'teams'
      if (!db.objectStoreNames.contains("teams")) {
        db.createObjectStore("teams", { keyPath: "id" });
      }
       // ✅ Novo store para equipes com detalhes
       if (!db.objectStoreNames.contains("teams_detalhados")) {
        db.createObjectStore("teams_detalhados", { keyPath: "id" });
      }
    },
  });
}

// --- Funções para Usuários ---

/**
 * Salva um ou múltiplos usuários no IndexedDB
 * @param {Object|Object[]} users - Objeto de usuário ou array de usuários
 */
export async function salvarUserData(users) {
  const arr = Array.isArray(users) ? users : [users];
  const db = await getDB();
  const tx = db.transaction("users", "readwrite");
  const store = tx.objectStore("users");
  for (const u of arr) {
    await store.put(u);
  }
  await tx.done;
}

/**
 * Salva um ou múltiplos teams no IndexedDB
 * @param {Object|Object[]} teams - Objeto de usuário ou array de usuários
 */
export async function salvarTeamData(teams) {
  const arr = Array.isArray(teams) ? teams : [teams];
  const db = await getDB();
  const tx = db.transaction("teams", "readwrite");
  const store = tx.objectStore("teams");
  for (const u of arr) {
    await store.put(u);
  }
  await tx.done;
}
/**
 * Carrega todos os teams salvos no IndexedDB
 * @returns {Promise<Object[]>}
 */
export async function carregarTodosTeams() {
  const db = await getDB();
  return db.getAll("teams");
}

/**
 * Carrega todos os usuários salvos no IndexedDB
 * @returns {Promise<Object[]>}
 */
export async function carregarTodosUsers() {
  const db = await getDB();
  return db.getAll("users");
}

// --- Funções para Targets ---

/**
 * Salva uma lista de targets no IndexedDB
 * @param {Object[]} targets - Array de alvos/fiscalizações
 */
export async function salvarTargets(targets) {
  const db = await getDB();
  const tx = db.transaction("targets", "readwrite");
  const store = tx.objectStore("targets");
  for (const t of targets) {
    await store.put(t);
  }
  await tx.done;
}

/**
 * Carrega todos os targets salvos no IndexedDB
 * @returns {Promise<Object[]>}
 */
export async function carregarTodosTargets() {
  const db = await getDB();
  return db.getAll("targets");
}

/**
 * Limpa todos os targets do IndexedDB (opcional)
 */
export async function limparTargets() {
  const db = await getDB();
  const tx = db.transaction("targets", "readwrite");
  await tx.objectStore("targets").clear();
  await tx.done;
}



/**
 * Salva uma equipe específica (com membros e alvos) no IndexedDB
 * @param {Object} team - Equipe com users, targets, etc.
 */
export async function salvarTeamDetalhado(team) {
  if (!team || !team.id) {
    console.warn("❌ Não foi possível salvar equipe: falta ID", team);
    return;
  }

  try {
    const db = await getDB();
    const tx = db.transaction("teams_detalhados", "readwrite");
    const store = tx.objectStore("teams_detalhados");

    await store.put(team); // ✅ Sem segundo parâmetro

    console.log("✅ Equipe salva no IndexedDB:", team.id, team.name);
  } catch (error) {
    console.error("❌ Erro ao salvar equipe no IndexedDB:", error);
  }
}

/**
 * Carrega uma equipe específica do IndexedDB
 * @param {number} teamId - ID da equipe
 * @returns {Promise<Object|null>}
 */
export async function carregarTeamDetalhado(teamId) {
  try {
    const db = await getDB();
    const team = await db.get("teams_detalhados", Number(teamId));
    console.log("🔍 Carregado do IndexedDB:", team ? team : "não encontrado", "ID:", teamId);
    return team;
  } catch (error) {
    console.error("❌ Erro ao carregar equipe do IndexedDB:", error);
    return null;
  }
}

/**
 * Limpa todas as equipes detalhadas (opcional)
 */
export async function limparTeamDetalhado() {
  const db = await getDB();
  const tx = db.transaction("teams_detalhados", "readwrite");
  await tx.objectStore("teams_detalhados").clear();
  await tx.done;
}