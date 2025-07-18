"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [message, setMessage] = useState("Conectando ao backend...");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:3000/teste")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Falha na conexão com o backend.");
        }
        return response.json();
      })
      .then((data) => {
        setMessage(data.message);
      })
      .catch((err) => {
        console.error(err);
        setError("Não foi possível conectar. O backend está rodando?");
      });
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-4">
        Teste de Conexão Frontend-Backend
      </h1>
      <div className="text-2xl p-4 border rounded-lg">
        {error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <p>
            Resposta do Backend:{" "}
            <span className="font-mono bg-gray-700 p-1 rounded">{message}</span>
          </p>
        )}
      </div>
    </main>
  );
}
