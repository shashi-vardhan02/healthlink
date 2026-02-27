const GEMINI_API_KEY = 'AIzaSyDYSovKeJOuHeYTjIXF2zXESWHV6qahSJA';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

async function testAI() {
    console.log("Final Testing: Gemini 1.5-flash API with New Key...");
    try {
        const response = await fetch(GEMINI_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ role: 'user', parts: [{ text: 'Respond with "System Online" if you are working.' }] }]
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            console.error("API Error Status:", response.status);
            console.error("API Message:", error.error.message);
            return;
        }

        const data = await response.json();
        console.log("SUCCESS:", data.candidates[0].content.parts[0].text);
    } catch (err) {
        console.error("Error:", err.message);
    }
}

testAI();
