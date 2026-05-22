import { useState, useRef, useEffect, useCallback } from "react";

const HOSPITALS_INTERIOR = [
  "Alta Gracia - Arturo U. Illia",
  "Bell Ville - José Antonio Ceballos",
  "Cosquín - Cosquín",
  "Corral de Bustos - Pedro Vella",
  "Cruz del Eje - Aurelio Crespo",
  "Dean Fúnes - Ernesto Romagosa",
  "Despeñaderos - Elpidio Torres",
  "Huinca Renancó - René Favaloro",
  "Jesús María - Vicente Agüero",
  "La Calera - Ramón J. Cárcano",
  "La Carlota - Arturo Illia",
  "La Dormida - San Antonio",
  "Laboulaye - San José de La Dormida",
  "Marcos Juárez - Abel Ayerza",
  "Mina Clavero - Luis María Bellodi",
  "Oliva - Emilio Vidal Abal",
  "Oliva - Zonal de Oliva",
  "Río III - Prov. de Río III",
  "Río IV - San Antonio de Padua",
  "San Francisco - José B. Iturraspe",
  "San Francisco del Chañar - JJ Puente",
  "Santa María de Punilla - Colonia Santa Marta",
  "Santa Rosa de Calamuchita - Eva Perón",
  "Santa Rosa de Río I - Ramón B. Mestre",
  "Unquillo - Centro de Rehabilitación Sierras Chicas",
  "Unquillo - J.M. Urrutía",
  "Villa Caeiro - Domingo Funes",
  "Villa del Rosario - San Vicente Paul",
  "Villa Dolores - Regional de Villa Dolores",
  "Villa María - Louis Pasteur",
  "Otro"
];

const HOSPITALS_CAPITAL = [
  "San Roque Nuevo",
  "San Roque Viejo",
  "H. De Niños",
  "Oncológico",
  "Pediátrico",
  "Tránsito",
  "Rawson",
  "Materno Provincial",
  "Misericordia",
  "Elpidio Torres",
  "Eva Perón",
  "Materno Neonatal",
  "Florencio Diaz",
  "Neuropsiquiátrico",
  "Córdoba",
  "Banco de Sangre",
  "CAPS",
  "Derivación de Pacientes",
  "Odontología",
  "Laboratorio Central",
  "Neuropsiquiátrico Provincial",
  "Polo de la Mujer",
  "Zonal de Oliva",
  "Otro"
];

const PROVEEDORES = [
  "ABBVIE",
  "AGIMED",
  "AIR LIQUID",
  "ALEJO STORICH",
  "APLICACIONES MÉDICAS",
  "AUSTRAL FARMA",
  "BIOTEK",
  "CANON MEDICAL SYSTEMS ARGENTINA S.A.",
  "CASTELLANO GABRIEL",
  "CASTELLANO JAVIER HORACIO",
  "CEC",
  "CMC",
  "CORPOMEDICA",
  "CORSALTEC",
  "DACSHEN SA",
  "DALESC SA",
  "DECADE",
  "DEHNER",
  "DIAGNOSTIKA",
  "EBER ALBANO ACUÑA",
  "ELECTROMEDICINA",
  "ELECTRÓNICA MÉDICA - COCO",
  "ENDOSCOPIO ROSARIO",
  "ETYC SA",
  "FARKIM",
  "FEMEX",
  "FM SALUD – MARIANO MESSAD",
  "FRESENIUS - MEDICAL PRO",
  "GASTROTEX S.R.L.",
  "GE HEALTHCARE ARGENTINA S.A.",
  "GM ELECTRÓNICA DE POTENCIA",
  "GONZALEZ VOLK MAXIMILIANO",
  "IBS S.A.",
  "IESA",
  "INDURA ARGENTINA S.A.",
  "INGEMED",
  "INGMED – REARTE",
  "INGOOZ",
  "INTEC",
  "IPM INGENIERÍA",
  "JAEJ",
  "JCR INSUMOS MÉDICOS S.A.",
  "KARL STORZ",
  "KIFER",
  "KULVIETIS",
  "LEISTUNG",
  "M.G. SOLUCIONES",
  "MATIAS VALDEMARÍN",
  "MEDILAB",
  "MEDIGRUP",
  "MICRALAB – CARLOS ROLPH",
  "NATIVA",
  "NEX CIRUGÍA – DIEGO MONSALVO",
  "NOVAMEDIC",
  "PAM",
  "PHILIPS ARGENTINA S.A.",
  "PROENERGY",
  "PROPATO",
  "PROVEEDURÍA MÉDICA",
  "ROLA INGENIERÍA",
  "SALUD RENAL",
  "SIEC",
  "SIEMENS HEALTHCARE S.A.",
  "SONOCARE",
  "SORO",
  "SOTEM S.A.S",
  "TECME S.A.",
  "UNIC",
  "VACCARINI DIEGO SEBASTIAN",
  "WERK",
  "Otro"
];

// ── Signature Pad Component (Fullscreen) ──
function SignaturePad({ onSignatureChange, signatureData }) {
  const canvasRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  const initCanvas = useCallback(() => {
    setTimeout(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * 2;
      canvas.height = rect.height * 2;
      ctx.scale(2, 2);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.lineWidth = 3;
      ctx.strokeStyle = "#1a2744";
      setHasDrawn(false);
    }, 50);
  }, []);

  const getPos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches ? e.touches[0] : e;
    return { x: touch.clientX - rect.left, y: touch.clientY - rect.top };
  };

  const startDraw = (e) => {
    e.preventDefault();
    const ctx = canvasRef.current.getContext("2d");
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    e.preventDefault();
    const ctx = canvasRef.current.getContext("2d");
    const pos = getPos(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    setHasDrawn(true);
  };

  const stopDraw = () => setIsDrawing(false);

  const handleOpen = () => {
    setIsOpen(true);
    initCanvas();
  };

  const handleConfirm = () => {
    if (hasDrawn) {
      const data = canvasRef.current.toDataURL("image/png");
      onSignatureChange(data);
    }
    setIsOpen(false);
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);
    setHasDrawn(false);
  };

  const handleDelete = () => {
    onSignatureChange(null);
  };

  if (isOpen) {
    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 9999,
          background: "#f8fafc",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "12px 16px",
            background: "#0d1b2a",
          }}
        >
          <button
            onClick={() => setIsOpen(false)}
            style={{
              background: "none",
              border: "none",
              color: "#8ea4bf",
              fontSize: 16,
              fontFamily: "'DM Sans', sans-serif",
              cursor: "pointer",
              padding: "8px 12px",
            }}
          >
            ✕ Cancelar
          </button>
          <span
            style={{
              color: "#e0e6ed",
              fontSize: 15,
              fontWeight: 600,
              fontFamily: "'DM Sans', sans-serif",
              letterSpacing: 0.5,
            }}
          >
            Firme aquí
          </span>
          <button
            onClick={handleClear}
            style={{
              background: "rgba(231,76,60,0.15)",
              border: "none",
              color: "#e74c3c",
              fontSize: 14,
              fontFamily: "'DM Sans', sans-serif",
              cursor: "pointer",
              padding: "8px 14px",
              borderRadius: 8,
            }}
          >
            Borrar
          </button>
        </div>

        <div style={{ flex: 1, position: "relative", padding: 12 }}>
          <canvas
            ref={canvasRef}
            style={{
              width: "100%",
              height: "100%",
              border: "2px dashed #c0cfe0",
              borderRadius: 16,
              background: "#ffffff",
              cursor: "crosshair",
              touchAction: "none",
            }}
            onMouseDown={startDraw}
            onMouseMove={draw}
            onMouseUp={stopDraw}
            onMouseLeave={stopDraw}
            onTouchStart={startDraw}
            onTouchMove={draw}
            onTouchEnd={stopDraw}
          />
          {!hasDrawn && (
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                color: "#b0c4d8",
                fontSize: 18,
                fontFamily: "'DM Sans', sans-serif",
                pointerEvents: "none",
                textAlign: "center",
                lineHeight: 1.6,
              }}
            >
              ✍️<br />Dibuje su firma
            </div>
          )}
        </div>

        <div style={{ padding: "12px 16px 24px" }}>
          <button
            onClick={handleConfirm}
            style={{
              width: "100%",
              padding: "16px 0",
              background: hasDrawn
                ? "linear-gradient(135deg, #2e86de, #48c6ef)"
                : "rgba(46,134,222,0.3)",
              border: "none",
              borderRadius: 14,
              color: "#fff",
              fontSize: 17,
              fontWeight: 700,
              fontFamily: "'DM Sans', sans-serif",
              cursor: hasDrawn ? "pointer" : "default",
              letterSpacing: 0.5,
              boxShadow: hasDrawn ? "0 4px 20px rgba(46,134,222,0.3)" : "none",
            }}
            disabled={!hasDrawn}
          >
            ✓ Confirmar Firma
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {!signatureData ? (
        <div
          onClick={handleOpen}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            padding: "22px 14px",
            background: "rgba(255,255,255,0.06)",
            border: "2px dashed rgba(255,255,255,0.15)",
            borderRadius: 12,
            cursor: "pointer",
            transition: "border 0.2s, background 0.2s",
          }}
        >
          <span style={{ fontSize: 22 }}>✍️</span>
          <span style={{ color: "#8ea4bf", fontSize: 14, fontFamily: "'DM Sans', sans-serif" }}>
            Toque para firmar
          </span>
        </div>
      ) : (
        <div style={{ position: "relative" }}>
          <img
            src={signatureData}
            alt="Firma"
            onClick={handleOpen}
            style={{
              width: "100%",
              height: 80,
              objectFit: "contain",
              background: "#f8fafc",
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.12)",
              cursor: "pointer",
            }}
          />
          <button
            onClick={handleDelete}
            style={{
              position: "absolute",
              top: 6,
              right: 6,
              background: "#e74c3c",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              padding: "4px 10px",
              fontSize: 12,
              cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Borrar
          </button>
        </div>
      )}
    </div>
  );
}

// ── Main App ──
export default function App() {
  const [view, setView] = useState("home"); // home | form | success | config | history
  const [category, setCategory] = useState("");
  const [webhookUrl, setWebhookUrl] = useState("");
  const [tempWebhook, setTempWebhook] = useState("");
  const [sending, setSending] = useState(false);
  const [records, setRecords] = useState([]);
  const [lastResponse, setLastResponse] = useState({ mensaje: "", tipo: "" });
  const [form, setForm] = useState({
    hospital: "",
    hospitalOtro: "",
    ticketTipo: "",
    ticket: "",
    dispositivo: "",
    tipo: "",
    fecha: new Date().toISOString().slice(0, 10),
    serie: "",
    recibio: "",
    firma: null,
    foto: null,
  });

  useEffect(() => {
    (async () => {
      try {
        const wh = await window.storage.get("config:webhook");
        if (wh?.value) setWebhookUrl(wh.value);
      } catch {}
      try {
        const rec = await window.storage.get("records:all");
        if (rec?.value) setRecords(JSON.parse(rec.value));
      } catch {}
    })();
  }, []);

  const saveRecords = async (newRecords) => {
    setRecords(newRecords);
    try {
      await window.storage.set("records:all", JSON.stringify(newRecords));
    } catch {}
  };

  const saveWebhook = async () => {
    setWebhookUrl(tempWebhook);
    try {
      await window.storage.set("config:webhook", tempWebhook);
    } catch {}
    setView("home");
  };

  const getHospitalList = () => {
    if (category === "interior") return HOSPITALS_INTERIOR;
    if (category === "capital") return HOSPITALS_CAPITAL;
    return PROVEEDORES;
  };

  const getCategoryLabel = () => {
    if (category === "interior") return "EQUIPO INTERIOR";
    if (category === "capital") return "EQUIPO CAPITAL";
    return "PROVEEDORES";
  };

  const getCategoryLabelPretty = () => {
    if (category === "interior") return "Hospital Interior";
    if (category === "capital") return "Hospital Capital";
    return "Proveedores";
  };

  const handleSelect = (cat) => {
    setCategory(cat);
    setForm({
      hospital: "",
      hospitalOtro: "",
      ticketTipo: "",
      ticket: "",
      dispositivo: "",
      tipo: "",
      fecha: new Date().toISOString().slice(0, 10),
      serie: "",
      recibio: "",
      firma: null,
      foto: null,
    });
    setView("form");
  };

  const handleSubmit = async () => {
    const hospitalName = form.hospital === "Otro" ? form.hospitalOtro : form.hospital;
    if (!hospitalName || !form.ticketTipo || !form.ticket || !form.dispositivo || !form.tipo || !form.fecha) {
      alert("Complete todos los campos obligatorios.");
      return;
    }

    const ticketCompleto = `${form.ticketTipo}-${form.ticket}`;

    const record = {
      id: Date.now(),
      categoria: getCategoryLabel(),
      hospital: hospitalName,
      ticket: ticketCompleto,
      dispositivo: form.dispositivo,
      tipo: form.tipo,
      fecha: form.fecha,
      serie: form.serie,
      recibio: form.recibio,
      firmaPresente: form.firma ? "Sí" : "No",
      fotoPresente: form.foto ? "Sí" : "No",
      timestamp: new Date().toLocaleString("es-AR"),
    };

    const newRecords = [record, ...records];
    await saveRecords(newRecords);

    let responseMessage = "";
    let responseTipo = "";
    if (webhookUrl) {
      setSending(true);
      try {
        const res = await fetch(webhookUrl, {
          method: "POST",
          body: JSON.stringify({
            ...record,
            firma: form.firma || "",
            foto: form.foto || "",
          }),
        });
        const result = await res.json();
        responseMessage = result.mensaje || "";
        responseTipo = result.tipo || "";
      } catch (err) {
        console.error("Error enviando a Google Sheets:", err);
        responseMessage = "Error al enviar a Google Sheets";
      }
      setSending(false);
    }

    setLastResponse({ mensaje: responseMessage, tipo: responseTipo });
    setView("success");
  };

  const update = (field, val) => setForm((p) => ({ ...p, [field]: val }));

  const fonts = `@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@700;800&display=swap');`;

  const bg = {
    minHeight: "100vh",
    background: "linear-gradient(165deg, #0d1b2a 0%, #1b2838 40%, #1a3550 100%)",
    fontFamily: "'DM Sans', sans-serif",
    color: "#e0e6ed",
    position: "relative",
    overflow: "hidden",
  };

  const gridOverlay = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage:
      "linear-gradient(rgba(61,90,128,0.06) 1px, transparent 1px), linear-gradien... (truncated)
