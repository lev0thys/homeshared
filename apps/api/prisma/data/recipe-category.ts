/** Infère la catégorie cuisine (seed catalogue). */
export type RecipeCuisineSlug =
  | 'FRENCH'
  | 'ITALIAN'
  | 'ASIAN'
  | 'INDIAN'
  | 'MEDITERRANEAN'
  | 'MEXICAN'
  | 'SEAFOOD'
  | 'MEAT'
  | 'VEGETARIAN'
  | 'SOUP'
  | 'SALAD'
  | 'DESSERT'
  | 'BREAKFAST'
  | 'OTHER';

export const RECIPE_CUISINE_LABELS: Record<RecipeCuisineSlug, string> = {
  FRENCH: 'Français',
  ITALIAN: 'Italien',
  ASIAN: 'Asiatique',
  INDIAN: 'Indien',
  MEDITERRANEAN: 'Méditerranéen',
  MEXICAN: 'Mexicain',
  SEAFOOD: 'Poisson & mer',
  MEAT: 'Viande & volaille',
  VEGETARIAN: 'Végétarien',
  SOUP: 'Soupes',
  SALAD: 'Salades',
  DESSERT: 'Desserts',
  BREAKFAST: 'Petit-déjeuner',
  OTHER: 'Autre',
};

export function inferRecipeCuisine(slug: string, title: string): RecipeCuisineSlug {
  const s = `${slug} ${title}`.toLowerCase();

  if (/dessert|mousse|tarte|gateau|gâteau|crumble|sorbet|cookie|brownie|crêpe|crepe|gaufre|flan|compote|tiramisu|profiterole|ile-flottante|banana-bread|riz-lait/.test(s)) {
    return 'DESSERT';
  }
  if (/brunch|petit-dej|oeuf-poche|pancake|toast|gaufre|muesli|porridge/.test(s)) {
    return 'BREAKFAST';
  }
  if (/salade|taboule|taboulé|ceviche/.test(s)) {
    return 'SALAD';
  }
  if (/soupe|veloute|velouté|bisque|bouillabaisse|potage|minestrone|gazpacho/.test(s)) {
    return 'SOUP';
  }
  if (/vegetari|végétari|vege-|falafel|tofu|lentilles-veget|burger-lentille|dahl|curry-lentille/.test(s)) {
    return 'VEGETARIAN';
  }
  if (/tacos|fajitas|chili|mexicain|burrito|nachos/.test(s)) {
    return 'MEXICAN';
  }
  if (/curry|tandoori|dahl|tikka|biryani|naan|indien|masala/.test(s)) {
    return 'INDIAN';
  }
  if (/teriyaki|wok|nem|nems|satay|ramen|sushi|riz-cantonais|nouilles|pad-thai|spring|printemps|coco-ananas|soja|gingembre|porc-caramel|yakisoba/.test(s)) {
    return 'ASIAN';
  }
  if (/paella|moussaka|taboule|brandade|tapenade|provenç|provenc|mediterr/.test(s)) {
    return 'MEDITERRANEAN';
  }
  if (/pates|pâtes|pizza|risotto|lasagn|carbonara|pesto|bolognaise|napolitaine|margherita|italien|parmesan|mozzarella/.test(s)) {
    return 'ITALIAN';
  }
  if (/saumon|cabillaud|colin|thon|crevettes|moules|poisson|fish|sardine|brandade|bouillabaisse|paella/.test(s)) {
    return 'SEAFOOD';
  }
  if (/boeuf|bœuf|porc|poulet|agneau|veau|merguez|saucisse|steak|bourguignon|hachis|escalope|brochettes-poulet|viande/.test(s)) {
    return 'MEAT';
  }
  if (/quiche|gratin|ratatouille|croque|souffle|soufflé|bourguignon|blanquette|cassoulet|tarte-tomate|francais|français/.test(s)) {
    return 'FRENCH';
  }

  return 'OTHER';
}
