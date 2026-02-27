export const checkInteractions = (selectedMedicines, newMedicine) => {
    const warnings = [];

    if (!newMedicine || !newMedicine.interactions) return warnings;

    selectedMedicines.forEach(existingMed => {
        if (newMedicine.interactions.includes(existingMed.name)) {
            warnings.push({
                type: "interaction",
                severity: "warning",
                message: `${newMedicine.name} may interact with ${existingMed.name}.`,
                involvedMedicines: [newMedicine.name, existingMed.name]
            });
        }

        // Overdose check (same medication twice)
        if (newMedicine.name === existingMed.name) {
            warnings.push({
                type: "duplicate",
                severity: "critical",
                message: `Duplicate medication detected: ${newMedicine.name} is already in the list.`,
                involvedMedicines: [newMedicine.name]
            });
        }
    });

    return warnings;
};
