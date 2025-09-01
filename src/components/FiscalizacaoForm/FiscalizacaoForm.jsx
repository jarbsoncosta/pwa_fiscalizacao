// src/components/FiscalizacaoForm.jsx
"use client";

import React, { useState } from "react";
import { Camera } from "react-html5-camera-photo";
import "react-html5-camera-photo/build/css/index.css";
import { api } from "../../services/api";
import { carregarFiscalizacoesOffline, removerFiscalizacaoOffline, salvarFiscalizacaoOffline } from "../../services/idb";
import { ButtonComponent } from "../Button/Button";
import styles from "./FiscalizacaoForm.module.css";

export function FiscalizacaoForm({ targetId, onClose }) {
  const [status, setStatus] = useState("NÃO INICIADA");
  const [photos, setPhotos] = useState([]);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isOnline] = useState(navigator.onLine);

  // Preview URLs
  const previewUrls = photos.map((file) => URL.createObjectURL(file));

  React.useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [photos]);

  // Captura da câmera
  const handleTakePhoto = (dataUri) => {
    fetch(dataUri)
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], `photo-${Date.now()}.jpg`, {
          type: "image/jpeg",
        });
        setPhotos((prev) => [...prev, file]);
      });

    setIsCameraOpen(false);
  };

  // Remover foto
  const removePhoto = (index) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  // Enviar para API
  const sendToAPI = async (data) => {
    const formData = new FormData();
    formData.append("status", data.status);
    data.photos.forEach((file) => formData.append("files", file));

    try {
      await api.put(`/target/${data.targetId}/status`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      await removerFiscalizacaoOffline(data.targetId);
      console.log("✅ Enviado para API:", data.targetId);
    } catch (err) {
      console.error("❌ Falha ao enviar:", err);
      await salvarFiscalizacaoOffline(data);
    }
  };

  // Sincronizar ao ficar online
  React.useEffect(() => {
    const syncPending = async () => {
      if (!isOnline) return;

      const pendentes = await carregarFiscalizacoesOffline();
      for (const item of pendentes) {
        const fotos = item.fotos.map((f) => new Blob([f.data], { type: f.type }));
        const data = { ...item, photos: fotos };
        await sendToAPI(data);
      }
    };

    syncPending();
  }, [isOnline]);



  // Enviar formulário
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (photos.length === 0) {
      alert("Adicione pelo menos uma foto.");
      return;
    }

    const formData = { targetId, status, photos };

    if (isOnline) {
      await sendToAPI(formData);
      alert("Atualização enviada com sucesso!");
    } else {
      await salvarFiscalizacaoOffline(formData);
      alert("Dados salvos offline. Serão enviados quando estiver online.");
    }

    // Resetar
    setPhotos([]);
    setStatus("NÃO INICIADA");
  };

  return (
    <form onSubmit={handleSubmit} className={styles.container}>
      <h2 className={styles.title}>Atualizar Fiscalização #{targetId}</h2>

      {/* Status */}
      <div className={styles.field}>
        <label className={styles.label}>Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className={styles.select}
        >
          <option value="NÃO INICIADA">NÃO INICIADA</option>
          <option value="EM ANDAMENTO">EM ANDAMENTO</option>
          <option value="CONCLUÍDA">CONCLUÍDA</option>
        </select>
      </div>

      {/* Fotos */}
      <div className={styles.field}>
        <label className={styles.label}>Fotos</label>

        {/* Câmera */}
        {!isCameraOpen ? (
          <button
            type="button"
            onClick={() => setIsCameraOpen(true)}
            className={styles.buttonCamera}
          >
            📷 Abrir Câmera
          </button>
        ) : (
          <div className={styles.cameraContainer}>
            <Camera
              onTakePhoto={handleTakePhoto}
              idealFacingMode="environment"
              isImageMirror={false}
            />
            <button
              type="button"
              onClick={() => setIsCameraOpen(false)}
              className={styles.buttonClose}
            >
              ❌ Fechar Câmera
            </button>
          </div>
        )}

        {/* Upload */}
        {/*  <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => {
            const files = Array.from(e.target.files);
            setPhotos((prev) => [...prev, ...files]);
          }}
          className={styles.fileInput}
        /> */}

        {/* Previews */}
        {previewUrls.length > 0 && (
          <div className={styles.previewContainer}>
            {previewUrls.map((url, index) => (
              <div key={index} className={styles.previewItem}>
                <img src={url} alt="Preview" className={styles.previewImage} />
                <button
                  type="button"
                  onClick={() => removePhoto(index)}
                  className={styles.removeButton}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className={styles.groupButton}>
        <ButtonComponent
          type="button"
          variant="gray"
          onClick={onClose}

        >
          Cancelar
        </ButtonComponent>
        <ButtonComponent
          variant="green"
          type="submit"
          disabled={photos.length === 0}

        >
          Salvar Atualização
        </ButtonComponent>
      </div>
    </form>
  );
}

