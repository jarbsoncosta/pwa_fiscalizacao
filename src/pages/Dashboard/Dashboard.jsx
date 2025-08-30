"use client";
import { useContext, useEffect, useMemo, useState } from "react";
import { FaLayerGroup, FaSync } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import styles from "./Dashboard.module.css";
import Card from "../../components/Card/Card";
import { CardEquip } from "../../components/CardEquip/CardEquip";
import { FormCreateTeam } from "../../components/FormCreateTeam/FormCreateTeam";
import { Modal } from "../../components/Modal/Modal";
import DashboardHeader from "../../components/Title/Title";
import { DataContext } from "../../context/DataContext";
import { formatDateBR } from "../../utils/formatDate";
import { LuTarget } from "react-icons/lu";
import { IoCheckmark, IoPause, IoTime } from "react-icons/io5";

export default function Dashboard () {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { targets, teams, fetchTeams } = useContext(DataContext);

  function filtrarComTargets(dados) {
    return dados.filter(item => item.targets && item.targets.length > 0);
  }
  
  const filtrados = filtrarComTargets(teams);

  // Contagem de status usando useMemo
  const { nao_iniciado, em_andamento, concluida, outros } = useMemo(() => {
    return targets.reduce(
      (acc, t) => {
        const status = t.status?.toUpperCase();
        if (status === "NÃO INICIADA") acc.nao_iniciado += 1;
        else if (status === "EM ANDAMENTO") acc.em_andamento += 1;
        else if (status === "CONCLUÍDA") acc.concluida += 1;
        else acc.outros += 1;
        return acc;
      },
      { nao_iniciado: 0, em_andamento: 0, concluida: 0, outros: 0 }
    );
  }, [targets]);

  // const [teams, setTeams] = useState([]);
  // const [loading, setLoading] = useState(true);

  // const fetchTeams = async () => {
  //   try {
  //     const response = await api.get("/team");
  //     setTeams(response.data);
  //   } catch (error) {
  //     console.error("Erro ao buscar equipes:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  useEffect(() => {
    fetchTeams();
  }, []);

  const refreshData = () => {
    window.location.reload();
  };

  const handleTeamCreated = () => {
    fetchTeams(); // Atualiza a lista de equipes
  };

  // if (loading) {
  //   return <p className="p-6 text-gray-600">Carregando equipes...</p>;
  // }

  return (
    <main>
      {/* Seção de Estatísticas */}
      <div className={styles.headerContainer}>
        <DashboardHeader
          title="Dashboard de Fiscalização"
          subtitle="Acompanhe o progresso das fiscalizações em tempo real"
          actions={[
            {
              label: "Atualizar",
              icon: <FaSync size={20} />,
              onClick: refreshData,
              color: "green",
            },
          ]}
        />
      </div>

      <div className={styles.statsGrid}>
      <Card  value={targets.length} label="Total de Fiscalização" color="blue" icon={<LuTarget />} />
      <Card  value={concluida}  label="Concluídas" color="green" icon={<IoCheckmark />} />
      <Card value={em_andamento} label="Em Andamento" color="yellow" icon={<IoTime />} />
      <Card value={nao_iniciado} label="Não Iniciada" color="gray" icon={<IoPause/>} />
      <Card value={filtrados.length} label="Equipes Ativas" color="sky" icon={<FaLayerGroup />} />
      </div>

      {/* Seção de Equipes */}
      <div className={styles.headerContainer}>
        <DashboardHeader
          title="Equipes"          
          actions={[
            {
              label: "Nova Equipe",
              icon: <IoMdAdd size={20} />,
              onClick: () => setIsModalOpen(true),
              color: "blue",
            },
          ]}
        />
      </div>

      <div className={styles.teamsGrid}>
        {teams.length === 0 ? (
          <p className={styles.emptyState}>Nenhuma equipe encontrada.</p>
        ) : (
          teams.map((team) => {
            const concluidos =
              team.targets?.filter(
                (t) => t.status?.trim().toUpperCase() === "CONCLUÍDA"
              ).length || 0;
            const total = team.targets?.length || 0;
            const completedPercentage =
              total > 0 ? Math.round((concluidos / total) * 100) : 0;

            return (
              <CardEquip
                key={team.id}
                name={team.name}
                status={team.status}
                color={team.color}
                members={team.users?.length || 0}
                goals={total}
                link={`/view/equipe/${team.id}`}
                updatedAt={formatDateBR(team.updatedAt)}
                completedPercentage={completedPercentage}
              />
            );
          })
        )}
      </div>

      {/* Modal de criação de equipe */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <FormCreateTeam
          onTeamCreated={handleTeamCreated}
          onClose={() => setIsModalOpen(false)}
        />
      </Modal>
    </main>
  );
}

