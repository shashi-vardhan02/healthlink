import Fuse from 'fuse.js';
import { medicineDB } from '../../../data/medicinesData.js';

const fuse = new Fuse(medicineDB, {
    keys: ['name'],
    threshold: 0.4,
    includeScore: true
});

export const findBestMatch = (query) => {
    if (!query) return null;

    const results = fuse.search(query);
    if (results.length > 0) {
        const best = results[0];
        return {
            ...best.item,
            matchScore: (1 - best.score) * 100, // Convert to percentage
            originalQuery: query
        };
    }

    return null;
};
