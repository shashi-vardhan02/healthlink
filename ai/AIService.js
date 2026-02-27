// Gemini AI Service — Direct API calls
// Recommendation: Move these to a .env file!
const GEMINI_API_KEY = 'AIzaSyBcZIqNhmJ2Xv0-oWF31j7EoaFs0gSXHac';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

// THE RMP PROMPT: Professional, helpful, and identifying
const MEDICINE_SYSTEM_PROMPT = `You are HealthLink AI, a virtual Registered Medical Practitioner (RMP).

YOUR MISSION:
1. IDENTIFY: When a user mentions or shows a medicine, identify its class (e.g., Analgesic, Antipyretic) and common use.
2. OTC SUGGESTIONS: For minor symptoms, suggest standard Over-The-Counter (OTC) medications.
3. EXPLAIN: Tell the user exactly what the medicine does in simple terms.

STRICT PROTOCOLS:
- Use a professional, clinical yet empathetic tone.
- NEVER prescribe "Schedule H" drugs (antibiotics/steroids).
- If symptoms sound severe (chest pain, high fever), urge an immediate ER visit.
- MANDATORY FOOTER: Always end with: "⚠️ Note: This is for informational purposes. Please consult a physical doctor for dosage."`;

// ... (keep your checkDailyLimit and fileToBase64 functions as they are) ...

export const getAIResponse = async (history) => {
    try {
        if (!checkDailyLimit()) {
            return "Daily limit reached. Try again tomorrow.";
        }

        // FIX: Gemini needs a specific 'user' -> 'model' alternating pattern.
        // We map your history directly to the 'contents' array.
        const contents = history.map(msg => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.text }]
        }));

        const requestBody = {
            contents: contents,
            systemInstruction: {
                parts: [{ text: MEDICINE_SYSTEM_PROMPT }]
            },
            generationConfig: {
                temperature: 0.7, // Balanced for medical accuracy and conversation
                maxOutputTokens: 800,
            }
        };

        const response = await fetch(GEMINI_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) throw new Error(`API Error: ${response.status}`);

        const data = await response.json();
        return data?.candidates?.[0]?.content?.parts?.[0]?.text || "I'm having trouble analyzing that. Could you rephrase?";

    } catch (error) {
        console.error("Chat Service Error:", error);
        return "Connection issue. Please try again.";
    }
};