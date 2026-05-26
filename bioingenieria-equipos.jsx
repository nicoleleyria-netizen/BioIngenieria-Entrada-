import { useState, useRef, useEffect } from "react";
import { appStorage } from "./src/storage";

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

// ── Signature Pad Component ──
function SignaturePad({ onSignatureChange, signatureData }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#1a2744";
    if (signatureData) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, rect.width, rect.height);
        setHasSignature(true);
      };
      img.src = signatureData;
    }
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
    setHasSignature(true);
  };

  const stopDraw = () => {
    if (isDrawing) {
      setIsDrawing(false);
      const data = canvasRef.current.toDataURL("image/png");
      onSignatureChange(data);
    }
  };

  const clear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);
    setHasSignature(false);
    onSignatureChange(null);
  };

  return (
    <div style={{ position: "relative" }}>
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          height: 150,
          border: "2px dashed #3d5a80",
          borderRadius: 12,
          background: "#f8fafc",
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
      {!hasSignature && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            color: "#8ea4bf",
            fontSize: 14,
            fontFamily: "'DM Sans', sans-serif",
            pointerEvents: "none",
            letterSpacing: 0.3,
          }}
        >
          Firme aquí
        </div>
      )}
      {hasSignature && (
        <button
          onClick={clear}
          style={{
            position: "absolute",
            top: 8,
            right: 8,
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
  const [lastResponse, setLastResponse] = useState({ mensaje: "", tipo: "" });
  const [records, setRecords] = useState([]);
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

  // Load saved config & records from state (persistent storage)
  useEffect(() => {
    (async () => {
      try {
        const wh = await appStorage.get("config:webhook");
        if (wh?.value) setWebhookUrl(wh.value);
      } catch {}
      try {
        const rec = await appStorage.get("records:all");
        if (rec?.value) setRecords(JSON.parse(rec.value));
      } catch {}
    })();
  }, []);

  const saveRecords = async (newRecords) => {
    setRecords(newRecords);
    try {
      await appStorage.set("records:all", JSON.stringify(newRecords));
    } catch {}
  };

  const saveWebhook = async () => {
    setWebhookUrl(tempWebhook);
    try {
      await appStorage.set("config:webhook", tempWebhook);
    } catch {}
    setView("home");
  };

  const getHospitalList = () => {
    if (category === "interior") return HOSPITALS_INTERIOR;
    if (category === "capital") return HOSPITALS_CAPITAL;
    return PROVEEDORES;
  };

  const getCategoryLabel = () => {
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
    setLastResponse({ mensaje: "", tipo: "" });
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

    // Save locally
    const newRecords = [record, ...records];
    await saveRecords(newRecords);

    let responseMessage = "";
    let responseTipo = "";
    // Send to Google Sheets if configured
    if (webhookUrl) {
      setSending(true);
      try {
        await fetch(webhookUrl, {
          method: "POST",
          mode: "no-cors",
          body: JSON.stringify({
            ...record,
            firma: form.firma || "",
            foto: form.foto || "",
          }),
        });
        if (form.tipo === "Ingreso") {
          responseMessage = "INGRESO REGISTRADO CORRECTAMENTE";
          responseTipo = "ingreso";
        } else {
          responseMessage = "EGRESO REGISTRADO. Verificar matching en la Sheet.";
          responseTipo = "egreso_matched";
        }
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

  // ── Styles ──
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
      "linear-gradient(rgba(61,90,128,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(61,90,128,0.06) 1px, transparent 1px)",
    backgroundSize: "40px 40px",
    pointerEvents: "none",
    zIndex: 0,
  };

  const container = {
    maxWidth: 520,
    margin: "0 auto",
    padding: "20px 16px 40px",
    position: "relative",
    zIndex: 1,
  };

  const header = {
    textAlign: "center",
    marginBottom: 32,
    paddingTop: 24,
  };

  const titleStyle = {
    fontFamily: "'Playfair Display', serif",
    fontSize: 28,
    fontWeight: 800,
    color: "#e0e6ed",
    margin: 0,
    lineHeight: 1.2,
    letterSpacing: -0.5,
  };

  const subtitleStyle = {
    fontSize: 13,
    color: "#6b8aad",
    marginTop: 6,
    fontWeight: 500,
    letterSpacing: 1.5,
    textTransform: "uppercase",
  };

  const cardBase = {
    background: "rgba(255,255,255,0.04)",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
  };

  const categoryBtn = (accent) => ({
    ...cardBase,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: 16,
    transition: "all 0.25s ease",
    borderLeft: `4px solid ${accent}`,
    marginBottom: 12,
    padding: "20px 24px",
  });

  const inputStyle = {
    width: "100%",
    padding: "12px 14px",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 10,
    color: "#e0e6ed",
    fontSize: 15,
    fontFamily: "'DM Sans', sans-serif",
    outline: "none",
    boxSizing: "border-box",
    transition: "border 0.2s",
  };

  const selectStyle = {
    ...inputStyle,
    appearance: "none",
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236b8aad' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 14px center",
    paddingRight: 36,
  };

  const labelStyle = {
    display: "block",
    fontSize: 12,
    fontWeight: 600,
    color: "#6b8aad",
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 1,
  };

  const fieldGroup = { marginBottom: 18 };

  const primaryBtn = {
    width: "100%",
    padding: "14px 0",
    background: "linear-gradient(135deg, #2e86de, #48c6ef)",
    border: "none",
    borderRadius: 12,
    color: "#fff",
    fontSize: 16,
    fontWeight: 700,
    fontFamily: "'DM Sans', sans-serif",
    cursor: "pointer",
    letterSpacing: 0.5,
    transition: "transform 0.15s, box-shadow 0.25s",
    boxShadow: "0 4px 20px rgba(46,134,222,0.3)",
  };

  const pillBtn = {
    padding: "8px 20px",
    borderRadius: 20,
    border: "1px solid rgba(255,255,255,0.15)",
    background: "rgba(255,255,255,0.05)",
    color: "#8ea4bf",
    fontSize: 13,
    fontWeight: 500,
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
    transition: "all 0.2s",
  };

  const pillActive = {
    ...pillBtn,
    background: "linear-gradient(135deg, #2e86de, #48c6ef)",
    border: "1px solid transparent",
    color: "#fff",
    fontWeight: 600,
  };

  const backBtn = {
    background: "none",
    border: "none",
    color: "#6b8aad",
    fontSize: 14,
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
    padding: "8px 0",
    marginBottom: 16,
    display: "flex",
    alignItems: "center",
    gap: 6,
  };

  const iconCircle = (color) => ({
    width: 44,
    height: 44,
    borderRadius: 12,
    background: `${color}18`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 20,
    flexShrink: 0,
  });

  const topBar = {
    display: "flex",
    justifyContent: "flex-end",
    gap: 8,
    marginBottom: 8,
  };

  const smallBtn = {
    background: "none",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 8,
    color: "#6b8aad",
    fontSize: 12,
    padding: "6px 12px",
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
  };

  // ── Views ──

  // HOME
  if (view === "home") {
    return (
      <div style={bg}>
        <style>{fonts}</style>
        <div style={gridOverlay} />
        <div style={container}>
          <div style={topBar}>
            <button style={smallBtn} onClick={() => { setTempWebhook(webhookUrl); setView("config"); }}>
              ⚙ Config
            </button>
            {records.length > 0 && (
              <button style={smallBtn} onClick={() => setView("history")}>
                📋 Historial ({records.length})
              </button>
            )}
          </div>
          <div style={header}>
            <div style={{ fontSize: 40, marginBottom: 8 }}>🔬</div>
            <h1 style={titleStyle}>Bioingeniería</h1>
            <p style={subtitleStyle}>Control de Equipos</p>
          </div>

          <p style={{ color: "#8ea4bf", fontSize: 14, marginBottom: 20, textAlign: "center" }}>
            Seleccione la categoría para registrar un equipo
          </p>

          <div
            style={categoryBtn("#2e86de")}
            onClick={() => handleSelect("interior")}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateX(4px)"; e.currentTarget.style.background = "rgba(46,134,222,0.08)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "translateX(0)"; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
          >
            <div style={iconCircle("#2e86de")}>🏥</div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 16 }}>Hospital Interior</div>
              <div style={{ fontSize: 12, color: "#6b8aad", marginTop: 2 }}>Hospitales del interior provincial</div>
            </div>
          </div>

          <div
            style={categoryBtn("#27ae60")}
            onClick={() => handleSelect("capital")}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateX(4px)"; e.currentTarget.style.background = "rgba(39,174,96,0.08)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "translateX(0)"; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
          >
            <div style={iconCircle("#27ae60")}>🏛</div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 16 }}>Hospital Capital</div>
              <div style={{ fontSize: 12, color: "#6b8aad", marginTop: 2 }}>Hospitales de Córdoba Capital</div>
            </div>
          </div>

          <div
            style={categoryBtn("#e67e22")}
            onClick={() => handleSelect("proveedores")}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateX(4px)"; e.currentTarget.style.background = "rgba(230,126,34,0.08)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "translateX(0)"; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
          >
            <div style={iconCircle("#e67e22")}>🚚</div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 16 }}>Proveedores</div>
              <div style={{ fontSize: 12, color: "#6b8aad", marginTop: 2 }}>Proveedores de equipamiento</div>
            </div>
          </div>

          {!webhookUrl && (
            <div style={{ ...cardBase, borderLeft: "4px solid #e74c3c", marginTop: 24, padding: 16 }}>
              <div style={{ fontSize: 13, color: "#e0a07a" }}>
                ⚠ Google Sheets no configurado.{" "}
                <span
                  style={{ textDecoration: "underline", cursor: "pointer", color: "#48c6ef" }}
                  onClick={() => { setTempWebhook(""); setView("config"); }}
                >
                  Configurar ahora
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // CONFIG
  if (view === "config") {
    return (
      <div style={bg}>
        <style>{fonts}</style>
        <div style={gridOverlay} />
        <div style={container}>
          <button style={backBtn} onClick={() => setView("home")}>← Volver</button>
          <div style={header}>
            <h1 style={{ ...titleStyle, fontSize: 22 }}>Configuración</h1>
            <p style={subtitleStyle}>Google Sheets</p>
          </div>
          <div style={cardBase}>
            <div style={fieldGroup}>
              <label style={labelStyle}>URL del Web App (Google Apps Script)</label>
              <input
                style={inputStyle}
                placeholder="https://script.google.com/macros/s/..."
                value={tempWebhook}
                onChange={(e) => setTempWebhook(e.target.value)}
              />
            </div>
            <p style={{ fontSize: 12, color: "#6b8aad", lineHeight: 1.6, marginBottom: 20 }}>
              Pegue aquí la URL del script de Google Apps Script que recibe los datos y los escribe en su Google Sheet. Vea las instrucciones para crear el script.
            </p>
            <button style={primaryBtn} onClick={saveWebhook}>Guardar</button>
          </div>
        </div>
      </div>
    );
  }

  // HISTORY
  if (view === "history") {
    return (
      <div style={bg}>
        <style>{fonts}</style>
        <div style={gridOverlay} />
        <div style={container}>
          <button style={backBtn} onClick={() => setView("home")}>← Volver</button>
          <div style={header}>
            <h1 style={{ ...titleStyle, fontSize: 22 }}>Historial</h1>
            <p style={subtitleStyle}>{records.length} registros</p>
          </div>
          {records.length === 0 ? (
            <div style={{ ...cardBase, textAlign: "center", color: "#6b8aad" }}>Sin registros aún</div>
          ) : (
            records.map((r) => (
              <div key={r.id} style={{ ...cardBase, padding: 16, marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <span style={{ fontWeight: 600, fontSize: 15 }}>{r.dispositivo}</span>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      padding: "3px 10px",
                      borderRadius: 12,
                      background: r.tipo === "Ingreso" ? "rgba(46,134,222,0.15)" : "rgba(230,126,34,0.15)",
                      color: r.tipo === "Ingreso" ? "#48c6ef" : "#e67e22",
                    }}
                  >
                    {r.tipo}
                  </span>
                </div>
                <div style={{ fontSize: 12, color: "#6b8aad", lineHeight: 1.8 }}>
                  <div>{r.categoria} → {r.hospital}</div>
                  <div>Ticket: {r.ticket} · Serie: {r.serie || "—"}</div>
                  <div>Fecha: {r.fecha} · Recibió: {r.recibio || "—"}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  // SUCCESS
  if (view === "success") {
    const lastHospital = form.hospital === "Otro" ? form.hospitalOtro : form.hospital;
    return (
      <div style={bg}>
        <style>{fonts}</style>
        <div style={gridOverlay} />
        <div style={container}>
          <div style={{ ...cardBase, textAlign: "center", marginTop: 60, padding: 40 }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>✓</div>
            <h2 style={{ ...titleStyle, fontSize: 22, marginBottom: 8 }}>Registro Guardado</h2>
            <p style={{ color: "#6b8aad", fontSize: 14, marginBottom: 6 }}>
              {lastResponse.mensaje || (webhookUrl ? "Enviado a Google Sheets correctamente" : "Guardado localmente (Google Sheets no configurado)")}
            </p>
            <p style={{ color: "#8ea4bf", fontSize: 13, marginBottom: 28 }}>
              {getCategoryLabel()} → {lastHospital}
            </p>
            <button
              style={primaryBtn}
              onClick={() => {
                setForm((p) => ({
                  ...p,
                  ticketTipo: "",
                  ticket: "",
                  dispositivo: "",
                  serie: "",
                  recibio: "",
                  firma: null,
                  foto: null,
                }));
                setView("form");
              }}
            >
              Seguir cargando en {lastHospital}
            </button>
            <button
              style={{ ...pillBtn, marginTop: 12, width: "100%" }}
              onClick={() => setView("home")}
            >
              Menú Principal
            </button>
          </div>
        </div>
      </div>
    );
  }

  // FORM
  return (
    <div style={bg}>
      <style>{fonts}</style>
      <div style={gridOverlay} />
      <div style={container}>
        <button style={backBtn} onClick={() => setView("home")}>← Volver</button>

        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <div
            style={iconCircle(
              category === "interior" ? "#2e86de" : category === "capital" ? "#27ae60" : "#e67e22"
            )}
          >
            {category === "interior" ? "🏥" : category === "capital" ? "🏛" : "🚚"}
          </div>
          <div>
            <h2 style={{ ...titleStyle, fontSize: 20, margin: 0 }}>{getCategoryLabel()}</h2>
            <p style={{ color: "#6b8aad", fontSize: 12, margin: 0, marginTop: 2 }}>Registro de equipo</p>
          </div>
        </div>

        <div style={cardBase}>
          {/* Hospital / Proveedor */}
          <div style={fieldGroup}>
            <label style={labelStyle}>
              {category === "proveedores" ? "Proveedor" : "Hospital"} *
            </label>
            <select
              style={selectStyle}
              value={form.hospital}
              onChange={(e) => update("hospital", e.target.value)}
            >
              <option value="">Seleccione...</option>
              {getHospitalList().map((h) => (
                <option key={h} value={h}>{h}</option>
              ))}
            </select>
          </div>

          {form.hospital === "Otro" && (
            <div style={fieldGroup}>
              <label style={labelStyle}>Especifique *</label>
              <input
                style={inputStyle}
                placeholder="Nombre..."
                value={form.hospitalOtro}
                onChange={(e) => update("hospitalOtro", e.target.value)}
              />
            </div>
          )}

          {/* Tipo */}
          <div style={fieldGroup}>
            <label style={labelStyle}>Tipo de Movimiento *</label>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                style={form.tipo === "Ingreso" ? pillActive : pillBtn}
                onClick={() => update("tipo", "Ingreso")}
              >
                ↓ Ingreso
              </button>
              <button
                style={form.tipo === "Egreso" ? pillActive : pillBtn}
                onClick={() => update("tipo", "Egreso")}
              >
                ↑ Egreso
              </button>
            </div>
          </div>

          {/* Ticket */}
          <div style={fieldGroup}>
            <label style={labelStyle}>Nº de Ticket *</label>
            <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
              <button
                style={form.ticketTipo === "I" ? pillActive : pillBtn}
                onClick={() => update("ticketTipo", "I")}
              >
                I · Incidente
              </button>
              <button
                style={form.ticketTipo === "R" ? pillActive : pillBtn}
                onClick={() => update("ticketTipo", "R")}
              >
                R · Requerimiento
              </button>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{
                padding: "12px 14px",
                background: form.ticketTipo ? "rgba(46,134,222,0.15)" : "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: "10px 0 0 10px",
                color: form.ticketTipo ? "#48c6ef" : "#6b8aad",
                fontSize: 16,
                fontWeight: 700,
                fontFamily: "'DM Sans', sans-serif",
                minWidth: 28,
                textAlign: "center",
              }}>
                {form.ticketTipo || "?"}
              </span>
              <input
                style={{ ...inputStyle, borderRadius: "0 10px 10px 0", flex: 1 }}
                placeholder="Número de ticket"
                value={form.ticket}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "");
                  update("ticket", val);
                }}
                inputMode="numeric"
              />
            </div>
          </div>

          {/* Dispositivo */}
          <div style={fieldGroup}>
            <label style={labelStyle}>Dispositivo / Equipo *</label>
            <input
              style={inputStyle}
              placeholder="Ej: Monitor multiparamétrico"
              value={form.dispositivo}
              onChange={(e) => update("dispositivo", e.target.value)}
            />
          </div>

          {/* Serie */}
          <div style={fieldGroup}>
            <label style={labelStyle}>Nº de Serie</label>
            <input
              style={inputStyle}
              placeholder="Ej: SN-2024-0001"
              value={form.serie}
              onChange={(e) => update("serie", e.target.value)}
            />
          </div>

          {/* Fecha */}
          <div style={fieldGroup}>
            <label style={labelStyle}>Fecha *</label>
            <input
              type="date"
              style={inputStyle}
              value={form.fecha}
              onChange={(e) => update("fecha", e.target.value)}
            />
          </div>

          {/* Firma */}
          <div style={fieldGroup}>
            <label style={labelStyle}>Firma</label>
            <SignaturePad
              signatureData={form.firma}
              onSignatureChange={(data) => update("firma", data)}
            />
          </div>

          {/* Aclaración */}
          <div style={fieldGroup}>
            <label style={labelStyle}>Aclaración</label>
            <input
              style={inputStyle}
              placeholder="Nombre y apellido de quien firma"
              value={form.recibio}
              onChange={(e) => update("recibio", e.target.value)}
            />
          </div>

          {/* Foto */}
          <div style={fieldGroup}>
            <label style={labelStyle}>Foto del Equipo</label>
            {!form.foto ? (
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                  padding: "20px 14px",
                  background: "rgba(255,255,255,0.06)",
                  border: "2px dashed rgba(255,255,255,0.15)",
                  borderRadius: 12,
                  cursor: "pointer",
                  transition: "border 0.2s",
                }}
              >
                <span style={{ fontSize: 24 }}>📷</span>
                <span style={{ color: "#8ea4bf", fontSize: 14 }}>Tomar foto o elegir imagen</span>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = (ev) => update("foto", ev.target.result);
                    reader.readAsDataURL(file);
                  }}
                />
              </label>
            ) : (
              <div style={{ position: "relative" }}>
                <img
                  src={form.foto}
                  alt="Foto del equipo"
                  style={{
                    width: "100%",
                    maxHeight: 200,
                    objectFit: "cover",
                    borderRadius: 12,
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                />
                <button
                  onClick={() => update("foto", null)}
                  style={{
                    position: "absolute",
                    top: 8,
                    right: 8,
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

          <button
            style={{ ...primaryBtn, opacity: sending ? 0.6 : 1 }}
            onClick={handleSubmit}
            disabled={sending}
          >
            {sending ? "Enviando..." : "Registrar Equipo"}
          </button>
        </div>
      </div>
    </div>
  );
}
