"use client";
import { useState } from "react";
import styles from "./Fiscalizacoes.module.css";
import { ButtonComponent } from "../../components/Button/Button";
import DashboardHeader from "../../components/Title/Title";
import { TargetTable } from "./components/TargetTable/TargetTable";
import { AssignTargetsModal } from "./components/AssignTargetsModal/AssignTargetsModal";



export default function TargetsPage() {
  const [selectedTargetIds, setSelectedTargetIds] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSelectionChange = (ids) => {
    setSelectedTargetIds(ids);
  };

  const handleAssign = () => {
    console.log("Alvos atribuídos:", selectedTargetIds);
    setIsModalOpen(false);
    // Aqui você pode chamar uma função para atualizar os dados
    // Ex: refetch targets, mostrar toast, etc.
  };

  return (
    <div className={styles.container}>
      {/* Cabeçalho */}
      <DashboardHeader
        title="Gestão de Alvos"
        subtitle="Selecione alvos e atribua a equipes para fiscalização"
      />

      {/* Botão de ação */}
      <div className={styles.actions}>
        <ButtonComponent
          variant="blue"
          onClick={() => setIsModalOpen(true)}
          disabled={selectedTargetIds.length === 0}
        >
          Atribuir a Equipe ({selectedTargetIds.length})
        </ButtonComponent>
      </div>

      {/* Tabela de alvos */}
      <TargetTable onSelectionChange={handleSelectionChange} />

      {/* Modal de atribuição */}
      <AssignTargetsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        targetIds={selectedTargetIds}
        onSuccess={handleAssign}
      />
    </div>
  );
}