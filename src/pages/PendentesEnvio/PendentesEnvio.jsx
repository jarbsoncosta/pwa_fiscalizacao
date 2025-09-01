// src/components/PendentesPage.jsx
import React, { useState, useEffect } from "react";
import styles from "./PendentesPage.module.css";
import { carregarFiscalizacoesOffline } from "../../services/idb";


export default function PendentesPage() {
  const [pendentes, setPendentes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregar = async () => {
      try {
        const lista = await carregarFiscalizacoesOffline();
        setPendentes(lista);
      } catch (err) {
        console.error("Erro ao carregar dados offline:", err);
      } finally {
        setLoading(false);
      }
    };

    carregar();
  }, []);

  if (loading) {
    return (
      <div className={styles.container}>
        <p>Carregando...</p>
      </div>
    );
  }

  if (pendentes.length === 0) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>Fiscalizações Pendentes</h1>
        <p className={styles.subtitle}>
          Nenhuma atualização pendente de envio.
        </p>
        <div className={styles.empty}>
          <h3 className={styles.emptyTitle}>🎉 Tudo atualizado!</h3>
          <p>Todas as fiscalizações já foram enviadas ao servidor.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Fiscalizações Pendentes</h1>
      <p className={styles.subtitle}>
        Estes registros foram salvos offline e ainda não foram enviados ao servidor.
      </p>

      {pendentes.map((item) => {
        // Define classe do status
        let statusClass = styles.statusNaoIniciada;
        if (item.status === "CONCLUÍDA") statusClass = styles.statusConcluida;
        if (item.status === "EM ANDAMENTO") statusClass = styles.statusEmAndamento;

        return (
          <div key={item.targetId} className={styles.card}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>Alvo #{item.targetId}</h3>
              <span className={`${styles.statusBadge} ${statusClass}`}>
                {item.status}
              </span>
            </div>

            <div className={styles.info}>
              <span>
                <strong>Data:</strong>{" "}
                {new Date(item.timestamp).toLocaleString("pt-BR")}
              </span>
              <span>
                <strong>Fotos:</strong> {item.fotos.length}
              </span>
            </div>

            <div className={styles.photos}>
              {item.fotos.map((foto, index) => {
                // Converte Blob para URL
                const blob = new Blob([foto.data], { type: foto.type });
                const url = URL.createObjectURL(blob);
                return (
                  <img
                    key={index}
                    src={url}
                    alt={`Foto ${index + 1}`}
                    className={styles.photo}
                    onLoad={() => URL.revokeObjectURL(url)} // Libera memória
                  />
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}