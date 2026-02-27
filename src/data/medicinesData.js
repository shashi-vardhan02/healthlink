export const medicineDB = [
    {
        id: "med-001",
        name: "Paracetamol",
        strengths: ["500mg", "650mg", "1000mg"],
        type: "Tablet",
        interactions: ["Ibuprofen", "Alcohol"],
        dosageDefault: "1-0-1",
        category: "Analgesic"
    },
    {
        id: "med-002",
        name: "Amoxicillin",
        strengths: ["250mg", "500mg"],
        type: "Capsule",
        interactions: ["Methotrexate"],
        dosageDefault: "1-1-1",
        category: "Antibiotic"
    },
    {
        id: "med-003",
        name: "Ibuprofen",
        strengths: ["200mg", "400mg", "600mg"],
        type: "Tablet",
        interactions: ["Aspirin", "Warfarin", "Paracetamol"],
        dosageDefault: "1-0-1",
        category: "NSAID"
    },
    {
        id: "med-004",
        name: "Cetirizine",
        strengths: ["5mg", "10mg"],
        type: "Tablet",
        interactions: [],
        dosageDefault: "0-0-1",
        category: "Antihistamine"
    },
    {
        id: "med-005",
        name: "Metformin",
        strengths: ["500mg", "850mg", "1000mg"],
        type: "Tablet",
        interactions: ["Contrast Media"],
        dosageDefault: "1-0-1",
        category: "Antidiabetic"
    },
    {
        id: "med-006",
        name: "Atorvastatin",
        strengths: ["10mg", "20mg", "40mg", "80mg"],
        type: "Tablet",
        interactions: ["Grapefruit Juice"],
        dosageDefault: "0-0-1",
        category: "Statin"
    }
];
