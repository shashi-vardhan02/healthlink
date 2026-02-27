export const parseStrength = (text) => {
    // Looks for patterns like 500mg, 650 mg, 5ml
    const strengthPattern = /\b(\d+)\s*(mg|ml|mcg|g)\b/i;
    const match = text.match(strengthPattern);

    if (match) return match[0];

    return null;
};
