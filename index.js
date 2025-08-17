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
app.use(express.static("public")); // Serve static files from the 'public' directory
// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({});


app.post("/chat", async (req, res) => {
	if(!req.body) {
		return res.status(400).json({ error: "Request Body are required" });
	}

	const messages = req.body.prompt;


	// Validate that messages are provided
	// messages should be an array of objects with 'role' and 'content'
	// if(!messages || !Array.isArray(messages) || messages.length === 0) {
	// 	return res.status(400).send('Invalid or missing messages array');
	// }

	console.log(messages);
	console.log(req.body.prompt);
	
	if(!messages) {
		return res.status(400).json({ error: "Tidak ada prompt" });
	}

	const contents = messages;
 	// const contents = messages.map(message => {
	// 	return {
	// 		role: message.role || "user", // Default to 'user' if role is not specified
	// 		content: message.content || "" // Default to empty string if content is not specified
	// 	};
	// });


	try {
		const response = await ai.models.generateContent({
			model: "gemini-2.0-flash",
			contents: contents,
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