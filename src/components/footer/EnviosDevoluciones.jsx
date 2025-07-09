import React, { useState } from "react";

const faqs = [
  {
    question: "¿Cuáles son los métodos de envío disponibles?",
    answer: "Ofrecemos envío estándar (2-5 días laborables), exprés (24-48h) y recogida en tienda gratuita."
  },
  {
    question: "¿Cuánto cuesta el envío?",
    answer: "El coste del envío estándar es de 3,99€. El envío exprés cuesta 7,99€. Envío gratuito en pedidos superiores a 60€."
  },
  {
    question: "¿Puedo hacer seguimiento de mi pedido?",
    answer: "Sí, recibirás un enlace de seguimiento por email una vez tu pedido haya sido enviado."
  },
  {
    question: "¿Cuál es la política de devoluciones?",
    answer: "Dispones de 30 días desde la recepción para devolver cualquier producto no usado. Las devoluciones son gratuitas."
  },
  {
    question: "¿Cómo solicito una devolución?",
    answer: "Accede a tu cuenta, selecciona el pedido y haz clic en 'Solicitar devolución'. Sigue las instrucciones que recibirás por email."
  },
  {
    question: "¿Cuándo recibiré el reembolso?",
    answer: "El reembolso se realiza en un plazo de 3 a 7 días hábiles tras la recepción y comprobación del producto devuelto."
  }
];

const EnviosDevoluciones = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = idx => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div style={{ maxWidth: 700, margin: "40px auto", padding: 24 }}>
      <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 32, textAlign: "center", color: "#111" }}>Envíos y Devoluciones</h1>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {faqs.map((faq, idx) => (
          <li key={idx} style={{ borderBottom: "1px solid #e5e5e5", marginBottom: 0 }}>
            <button
              onClick={() => toggle(idx)}
              style={{
                width: "100%",
                background: "none",
                border: "none",
                textAlign: "left",
                padding: "20px 0",
                fontSize: 18,
                fontWeight: 600,
                color: "#111",
                cursor: "pointer",
                outline: "none",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
              aria-expanded={openIndex === idx}
            >
              {faq.question}
              <span style={{ fontSize: 22, transition: "transform 0.2s", transform: openIndex === idx ? "rotate(45deg)" : "rotate(0deg)" }}>
                +
              </span>
            </button>
            {openIndex === idx && (
              <div style={{ padding: "0 0 20px 0", color: "#444", fontSize: 16, animation: "fadeIn 0.2s" }}>
                {faq.answer}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EnviosDevoluciones;