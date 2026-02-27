export const parseDosage = (text) => {
    // Looks for patterns like 1-0-1, 1-1-1, or "once daily"
    const dosagePattern = /\b([0-1])-([0-1])-([0-1])\b/g;
    const match = text.match(dosagePattern);

    if (match) return match[0];

    // Fallback common patterns
    if (text.toLowerCase().includes("daily")) return "0-0-1";
    if (text.toLowerCase().includes("twice")) return "1-0-1";
    if (text.toLowerCase().includes("thrice")) return "1-1-1";

    return null;
};
