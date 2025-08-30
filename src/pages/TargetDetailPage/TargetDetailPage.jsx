"use client";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./TargetDetailPage.module.css";
import { DataContext } from "../../context/DataContext";
import { ButtonComponent } from "../../components/Button/Button";
import { FiMapPin } from "react-icons/fi";
import { formatCNPJ, formatDateBR } from "../../utils/formatDate";

export default function TargetDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { targets, loading: targetsLoading } = useContext(DataContext);
  const [target, setTarget] = useState(null);
  const [error, setError] = useState(null);

  console.log(target, "Target")

  const handleOpenMap = () => {
    if (!target) return;
    sessionStorage.setItem("userTargets", JSON.stringify([target]));
    navigate("/view/meus_alvos/mapa");
  };

  useEffect(() => {
    if (targetsLoading) {
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
      <p className={styles.subtitle}>CNPJ:{formatCNPJ(target.cnpj)}</p>

      {/* Card de informações */}
      <div className={styles.card}>
        <div className={styles.header}>
          <span className={styles.icon}></span>
          <h2>Informações do Alvo</h2>
        </div>

        <div className={styles.grid}>
          <div className={styles.info}>
            <label>Nome/Razão Social</label>
            <p>{target.nomeProprietario}</p>
          </div>
          <div className={styles.info}>
            <label>CEP</label>
            <p>{target.cep}</p>
          </div>
          <div className={styles.info}>
            <label>CNPJ</label>
            <p>{formatCNPJ(target.cnpj)}</p>
          </div>
          <div className={styles.info}>
            <label>Endereço</label>
            <p>{target.enderecoObra}</p>
          </div>
          <div className={styles.info}>
            <label>Data de Cadastro</label>
            <p>
              {target.createdAt
                ? formatDateBR(target.createdAt)
                : "-"}
            </p>
          </div>
          <div className={styles.info}>
            <label>Cidade</label>
            <p>{target.cidade}</p>
          </div>
          <div className={styles.info}>
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

      {/* Card de resultados */}
      <div className={styles.card}>
        <div className={styles.header}>
          <span className={styles.icon}></span>
          <h2>Resultado da Fiscalização</h2>
        </div>

        <div className={styles.grid}>
          <div className={styles.info}>
            <label>Fiscalizador</label>
            <p>{target.fiscalizador}</p>
          </div>
          <div className={styles.info}>
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
          <div className={styles.info}>
            <label>Formulário Utilizado</label>
            <p>{target.formularioUtilizado}</p>
          </div>
          <div className={styles.info}>
            <label>Anexos</label>
            <div className={styles.anexos}>
              {target.images?.length > 0 ? (
                target.images.map((file, index) => {
                  const filePath = typeof file === "string" ? file : file.url || "";
                  const fileName =
                    typeof file === "string"
                      ? file.split("/").pop()
                      : file.name || "arquivo";

                  return (
                    <div key={index} className={styles.anexo}>
                      <a href={`/${filePath}`} rel="noopener noreferrer">
                        <span className={styles.downloadIcon}> ⬇️ </span>
                        Baixar Arquivo
                      </a>
                     {/*  <span className={styles.fileName}>{fileName}</span> */}
                    </div>
                  );
                })
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
