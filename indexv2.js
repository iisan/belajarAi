import { GoogleGenAI } from "@google/genai";
import "dotenv/config";
import express from "express";
import cors from "cors";
import multer from "multer";


// Initialize the Express application
const app = express();
// Middleware to parse JSON and handle CORS
app.use(cors()); //buat cross-origin resource sharing
app.use(express.json()); //membolehkan parsing JSON dalam request body
// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({});

// ====== Tambahan: KNOWLEDGE_BASE & SYSTEM_INSTRUCTION ======
const KNOWLEDGE_BASE = `
Nama Sistem: SIMASN (Sistem Informasi Manajemen Aparatur Sipil Negara) BKPSDM Pemerintah Kota Tangerang
Jam Operasional Layanan: Senin–Jumat, 07.30–16.30 WIB (hari libur nasional tutup)
Produk Layanan Utama:
- Tugas Belajar ASN
- Keterangan Menyelesaikan Pendidikan ASN
- Penyesuaian Ijazah ASN
- Kenaikan Pangkat ASN/PNS
- Pensiun ASN/PNS
- Pemberhentian ASN/PNS
- Ujian Dinas ASN
- Pengangkatan PPPK
- Kartu Pegawai (KARPEG)
- Kartu Istri (KARIS) / Kartu Suami (KARSU)
- Satyalencana Karya Satya
- Jabatan Fungsional ASN
- Pencantuman Gelar bagi PNS
- SPMT PPPK
- Perjanjian Kerja PPPK

Lokasi Layanan: BKPSDM Kota Tangerang (Gedung Cisadane, Lantai 2)

Aturan (Kebijakan Jawaban):
1) Jawab HANYA berdasarkan informasi yang ada di KONTEKS (basis pengetahuan ini atau konteks tambahan yang disediakan dalam prompt).
2) Jika info TIDAK ada di KONTEKS, sampaikan sopan bahwa data belum tersedia dan arahkan ke kanal resmi/jam layanan. Jangan mengarang.
3) Di luar topik SIMASN/BKPSDM, tolak sopan dan arahkan kembali.
4) Bahasa ramah, ringkas, gunakan bullet untuk prosedur/berkas.
5) Selalu WIB; jangan janji di luar jam operasional.
6) Jangan minta/tampilkan data sensitif yang tak relevan; ingatkan soal NIP/dokumen.
7) Jika istilah berbeda, jelaskan singkat dan sarankan verifikasi ke kanal resmi.
8) Jika syarat/prosedur tak ada di konteks, katakan belum tercantum dan sarankan hubungi BKPSDM.
9) Format jawaban: ringkasan singkat → bullet langkah/dokumen → penutup (jam & kanal).
10) Selalu berperan sebagai “Sahabat ASN”; jangan mengaku model AI.
`;

const SYSTEM_INSTRUCTION = `
Anda adalah "Sahabat ASN", asisten virtual SIMASN BKPSDM Kota Tangerang.
- Jawab hanya berdasarkan KONTEKS.
- Jika info tidak ada di KONTEKS: sebutkan belum tersedia dan arahkan ke kanal resmi pada hari kerja 07.30–16.30 WIB.
- Di luar topik SIMASN/BKPSDM: tolak sopan dan kembalikan ke topik.
- Gaya: ramah & ringkas; format: ringkasan → bullet → penutup; gunakan WIB; jangan mengaku model AI.
`;
// ===========================================================

app.post("/chat", async (req, res) => {
	if(!req.body) {
		return res.status(400).json({ error: "Request Body are required" });
	}

	const {prompt} = req.body;

	if(!prompt) {
		return res.status(400).json({ error: "Tidak ada prompt" });
	}

	try {
		const response = await ai.models.generateContent({
			model: "gemini-2.5-flash",
			contents: `Konteks:\n${KNOWLEDGE_BASE}\n\nPertanyaan Pengguna:\n${prompt}`,
			// Di @google/genai, system instruction disetel via config
			config: {
				systemInstruction: SYSTEM_INSTRUCTION,
				// optional: atur output mime-type jika perlu
				// responseMimeType: "text/plain",
				// optional: kontrol kreativitas
				// temperature: 0.5,
			},
		});
		return res.status(200).send(response.text || "No response text available");
	} catch (error) {
		console.error("Error generating content:", error);
		return res.status(500).send(error.message || "Internal Server Error");
	}
});

app.listen(3000, () => {
	console.log("Server is running on port 3000");	
});

/* async function main() {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: "Explain how AI works in a few words",
  });
  console.log(response.text);
//   console.log(response);
}

main(); */