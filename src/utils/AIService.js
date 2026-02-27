// Gemini AI Service — Direct API calls (no backend needed)
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyDYSovKeJOuHeYTjIXF2zXESWHV6qahSJA';
// Using gemini-2.0-flash for better reliability and performance with newer keys
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

const MEDICINE_SYSTEM_PROMPT = `You are HealthLink AI, a virtual RMP (Registered Medical Practitioner) and Medicine Information Assistant for the HealthLink healthcare app.

YOUR ROLE:
- Provide general medicine information only
- Suggest commonly used OTC (over-the-counter) medicines
- Explain what each medicine is used for
- Keep responses short, clear, and easy to understand

STRICT SAFETY RULES:
- Do NOT diagnose diseases
- Do NOT prescribe specific dosages
- Do NOT replace doctor consultation
- Always include the disclaimer: "This is general information. Please consult a doctor."
- If the query is about a serious condition, advise seeing a doctor immediately
- Be friendly, calm, and reassuring

RESPONSE FORMAT (use this for symptom queries):
For mild [symptom], commonly used medicines include:

• **Medicine Name** – what it is used for
• **Medicine Name** – what it is used for

⚠️ *This is general information only. Please consult a doctor before taking any medication.*`;

const checkDailyLimit = () => {
    try {
        const today = new Date().toISOString().split('T')[0];
        const storageKey = 'varogra_ai_usage';
        const data = JSON.parse(localStorage.getItem(storageKey) || '{}');

        if (data.date !== today) {
            localStorage.setItem(storageKey, JSON.stringify({ date: today, count: 1 }));
            return true;
        }

        if (data.count >= 100) {
            return false;
        }

        localStorage.setItem(storageKey, JSON.stringify({ date: today, count: (data.count || 0) + 1 }));
        return true;
    } catch (e) {
        console.warn("Storage error:", e);
        return true;
    }
};

const delay = (ms) => new Promise(res => setTimeout(res, ms));

export const getAIResponse = async (history, role = 'patient') => {
    try {
        if (!checkDailyLimit()) {
            return "You've reached your daily AI usage limit (100 queries). Please try again tomorrow.";
        }

        // Filter and format history to strictly alternate user/model
        const formattedHistory = [];
        let lastRole = null;

        for (const msg of history) {
            const currentRole = msg.role === 'user' ? 'user' : 'model';
            if (currentRole === lastRole) continue;

            if (msg.text && msg.text.trim()) {
                formattedHistory.push({
                    role: currentRole,
                    parts: [{ text: msg.text }]
                });
                lastRole = currentRole;
            }
        }

        const requestBody = {
            contents: formattedHistory,
            systemInstruction: {
                parts: [{ text: MEDICINE_SYSTEM_PROMPT }]
            },
            generationConfig: {
                temperature: 0.7,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 500,
            }
        };

        // Exponential Backoff Logic for 429 errors
        let retryCount = 0;
        const maxRetries = 3;
        let waitTime = 2000; // Start with 2s

        while (retryCount <= maxRetries) {
            const response = await fetch(GEMINI_API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody),
            });

            if (response.status === 429 && retryCount < maxRetries) {
                console.warn(`AI Rate Limited (429). Retrying in ${waitTime}ms... (Attempt ${retryCount + 1}/${maxRetries})`);
                await delay(waitTime);
                retryCount++;
                waitTime *= 2; // Double the wait time
                continue;
            }

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('Gemini API Error Status:', response.status);
                throw new Error(`Gemini API error: ${response.status}`);
            }

            const data = await response.json();
            const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

            if (!text) {
                throw new Error('Empty response from Gemini');
            }

            return text;
        }
    } catch (error) {
        console.error("AI Service Error Details:", error);
        return "I apologize, but I'm having trouble connecting to the AI system. Please try again or consult a human doctor for urgent matters.";
    }
};

// Helper to convert file to base64
async function fileToBase64(file) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result.split(',')[1]);
        reader.readAsDataURL(file);
    });
}

export const identifyMedicine = async (imageFile) => {
    try {
        if (!(imageFile instanceof File)) throw new Error("Invalid image file");

        const base64Data = await fileToBase64(imageFile);

        const response = await fetch(GEMINI_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                systemInstruction: { parts: [{ text: MEDICINE_SYSTEM_PROMPT }] },
                contents: [{
                    role: 'user',
                    parts: [
                        { text: 'Identify this medicine from the image. Provide: medicine name, what it is commonly used for, and a reminder to consult a doctor. Keep it short and clear.' },
                        { inlineData: { mimeType: imageFile.type, data: base64Data } }
                    ]
                }],
                generationConfig: { temperature: 0.3, maxOutputTokens: 300 }
            }),
        });

        if (!response.ok) throw new Error('API error');
        const data = await response.json();
        return data?.candidates?.[0]?.content?.parts?.[0]?.text || "Could not identify the medicine.";
    } catch (error) {
        console.error("Medicine ID Error:", error);
        return "Connection issue. Please try again.";
    }
};

export const analyzePrescription = async (imageFile) => {
    try {
        if (!(imageFile instanceof File)) throw new Error("Invalid image file");

        const base64Data = await fileToBase64(imageFile);

        const response = await fetch(GEMINI_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                systemInstruction: { parts: [{ text: MEDICINE_SYSTEM_PROMPT }] },
                contents: [{
                    role: 'user',
                    parts: [
                        { text: 'Analyze this prescription image. List each medicine mentioned, what it is typically used for, and any general notes. Always remind the user to follow their doctor\'s instructions.' },
                        { inlineData: { mimeType: imageFile.type, data: base64Data } }
                    ]
                }],
                generationConfig: { temperature: 0.3, maxOutputTokens: 500 }
            }),
        });

        if (!response.ok) throw new Error('API error');
        const data = await response.json();
        return data?.candidates?.[0]?.content?.parts?.[0]?.text || "Could not analyze the prescription.";
    } catch (error) {
        console.error("Prescription Error:", error);
        return "Connection issue. Please try again.";
    }
};

export const extractAppointmentDetails = async (text) => {
    try {
        const prompt = `Extract appointment details from the following text into a JSON object. 
        Fields: intent (book, cancel, reschedule), doctor, hospital, date, time, specialty.
        If a field is missing, set it as null.
        Text: "${text}"`;

        const response = await fetch(GEMINI_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ role: 'user', parts: [{ text: prompt }] }],
                generationConfig: { temperature: 0.1, maxOutputTokens: 200 }
            }),
        });

        if (!response.ok) throw new Error('API error');
        const data = await response.json();
        const responseText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        const jsonMatch = responseText?.match(/\{[\s\S]*\}/);
        return jsonMatch ? JSON.parse(jsonMatch[0]) : null;
    } catch (error) {
        console.error("Extraction Error:", error);
        return null;
    }
};
