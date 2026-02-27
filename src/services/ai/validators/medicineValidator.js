import { findBestMatch } from '../matchers/fuzzyMatcher.js';
import { parseDosage } from '../parsers/dosageParser.js';
import { parseStrength } from '../parsers/strengthParser.js';
import { checkInteractions } from './interactionEngine.js';

export const medicineValidator = {
    validateMedicine: (rawLine, currentList = []) => {
        // Step 1: Extract basic patterns from raw OCR line
        const strength = parseStrength(rawLine);
        const dosage = parseDosage(rawLine);

        // Step 2: Extract name (everything before strength/dosage)
        const nameQuery = rawLine.split(/\d+|mg|ml|mcg/i)[0].trim();

        // Step 3: Fuzzy match name with DB
        const match = findBestMatch(nameQuery);

        if (!match) {
            return {
                validated: false,
                name: nameQuery,
                strength,
                dosage: dosage || "1-0-1",
                confidence: 40,
                warnings: [{ type: "unknown", severity: "warning", message: "Medicine not found in database." }]
            };
        }

        // Step 4: Run safety checks
        const interactions = checkInteractions(currentList, match);

        return {
            validated: true,
            id: match.id,
            name: match.name,
            originalName: nameQuery,
            strength: strength || match.strengths[0],
            dosage: dosage || match.dosageDefault,
            confidence: Math.round(match.matchScore),
            warnings: interactions
        };
    }
};
