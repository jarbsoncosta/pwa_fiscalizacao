"use client";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./TargetDetailPage.module.css";
import { DataContext } from "../../context/DataContext";
import { ButtonComponent } from "../../components/Button/Button";
import { FiMapPin } from "react-icons/fi";

export default function TargetDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { targets, loading: targetsLoading } = useContext(DataContext);

  const [target, setTarget] = useState(null);
  const [error, setError] = useState(null);

  const handleOpenMap = () => {
    if (!target) return;
    sessionStorage.setItem("userTargets", JSON.stringify([target]));
    navigate("/view/meus_alvos/mapa");
  };

  useEffect(() => {
    if (targetsLoading) {
      // evita sobrescrever erro enquanto carrega
      if (error !== null) setError(null);
      return;
    }

    if (!Array.isArray(targets)) {
      if (target !== null) setTarget(null);
      if (error !== "Nenhum dado disponível.") setError("Nenhum dado disponível.");
      return;
    }

    const encontrado = targets.find((item) => String(item.id) === String(id));

    if (encontrado) {
      // só atualiza se for diferente
      if (target?.id !== encontrado.id) setTarget(encontrado);
      if (error !== null) setError(null);
    } else {
      if (target !== null) setTarget(null);
      if (error !== "Alvo não encontrado.") setError("Alvo não encontrado.");
    }
  }, [id, targets, targetsLoading]);

  const handleBack = () => navigate(-1);

  if (targetsLoading) return <p className={styles.loading}>Carregando...</p>;
  if (error) return <p className={styles.error}>{error}</p>;
  if (!target) return <p className={styles.error}>Alvo não encontrado.</p>;

  return (
    <div className={styles.container}>
      <button onClick={handleBack} className={styles.backButton}>
        ← Voltar
      </button>

      <h1 className={styles.title}>{target.nomeProprietario}</h1>
      <p className={styles.subtitle}>CNPJ: {target.cnpj}</p>

      <div className={styles.card}>
        <div className={styles.header}>
          <span className={styles.icon}></span>
          <h2>Informações do Alvo</h2>
        </div>

        <div className={styles.grid}>
          <div style={{ display: "flex", flexDirection: "column", gap:"0.3rem" }}>
            <label>Nome/Razão Social</label>
            <p>{target.nomeProprietario}</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap:"0.3rem" }}>
            <label>CEP</label>
            <p>{target.cep}</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap:"0.3rem" }}>
            <label>CNPJ</label>
            <p>{target.cnpj}</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap:"0.3rem" }}>
            <label>Endereço</label>
            <p>{target.enderecoObra}</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap:"0.3rem" }}>
            <label>Data de Cadastro</label>
            <p>{new Date().toLocaleDateString("pt-BR")}</p>
          </div>
          <div>
            <label>Cidade</label>
            <p>{target.cidade}</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap:"0.3rem" }}>
            <label>Status</label>
            <span
              className={`${styles.statusBadge} ${
                target.status === "CONCLUÍDA"
                  ? styles.bgGreen
                  : target.status === "EM ANDAMENTO"
                  ? styles.bgYellow
                  : styles.bgGray
              }`}
            >
              {target.status}
            </span>
          </div>
          <div>
            <ButtonComponent
              variant="blue"
              onClick={handleOpenMap}
              icon={<FiMapPin size={18} />}
            >
              Ver no Mapa
            </ButtonComponent>
          </div>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.header}>
          <span className={styles.icon}></span>
          <h2>Resultado da Fiscalização</h2>
        </div>

        <div className={styles.grid}>
          <div>
            <label>Fiscalizador</label>
            <p>{target.fiscalizador}</p>
          </div>
          <div>
            <label>Data/Hora</label>
            <p>
              <strong>Início:</strong>{" "}
              {target.dataInicio
                ? new Date(target.dataInicio).toLocaleString("pt-BR")
                : "-"}
              <br />
              <strong>Término:</strong>{" "}
              {target.dataTermino
                ? new Date(target.dataTermino).toLocaleString("pt-BR")
                : "-"}
            </p>
          </div>
          <div>
            <label>Formulário Utilizado</label>
            <p>{target.formularioUtilizado}</p>
          </div>
          <div>
            <label>Anexos</label>
            <div className={styles.anexos}>
              {target.anexos?.length ? (
                target.anexos.map((file, index) => (
                  <div key={index} className={styles.anexo}>
                    <a
                      href={file.url}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span className={styles.downloadIcon}>⬇️</span>
                      Baixar Arquivo
                    </a>
                    <span className={styles.fileName}>{file.name}</span>
                  </div>
                ))
              ) : (
                <span>Nenhum anexo</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
