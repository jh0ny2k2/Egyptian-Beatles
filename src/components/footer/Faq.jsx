import React, { useState } from "react";

const faqs = [
  {
    question: "¿Cómo realizo un pedido?",
    answer: "Selecciona tus productos, agrégalos al carrito y sigue el proceso de compra."
  },
  {
    question: "¿Cuáles son los métodos de pago disponibles?",
    answer: "Aceptamos tarjetas de crédito, débito y PayPal."
  },
  {
    question: "¿Cuánto tarda el envío?",
    answer: "El envío estándar tarda entre 2 y 5 días laborables."
  },
  {
    question: "¿Puedo devolver un producto?",
    answer: "Sí, tienes 30 días para devolver cualquier producto no usado."
  },
  {
    question: "¿Cómo puedo contactar con atención al cliente?",
    answer: "Puedes escribirnos a contacto@egyptianbeatles.com o usar el formulario de contacto."
  }
];

const Faq = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = idx => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div style={{ maxWidth: 700, margin: "40px auto", padding: 24 }}>
      <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 32, textAlign: "center", color: "#111" }}>Preguntas Frecuentes</h1>
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

export default Faq;