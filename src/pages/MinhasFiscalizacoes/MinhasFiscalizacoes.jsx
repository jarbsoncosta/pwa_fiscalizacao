"use client";
import { useState } from "react";
import styles from "./MinhasFiscalizacoes.module.css";
import DashboardHeader from "../../components/Title/Title";
import TableTarget from "./components/TargetTable/TableTarget";
import { AssignTargetsModal } from "../Fiscalizacoes/components/AssignTargetsModal/AssignTargetsModal";



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
        title="Meu Alvos"
        subtitle="Alvos vinculados a minha equipe"
      />

      {/* Tabela de alvos */}
      <TableTarget onSelectionChange={handleSelectionChange} />

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