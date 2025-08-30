"use client";
import { useState, useContext, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FiEye, FiMapPin, FiRefreshCw } from "react-icons/fi";
import styles from "./TargetTable.module.css";
import { DataContext } from "../../../../context/DataContext";
import { ButtonComponent } from "../../../../components/Button/Button";
import { AiOutlineClear } from "react-icons/ai";

export function TargetTable({ onSelectionChange }) {
  const { targets, filters: contextFilters, setFilters, loading, fetchTargets } = useContext(DataContext);
  const navigate = useNavigate();

  const [selectedTargetIds, setSelectedTargetIds] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [localFilters, setLocalFilters] = useState({
    numeroArt: "",
    teamId: "",
    status: "",
  });

  // Sincroniza filtros locais com os do contexto
  useEffect(() => {
    setLocalFilters({
      numeroArt: contextFilters.numeroArt || "",
      teamId: contextFilters.teamId || "",
      status: contextFilters.status || "",
    });
  }, [contextFilters]);

  // Notifica o pai sobre seleção
  useEffect(() => {
    onSelectionChange(selectedTargetIds);
  }, [selectedTargetIds, onSelectionChange]);

  // Reseta seleção quando os alvos mudarem
  useEffect(() => {
    setSelectedTargetIds([]);
    setSelectAll(false);
  }, [targets]);

  const handleSelectAll = () => {
    const availableTargets = targets.filter((t) => !t.teamId);
    if (selectAll) {
      setSelectedTargetIds([]);
    } else {
      setSelectedTargetIds(availableTargets.map((t) => t.id));
    }
    setSelectAll(!selectAll);
  };

  const handleToggle = (id) => {
    setSelectedTargetIds((prev) =>
      prev.includes(id)
        ? prev.filter((i) => i !== id)
        : [...prev, id]
    );
  };

  const handleOpenMap = () => {
    sessionStorage.setItem("userTargets", JSON.stringify(targets));
    navigate("/view/meus_alvos/mapa");
  };

  const handleView = (target) => {
    // Ex: navegar para /alvos/123
    console.log("Ver detalhes:", target);
    // navigate(`/alvos/${target.id}`);
  };

  const handleOpenInMap = (target) => {
    const userTargets = [target];
    sessionStorage.setItem("userTargets", JSON.stringify(userTargets));
    navigate("/view/meus_alvos/mapa");
  };

  const handleReallocate = (target) => {
    // Ex: abrir modal de realocação
    console.log("Realocar alvo:", target);
    // Abrir modal ou navegar para formulário
  };

  // Extrai equipes únicas dos targets
  const uniqueTeams = Array.from(
    new Set(targets.map((t) => t.team?.id).filter(Boolean))
  ).map((teamId) => {
    return targets.find((t) => t.team?.id === teamId)?.team;
  });

  return (
    <div className={styles.container}>
      {/* Botão para abrir mapa */}
      <div className={styles.header}>

        <div className={styles.filterGroup}>
          <ButtonComponent
            variant="gray"
            onClick={() => {
              setLocalFilters({ numeroArt: "", teamId: "", status: "" });
              setFilters({});
            }}

          >
            <AiOutlineClear size={20} />
            Limpar
          </ButtonComponent>
        </div>
        <ButtonComponent
          variant="blue"
          onClick={handleOpenMap}
          icon={<FiMapPin size={18} />}
        >
          Ver no Mapa
        </ButtonComponent>
      </div>

      {/* Filtros */}
      <div className={styles.filters}>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Nº ART</label>
          <input
            type="text"
            value={localFilters.numeroArt}
            onChange={(e) => {
              const value = e.target.value;
              setLocalFilters((prev) => ({ ...prev, numeroArt: value }));
              setFilters((prev) => ({ ...prev, numeroArt: value }));
            }}
            placeholder="72624476"
            className={styles.filterInput}
          />
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Equipe</label>
          <select
            value={localFilters.teamId}
            onChange={(e) => {
              const value = e.target.value;
              setLocalFilters((prev) => ({ ...prev, teamId: value }));
              setFilters((prev) => ({ ...prev, teamId: value || undefined }));
            }}
            className={styles.filterSelect}
          >
            <option value="">Todas</option>
            {uniqueTeams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Status</label>
          <select
            value={localFilters.status}
            onChange={(e) => {
              const value = e.target.value;
              setLocalFilters((prev) => ({ ...prev, status: value }));
              setFilters((prev) => ({ ...prev, status: value || undefined }));
            }}
            className={styles.filterSelect}
          >
            <option value="">Todos</option>
            <option value="NÃO INICIADA">NÃO INICIADA</option>
            <option value="EM ANDAMENTO">EM ANDAMENTO</option>
            <option value="CONCLUÍDA">CONCLUÍDA</option>
          </select>
        </div>

      </div>

      {/* Tabela */}
      <div style={{ overflowX: "auto" }}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                  disabled={targets.filter((t) => !t.teamId).length === 0}
                  style={{ width: "1rem", height: "1rem" }}
                />
              </th>
              <th>ART</th>
              <th>Proprietário</th>
              <th>Endereço</th>
              <th>Status</th>
              <th>Equipe Atual</th>
              <th>Ações</th> {/* Nova coluna */}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className={styles.loadingRow}>
                  Carregando...
                </td>
              </tr>
            ) : targets.length === 0 ? (
              <tr>
                <td colSpan={7} className={styles.emptyRow}>
                  Nenhum alvo encontrado com os filtros aplicados.
                </td>
              </tr>
            ) : (
              targets.map((target) => {
                const isAssigned = !!target.teamId;
                return (
                  <tr
                    key={target.id}
                    className={`${styles.tableRow} ${isAssigned ? styles.assigned : ""}`}
                  >
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedTargetIds.includes(target.id)}
                        onChange={() => handleToggle(target.id)}
                        disabled={isAssigned}
                        style={{ width: "1rem", height: "1rem" }}
                      />
                    </td>
                    <td>
                      <div style={{ fontWeight: 500, color: "#1f2937" }}>
                        {target.numeroArt}
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: "0.25rem" }}>
                        {target.tipoArt}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 500 }}>{target.nomeProprietario}</div>
                      <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>{target.cnpj}</div>
                    </td>
                    <td>{target.enderecoObra}</td>
                    <td>
                      <span
                        className={`${styles.statusBadge} ${target.status === "CONCLUÍDA"
                          ? styles.bgGreen
                          : target.status === "EM ANDAMENTO"
                            ? styles.bgYellow
                            : target.status === "NÃO INICIADA"
                              ? styles.bgGray
                              : styles.bgGray
                          }`}
                      >
                        {target.status}
                      </span>
                    </td>
                    <td >
                      {target.team ? (
                        <span
                          className={styles.teamBadge}
                          style={{
                            color: target.team.color,
                          }}
                        >
                          {target.team.name}
                        </span>
                      ) : (
                        <span > - </span>
                      )}
                    </td>
                    {/* Nova coluna de ações */}
                    <td>
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <NavLink to={`/view/target/${target.id}`}
                          onClick={() => handleView(target)}
                          className={styles.actionButton}
                          title="Ver detalhes"
                        >
                          <FiEye size={16} />
                        </NavLink>

                        <button
                          onClick={() => handleReallocate(target)}
                          className={styles.actionButton}
                          title="Realocar"
                        >
                          <FiRefreshCw size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}