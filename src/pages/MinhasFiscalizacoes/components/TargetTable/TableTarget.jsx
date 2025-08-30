"use client";
import { useContext, useState } from "react";
import { SiGooglemaps } from "react-icons/si";
import {  NavLink, useNavigate } from "react-router-dom";
import styles from "./TargetTable.module.css";
import { FiEye, FiRefreshCw } from "react-icons/fi";
import { DataContext } from "../../../../context/DataContext";
import { ButtonComponent } from "../../../../components/Button/Button";

export default function TableTarget() {
  const { userData } = useContext(DataContext);
  const navigate = useNavigate();
  const [loading] = useState(false); // Simulando loading (pode vir do contexto)

  // Extrai todos os targets das equipes do usuário
  const allTargets = userData[0]?.teams?.flatMap(team => team.targets) || [];

  console.log(allTargets)

  const handleOpenMap = () => {
    // Salva os alvos no sessionStorage
    sessionStorage.setItem("userTargets", JSON.stringify(allTargets));
    navigate("/view/meus_alvos/mapa"); // Ajuste conforme sua rota
  };

  return (
    <div className={styles.container}>
     
      <div className={styles.card}>
        {/* Botão para abrir mapa */}
        <div className={styles.header}>
          <ButtonComponent
            variant="blue"
            onClick={handleOpenMap}
            icon={<SiGooglemaps size={18} />}
          >
            Ver no Mapa
          </ButtonComponent>
        </div>

        {/* Tabela */}
        <div style={{ overflowX: "auto" }}>
               <table className={styles.table}>
                 <thead>
                   <tr>
                   
                     <th>ART</th>
                     <th>Proprietário</th>
                     <th>Endereço</th>
                     <th>Status</th>
                     {/* <th>Equipe Atual</th> */}
                     <th>Ações</th> 
                   </tr>
                 </thead>
                 <tbody>
                   {loading ? (
                     <tr>
                       <td colSpan={7} className={styles.loadingRow}>
                         Carregando...
                       </td>
                     </tr>
                   ) : allTargets.length === 0 ? (
                     <tr>
                       <td colSpan={7} className={styles.emptyRow}>
                         Nenhum alvo encontrado com os filtros aplicados.
                       </td>
                     </tr>
                   ) : (
                     allTargets.map((target) => {
                       const isAssigned = !!target.teamId;
                       return (
                         <tr
                           key={target.id}
                           className={`${styles.tableRow} ${isAssigned ? styles.assigned : ""}`}
                         >
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
                               className={`${styles.statusBadge} ${
                                 target.status === "CONCLUÍDA"
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
                           {/* <td>
                             {target.team ? (
                               <span
                                 className={styles.teamBadge}
                                 style={{
                                   backgroundColor: `${target.team.color}30`,
                                   color: target.team.color,
                                 }}
                               >
                                 {target.team.name}
                               </span>
                             ) : (
                               <span style={{ color: "#9ca3af" }}>Não vinculado</span>
                             )}
                           </td> */}
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
                               {/* <button
                                 onClick={() => handleOpenInMap(target)}
                                 className={styles.actionButton}
                                 title="Ver no mapa"
                               >
                                 <FiMapPin size={16} />
                               </button> */}
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
    </div>
  );
}