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
			contents: prompt,
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