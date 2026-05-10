import mammoth from "mammoth";
import pdf from "pdf-parse/lib/pdf-parse.js";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
};

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { filename, base64, mimetype } = req.body;

    if (!base64 || !filename) {
      return res.status(400).json({ error: "Fichier manquant" });
    }

    const buffer = Buffer.from(base64, "base64");
    let text = "";

    // Word .docx
    if (mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || filename.endsWith(".docx")) {
      const result = await mammoth.extractRawText({ buffer });
      text = result.value;
    }
    // Word .doc ancien format
    else if (mimetype === "application/msword" || filename.endsWith(".doc")) {
      text = buffer.toString("utf-8").replace(/[^\x20-\x7E\xA0-\xFF\n\r]/g, " ").replace(/\s+/g, " ").trim();
    }
    // PDF
    else if (mimetype === "application/pdf" || filename.endsWith(".pdf")) {
      const data = await pdf(buffer);
      text = data.text;
    }
    // TXT / MD / CSV — déjà lisibles côté client, mais on gère quand même
    else {
      text = buffer.toString("utf-8");
    }

    if (!text || text.trim().length < 10) {
      return res.status(200).json({ text: "", warning: "Contenu vide ou illisible" });
    }

    // Limiter à 15 000 caractères pour ne pas exploser le contexte Claude
    const truncated = text.length > 15000;
    return res.status(200).json({
      text: text.slice(0, 15000),
      truncated,
      chars: text.length,
    });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
