/** Généré par scripts/generate-recipe-bulk.mjs — ne pas éditer à la main. */
import type { RecipeCatalogEntry } from './recipe.catalog.js';

export const RECIPE_CATALOG_BULK: RecipeCatalogEntry[] = [
  {
    slug: "salade-grecque",
    title: "Salade grecque",
    description: "Fraîcheur méditerranéenne.",
    instructions: "1. Couper concombre, tomate et poivron en dés.\n2. Ajouter olives et fromage feta (substitut : chèvre du catalogue).\n3. Assaisonner huile, citron, thym, sel.",
    prepMinutes: 12,
    cookMinutes: 0,
    servings: 2,
    lines: [
      {
        ingredientSlug: "concombre",
        quantity: 1,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "tomate",
        quantity: 2,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "poivron",
        quantity: 1,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "olive",
        quantity: 40,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "chevre",
        quantity: 100,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "oignon",
        quantity: 0.5,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "huile-olive",
        quantity: 2,
        unit: "càs",
        optional: false
      },
      {
        ingredientSlug: "citron",
        quantity: 0.5,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "thym",
        quantity: 1,
        unit: null,
        optional: true
      }
    ]
  },
  {
    slug: "salade-cesar-vegetarienne",
    title: "Salade César végétarienne",
    description: "Sans poulet, croûtons maison.",
    instructions: "1. Griller pain en croûtons.\n2. Mélanger salade, parmesan, sauce yaourt-moutarde.\n3. Poivrer et servir.",
    prepMinutes: 10,
    cookMinutes: 5,
    servings: 2,
    lines: [
      {
        ingredientSlug: "salade",
        quantity: 1,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "pain",
        quantity: 2,
        unit: "tranches",
        optional: false
      },
      {
        ingredientSlug: "parmesan",
        quantity: 40,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "yaourt",
        quantity: 2,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "moutarde",
        quantity: 1,
        unit: "càc",
        optional: false
      },
      {
        ingredientSlug: "huile-olive",
        quantity: 1,
        unit: "càs",
        optional: false
      }
    ]
  },
  {
    slug: "salade-lentilles",
    title: "Salade de lentilles",
    description: "Protéinée et économique.",
    instructions: "1. Cuire lentilles 25 min.\n2. Mélanger avec carotte, oignon, vinaigrette.\n3. Servir tiède ou froid.",
    prepMinutes: 10,
    cookMinutes: 25,
    servings: 4,
    lines: [
      {
        ingredientSlug: "lentilles",
        quantity: 250,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "carotte",
        quantity: 2,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "oignon",
        quantity: 1,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "vinaigre",
        quantity: 2,
        unit: "càs",
        optional: false
      },
      {
        ingredientSlug: "huile-olive",
        quantity: 2,
        unit: "càs",
        optional: false
      }
    ]
  },
  {
    slug: "salade-avocat-crevettes",
    title: "Salade avocat-crevettes",
    description: "Légère et iodée.",
    instructions: "1. Cuire les crevettes 3 à 4 min à feu vif jusqu'à rose et opaque.\n2. Disposer avocat, salade et tomate.\n3. Assaisonner citron et huile, servir frais.",
    prepMinutes: 15,
    cookMinutes: 5,
    servings: 2,
    lines: [
      {
        ingredientSlug: "crevettes",
        quantity: 200,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "avocat",
        quantity: 1,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "salade",
        quantity: 1,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "tomate",
        quantity: 2,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "citron",
        quantity: 1,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "huile-olive",
        quantity: 2,
        unit: "càs",
        optional: false
      }
    ]
  },
  {
    slug: "salade-pois-chiches",
    title: "Salade de pois chiches",
    description: "Express et rassasiante.",
    instructions: "1. Égoutter pois chiches.\n2. Mélanger tomate, concombre, persil, citron.\n3. Servir frais.",
    prepMinutes: 8,
    cookMinutes: 0,
    servings: 3,
    lines: [
      {
        ingredientSlug: "pois-chiches",
        quantity: 400,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "tomate",
        quantity: 2,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "concombre",
        quantity: 1,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "persil",
        quantity: 1,
        unit: "botte",
        optional: false
      },
      {
        ingredientSlug: "citron",
        quantity: 1,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "huile-olive",
        quantity: 2,
        unit: "càs",
        optional: false
      }
    ]
  },
  {
    slug: "salade-endive-roquefort",
    title: "Salade endive et chèvre",
    description: "Amère et crémeuse.",
    instructions: "1. Effeuiller salade et endive (salade).\n2. Émietter chèvre, ajouter noix.\n3. Vinaigrette moutarde.",
    prepMinutes: 8,
    cookMinutes: 0,
    servings: 2,
    lines: [
      {
        ingredientSlug: "salade",
        quantity: 2,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "chevre",
        quantity: 100,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "noix",
        quantity: 40,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "moutarde",
        quantity: 1,
        unit: "càc",
        optional: false
      },
      {
        ingredientSlug: "vinaigre",
        quantity: 1,
        unit: "càs",
        optional: false
      }
    ]
  },
  {
    slug: "salade-pomme-celeri",
    title: "Salade pomme-céleri",
    description: "Croquante et légère.",
    instructions: "1. Râper pomme et céleri.\n2. Mélanger yaourt, citron, sel.\n3. Servir frais.",
    prepMinutes: 10,
    cookMinutes: 0,
    servings: 3,
    lines: [
      {
        ingredientSlug: "pomme",
        quantity: 2,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "celeri",
        quantity: 3,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "yaourt",
        quantity: 1,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "citron",
        quantity: 0.5,
        unit: null,
        optional: false
      }
    ]
  },
  {
    slug: "salade-riz-thon",
    title: "Salade de riz au thon",
    description: "Repas complet froid.",
    instructions: "1. Cuire riz, refroidir.\n2. Mélanger thon, maïs, tomate, poivron.\n3. Assaisonner huile et citron.",
    prepMinutes: 15,
    cookMinutes: 15,
    servings: 4,
    lines: [
      {
        ingredientSlug: "riz",
        quantity: 250,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "thon",
        quantity: 160,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "mais",
        quantity: 150,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "tomate",
        quantity: 2,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "poivron",
        quantity: 1,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "huile-olive",
        quantity: 2,
        unit: "càs",
        optional: false
      }
    ]
  },
  {
    slug: "salade-concombre-yaourt",
    title: "Concombre au yaourt",
    description: "Accompagnement turc simple.",
    instructions: "1. Trancher concombre finement.\n2. Mélanger yaourt, ail, sel.\n3. Réfrigérer 30 min avant service.",
    prepMinutes: 8,
    cookMinutes: 0,
    servings: 4,
    lines: [
      {
        ingredientSlug: "concombre",
        quantity: 2,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "yaourt",
        quantity: 2,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "ail",
        quantity: 1,
        unit: "gousse",
        optional: false
      },
      {
        ingredientSlug: "sel",
        quantity: 1,
        unit: "pincée",
        optional: false
      }
    ]
  },
  {
    slug: "salade-feta-pasteque",
    title: "Pastèque et feta",
    description: "Sucré-salé estival.",
    instructions: "1. Couper pastèque (ananas option) et concombre.\n2. Émietter feta (chèvre).\n3. Menthe (basilic), huile, citron.",
    prepMinutes: 10,
    cookMinutes: 0,
    servings: 4,
    lines: [
      {
        ingredientSlug: "ananas",
        quantity: 0.5,
        unit: null,
        optional: true
      },
      {
        ingredientSlug: "concombre",
        quantity: 1,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "chevre",
        quantity: 120,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "basilic",
        quantity: 6,
        unit: "feuilles",
        optional: false
      },
      {
        ingredientSlug: "huile-olive",
        quantity: 1,
        unit: "càs",
        optional: false
      }
    ]
  },
  {
    slug: "salade-chou-rouge",
    title: "Salade de chou rouge",
    description: "Accompagnement croquant.",
    instructions: "1. Émincer chou finement (chou-fleur rouge → chou-fleur).\n2. Mélanger carotte râpée, vinaigrette.\n3. Laisser mariner 1 h.",
    prepMinutes: 10,
    cookMinutes: 0,
    servings: 4,
    lines: [
      {
        ingredientSlug: "chou-fleur",
        quantity: 0.5,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "carotte",
        quantity: 2,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "vinaigre",
        quantity: 2,
        unit: "càs",
        optional: false
      },
      {
        ingredientSlug: "huile-olive",
        quantity: 2,
        unit: "càs",
        optional: false
      },
      {
        ingredientSlug: "sucre",
        quantity: 1,
        unit: "càc",
        optional: true
      }
    ]
  },
  {
    slug: "salade-betterave-chèvre",
    title: "Betterave et chèvre",
    description: "Couleurs et saveurs.",
    instructions: "1. Cuire betteraves (carotte) 40 min au four.\n2. Trancher, ajouter chèvre et noix.\n3. Assaisonner.",
    prepMinutes: 10,
    cookMinutes: 40,
    servings: 3,
    lines: [
      {
        ingredientSlug: "carotte",
        quantity: 400,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "chevre",
        quantity: 80,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "noix",
        quantity: 30,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "huile-olive",
        quantity: 2,
        unit: "càs",
        optional: false
      }
    ]
  },
  {
    slug: "salade-quinoa-avocat",
    title: "Salade quinoa-avocat",
    description: "Superfood express.",
    instructions: "1. Cuire quinoa (semoule) 15 min.\n2. Mélanger avocat, tomate, citron.\n3. Servir tiède.",
    prepMinutes: 10,
    cookMinutes: 15,
    servings: 3,
    lines: [
      {
        ingredientSlug: "semoule",
        quantity: 180,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "avocat",
        quantity: 1,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "tomate",
        quantity: 2,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "citron",
        quantity: 1,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "huile-olive",
        quantity: 1,
        unit: "càs",
        optional: false
      }
    ]
  },
  {
    slug: "salade-haricots-verts",
    title: "Salade de haricots verts",
    description: "Classique de buffet.",
    instructions: "1. Cuire haricots 8 min, refroidir.\n2. Émincer oignon, vinaigrette moutarde.\n3. Servir froid.",
    prepMinutes: 10,
    cookMinutes: 10,
    servings: 4,
    lines: [
      {
        ingredientSlug: "haricot-vert",
        quantity: 400,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "oignon",
        quantity: 1,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "moutarde",
        quantity: 1,
        unit: "càc",
        optional: false
      },
      {
        ingredientSlug: "vinaigre",
        quantity: 2,
        unit: "càs",
        optional: false
      }
    ]
  },
  {
    slug: "salade-surimi",
    title: "Salade surimi (style)",
    description: "Avec crevettes.",
    instructions: "1. Effilocher crevettes cuites.\n2. Mélanger maïs, concombre, yaourt.\n3. Servir frais.",
    prepMinutes: 10,
    cookMinutes: 0,
    servings: 3,
    lines: [
      {
        ingredientSlug: "crevettes",
        quantity: 200,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "mais",
        quantity: 150,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "concombre",
        quantity: 1,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "yaourt",
        quantity: 2,
        unit: null,
        optional: false
      }
    ]
  },
  {
    slug: "salade-tomates-mozzarella-basilic",
    title: "Tomates-mozzarella-basilic",
    description: "Caprese revisitée.",
    instructions: "1. Trancher tomates et mozzarella.\n2. Alterner sur assiette.\n3. Huile, sel, basilic.",
    prepMinutes: 8,
    cookMinutes: 0,
    servings: 2,
    lines: [
      {
        ingredientSlug: "tomate",
        quantity: 4,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "mozzarella",
        quantity: 250,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "basilic",
        quantity: 10,
        unit: "feuilles",
        optional: false
      },
      {
        ingredientSlug: "huile-olive",
        quantity: 2,
        unit: "càs",
        optional: false
      },
      {
        ingredientSlug: "sel",
        quantity: 1,
        unit: "pincée",
        optional: false
      }
    ]
  },
  {
    slug: "salade-pates-italienne",
    title: "Salade de pâtes italienne",
    description: "Picnic idéal.",
    instructions: "1. Cuire pâtes, refroidir.\n2. Mélanger tomate, mozzarella, basilic, huile.\n3. Servir froid.",
    prepMinutes: 12,
    cookMinutes: 12,
    servings: 4,
    lines: [
      {
        ingredientSlug: "pates",
        quantity: 300,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "tomate",
        quantity: 3,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "mozzarella",
        quantity: 125,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "basilic",
        quantity: 8,
        unit: "feuilles",
        optional: false
      },
      {
        ingredientSlug: "huile-olive",
        quantity: 3,
        unit: "càs",
        optional: false
      }
    ]
  },
  {
    slug: "salade-fruits-ete",
    title: "Salade de fruits d'été",
    description: "Dessert léger.",
    instructions: "1. Couper fraises, framboises, mangue, banane.\n2. Arroser citron et miel.\n3. Servir frais.",
    prepMinutes: 15,
    cookMinutes: 0,
    servings: 6,
    lines: [
      {
        ingredientSlug: "fraise",
        quantity: 200,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "framboise",
        quantity: 150,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "mangue",
        quantity: 1,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "banane",
        quantity: 2,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "citron",
        quantity: 0.5,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "miel",
        quantity: 2,
        unit: "càs",
        optional: false
      }
    ]
  },
  {
    slug: "salade-roquette-parmesan",
    title: "Roquette et parmesan",
    description: "Simple et élégante.",
    instructions: "1. Laver salade (roquette).\n2. Copeaux de parmesan.\n3. Huile, citron, poivre.",
    prepMinutes: 5,
    cookMinutes: 0,
    servings: 2,
    lines: [
      {
        ingredientSlug: "salade",
        quantity: 1,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "parmesan",
        quantity: 50,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "huile-olive",
        quantity: 2,
        unit: "càs",
        optional: false
      },
      {
        ingredientSlug: "citron",
        quantity: 0.5,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "poivre",
        quantity: 1,
        unit: "pincée",
        optional: false
      }
    ]
  },
  {
    slug: "salade-celeri-pomme-noix",
    title: "Céleri-pomme-noix",
    description: "Waldorf simplifiée.",
    instructions: "1. Couper céleri et pomme en bâtonnets.\n2. Mélanger yaourt et citron.\n3. Ajouter noix concassées.",
    prepMinutes: 10,
    cookMinutes: 0,
    servings: 3,
    lines: [
      {
        ingredientSlug: "celeri",
        quantity: 4,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "pomme",
        quantity: 2,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "yaourt",
        quantity: 2,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "noix",
        quantity: 50,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "citron",
        quantity: 0.5,
        unit: null,
        optional: false
      }
    ]
  },
  {
    slug: "salade-melon-jambon",
    title: "Melon et jambon",
    description: "Entrée estivale.",
    instructions: "1. Couper melon (ananas) en quartiers.\n2. Envelopper de jambon.\n3. Servir frais.",
    prepMinutes: 8,
    cookMinutes: 0,
    servings: 2,
    lines: [
      {
        ingredientSlug: "ananas",
        quantity: 0.5,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "jambon",
        quantity: 100,
        unit: "g",
        optional: false
      }
    ]
  },
  {
    slug: "salade-lentilles-feta",
    title: "Lentilles et feta",
    description: "Repas équilibré.",
    instructions: "1. Cuire lentilles.\n2. Mélanger feta, tomate, oignon.\n3. Vinaigrette citron.",
    prepMinutes: 10,
    cookMinutes: 30,
    servings: 4,
    lines: [
      {
        ingredientSlug: "lentilles",
        quantity: 250,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "chevre",
        quantity: 100,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "tomate",
        quantity: 2,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "oignon",
        quantity: 1,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "citron",
        quantity: 1,
        unit: null,
        optional: false
      }
    ]
  },
  {
    slug: "rouleaux-printemps",
    title: "Rouleaux de printemps",
    description: "Frais et légers — proportions vérifiées (≈12 rouleaux / 4 pers.).",
    instructions: "1. Cuire les vermicelles 3 à 5 min, rincer à l'eau froide (réf. Jow / recettes.com).\n2. Tremper chaque feuille 5 à 10 s dans l'eau tiède.\n3. Garnir : salade, 15 g vermicelles, 2 crevettes, carotte en julienne, herbes.\n4. Rouler serré. Sauce soja ou citron en accompagnement.",
    prepMinutes: 25,
    cookMinutes: 0,
    servings: 4,
    lines: [
      {
        ingredientSlug: "feuille-riz",
        quantity: 12,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "crevettes",
        quantity: 250,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "nouilles-riz",
        quantity: 120,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "carotte",
        quantity: 1,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "salade",
        quantity: 4,
        unit: "feuilles",
        optional: false
      },
      {
        ingredientSlug: "basilic",
        quantity: 8,
        unit: "feuilles",
        optional: false
      },
      {
        ingredientSlug: "sauce-soja",
        quantity: 3,
        unit: "càs",
        optional: false
      },
      {
        ingredientSlug: "citron",
        quantity: 1,
        unit: null,
        optional: false
      }
    ]
  },
  {
    slug: "nem-poulet",
    title: "Nems au poulet",
    description: "Version croustillante au four.",
    instructions: "1. Faire revenir le poulet haché avec carotte et champignon 8 min (chair blanche).\n2. Garnir les feuilles de riz, plier en nem.\n3. Cuire au four 200 °C, 18 min, jusqu'à coloration — farce déjà cuite.",
    prepMinutes: 20,
    cookMinutes: 15,
    servings: 4,
    lines: [
      {
        ingredientSlug: "poulet",
        quantity: 300,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "carotte",
        quantity: 1,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "champignon",
        quantity: 100,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "feuille-riz",
        quantity: 6,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "sauce-soja",
        quantity: 2,
        unit: "càs",
        optional: false
      },
      {
        ingredientSlug: "huile-tournesol",
        quantity: 1,
        unit: "càs",
        optional: false
      }
    ]
  },
  {
    slug: "pad-thai-express",
    title: "Pad thaï express",
    description: "Nouilles sautées sucré-salé.",
    instructions: "1. Faire tremper nouilles de riz.\n2. Sauter crevettes, oeuf brouillé, légumes.\n3. Mélanger sauce soja, citron, sucre.",
    prepMinutes: 15,
    cookMinutes: 10,
    servings: 3,
    lines: [
      {
        ingredientSlug: "nouilles-riz",
        quantity: 200,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "crevettes",
        quantity: 150,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "oeuf",
        quantity: 2,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "carotte",
        quantity: 1,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "sauce-soja",
        quantity: 3,
        unit: "càs",
        optional: false
      },
      {
        ingredientSlug: "citron",
        quantity: 1,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "sucre",
        quantity: 1,
        unit: "càs",
        optional: false
      }
    ]
  },
  {
    slug: "riz-saute-legumes",
    title: "Riz sauté aux légumes",
    description: "Reste de riz valorisé.",
    instructions: "1. Sauter oignon, carotte, petit pois.\n2. Ajouter riz cuit, oeuf, sauce soja.\n3. Servir chaud.",
    prepMinutes: 10,
    cookMinutes: 12,
    servings: 3,
    lines: [
      {
        ingredientSlug: "riz",
        quantity: 300,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "oeuf",
        quantity: 2,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "carotte",
        quantity: 1,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "petit-pois",
        quantity: 100,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "oignon",
        quantity: 1,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "sauce-soja",
        quantity: 2,
        unit: "càs",
        optional: false
      },
      {
        ingredientSlug: "huile-tournesol",
        quantity: 2,
        unit: "càs",
        optional: false
      }
    ]
  },
  {
    slug: "soupe-miso-legumes",
    title: "Soupe miso aux légumes",
    description: "Réconfort japonais.",
    instructions: "1. Chauffer bouillon.\n2. Ajouter tofu, champignon, oignon vert (oignon).\n3. Incorporer sauce soja en fin de cuisson.",
    prepMinutes: 10,
    cookMinutes: 15,
    servings: 4,
    lines: [
      {
        ingredientSlug: "bouillon",
        quantity: 1,
        unit: "L",
        optional: false
      },
      {
        ingredientSlug: "tofu",
        quantity: 200,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "champignon",
        quantity: 150,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "oignon",
        quantity: 1,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "sauce-soja",
        quantity: 2,
        unit: "càs",
        optional: false
      }
    ]
  },
  {
    slug: "curry-coco-legumes",
    title: "Curry coco légumes",
    description: "Végétarien crémeux.",
    instructions: "1. Faire revenir oignon, gingembre, curry.\n2. Ajouter légumes, lait de coco, mijoter 20 min.\n3. Servir avec riz.",
    prepMinutes: 12,
    cookMinutes: 25,
    servings: 4,
    lines: [
      {
        ingredientSlug: "oignon",
        quantity: 1,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "gingembre",
        quantity: 15,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "curry",
        quantity: 2,
        unit: "càc",
        optional: false
      },
      {
        ingredientSlug: "lait-coco",
        quantity: 400,
        unit: "ml",
        optional: false
      },
      {
        ingredientSlug: "pomme-de-terre",
        quantity: 2,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "carotte",
        quantity: 2,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "riz",
        quantity: 250,
        unit: "g",
        optional: false
      }
    ]
  },
  {
    slug: "boeuf-saute-gingembre",
    title: "Bœuf sauté au gingembre",
    description: "Wok rapide.",
    instructions: "1. Mariner bœuf sauce soja et gingembre.\n2. Sauter à feu vif 3 min.\n3. Ajouter oignon et poivron, servir riz.",
    prepMinutes: 15,
    cookMinutes: 8,
    servings: 3,
    lines: [
      {
        ingredientSlug: "boeuf",
        quantity: 400,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "gingembre",
        quantity: 20,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "sauce-soja",
        quantity: 3,
        unit: "càs",
        optional: false
      },
      {
        ingredientSlug: "oignon",
        quantity: 1,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "poivron",
        quantity: 1,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "riz",
        quantity: 250,
        unit: "g",
        optional: false
      }
    ]
  },
  {
    slug: "sushi-maison-simplifie",
    title: "Sushi maison simplifié",
    description: "Makis express.",
    instructions: "1. Cuire riz, assaisonner vinaigre et sucre.\n2. Rouler riz, saumon, concombre dans feuille de riz.\n3. Couper en tranches.",
    prepMinutes: 30,
    cookMinutes: 20,
    servings: 4,
    lines: [
      {
        ingredientSlug: "riz",
        quantity: 300,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "saumon",
        quantity: 200,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "concombre",
        quantity: 0.5,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "vinaigre",
        quantity: 2,
        unit: "càs",
        optional: false
      },
      {
        ingredientSlug: "sucre",
        quantity: 1,
        unit: "càs",
        optional: false
      }
    ]
  },
  {
    slug: "brochettes-poulet-citronnelle",
    title: "Brochettes poulet citron",
    description: "Grill ou poêle.",
    instructions: "1. Mariner le poulet au citron, gingembre et sauce soja 30 min.\n2. Enfiler sur brochettes.\n3. Griller 12 à 15 min en retournant jusqu'à 74 °C à cœur (chair blanche).",
    prepMinutes: 15,
    cookMinutes: 12,
    servings: 4,
    lines: [
      {
        ingredientSlug: "poulet",
        quantity: 500,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "citron",
        quantity: 2,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "gingembre",
        quantity: 15,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "sauce-soja",
        quantity: 2,
        unit: "càs",
        optional: false
      }
    ]
  },
  {
    slug: "nouilles-sautees-tofu",
    title: "Nouilles sautées au tofu",
    description: "Végétarien protéiné.",
    instructions: "1. Dorer tofu en cubes.\n2. Sauter nouilles, légumes, sauce soja.\n3. Parsemer sésame.",
    prepMinutes: 12,
    cookMinutes: 15,
    servings: 3,
    lines: [
      {
        ingredientSlug: "tofu",
        quantity: 250,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "nouilles-riz",
        quantity: 200,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "carotte",
        quantity: 1,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "champignon",
        quantity: 150,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "sauce-soja",
        quantity: 3,
        unit: "càs",
        optional: false
      },
      {
        ingredientSlug: "sesame",
        quantity: 10,
        unit: "g",
        optional: false
      }
    ]
  },
  {
    slug: "porc-caramelise-asiatique",
    title: "Porc laqué miel-soja",
    description: "Style asiatique au four (pas de canard).",
    instructions: "1. Badigeonner le porc de miel et sauce soja.\n2. Enfourner 180 °C, 45 min en arrosant (porc bien cuit à cœur).\n3. Servir avec riz et concombre.",
    prepMinutes: 15,
    cookMinutes: 45,
    servings: 4,
    lines: [
      {
        ingredientSlug: "porc",
        quantity: 600,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "miel",
        quantity: 3,
        unit: "càs",
        optional: false
      },
      {
        ingredientSlug: "sauce-soja",
        quantity: 3,
        unit: "càs",
        optional: false
      },
      {
        ingredientSlug: "riz",
        quantity: 250,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "concombre",
        quantity: 1,
        unit: null,
        optional: false
      }
    ]
  },
  {
    slug: "samoussas-legumes",
    title: "Samoussas aux légumes",
    description: "Feuilletés croustillants.",
    instructions: "1. Farce : pomme de terre, petit pois, curry.\n2. Garnir feuilles (feuille-riz), plier triangle.\n3. Cuire au four 20 min.",
    prepMinutes: 25,
    cookMinutes: 20,
    servings: 6,
    lines: [
      {
        ingredientSlug: "pomme-de-terre",
        quantity: 3,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "petit-pois",
        quantity: 100,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "curry",
        quantity: 1,
        unit: "càc",
        optional: false
      },
      {
        ingredientSlug: "feuille-riz",
        quantity: 12,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "huile-tournesol",
        quantity: 2,
        unit: "càs",
        optional: false
      }
    ]
  },
  {
    slug: "pho-boeuf-express",
    title: "Pho bœuf express",
    description: "Soupe vietnamienne.",
    instructions: "1. Porter le bouillon à frémissement avec gingembre.\n2. Cuire les nouilles de riz à part.\n3. Trancher le bœuf très fin : le plonger 1 à 2 min dans le bouillon frémissant jusqu'à plus de rose visible. Servir avec herbes.",
    prepMinutes: 15,
    cookMinutes: 20,
    servings: 4,
    lines: [
      {
        ingredientSlug: "bouillon",
        quantity: 1.5,
        unit: "L",
        optional: false
      },
      {
        ingredientSlug: "boeuf",
        quantity: 300,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "nouilles-riz",
        quantity: 200,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "gingembre",
        quantity: 20,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "citron",
        quantity: 1,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "basilic",
        quantity: 8,
        unit: "feuilles",
        optional: false
      }
    ]
  },
  {
    slug: "tempura-legumes",
    title: "Tempura de légumes",
    description: "Beignets légers.",
    instructions: "1. Préparer pâte farine + eau glacée.\n2. Tremper légumes, frire ou four 15 min.\n3. Servir sauce soja.",
    prepMinutes: 15,
    cookMinutes: 15,
    servings: 4,
    lines: [
      {
        ingredientSlug: "farine",
        quantity: 150,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "courgette",
        quantity: 1,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "carotte",
        quantity: 2,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "poivron",
        quantity: 1,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "sauce-soja",
        quantity: 2,
        unit: "càs",
        optional: false
      },
      {
        ingredientSlug: "huile-tournesol",
        quantity: 3,
        unit: "càs",
        optional: false
      }
    ]
  },
  {
    slug: "bun-boeuf-vietnamien",
    title: "Bun bœuf",
    description: "Bol de nouilles froides.",
    instructions: "1. Cuire nouilles, refroidir.\n2. Griller bœuf, disposer légumes frais.\n3. Arroser sauce soja et citron.",
    prepMinutes: 15,
    cookMinutes: 10,
    servings: 3,
    lines: [
      {
        ingredientSlug: "nouilles-riz",
        quantity: 250,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "boeuf",
        quantity: 300,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "carotte",
        quantity: 1,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "concombre",
        quantity: 1,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "sauce-soja",
        quantity: 2,
        unit: "càs",
        optional: false
      },
      {
        ingredientSlug: "citron",
        quantity: 1,
        unit: null,
        optional: false
      }
    ]
  },
  {
    slug: "riz-cantonais",
    title: "Riz cantonais",
    description: "Classique chinois.",
    instructions: "1. Sauter jambon, oeuf, petit pois.\n2. Ajouter riz froid, sauce soja.\n3. Bien mélanger à feu vif.",
    prepMinutes: 10,
    cookMinutes: 15,
    servings: 4,
    lines: [
      {
        ingredientSlug: "riz",
        quantity: 400,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "jambon",
        quantity: 100,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "oeuf",
        quantity: 2,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "petit-pois",
        quantity: 80,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "sauce-soja",
        quantity: 2,
        unit: "càs",
        optional: false
      },
      {
        ingredientSlug: "huile-tournesol",
        quantity: 2,
        unit: "càs",
        optional: false
      }
    ]
  },
  {
    slug: "satay-poulet",
    title: "Poulet satay",
    description: "Brochettes sauce coco.",
    instructions: "1. Mariner le poulet (curry, lait coco, sauce soja) 30 min.\n2. Enfiler sur brochettes, griller 12 à 15 min jusqu'à 74 °C à cœur.\n3. Servir avec sauce sésame.",
    prepMinutes: 20,
    cookMinutes: 15,
    servings: 4,
    lines: [
      {
        ingredientSlug: "poulet",
        quantity: 500,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "curry",
        quantity: 1,
        unit: "càc",
        optional: false
      },
      {
        ingredientSlug: "lait-coco",
        quantity: 200,
        unit: "ml",
        optional: false
      },
      {
        ingredientSlug: "sauce-soja",
        quantity: 2,
        unit: "càs",
        optional: false
      },
      {
        ingredientSlug: "sesame",
        quantity: 20,
        unit: "g",
        optional: false
      }
    ]
  },
  {
    slug: "maki-avocat-concombre",
    title: "Maki avocat-concombre",
    description: "Végétarien.",
    instructions: "1. Étaler riz sur feuille de riz.\n2. Garnir avocat, concombre.\n3. Rouler et couper.",
    prepMinutes: 20,
    cookMinutes: 0,
    servings: 3,
    lines: [
      {
        ingredientSlug: "riz",
        quantity: 250,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "feuille-riz",
        quantity: 6,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "avocat",
        quantity: 1,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "concombre",
        quantity: 1,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "vinaigre",
        quantity: 1,
        unit: "càs",
        optional: false
      }
    ]
  },
  {
    slug: "pates-arrabiata",
    title: "Pâtes arrabiata",
    description: "Tomate piquante.",
    instructions: "1. Cuire les pâtes al dente.\n2. Préparer la sauce avec les ingrédients.\n3. Mélanger et servir chaud.",
    prepMinutes: 10,
    cookMinutes: 15,
    servings: 4,
    lines: [
      {
        ingredientSlug: "sauce-tomate",
        quantity: 400,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "piment",
        quantity: 1,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "ail",
        quantity: 100,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "pates",
        quantity: 320,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "huile-olive",
        quantity: 100,
        unit: "càs",
        optional: false
      }
    ]
  },
  {
    slug: "pates-4-fromages",
    title: "Pâtes quatre fromages",
    description: "Ultra crémeux.",
    instructions: "1. Cuire les pâtes al dente.\n2. Préparer la sauce avec les ingrédients.\n3. Mélanger et servir chaud.",
    prepMinutes: 10,
    cookMinutes: 15,
    servings: 4,
    lines: [
      {
        ingredientSlug: "pates",
        quantity: 320,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "emmental",
        quantity: 100,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "parmesan",
        quantity: 100,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "mozzarella",
        quantity: 100,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "chevre",
        quantity: 100,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "creme-fraiche",
        quantity: 100,
        unit: "ml",
        optional: false
      }
    ]
  },
  {
    slug: "pates-bolognaise-vegetarienne",
    title: "Bolognaise végétarienne",
    description: "Lentilles à la place du bœuf.",
    instructions: "1. Cuire les pâtes al dente.\n2. Préparer la sauce avec les ingrédients.\n3. Mélanger et servir chaud.",
    prepMinutes: 10,
    cookMinutes: 15,
    servings: 4,
    lines: [
      {
        ingredientSlug: "pates",
        quantity: 320,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "lentilles",
        quantity: 100,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "sauce-tomate",
        quantity: 400,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "oignon",
        quantity: 100,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "carotte",
        quantity: 100,
        unit: "g",
        optional: false
      }
    ]
  },
  {
    slug: "pates-saumon-aneth",
    title: "Pâtes saumon",
    description: "Crémeux et rapide.",
    instructions: "1. Cuire les pâtes al dente.\n2. Préparer la sauce avec les ingrédients.\n3. Mélanger et servir chaud.",
    prepMinutes: 10,
    cookMinutes: 15,
    servings: 4,
    lines: [
      {
        ingredientSlug: "pates",
        quantity: 320,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "saumon",
        quantity: 100,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "creme-fraiche",
        quantity: 100,
        unit: "ml",
        optional: false
      },
      {
        ingredientSlug: "citron",
        quantity: 100,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "persil",
        quantity: 1,
        unit: "botte",
        optional: false
      }
    ]
  },
  {
    slug: "pates-champignons-creme",
    title: "Pâtes champignons",
    description: "Végétarien réconfortant.",
    instructions: "1. Cuire les pâtes al dente.\n2. Préparer la sauce avec les ingrédients.\n3. Mélanger et servir chaud.",
    prepMinutes: 10,
    cookMinutes: 15,
    servings: 4,
    lines: [
      {
        ingredientSlug: "pates",
        quantity: 320,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "champignon",
        quantity: 100,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "creme-fraiche",
        quantity: 100,
        unit: "ml",
        optional: false
      },
      {
        ingredientSlug: "ail",
        quantity: 100,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "persil",
        quantity: 100,
        unit: "g",
        optional: false
      }
    ]
  },
  {
    slug: "pates-lardons-cream",
    title: "Pâtes lardons-crème",
    description: "Classique français.",
    instructions: "1. Cuire les pâtes al dente.\n2. Préparer la sauce avec les ingrédients.\n3. Mélanger et servir chaud.",
    prepMinutes: 10,
    cookMinutes: 15,
    servings: 4,
    lines: [
      {
        ingredientSlug: "pates",
        quantity: 320,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "lardons",
        quantity: 100,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "creme-fraiche",
        quantity: 100,
        unit: "ml",
        optional: false
      },
      {
        ingredientSlug: "oeuf",
        quantity: 2,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "parmesan",
        quantity: 100,
        unit: "g",
        optional: false
      }
    ]
  },
  {
    slug: "pates-puttanesca",
    title: "Pâtes puttanesca",
    description: "Olives et anchois.",
    instructions: "1. Cuire les pâtes al dente.\n2. Préparer la sauce avec les ingrédients.\n3. Mélanger et servir chaud.",
    prepMinutes: 10,
    cookMinutes: 15,
    servings: 4,
    lines: [
      {
        ingredientSlug: "pates",
        quantity: 320,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "sauce-tomate",
        quantity: 400,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "olive",
        quantity: 100,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "anchois",
        quantity: 100,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "ail",
        quantity: 100,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "capres",
        quantity: 100,
        unit: "g",
        optional: false
      }
    ]
  },
  {
    slug: "pates-pesto-rouge",
    title: "Pâtes pesto rouge",
    description: "Tomates séchées style.",
    instructions: "1. Cuire les pâtes al dente.\n2. Préparer la sauce avec les ingrédients.\n3. Mélanger et servir chaud.",
    prepMinutes: 10,
    cookMinutes: 15,
    servings: 4,
    lines: [
      {
        ingredientSlug: "pates",
        quantity: 320,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "sauce-tomate",
        quantity: 400,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "pesto",
        quantity: 100,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "parmesan",
        quantity: 100,
        unit: "g",
        optional: false
      }
    ]
  },
  {
    slug: "pates-aubergine",
    title: "Pâtes aubergine",
    description: "Méditerranéen.",
    instructions: "1. Cuire les pâtes al dente.\n2. Préparer la sauce avec les ingrédients.\n3. Mélanger et servir chaud.",
    prepMinutes: 10,
    cookMinutes: 15,
    servings: 4,
    lines: [
      {
        ingredientSlug: "pates",
        quantity: 320,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "aubergine",
        quantity: 100,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "tomate",
        quantity: 100,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "basilic",
        quantity: 100,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "huile-olive",
        quantity: 100,
        unit: "càs",
        optional: false
      }
    ]
  },
  {
    slug: "pates-courgette-citron",
    title: "Pâtes courgette-citron",
    description: "Léger été.",
    instructions: "1. Cuire les pâtes al dente.\n2. Préparer la sauce avec les ingrédients.\n3. Mélanger et servir chaud.",
    prepMinutes: 10,
    cookMinutes: 15,
    servings: 4,
    lines: [
      {
        ingredientSlug: "pates",
        quantity: 320,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "courgette",
        quantity: 100,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "citron",
        quantity: 100,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "parmesan",
        quantity: 100,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "huile-olive",
        quantity: 100,
        unit: "càs",
        optional: false
      }
    ]
  },
  {
    slug: "pates-thon-tomate",
    title: "Pâtes thon-tomate",
    description: "Pantry staple.",
    instructions: "1. Cuire les pâtes al dente.\n2. Préparer la sauce avec les ingrédients.\n3. Mélanger et servir chaud.",
    prepMinutes: 10,
    cookMinutes: 15,
    servings: 4,
    lines: [
      {
        ingredientSlug: "pates",
        quantity: 320,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "thon",
        quantity: 100,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "sauce-tomate",
        quantity: 400,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "oignon",
        quantity: 100,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "ail",
        quantity: 100,
        unit: "g",
        optional: false
      }
    ]
  },
  {
    slug: "pates-spinach-ricotta",
    title: "Pâtes épinard-ricotta",
    description: "Vert et doux.",
    instructions: "1. Cuire les pâtes al dente.\n2. Préparer la sauce avec les ingrédients.\n3. Mélanger et servir chaud.",
    prepMinutes: 10,
    cookMinutes: 15,
    servings: 4,
    lines: [
      {
        ingredientSlug: "pates",
        quantity: 320,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "epinard",
        quantity: 100,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "ricotta",
        quantity: 100,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "ail",
        quantity: 100,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "parmesan",
        quantity: 100,
        unit: "g",
        optional: false
      }
    ]
  },
  {
    slug: "pates-gorgonzola-poire",
    title: "Pâtes poire-fromage",
    description: "Sucré-salé.",
    instructions: "1. Cuire les pâtes al dente.\n2. Préparer la sauce avec les ingrédients.\n3. Mélanger et servir chaud.",
    prepMinutes: 10,
    cookMinutes: 15,
    servings: 4,
    lines: [
      {
        ingredientSlug: "pates",
        quantity: 320,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "poire",
        quantity: 2,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "chevre",
        quantity: 80,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "noix",
        quantity: 100,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "beurre",
        quantity: 100,
        unit: "g",
        optional: false
      }
    ]
  },
  {
    slug: "pates-arrabiata-crevettes",
    title: "Pâtes crevettes piquantes",
    description: "Mer et piment.",
    instructions: "1. Cuire les pâtes al dente.\n2. Préparer la sauce avec les ingrédients.\n3. Mélanger et servir chaud.",
    prepMinutes: 10,
    cookMinutes: 15,
    servings: 4,
    lines: [
      {
        ingredientSlug: "pates",
        quantity: 320,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "crevettes",
        quantity: 100,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "sauce-tomate",
        quantity: 400,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "piment",
        quantity: 100,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "ail",
        quantity: 100,
        unit: "g",
        optional: false
      }
    ]
  },
  {
    slug: "pates-carbonara-saumon",
    title: "Carbonara au saumon",
    description: "Twist iodé.",
    instructions: "1. Cuire les pâtes al dente.\n2. Préparer la sauce avec les ingrédients.\n3. Mélanger et servir chaud.",
    prepMinutes: 10,
    cookMinutes: 15,
    servings: 4,
    lines: [
      {
        ingredientSlug: "pates",
        quantity: 320,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "saumon",
        quantity: 100,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "oeuf",
        quantity: 2,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "creme-fraiche",
        quantity: 100,
        unit: "ml",
        optional: false
      },
      {
        ingredientSlug: "poivre",
        quantity: 100,
        unit: "g",
        optional: false
      }
    ]
  },
  {
    slug: "pates-napolitaine",
    title: "Pâtes napolitaine",
    description: "Sauce tomate basilic.",
    instructions: "1. Cuire les pâtes al dente.\n2. Préparer la sauce avec les ingrédients.\n3. Mélanger et servir chaud.",
    prepMinutes: 10,
    cookMinutes: 15,
    servings: 4,
    lines: [
      {
        ingredientSlug: "pates",
        quantity: 320,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "sauce-tomate",
        quantity: 400,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "basilic",
        quantity: 100,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "ail",
        quantity: 100,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "huile-olive",
        quantity: 100,
        unit: "càs",
        optional: false
      }
    ]
  },
  {
    slug: "pates-saucisse",
    title: "Pâtes saucisse",
    description: "Rustique.",
    instructions: "1. Cuire les pâtes al dente.\n2. Préparer la sauce avec les ingrédients.\n3. Mélanger et servir chaud.",
    prepMinutes: 10,
    cookMinutes: 15,
    servings: 4,
    lines: [
      {
        ingredientSlug: "pates",
        quantity: 320,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "saucisse",
        quantity: 100,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "oignon",
        quantity: 100,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "sauce-tomate",
        quantity: 400,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "parmesan",
        quantity: 100,
        unit: "g",
        optional: false
      }
    ]
  },
  {
    slug: "pates-mexicaine",
    title: "Pâtes mexicaine",
    description: "Haricots et maïs.",
    instructions: "1. Cuire les pâtes al dente.\n2. Préparer la sauce avec les ingrédients.\n3. Mélanger et servir chaud.",
    prepMinutes: 10,
    cookMinutes: 15,
    servings: 4,
    lines: [
      {
        ingredientSlug: "pates",
        quantity: 320,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "haricot-rouge",
        quantity: 100,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "mais",
        quantity: 100,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "poivron",
        quantity: 100,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "cumin",
        quantity: 100,
        unit: "g",
        optional: false
      }
    ]
  },
  {
    slug: "pates-truffe-champignon",
    title: "Pâtes champignons truffe",
    description: "Gourmand.",
    instructions: "1. Cuire les pâtes al dente.\n2. Préparer la sauce avec les ingrédients.\n3. Mélanger et servir chaud.",
    prepMinutes: 10,
    cookMinutes: 15,
    servings: 4,
    lines: [
      {
        ingredientSlug: "pates",
        quantity: 320,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "champignon",
        quantity: 100,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "creme-fraiche",
        quantity: 100,
        unit: "ml",
        optional: false
      },
      {
        ingredientSlug: "parmesan",
        quantity: 100,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "persil",
        quantity: 100,
        unit: "g",
        optional: false
      }
    ]
  },
  {
    slug: "pates-ail-persil",
    title: "Spaghetti aglio e olio",
    description: "3 ingrédients.",
    instructions: "1. Cuire les pâtes al dente.\n2. Préparer la sauce avec les ingrédients.\n3. Mélanger et servir chaud.",
    prepMinutes: 10,
    cookMinutes: 15,
    servings: 4,
    lines: [
      {
        ingredientSlug: "pates",
        quantity: 320,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "ail",
        quantity: 100,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "huile-olive",
        quantity: 100,
        unit: "càs",
        optional: false
      },
      {
        ingredientSlug: "piment",
        quantity: 100,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "persil",
        quantity: 100,
        unit: "g",
        optional: false
      }
    ]
  },
  {
    slug: "soupe-oignon",
    title: "Soupe à l'oignon",
    description: "Gratinée express.",
    instructions: "1. Préparer et laver les légumes.\n2. Cuire dans le bouillon jusqu'à tendreté.\n3. Mixer si velouté, assaisonner et servir.",
    prepMinutes: 15,
    cookMinutes: 40,
    servings: 4,
    lines: [
      {
        ingredientSlug: "oignon",
        quantity: 1,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "beurre",
        quantity: 2,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "bouillon",
        quantity: 1,
        unit: "L",
        optional: false
      },
      {
        ingredientSlug: "pain",
        quantity: 4,
        unit: "tranches",
        optional: false
      },
      {
        ingredientSlug: "emmental",
        quantity: 100,
        unit: "g",
        optional: false
      }
    ]
  },
  {
    slug: "soupe-potiron",
    title: "Velouté de potiron",
    description: "Automne.",
    instructions: "1. Préparer et laver les légumes.\n2. Cuire dans le bouillon jusqu'à tendreté.\n3. Mixer si velouté, assaisonner et servir.",
    prepMinutes: 10,
    cookMinutes: 30,
    servings: 4,
    lines: [
      {
        ingredientSlug: "potiron",
        quantity: 800,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "oignon",
        quantity: 1,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "creme-fraiche",
        quantity: 150,
        unit: "ml",
        optional: false
      },
      {
        ingredientSlug: "bouillon",
        quantity: 1,
        unit: "L",
        optional: false
      },
      {
        ingredientSlug: "cannelle",
        quantity: 1,
        unit: "càc",
        optional: false
      }
    ]
  },
  {
    slug: "soupe-poireau-pomme-de-terre",
    title: "Soupe poireau-pomme de terre",
    description: "Vichyssoise chaude.",
    instructions: "1. Préparer et laver les légumes.\n2. Cuire dans le bouillon jusqu'à tendreté.\n3. Mixer si velouté, assaisonner et servir.",
    prepMinutes: 12,
    cookMinutes: 25,
    servings: 4,
    lines: [
      {
        ingredientSlug: "poireau",
        quantity: 2,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "pomme-de-terre",
        quantity: 3,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "bouillon",
        quantity: 1,
        unit: "L",
        optional: false
      },
      {
        ingredientSlug: "creme-fraiche",
        quantity: 150,
        unit: "ml",
        optional: false
      }
    ]
  },
  {
    slug: "soupe-tomate-basilic",
    title: "Soupe tomate-basilic",
    description: "Classique.",
    instructions: "1. Préparer et laver les légumes.\n2. Cuire dans le bouillon jusqu'à tendreté.\n3. Mixer si velouté, assaisonner et servir.",
    prepMinutes: 10,
    cookMinutes: 20,
    servings: 4,
    lines: [
      {
        ingredientSlug: "sauce-tomate",
        quantity: 400,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "tomate",
        quantity: 2,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "basilic",
        quantity: 2,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "bouillon",
        quantity: 1,
        unit: "L",
        optional: false
      },
      {
        ingredientSlug: "creme-fraiche",
        quantity: 150,
        unit: "ml",
        optional: false
      }
    ]
  },
  {
    slug: "soupe-legumes-maison",
    title: "Soupe de légumes",
    description: "Zero waste.",
    instructions: "1. Préparer et laver les légumes.\n2. Cuire dans le bouillon jusqu'à tendreté.\n3. Mixer si velouté, assaisonner et servir.",
    prepMinutes: 15,
    cookMinutes: 35,
    servings: 6,
    lines: [
      {
        ingredientSlug: "carotte",
        quantity: 2,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "poireau",
        quantity: 2,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "pomme-de-terre",
        quantity: 3,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "courgette",
        quantity: 2,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "bouillon",
        quantity: 1,
        unit: "L",
        optional: false
      }
    ]
  },
  {
    slug: "soupe-haricots-rouges",
    title: "Soupe haricots rouges",
    description: "Américaine.",
    instructions: "1. Préparer et laver les légumes.\n2. Cuire dans le bouillon jusqu'à tendreté.\n3. Mixer si velouté, assaisonner et servir.",
    prepMinutes: 10,
    cookMinutes: 30,
    servings: 4,
    lines: [
      {
        ingredientSlug: "haricot-rouge",
        quantity: 250,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "tomate",
        quantity: 2,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "oignon",
        quantity: 1,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "cumin",
        quantity: 1,
        unit: "càc",
        optional: false
      },
      {
        ingredientSlug: "bouillon",
        quantity: 1,
        unit: "L",
        optional: false
      }
    ]
  },
  {
    slug: "soupe-champignons",
    title: "Crème de champignons",
    description: "Onctueuse.",
    instructions: "1. Préparer et laver les légumes.\n2. Cuire dans le bouillon jusqu'à tendreté.\n3. Mixer si velouté, assaisonner et servir.",
    prepMinutes: 10,
    cookMinutes: 25,
    servings: 4,
    lines: [
      {
        ingredientSlug: "champignon",
        quantity: 2,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "oignon",
        quantity: 1,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "creme-fraiche",
        quantity: 150,
        unit: "ml",
        optional: false
      },
      {
        ingredientSlug: "bouillon",
        quantity: 1,
        unit: "L",
        optional: false
      },
      {
        ingredientSlug: "persil",
        quantity: 2,
        unit: null,
        optional: false
      }
    ]
  },
  {
    slug: "soupe-brocoli",
    title: "Velouté brocoli",
    description: "Vert vitaminé.",
    instructions: "1. Préparer et laver les légumes.\n2. Cuire dans le bouillon jusqu'à tendreté.\n3. Mixer si velouté, assaisonner et servir.",
    prepMinutes: 10,
    cookMinutes: 20,
    servings: 4,
    lines: [
      {
        ingredientSlug: "brocoli",
        quantity: 2,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "pomme-de-terre",
        quantity: 3,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "bouillon",
        quantity: 1,
        unit: "L",
        optional: false
      },
      {
        ingredientSlug: "creme-fraiche",
        quantity: 150,
        unit: "ml",
        optional: false
      }
    ]
  },
  {
    slug: "soupe-celeri",
    title: "Velouté céleri",
    description: "Léger.",
    instructions: "1. Préparer et laver les légumes.\n2. Cuire dans le bouillon jusqu'à tendreté.\n3. Mixer si velouté, assaisonner et servir.",
    prepMinutes: 10,
    cookMinutes: 25,
    servings: 4,
    lines: [
      {
        ingredientSlug: "celeri",
        quantity: 2,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "pomme-de-terre",
        quantity: 3,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "bouillon",
        quantity: 1,
        unit: "L",
        optional: false
      },
      {
        ingredientSlug: "creme-fraiche",
        quantity: 150,
        unit: "ml",
        optional: false
      }
    ]
  },
  {
    slug: "soupe-fenouil",
    title: "Velouté fenouil",
    description: "Anisé.",
    instructions: "1. Préparer et laver les légumes.\n2. Cuire dans le bouillon jusqu'à tendreté.\n3. Mixer si velouté, assaisonner et servir.",
    prepMinutes: 10,
    cookMinutes: 25,
    servings: 4,
    lines: [
      {
        ingredientSlug: "fenouil",
        quantity: 2,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "pomme-de-terre",
        quantity: 3,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "bouillon",
        quantity: 1,
        unit: "L",
        optional: false
      },
      {
        ingredientSlug: "huile-olive",
        quantity: 2,
        unit: "càs",
        optional: false
      }
    ]
  },
  {
    slug: "soupe-minestrone",
    title: "Minestrone",
    description: "Italienne.",
    instructions: "1. Préparer et laver les légumes.\n2. Cuire dans le bouillon jusqu'à tendreté.\n3. Mixer si velouté, assaisonner et servir.",
    prepMinutes: 15,
    cookMinutes: 35,
    servings: 6,
    lines: [
      {
        ingredientSlug: "pates",
        quantity: 80,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "haricot-rouge",
        quantity: 250,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "carotte",
        quantity: 2,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "tomate",
        quantity: 2,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "bouillon",
        quantity: 1,
        unit: "L",
        optional: false
      },
      {
        ingredientSlug: "courgette",
        quantity: 2,
        unit: null,
        optional: false
      }
    ]
  },
  {
    slug: "soupe-gaspacho",
    title: "Gaspacho",
    description: "Froid espagnol.",
    instructions: "1. Préparer et laver les légumes.\n2. Cuire dans le bouillon jusqu'à tendreté.\n3. Mixer si velouté, assaisonner et servir.",
    prepMinutes: 15,
    cookMinutes: 0,
    servings: 4,
    lines: [
      {
        ingredientSlug: "tomate",
        quantity: 2,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "concombre",
        quantity: 2,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "poivron",
        quantity: 2,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "ail",
        quantity: 2,
        unit: "gousse",
        optional: false
      },
      {
        ingredientSlug: "huile-olive",
        quantity: 2,
        unit: "càs",
        optional: false
      },
      {
        ingredientSlug: "vinaigre",
        quantity: 2,
        unit: "càs",
        optional: false
      }
    ]
  },
  {
    slug: "soupe-pho-vegetarienne",
    title: "Pho végétarien",
    description: "Bouillon parfumé.",
    instructions: "1. Préparer et laver les légumes.\n2. Cuire dans le bouillon jusqu'à tendreté.\n3. Mixer si velouté, assaisonner et servir.",
    prepMinutes: 12,
    cookMinutes: 25,
    servings: 4,
    lines: [
      {
        ingredientSlug: "bouillon",
        quantity: 1,
        unit: "L",
        optional: false
      },
      {
        ingredientSlug: "nouilles-riz",
        quantity: 150,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "tofu",
        quantity: 200,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "gingembre",
        quantity: 2,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "basilic",
        quantity: 2,
        unit: null,
        optional: false
      }
    ]
  },
  {
    slug: "soupe-lentilles-corail",
    title: "Soupe lentilles corail",
    description: "Indienne douce.",
    instructions: "1. Préparer et laver les légumes.\n2. Cuire dans le bouillon jusqu'à tendreté.\n3. Mixer si velouté, assaisonner et servir.",
    prepMinutes: 10,
    cookMinutes: 25,
    servings: 4,
    lines: [
      {
        ingredientSlug: "lentilles",
        quantity: 250,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "carotte",
        quantity: 2,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "curry",
        quantity: 1,
        unit: "càc",
        optional: false
      },
      {
        ingredientSlug: "lait-coco",
        quantity: 200,
        unit: "ml",
        optional: false
      },
      {
        ingredientSlug: "oignon",
        quantity: 1,
        unit: null,
        optional: false
      }
    ]
  },
  {
    slug: "soupe-pois-cassés",
    title: "Soupe pois cassés",
    description: "Tradition.",
    instructions: "1. Préparer et laver les légumes.\n2. Cuire dans le bouillon jusqu'à tendreté.\n3. Mixer si velouté, assaisonner et servir.",
    prepMinutes: 10,
    cookMinutes: 45,
    servings: 6,
    lines: [
      {
        ingredientSlug: "lentilles",
        quantity: 250,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "lardons",
        quantity: 100,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "carotte",
        quantity: 2,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "oignon",
        quantity: 1,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "bouillon",
        quantity: 1,
        unit: "L",
        optional: false
      }
    ]
  },
  {
    slug: "soupe-navet",
    title: "Soupe navet",
    description: "Hiver.",
    instructions: "1. Préparer et laver les légumes.\n2. Cuire dans le bouillon jusqu'à tendreté.\n3. Mixer si velouté, assaisonner et servir.",
    prepMinutes: 10,
    cookMinutes: 30,
    servings: 4,
    lines: [
      {
        ingredientSlug: "navet",
        quantity: 2,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "pomme-de-terre",
        quantity: 3,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "bouillon",
        quantity: 1,
        unit: "L",
        optional: false
      },
      {
        ingredientSlug: "beurre",
        quantity: 2,
        unit: null,
        optional: false
      }
    ]
  },
  {
    slug: "soupe-epinard",
    title: "Soupe épinards",
    description: "Vert fluo.",
    instructions: "1. Préparer et laver les légumes.\n2. Cuire dans le bouillon jusqu'à tendreté.\n3. Mixer si velouté, assaisonner et servir.",
    prepMinutes: 8,
    cookMinutes: 15,
    servings: 4,
    lines: [
      {
        ingredientSlug: "epinard",
        quantity: 2,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "pomme-de-terre",
        quantity: 3,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "bouillon",
        quantity: 1,
        unit: "L",
        optional: false
      },
      {
        ingredientSlug: "creme-fraiche",
        quantity: 150,
        unit: "ml",
        optional: false
      }
    ]
  },
  {
    slug: "soupe-mais",
    title: "Crème de maïs",
    description: "Douce.",
    instructions: "1. Préparer et laver les légumes.\n2. Cuire dans le bouillon jusqu'à tendreté.\n3. Mixer si velouté, assaisonner et servir.",
    prepMinutes: 8,
    cookMinutes: 20,
    servings: 4,
    lines: [
      {
        ingredientSlug: "mais",
        quantity: 2,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "oignon",
        quantity: 1,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "creme-fraiche",
        quantity: 150,
        unit: "ml",
        optional: false
      },
      {
        ingredientSlug: "bouillon",
        quantity: 1,
        unit: "L",
        optional: false
      }
    ]
  },
  {
    slug: "soupe-poisson",
    title: "Soupe de poisson",
    description: "Méditerranée.",
    instructions: "1. Préparer et laver les légumes.\n2. Cuire dans le bouillon jusqu'à tendreté.\n3. Mixer si velouté, assaisonner et servir.",
    prepMinutes: 15,
    cookMinutes: 30,
    servings: 4,
    lines: [
      {
        ingredientSlug: "colin",
        quantity: 400,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "tomate",
        quantity: 2,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "ail",
        quantity: 2,
        unit: "gousse",
        optional: false
      },
      {
        ingredientSlug: "bouillon",
        quantity: 1,
        unit: "L",
        optional: false
      },
      {
        ingredientSlug: "huile-olive",
        quantity: 2,
        unit: "càs",
        optional: false
      },
      {
        ingredientSlug: "persil",
        quantity: 2,
        unit: null,
        optional: false
      }
    ]
  },
  {
    slug: "soupe-moules",
    title: "Soupe moules",
    description: "Bisque express.",
    instructions: "1. Préparer et laver les légumes.\n2. Cuire dans le bouillon jusqu'à tendreté.\n3. Mixer si velouté, assaisonner et servir.",
    prepMinutes: 15,
    cookMinutes: 20,
    servings: 4,
    lines: [
      {
        ingredientSlug: "moules",
        quantity: 400,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "tomate",
        quantity: 2,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "ail",
        quantity: 2,
        unit: "gousse",
        optional: false
      },
      {
        ingredientSlug: "bouillon",
        quantity: 1,
        unit: "L",
        optional: false
      },
      {
        ingredientSlug: "creme-fraiche",
        quantity: 150,
        unit: "ml",
        optional: false
      }
    ]
  },
  {
    slug: "poulet-citron-romarin",
    title: "Poulet citron-romarin",
    description: "Four.",
    instructions: "1. Assaisonner le poulet (sel, poivre).\n2. Cuire jusqu'à 74 °C à cœur (thermomètre dans la cuisse, sans toucher l'os).\n3. Laisser reposer 5 min — la chair ne doit jamais être rosée.",
    prepMinutes: 12,
    cookMinutes: 35,
    servings: 4,
    lines: [
      {
        ingredientSlug: "poulet",
        quantity: 600,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "oignon",
        quantity: 1,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "ail",
        quantity: 2,
        unit: "gousse",
        optional: false
      },
      {
        ingredientSlug: "huile-olive",
        quantity: 2,
        unit: "càs",
        optional: false
      },
      {
        ingredientSlug: "bouillon",
        quantity: 0.5,
        unit: "L",
        optional: true
      },
      {
        ingredientSlug: "curry",
        quantity: 1,
        unit: "càc",
        optional: true
      },
      {
        ingredientSlug: "paprika",
        quantity: 1,
        unit: "càc",
        optional: true
      },
      {
        ingredientSlug: "tomate",
        quantity: 2,
        unit: null,
        optional: true
      },
      {
        ingredientSlug: "riz",
        quantity: 250,
        unit: "g",
        optional: true
      }
    ]
  },
  {
    slug: "poulet-curry",
    title: "Poulet curry",
    description: "Crémeux.",
    instructions: "1. Assaisonner le poulet (sel, poivre).\n2. Cuire jusqu'à 74 °C à cœur (thermomètre dans la cuisse, sans toucher l'os).\n3. Laisser reposer 5 min — la chair ne doit jamais être rosée.",
    prepMinutes: 12,
    cookMinutes: 35,
    servings: 4,
    lines: [
      {
        ingredientSlug: "poulet",
        quantity: 600,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "oignon",
        quantity: 1,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "ail",
        quantity: 2,
        unit: "gousse",
        optional: false
      },
      {
        ingredientSlug: "huile-olive",
        quantity: 2,
        unit: "càs",
        optional: false
      },
      {
        ingredientSlug: "bouillon",
        quantity: 0.5,
        unit: "L",
        optional: true
      },
      {
        ingredientSlug: "curry",
        quantity: 1,
        unit: "càc",
        optional: true
      },
      {
        ingredientSlug: "paprika",
        quantity: 1,
        unit: "càc",
        optional: true
      },
      {
        ingredientSlug: "tomate",
        quantity: 2,
        unit: null,
        optional: true
      },
      {
        ingredientSlug: "riz",
        quantity: 250,
        unit: "g",
        optional: true
      }
    ]
  },
  {
    slug: "poulet-paprika",
    title: "Poulet paprika",
    description: "Hongrois.",
    instructions: "1. Assaisonner le poulet (sel, poivre).\n2. Cuire jusqu'à 74 °C à cœur (thermomètre dans la cuisse, sans toucher l'os).\n3. Laisser reposer 5 min — la chair ne doit jamais être rosée.",
    prepMinutes: 12,
    cookMinutes: 35,
    servings: 4,
    lines: [
      {
        ingredientSlug: "poulet",
        quantity: 600,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "oignon",
        quantity: 1,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "ail",
        quantity: 2,
        unit: "gousse",
        optional: false
      },
      {
        ingredientSlug: "huile-olive",
        quantity: 2,
        unit: "càs",
        optional: false
      },
      {
        ingredientSlug: "bouillon",
        quantity: 0.5,
        unit: "L",
        optional: true
      },
      {
        ingredientSlug: "curry",
        quantity: 1,
        unit: "càc",
        optional: true
      },
      {
        ingredientSlug: "paprika",
        quantity: 1,
        unit: "càc",
        optional: true
      },
      {
        ingredientSlug: "tomate",
        quantity: 2,
        unit: null,
        optional: true
      },
      {
        ingredientSlug: "riz",
        quantity: 250,
        unit: "g",
        optional: true
      }
    ]
  },
  {
    slug: "poulet-tandoori",
    title: "Poulet tandoori",
    description: "Épicé.",
    instructions: "1. Assaisonner le poulet (sel, poivre).\n2. Cuire jusqu'à 74 °C à cœur (thermomètre dans la cuisse, sans toucher l'os).\n3. Laisser reposer 5 min — la chair ne doit jamais être rosée.",
    prepMinutes: 12,
    cookMinutes: 35,
    servings: 4,
    lines: [
      {
        ingredientSlug: "poulet",
        quantity: 600,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "oignon",
        quantity: 1,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "ail",
        quantity: 2,
        unit: "gousse",
        optional: false
      },
      {
        ingredientSlug: "huile-olive",
        quantity: 2,
        unit: "càs",
        optional: false
      },
      {
        ingredientSlug: "bouillon",
        quantity: 0.5,
        unit: "L",
        optional: true
      },
      {
        ingredientSlug: "curry",
        quantity: 1,
        unit: "càc",
        optional: true
      },
      {
        ingredientSlug: "paprika",
        quantity: 1,
        unit: "càc",
        optional: true
      },
      {
        ingredientSlug: "tomate",
        quantity: 2,
        unit: null,
        optional: true
      },
      {
        ingredientSlug: "riz",
        quantity: 250,
        unit: "g",
        optional: true
      }
    ]
  },
  {
    slug: "poulet-champignons",
    title: "Poulet champignons",
    description: "Poêle.",
    instructions: "1. Assaisonner le poulet (sel, poivre).\n2. Cuire jusqu'à 74 °C à cœur (thermomètre dans la cuisse, sans toucher l'os).\n3. Laisser reposer 5 min — la chair ne doit jamais être rosée.",
    prepMinutes: 12,
    cookMinutes: 35,
    servings: 4,
    lines: [
      {
        ingredientSlug: "poulet",
        quantity: 600,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "oignon",
        quantity: 1,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "ail",
        quantity: 2,
        unit: "gousse",
        optional: false
      },
      {
        ingredientSlug: "huile-olive",
        quantity: 2,
        unit: "càs",
        optional: false
      },
      {
        ingredientSlug: "bouillon",
        quantity: 0.5,
        unit: "L",
        optional: true
      },
      {
        ingredientSlug: "curry",
        quantity: 1,
        unit: "càc",
        optional: true
      },
      {
        ingredientSlug: "paprika",
        quantity: 1,
        unit: "càc",
        optional: true
      },
      {
        ingredientSlug: "tomate",
        quantity: 2,
        unit: null,
        optional: true
      },
      {
        ingredientSlug: "riz",
        quantity: 250,
        unit: "g",
        optional: true
      }
    ]
  },
  {
    slug: "poulet-miel-moutarde",
    title: "Poulet miel-moutarde",
    description: "Caramélisé.",
    instructions: "1. Assaisonner le poulet (sel, poivre).\n2. Cuire jusqu'à 74 °C à cœur (thermomètre dans la cuisse, sans toucher l'os).\n3. Laisser reposer 5 min — la chair ne doit jamais être rosée.",
    prepMinutes: 12,
    cookMinutes: 35,
    servings: 4,
    lines: [
      {
        ingredientSlug: "poulet",
        quantity: 600,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "oignon",
        quantity: 1,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "ail",
        quantity: 2,
        unit: "gousse",
        optional: false
      },
      {
        ingredientSlug: "huile-olive",
        quantity: 2,
        unit: "càs",
        optional: false
      },
      {
        ingredientSlug: "bouillon",
        quantity: 0.5,
        unit: "L",
        optional: true
      },
      {
        ingredientSlug: "curry",
        quantity: 1,
        unit: "càc",
        optional: true
      },
      {
        ingredientSlug: "paprika",
        quantity: 1,
        unit: "càc",
        optional: true
      },
      {
        ingredientSlug: "tomate",
        quantity: 2,
        unit: null,
        optional: true
      },
      {
        ingredientSlug: "riz",
        quantity: 250,
        unit: "g",
        optional: true
      }
    ]
  },
  {
    slug: "poulet-basquaise",
    title: "Poulet basquaise",
    description: "Poivrons.",
    instructions: "1. Assaisonner le poulet (sel, poivre).\n2. Cuire jusqu'à 74 °C à cœur (thermomètre dans la cuisse, sans toucher l'os).\n3. Laisser reposer 5 min — la chair ne doit jamais être rosée.",
    prepMinutes: 12,
    cookMinutes: 35,
    servings: 4,
    lines: [
      {
        ingredientSlug: "poulet",
        quantity: 600,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "oignon",
        quantity: 1,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "ail",
        quantity: 2,
        unit: "gousse",
        optional: false
      },
      {
        ingredientSlug: "huile-olive",
        quantity: 2,
        unit: "càs",
        optional: false
      },
      {
        ingredientSlug: "bouillon",
        quantity: 0.5,
        unit: "L",
        optional: true
      },
      {
        ingredientSlug: "curry",
        quantity: 1,
        unit: "càc",
        optional: true
      },
      {
        ingredientSlug: "paprika",
        quantity: 1,
        unit: "càc",
        optional: true
      },
      {
        ingredientSlug: "tomate",
        quantity: 2,
        unit: null,
        optional: true
      },
      {
        ingredientSlug: "riz",
        quantity: 250,
        unit: "g",
        optional: true
      }
    ]
  },
  {
    slug: "poulet-colombo",
    title: "Poulet colombo",
    description: "Antillais.",
    instructions: "1. Assaisonner le poulet (sel, poivre).\n2. Cuire jusqu'à 74 °C à cœur (thermomètre dans la cuisse, sans toucher l'os).\n3. Laisser reposer 5 min — la chair ne doit jamais être rosée.",
    prepMinutes: 12,
    cookMinutes: 35,
    servings: 4,
    lines: [
      {
        ingredientSlug: "poulet",
        quantity: 600,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "oignon",
        quantity: 1,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "ail",
        quantity: 2,
        unit: "gousse",
        optional: false
      },
      {
        ingredientSlug: "huile-olive",
        quantity: 2,
        unit: "càs",
        optional: false
      },
      {
        ingredientSlug: "bouillon",
        quantity: 0.5,
        unit: "L",
        optional: true
      },
      {
        ingredientSlug: "curry",
        quantity: 1,
        unit: "càc",
        optional: true
      },
      {
        ingredientSlug: "paprika",
        quantity: 1,
        unit: "càc",
        optional: true
      },
      {
        ingredientSlug: "tomate",
        quantity: 2,
        unit: null,
        optional: true
      },
      {
        ingredientSlug: "riz",
        quantity: 250,
        unit: "g",
        optional: true
      }
    ]
  },
  {
    slug: "poulet-teriyaki",
    title: "Poulet teriyaki",
    description: "Japonais.",
    instructions: "1. Assaisonner le poulet (sel, poivre).\n2. Cuire jusqu'à 74 °C à cœur (thermomètre dans la cuisse, sans toucher l'os).\n3. Laisser reposer 5 min — la chair ne doit jamais être rosée.",
    prepMinutes: 12,
    cookMinutes: 20,
    servings: 4,
    lines: [
      {
        ingredientSlug: "poulet",
        quantity: 600,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "oignon",
        quantity: 1,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "ail",
        quantity: 2,
        unit: "gousse",
        optional: false
      },
      {
        ingredientSlug: "huile-olive",
        quantity: 2,
        unit: "càs",
        optional: false
      },
      {
        ingredientSlug: "bouillon",
        quantity: 0.5,
        unit: "L",
        optional: true
      },
      {
        ingredientSlug: "curry",
        quantity: 1,
        unit: "càc",
        optional: true
      },
      {
        ingredientSlug: "paprika",
        quantity: 1,
        unit: "càc",
        optional: true
      },
      {
        ingredientSlug: "tomate",
        quantity: 2,
        unit: null,
        optional: true
      },
      {
        ingredientSlug: "riz",
        quantity: 250,
        unit: "g",
        optional: true
      }
    ]
  },
  {
    slug: "poulet-coco-ananas",
    title: "Poulet coco-ananas",
    description: "Exotique.",
    instructions: "1. Assaisonner le poulet (sel, poivre).\n2. Cuire jusqu'à 74 °C à cœur (thermomètre dans la cuisse, sans toucher l'os).\n3. Laisser reposer 5 min — la chair ne doit jamais être rosée.",
    prepMinutes: 12,
    cookMinutes: 35,
    servings: 4,
    lines: [
      {
        ingredientSlug: "poulet",
        quantity: 600,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "oignon",
        quantity: 1,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "ail",
        quantity: 2,
        unit: "gousse",
        optional: false
      },
      {
        ingredientSlug: "huile-olive",
        quantity: 2,
        unit: "càs",
        optional: false
      },
      {
        ingredientSlug: "bouillon",
        quantity: 0.5,
        unit: "L",
        optional: true
      },
      {
        ingredientSlug: "curry",
        quantity: 1,
        unit: "càc",
        optional: true
      },
      {
        ingredientSlug: "paprika",
        quantity: 1,
        unit: "càc",
        optional: true
      },
      {
        ingredientSlug: "tomate",
        quantity: 2,
        unit: null,
        optional: true
      },
      {
        ingredientSlug: "riz",
        quantity: 250,
        unit: "g",
        optional: true
      }
    ]
  },
  {
    slug: "poulet-roti-herbes",
    title: "Poulet rôti aux herbes",
    description: "Dimanche.",
    instructions: "1. Assaisonner le poulet (sel, poivre).\n2. Cuire jusqu'à 74 °C à cœur (thermomètre dans la cuisse, sans toucher l'os).\n3. Laisser reposer 5 min — la chair ne doit jamais être rosée.",
    prepMinutes: 12,
    cookMinutes: 55,
    servings: 4,
    lines: [
      {
        ingredientSlug: "poulet",
        quantity: 600,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "oignon",
        quantity: 1,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "ail",
        quantity: 2,
        unit: "gousse",
        optional: false
      },
      {
        ingredientSlug: "huile-olive",
        quantity: 2,
        unit: "càs",
        optional: false
      },
      {
        ingredientSlug: "bouillon",
        quantity: 0.5,
        unit: "L",
        optional: true
      },
      {
        ingredientSlug: "curry",
        quantity: 1,
        unit: "càc",
        optional: true
      },
      {
        ingredientSlug: "paprika",
        quantity: 1,
        unit: "càc",
        optional: true
      },
      {
        ingredientSlug: "tomate",
        quantity: 2,
        unit: null,
        optional: true
      },
      {
        ingredientSlug: "riz",
        quantity: 250,
        unit: "g",
        optional: true
      }
    ]
  },
  {
    slug: "poulet-yassa",
    title: "Poulet yassa",
    description: "Sénégalais.",
    instructions: "1. Assaisonner le poulet (sel, poivre).\n2. Cuire jusqu'à 74 °C à cœur (thermomètre dans la cuisse, sans toucher l'os).\n3. Laisser reposer 5 min — la chair ne doit jamais être rosée.",
    prepMinutes: 12,
    cookMinutes: 35,
    servings: 4,
    lines: [
      {
        ingredientSlug: "poulet",
        quantity: 600,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "oignon",
        quantity: 1,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "ail",
        quantity: 2,
        unit: "gousse",
        optional: false
      },
      {
        ingredientSlug: "huile-olive",
        quantity: 2,
        unit: "càs",
        optional: false
      },
      {
        ingredientSlug: "bouillon",
        quantity: 0.5,
        unit: "L",
        optional: true
      },
      {
        ingredientSlug: "curry",
        quantity: 1,
        unit: "càc",
        optional: true
      },
      {
        ingredientSlug: "paprika",
        quantity: 1,
        unit: "càc",
        optional: true
      },
      {
        ingredientSlug: "tomate",
        quantity: 2,
        unit: null,
        optional: true
      },
      {
        ingredientSlug: "riz",
        quantity: 250,
        unit: "g",
        optional: true
      }
    ]
  },
  {
    slug: "poulet-couscous",
    title: "Poulet couscous",
    description: "Maghrébin.",
    instructions: "1. Assaisonner le poulet (sel, poivre).\n2. Cuire jusqu'à 74 °C à cœur (thermomètre dans la cuisse, sans toucher l'os).\n3. Laisser reposer 5 min — la chair ne doit jamais être rosée.",
    prepMinutes: 12,
    cookMinutes: 55,
    servings: 4,
    lines: [
      {
        ingredientSlug: "poulet",
        quantity: 600,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "oignon",
        quantity: 1,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "ail",
        quantity: 2,
        unit: "gousse",
        optional: false
      },
      {
        ingredientSlug: "huile-olive",
        quantity: 2,
        unit: "càs",
        optional: false
      },
      {
        ingredientSlug: "bouillon",
        quantity: 0.5,
        unit: "L",
        optional: true
      },
      {
        ingredientSlug: "curry",
        quantity: 1,
        unit: "càc",
        optional: true
      },
      {
        ingredientSlug: "paprika",
        quantity: 1,
        unit: "càc",
        optional: true
      },
      {
        ingredientSlug: "tomate",
        quantity: 2,
        unit: null,
        optional: true
      },
      {
        ingredientSlug: "riz",
        quantity: 250,
        unit: "g",
        optional: true
      }
    ]
  },
  {
    slug: "poulet-tajine",
    title: "Poulet tajine",
    description: "Maroc.",
    instructions: "1. Assaisonner le poulet (sel, poivre).\n2. Cuire jusqu'à 74 °C à cœur (thermomètre dans la cuisse, sans toucher l'os).\n3. Laisser reposer 5 min — la chair ne doit jamais être rosée.",
    prepMinutes: 12,
    cookMinutes: 35,
    servings: 4,
    lines: [
      {
        ingredientSlug: "poulet",
        quantity: 600,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "oignon",
        quantity: 1,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "ail",
        quantity: 2,
        unit: "gousse",
        optional: false
      },
      {
        ingredientSlug: "huile-olive",
        quantity: 2,
        unit: "càs",
        optional: false
      },
      {
        ingredientSlug: "bouillon",
        quantity: 0.5,
        unit: "L",
        optional: true
      },
      {
        ingredientSlug: "curry",
        quantity: 1,
        unit: "càc",
        optional: true
      },
      {
        ingredientSlug: "paprika",
        quantity: 1,
        unit: "càc",
        optional: true
      },
      {
        ingredientSlug: "tomate",
        quantity: 2,
        unit: null,
        optional: true
      },
      {
        ingredientSlug: "riz",
        quantity: 250,
        unit: "g",
        optional: true
      }
    ]
  },
  {
    slug: "poulet-fajitas",
    title: "Fajitas poulet",
    description: "Mexicain.",
    instructions: "1. Couper le poulet en cubes réguliers.\n2. Griller 12 à 15 min en retournant, jusqu'à 74 °C à cœur.\n3. Servir dès que la chair est blanche partout.",
    prepMinutes: 12,
    cookMinutes: 15,
    servings: 4,
    lines: [
      {
        ingredientSlug: "poulet",
        quantity: 600,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "oignon",
        quantity: 1,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "ail",
        quantity: 2,
        unit: "gousse",
        optional: false
      },
      {
        ingredientSlug: "huile-olive",
        quantity: 2,
        unit: "càs",
        optional: false
      },
      {
        ingredientSlug: "bouillon",
        quantity: 0.5,
        unit: "L",
        optional: true
      },
      {
        ingredientSlug: "curry",
        quantity: 1,
        unit: "càc",
        optional: true
      },
      {
        ingredientSlug: "paprika",
        quantity: 1,
        unit: "càc",
        optional: true
      },
      {
        ingredientSlug: "tomate",
        quantity: 2,
        unit: null,
        optional: true
      },
      {
        ingredientSlug: "riz",
        quantity: 250,
        unit: "g",
        optional: true
      }
    ]
  },
  {
    slug: "poulet-satay-coco",
    title: "Poulet satay coco",
    description: "Brochettes.",
    instructions: "1. Couper le poulet en cubes réguliers.\n2. Griller 12 à 15 min en retournant, jusqu'à 74 °C à cœur.\n3. Servir dès que la chair est blanche partout.",
    prepMinutes: 12,
    cookMinutes: 15,
    servings: 4,
    lines: [
      {
        ingredientSlug: "poulet",
        quantity: 600,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "oignon",
        quantity: 1,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "ail",
        quantity: 2,
        unit: "gousse",
        optional: false
      },
      {
        ingredientSlug: "huile-olive",
        quantity: 2,
        unit: "càs",
        optional: false
      },
      {
        ingredientSlug: "bouillon",
        quantity: 0.5,
        unit: "L",
        optional: true
      },
      {
        ingredientSlug: "curry",
        quantity: 1,
        unit: "càc",
        optional: true
      },
      {
        ingredientSlug: "paprika",
        quantity: 1,
        unit: "càc",
        optional: true
      },
      {
        ingredientSlug: "tomate",
        quantity: 2,
        unit: null,
        optional: true
      },
      {
        ingredientSlug: "riz",
        quantity: 250,
        unit: "g",
        optional: true
      }
    ]
  },
  {
    slug: "poulet-parmesan",
    title: "Poulet parmesan",
    description: "Pané four.",
    instructions: "1. Assaisonner le poulet (sel, poivre).\n2. Cuire jusqu'à 74 °C à cœur (thermomètre dans la cuisse, sans toucher l'os).\n3. Laisser reposer 5 min — la chair ne doit jamais être rosée.",
    prepMinutes: 12,
    cookMinutes: 35,
    servings: 4,
    lines: [
      {
        ingredientSlug: "poulet",
        quantity: 600,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "oignon",
        quantity: 1,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "ail",
        quantity: 2,
        unit: "gousse",
        optional: false
      },
      {
        ingredientSlug: "huile-olive",
        quantity: 2,
        unit: "càs",
        optional: false
      },
      {
        ingredientSlug: "bouillon",
        quantity: 0.5,
        unit: "L",
        optional: true
      },
      {
        ingredientSlug: "curry",
        quantity: 1,
        unit: "càc",
        optional: true
      },
      {
        ingredientSlug: "paprika",
        quantity: 1,
        unit: "càc",
        optional: true
      },
      {
        ingredientSlug: "tomate",
        quantity: 2,
        unit: null,
        optional: true
      },
      {
        ingredientSlug: "riz",
        quantity: 250,
        unit: "g",
        optional: true
      }
    ]
  },
  {
    slug: "poulet-stroganoff",
    title: "Poulet stroganoff",
    description: "Crème.",
    instructions: "1. Assaisonner le poulet (sel, poivre).\n2. Cuire jusqu'à 74 °C à cœur (thermomètre dans la cuisse, sans toucher l'os).\n3. Laisser reposer 5 min — la chair ne doit jamais être rosée.",
    prepMinutes: 12,
    cookMinutes: 35,
    servings: 4,
    lines: [
      {
        ingredientSlug: "poulet",
        quantity: 600,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "oignon",
        quantity: 1,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "ail",
        quantity: 2,
        unit: "gousse",
        optional: false
      },
      {
        ingredientSlug: "huile-olive",
        quantity: 2,
        unit: "càs",
        optional: false
      },
      {
        ingredientSlug: "bouillon",
        quantity: 0.5,
        unit: "L",
        optional: true
      },
      {
        ingredientSlug: "curry",
        quantity: 1,
        unit: "càc",
        optional: true
      },
      {
        ingredientSlug: "paprika",
        quantity: 1,
        unit: "càc",
        optional: true
      },
      {
        ingredientSlug: "tomate",
        quantity: 2,
        unit: null,
        optional: true
      },
      {
        ingredientSlug: "riz",
        quantity: 250,
        unit: "g",
        optional: true
      }
    ]
  },
  {
    slug: "poulet-dijonnaise",
    title: "Poulet dijonnaise",
    description: "Moutarde.",
    instructions: "1. Assaisonner le poulet (sel, poivre).\n2. Cuire jusqu'à 74 °C à cœur (thermomètre dans la cuisse, sans toucher l'os).\n3. Laisser reposer 5 min — la chair ne doit jamais être rosée.",
    prepMinutes: 12,
    cookMinutes: 35,
    servings: 4,
    lines: [
      {
        ingredientSlug: "poulet",
        quantity: 600,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "oignon",
        quantity: 1,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "ail",
        quantity: 2,
        unit: "gousse",
        optional: false
      },
      {
        ingredientSlug: "huile-olive",
        quantity: 2,
        unit: "càs",
        optional: false
      },
      {
        ingredientSlug: "bouillon",
        quantity: 0.5,
        unit: "L",
        optional: true
      },
      {
        ingredientSlug: "curry",
        quantity: 1,
        unit: "càc",
        optional: true
      },
      {
        ingredientSlug: "paprika",
        quantity: 1,
        unit: "càc",
        optional: true
      },
      {
        ingredientSlug: "tomate",
        quantity: 2,
        unit: null,
        optional: true
      },
      {
        ingredientSlug: "riz",
        quantity: 250,
        unit: "g",
        optional: true
      }
    ]
  },
  {
    slug: "poulet-Provencale",
    title: "Poulet provençale",
    description: "Tomates.",
    instructions: "1. Assaisonner le poulet (sel, poivre).\n2. Cuire jusqu'à 74 °C à cœur (thermomètre dans la cuisse, sans toucher l'os).\n3. Laisser reposer 5 min — la chair ne doit jamais être rosée.",
    prepMinutes: 12,
    cookMinutes: 35,
    servings: 4,
    lines: [
      {
        ingredientSlug: "poulet",
        quantity: 600,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "oignon",
        quantity: 1,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "ail",
        quantity: 2,
        unit: "gousse",
        optional: false
      },
      {
        ingredientSlug: "huile-olive",
        quantity: 2,
        unit: "càs",
        optional: false
      },
      {
        ingredientSlug: "bouillon",
        quantity: 0.5,
        unit: "L",
        optional: true
      },
      {
        ingredientSlug: "curry",
        quantity: 1,
        unit: "càc",
        optional: true
      },
      {
        ingredientSlug: "paprika",
        quantity: 1,
        unit: "càc",
        optional: true
      },
      {
        ingredientSlug: "tomate",
        quantity: 2,
        unit: null,
        optional: true
      },
      {
        ingredientSlug: "riz",
        quantity: 250,
        unit: "g",
        optional: true
      }
    ]
  },
  {
    slug: "poulet-brochettes",
    title: "Brochettes poulet",
    description: "Barbecue.",
    instructions: "1. Couper le poulet en cubes réguliers.\n2. Griller 12 à 15 min en retournant, jusqu'à 74 °C à cœur.\n3. Servir dès que la chair est blanche partout.",
    prepMinutes: 12,
    cookMinutes: 15,
    servings: 4,
    lines: [
      {
        ingredientSlug: "poulet",
        quantity: 600,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "oignon",
        quantity: 1,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "ail",
        quantity: 2,
        unit: "gousse",
        optional: false
      },
      {
        ingredientSlug: "huile-olive",
        quantity: 2,
        unit: "càs",
        optional: false
      },
      {
        ingredientSlug: "bouillon",
        quantity: 0.5,
        unit: "L",
        optional: true
      },
      {
        ingredientSlug: "curry",
        quantity: 1,
        unit: "càc",
        optional: true
      },
      {
        ingredientSlug: "paprika",
        quantity: 1,
        unit: "càc",
        optional: true
      },
      {
        ingredientSlug: "tomate",
        quantity: 2,
        unit: null,
        optional: true
      },
      {
        ingredientSlug: "riz",
        quantity: 250,
        unit: "g",
        optional: true
      }
    ]
  },
  {
    slug: "poulet-soupe",
    title: "Poulet soup",
    description: "Bouillon réconfort.",
    instructions: "1. Assaisonner le poulet (sel, poivre).\n2. Cuire jusqu'à 74 °C à cœur (thermomètre dans la cuisse, sans toucher l'os).\n3. Laisser reposer 5 min — la chair ne doit jamais être rosée.",
    prepMinutes: 12,
    cookMinutes: 35,
    servings: 4,
    lines: [
      {
        ingredientSlug: "poulet",
        quantity: 600,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "oignon",
        quantity: 1,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "ail",
        quantity: 2,
        unit: "gousse",
        optional: false
      },
      {
        ingredientSlug: "huile-olive",
        quantity: 2,
        unit: "càs",
        optional: false
      },
      {
        ingredientSlug: "bouillon",
        quantity: 0.5,
        unit: "L",
        optional: true
      },
      {
        ingredientSlug: "curry",
        quantity: 1,
        unit: "càc",
        optional: true
      },
      {
        ingredientSlug: "paprika",
        quantity: 1,
        unit: "càc",
        optional: true
      },
      {
        ingredientSlug: "tomate",
        quantity: 2,
        unit: null,
        optional: true
      },
      {
        ingredientSlug: "riz",
        quantity: 250,
        unit: "g",
        optional: true
      }
    ]
  },
  {
    slug: "boeuf-bourguignon-express",
    title: "Bœuf bourguignon express",
    description: "Mijoté.",
    instructions: "1. Assaisonner la viande.\n2. Bœuf haché : cuire jusqu'à 71 °C minimum. Autres viandes : bien saisir ou mijoter.\n3. Servir chaud.",
    prepMinutes: 15,
    cookMinutes: 40,
    servings: 4,
    lines: [
      {
        ingredientSlug: "boeuf",
        quantity: 500,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "carotte",
        quantity: 2,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "oignon",
        quantity: 2,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "bouillon",
        quantity: 0.5,
        unit: "L",
        optional: false
      }
    ]
  },
  {
    slug: "steak-poivre",
    title: "Steak au poivre",
    description: "Poêle.",
    instructions: "1. Assaisonner la viande.\n2. Bœuf haché : cuire jusqu'à 71 °C minimum. Autres viandes : bien saisir ou mijoter.\n3. Servir chaud.",
    prepMinutes: 15,
    cookMinutes: 40,
    servings: 4,
    lines: [
      {
        ingredientSlug: "boeuf",
        quantity: 500,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "creme-fraiche",
        quantity: 150,
        unit: "ml",
        optional: false
      },
      {
        ingredientSlug: "poivre",
        quantity: 1,
        unit: "pincée",
        optional: false
      },
      {
        ingredientSlug: "beurre",
        quantity: 30,
        unit: "g",
        optional: false
      }
    ]
  },
  {
    slug: "boeuf-stroganoff",
    title: "Bœuf stroganoff",
    description: "Crème.",
    instructions: "1. Assaisonner la viande.\n2. Bœuf haché : cuire jusqu'à 71 °C minimum. Autres viandes : bien saisir ou mijoter.\n3. Servir chaud.",
    prepMinutes: 15,
    cookMinutes: 40,
    servings: 4,
    lines: [
      {
        ingredientSlug: "boeuf",
        quantity: 500,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "champignon",
        quantity: 2,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "oignon",
        quantity: 2,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "creme-fraiche",
        quantity: 150,
        unit: "ml",
        optional: false
      }
    ]
  },
  {
    slug: "chili-con-carne",
    title: "Chili con carne",
    description: "Tex-mex.",
    instructions: "1. Assaisonner la viande.\n2. Bœuf haché : cuire jusqu'à 71 °C minimum. Autres viandes : bien saisir ou mijoter.\n3. Servir chaud.",
    prepMinutes: 15,
    cookMinutes: 40,
    servings: 4,
    lines: [
      {
        ingredientSlug: "boeuf",
        quantity: 500,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "haricot-rouge",
        quantity: 250,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "tomate",
        quantity: 2,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "cumin",
        quantity: 1,
        unit: "càc",
        optional: false
      }
    ]
  },
  {
    slug: "boeuf-hache-legumes",
    title: "Bœuf haché légumes",
    description: "Poêlée.",
    instructions: "1. Assaisonner la viande.\n2. Bœuf haché : cuire jusqu'à 71 °C minimum. Autres viandes : bien saisir ou mijoter.\n3. Servir chaud.",
    prepMinutes: 15,
    cookMinutes: 40,
    servings: 4,
    lines: [
      {
        ingredientSlug: "boeuf",
        quantity: 500,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "courgette",
        quantity: 2,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "carotte",
        quantity: 2,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "oignon",
        quantity: 2,
        unit: null,
        optional: false
      }
    ]
  },
  {
    slug: "lasagnes-boeuf",
    title: "Lasagnes bœuf",
    description: "Gratin.",
    instructions: "1. Assaisonner la viande.\n2. Bœuf haché : cuire jusqu'à 71 °C minimum. Autres viandes : bien saisir ou mijoter.\n3. Servir chaud.",
    prepMinutes: 15,
    cookMinutes: 40,
    servings: 4,
    lines: [
      {
        ingredientSlug: "boeuf",
        quantity: 500,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "sauce-tomate",
        quantity: 400,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "pates",
        quantity: 250,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "emmental",
        quantity: 100,
        unit: "g",
        optional: false
      }
    ]
  },
  {
    slug: "porc-miel",
    title: "Porc au miel",
    description: "Sucré.",
    instructions: "1. Assaisonner la viande.\n2. Bœuf haché : cuire jusqu'à 71 °C minimum. Autres viandes : bien saisir ou mijoter.\n3. Servir chaud.",
    prepMinutes: 15,
    cookMinutes: 40,
    servings: 4,
    lines: [
      {
        ingredientSlug: "porc",
        quantity: 500,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "miel",
        quantity: 2,
        unit: "càs",
        optional: false
      },
      {
        ingredientSlug: "sauce-soja",
        quantity: 2,
        unit: "càs",
        optional: false
      },
      {
        ingredientSlug: "ail",
        quantity: 2,
        unit: "gousse",
        optional: false
      }
    ]
  },
  {
    slug: "porc-caramel",
    title: "Porc caramel",
    description: "Asiatique.",
    instructions: "1. Assaisonner la viande.\n2. Bœuf haché : cuire jusqu'à 71 °C minimum. Autres viandes : bien saisir ou mijoter.\n3. Servir chaud.",
    prepMinutes: 15,
    cookMinutes: 40,
    servings: 4,
    lines: [
      {
        ingredientSlug: "porc",
        quantity: 500,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "sucre",
        quantity: 2,
        unit: "càs",
        optional: false
      },
      {
        ingredientSlug: "sauce-soja",
        quantity: 2,
        unit: "càs",
        optional: false
      },
      {
        ingredientSlug: "gingembre",
        quantity: 15,
        unit: "g",
        optional: false
      }
    ]
  },
  {
    slug: "cotes-agneau-romarin",
    title: "Côtes agneau romarin",
    description: "Grill.",
    instructions: "1. Assaisonner la viande.\n2. Bœuf haché : cuire jusqu'à 71 °C minimum. Autres viandes : bien saisir ou mijoter.\n3. Servir chaud.",
    prepMinutes: 15,
    cookMinutes: 40,
    servings: 4,
    lines: [
      {
        ingredientSlug: "agneau",
        quantity: 500,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "romarin",
        quantity: 2,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "ail",
        quantity: 2,
        unit: "gousse",
        optional: false
      },
      {
        ingredientSlug: "huile-olive",
        quantity: 2,
        unit: "càs",
        optional: false
      }
    ]
  },
  {
    slug: "agneau-tajine-pruneaux",
    title: "Tajine agneau pruneaux",
    description: "Sucré-salé.",
    instructions: "1. Assaisonner la viande.\n2. Bœuf haché : cuire jusqu'à 71 °C minimum. Autres viandes : bien saisir ou mijoter.\n3. Servir chaud.",
    prepMinutes: 15,
    cookMinutes: 40,
    servings: 4,
    lines: [
      {
        ingredientSlug: "agneau",
        quantity: 500,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "pruneau",
        quantity: 100,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "oignon",
        quantity: 2,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "cannelle",
        quantity: 1,
        unit: "càc",
        optional: false
      }
    ]
  },
  {
    slug: "saucisse-lentilles",
    title: "Saucisse-lentilles",
    description: "Campagnard.",
    instructions: "1. Assaisonner la viande.\n2. Bœuf haché : cuire jusqu'à 71 °C minimum. Autres viandes : bien saisir ou mijoter.\n3. Servir chaud.",
    prepMinutes: 15,
    cookMinutes: 40,
    servings: 4,
    lines: [
      {
        ingredientSlug: "saucisse",
        quantity: 500,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "lentilles",
        quantity: 250,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "carotte",
        quantity: 2,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "oignon",
        quantity: 2,
        unit: null,
        optional: false
      }
    ]
  },
  {
    slug: "merguez-couscous",
    title: "Merguez couscous",
    description: "Semoule.",
    instructions: "1. Assaisonner la viande.\n2. Bœuf haché : cuire jusqu'à 71 °C minimum. Autres viandes : bien saisir ou mijoter.\n3. Servir chaud.",
    prepMinutes: 15,
    cookMinutes: 40,
    servings: 4,
    lines: [
      {
        ingredientSlug: "merguez",
        quantity: 500,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "semoule",
        quantity: 300,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "courgette",
        quantity: 2,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "carotte",
        quantity: 2,
        unit: null,
        optional: false
      }
    ]
  },
  {
    slug: "boeuf-wok",
    title: "Bœuf wok",
    description: "Sauté.",
    instructions: "1. Assaisonner la viande.\n2. Bœuf haché : cuire jusqu'à 71 °C minimum. Autres viandes : bien saisir ou mijoter.\n3. Servir chaud.",
    prepMinutes: 15,
    cookMinutes: 40,
    servings: 4,
    lines: [
      {
        ingredientSlug: "boeuf",
        quantity: 500,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "poivron",
        quantity: 2,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "oignon",
        quantity: 2,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "sauce-soja",
        quantity: 2,
        unit: "càs",
        optional: false
      }
    ]
  },
  {
    slug: "hachis-parmentier",
    title: "Hachis parmentier",
    description: "Gratin.",
    instructions: "1. Assaisonner la viande.\n2. Bœuf haché : cuire jusqu'à 71 °C minimum. Autres viandes : bien saisir ou mijoter.\n3. Servir chaud.",
    prepMinutes: 15,
    cookMinutes: 40,
    servings: 4,
    lines: [
      {
        ingredientSlug: "boeuf",
        quantity: 500,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "pomme-de-terre",
        quantity: 800,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "oignon",
        quantity: 2,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "beurre",
        quantity: 30,
        unit: "g",
        optional: false
      }
    ]
  },
  {
    slug: "boeuf-carottes",
    title: "Bœuf aux carottes",
    description: "Mijoté.",
    instructions: "1. Assaisonner la viande.\n2. Bœuf haché : cuire jusqu'à 71 °C minimum. Autres viandes : bien saisir ou mijoter.\n3. Servir chaud.",
    prepMinutes: 15,
    cookMinutes: 40,
    servings: 4,
    lines: [
      {
        ingredientSlug: "boeuf",
        quantity: 500,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "carotte",
        quantity: 2,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "oignon",
        quantity: 2,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "bouillon",
        quantity: 0.5,
        unit: "L",
        optional: false
      }
    ]
  },
  {
    slug: "porc-cote-moutarde",
    title: "Côte porc moutarde",
    description: "Classique.",
    instructions: "1. Assaisonner la viande.\n2. Bœuf haché : cuire jusqu'à 71 °C minimum. Autres viandes : bien saisir ou mijoter.\n3. Servir chaud.",
    prepMinutes: 15,
    cookMinutes: 40,
    servings: 4,
    lines: [
      {
        ingredientSlug: "porc",
        quantity: 500,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "moutarde",
        quantity: 2,
        unit: "càs",
        optional: false
      },
      {
        ingredientSlug: "creme-fraiche",
        quantity: 150,
        unit: "ml",
        optional: false
      },
      {
        ingredientSlug: "oignon",
        quantity: 2,
        unit: null,
        optional: false
      }
    ]
  },
  {
    slug: "veau-parmesan",
    title: "Escalope veau parmesan",
    description: "Panée.",
    instructions: "1. Assaisonner la viande.\n2. Bœuf haché : cuire jusqu'à 71 °C minimum. Autres viandes : bien saisir ou mijoter.\n3. Servir chaud.",
    prepMinutes: 15,
    cookMinutes: 40,
    servings: 4,
    lines: [
      {
        ingredientSlug: "veau",
        quantity: 500,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "parmesan",
        quantity: 100,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "farine",
        quantity: 100,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "oeuf",
        quantity: 2,
        unit: null,
        optional: false
      }
    ]
  },
  {
    slug: "boeuf-tacos",
    title: "Tacos bœuf",
    description: "Mexicain.",
    instructions: "1. Assaisonner la viande.\n2. Bœuf haché : cuire jusqu'à 71 °C minimum. Autres viandes : bien saisir ou mijoter.\n3. Servir chaud.",
    prepMinutes: 15,
    cookMinutes: 40,
    servings: 4,
    lines: [
      {
        ingredientSlug: "boeuf",
        quantity: 500,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "tomate",
        quantity: 2,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "salade",
        quantity: 2,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "fromage-blanc",
        quantity: 150,
        unit: "g",
        optional: false
      }
    ]
  },
  {
    slug: "porc-saute-legumes",
    title: "Porc sauté légumes",
    description: "Wok.",
    instructions: "1. Assaisonner la viande.\n2. Bœuf haché : cuire jusqu'à 71 °C minimum. Autres viandes : bien saisir ou mijoter.\n3. Servir chaud.",
    prepMinutes: 15,
    cookMinutes: 40,
    servings: 4,
    lines: [
      {
        ingredientSlug: "porc",
        quantity: 500,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "brocoli",
        quantity: 2,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "carotte",
        quantity: 2,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "sauce-soja",
        quantity: 2,
        unit: "càs",
        optional: false
      }
    ]
  },
  {
    slug: "boeuf-brochettes",
    title: "Brochettes bœuf",
    description: "Grill.",
    instructions: "1. Assaisonner la viande.\n2. Bœuf haché : cuire jusqu'à 71 °C minimum. Autres viandes : bien saisir ou mijoter.\n3. Servir chaud.",
    prepMinutes: 15,
    cookMinutes: 40,
    servings: 4,
    lines: [
      {
        ingredientSlug: "boeuf",
        quantity: 500,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "poivron",
        quantity: 2,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "oignon",
        quantity: 2,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "paprika",
        quantity: 1,
        unit: "càc",
        optional: false
      }
    ]
  },
  {
    slug: "saumon-foil",
    title: "Saumon en papillote",
    description: "Citron-aneth.",
    instructions: "1. Saler et poivrer le poisson.\n2. Cuire jusqu'à chair opaque (≈63 °C à cœur pour poisson fin — réf. ANSES).\n3. Servir immédiatement.",
    prepMinutes: 12,
    cookMinutes: 20,
    servings: 4,
    lines: [
      {
        ingredientSlug: "saumon",
        quantity: 400,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "citron",
        quantity: 2,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "beurre",
        quantity: 30,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "persil",
        quantity: 2,
        unit: null,
        optional: false
      }
    ]
  },
  {
    slug: "saumon-grille",
    title: "Saumon grillé",
    description: "Peau croustillante.",
    instructions: "1. Saler et poivrer le poisson.\n2. Cuire jusqu'à chair opaque (≈63 °C à cœur pour poisson fin — réf. ANSES).\n3. Servir immédiatement.",
    prepMinutes: 12,
    cookMinutes: 20,
    servings: 4,
    lines: [
      {
        ingredientSlug: "saumon",
        quantity: 400,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "huile-olive",
        quantity: 2,
        unit: "càs",
        optional: false
      },
      {
        ingredientSlug: "citron",
        quantity: 2,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "sel",
        quantity: 2,
        unit: null,
        optional: false
      }
    ]
  },
  {
    slug: "cabillaud-beurre-blanc",
    title: "Cabillaud beurre blanc",
    description: "Classique.",
    instructions: "1. Saler et poivrer le poisson.\n2. Cuire jusqu'à chair opaque (≈63 °C à cœur pour poisson fin — réf. ANSES).\n3. Servir immédiatement.",
    prepMinutes: 12,
    cookMinutes: 20,
    servings: 4,
    lines: [
      {
        ingredientSlug: "cabillaud",
        quantity: 400,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "beurre",
        quantity: 30,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "citron",
        quantity: 2,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "creme-fraiche",
        quantity: 100,
        unit: null,
        optional: false
      }
    ]
  },
  {
    slug: "colin-poele",
    title: "Colin poêlé",
    description: "Rapide.",
    instructions: "1. Saler et poivrer le poisson.\n2. Cuire jusqu'à chair opaque (≈63 °C à cœur pour poisson fin — réf. ANSES).\n3. Servir immédiatement.",
    prepMinutes: 12,
    cookMinutes: 20,
    servings: 4,
    lines: [
      {
        ingredientSlug: "colin",
        quantity: 400,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "farine",
        quantity: 100,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "beurre",
        quantity: 30,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "citron",
        quantity: 2,
        unit: null,
        optional: false
      }
    ]
  },
  {
    slug: "fish-and-chips-maison",
    title: "Fish and chips maison",
    description: "Cabillaud frit.",
    instructions: "1. Saler et poivrer le poisson.\n2. Cuire jusqu'à chair opaque (≈63 °C à cœur pour poisson fin — réf. ANSES).\n3. Servir immédiatement.",
    prepMinutes: 12,
    cookMinutes: 20,
    servings: 4,
    lines: [
      {
        ingredientSlug: "cabillaud",
        quantity: 400,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "farine",
        quantity: 100,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "pomme-de-terre",
        quantity: 600,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "huile-tournesol",
        quantity: 2,
        unit: null,
        optional: false
      }
    ]
  },
  {
    slug: "sardines-grillees",
    title: "Sardines grillées",
    description: "Méditerranée.",
    instructions: "1. Saler et poivrer le poisson.\n2. Cuire jusqu'à chair opaque (≈63 °C à cœur pour poisson fin — réf. ANSES).\n3. Servir immédiatement.",
    prepMinutes: 12,
    cookMinutes: 20,
    servings: 4,
    lines: [
      {
        ingredientSlug: "sardine",
        quantity: 300,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "ail",
        quantity: 2,
        unit: "gousse",
        optional: false
      },
      {
        ingredientSlug: "persil",
        quantity: 2,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "huile-olive",
        quantity: 2,
        unit: "càs",
        optional: false
      }
    ]
  },
  {
    slug: "moules-mariniere",
    title: "Moules marinières",
    description: "Vin blanc style.",
    instructions: "1. Laver les moules, retirer les « barbes ».\n2. Cuire à feu vif 5 à 7 min couvert, jusqu'à ouverture des coquilles.\n3. Jeter toute coquille restée fermée après cuisson (règle sanitaire).",
    prepMinutes: 12,
    cookMinutes: 7,
    servings: 4,
    lines: [
      {
        ingredientSlug: "moules",
        quantity: 1500,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "ail",
        quantity: 2,
        unit: "gousse",
        optional: false
      },
      {
        ingredientSlug: "persil",
        quantity: 2,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "beurre",
        quantity: 30,
        unit: null,
        optional: false
      }
    ]
  },
  {
    slug: "crevettes-ail",
    title: "Crevettes à l'ail",
    description: "Tapas.",
    instructions: "1. Décortiquer si besoin, sécher les crevettes.\n2. Sauter ail 30 s, crevettes 3 min par face jusqu'à rose opaque.\n3. Servir immédiatement avec persil.",
    prepMinutes: 12,
    cookMinutes: 5,
    servings: 4,
    lines: [
      {
        ingredientSlug: "crevettes",
        quantity: 400,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "ail",
        quantity: 2,
        unit: "gousse",
        optional: false
      },
      {
        ingredientSlug: "persil",
        quantity: 2,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "huile-olive",
        quantity: 2,
        unit: "càs",
        optional: false
      }
    ]
  },
  {
    slug: "paella-express",
    title: "Paella express",
    description: "Riz safran style.",
    instructions: "1. Saler et poivrer le poisson.\n2. Cuire jusqu'à chair opaque (≈63 °C à cœur pour poisson fin — réf. ANSES).\n3. Servir immédiatement.",
    prepMinutes: 12,
    cookMinutes: 20,
    servings: 4,
    lines: [
      {
        ingredientSlug: "riz",
        quantity: 300,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "crevettes",
        quantity: 400,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "poivron",
        quantity: 2,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "petit-pois",
        quantity: 2,
        unit: null,
        optional: false
      }
    ]
  },
  {
    slug: "brandade-morue",
    title: "Brandade de morue",
    description: "Purée.",
    instructions: "1. Saler et poivrer le poisson.\n2. Cuire jusqu'à chair opaque (≈63 °C à cœur pour poisson fin — réf. ANSES).\n3. Servir immédiatement.",
    prepMinutes: 12,
    cookMinutes: 20,
    servings: 4,
    lines: [
      {
        ingredientSlug: "cabillaud",
        quantity: 400,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "pomme-de-terre",
        quantity: 600,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "ail",
        quantity: 2,
        unit: "gousse",
        optional: false
      },
      {
        ingredientSlug: "huile-olive",
        quantity: 2,
        unit: "càs",
        optional: false
      }
    ]
  },
  {
    slug: "saumon-teriyaki",
    title: "Saumon teriyaki",
    description: "Glacé.",
    instructions: "1. Saler et poivrer le poisson.\n2. Cuire jusqu'à chair opaque (≈63 °C à cœur pour poisson fin — réf. ANSES).\n3. Servir immédiatement.",
    prepMinutes: 12,
    cookMinutes: 20,
    servings: 4,
    lines: [
      {
        ingredientSlug: "saumon",
        quantity: 400,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "sauce-soja",
        quantity: 2,
        unit: "càs",
        optional: false
      },
      {
        ingredientSlug: "miel",
        quantity: 2,
        unit: "càs",
        optional: false
      },
      {
        ingredientSlug: "gingembre",
        quantity: 2,
        unit: null,
        optional: false
      }
    ]
  },
  {
    slug: "thon-grille",
    title: "Steak de thon",
    description: "Saisi.",
    instructions: "1. Saler et poivrer le poisson.\n2. Cuire jusqu'à chair opaque (≈63 °C à cœur pour poisson fin — réf. ANSES).\n3. Servir immédiatement.",
    prepMinutes: 12,
    cookMinutes: 20,
    servings: 4,
    lines: [
      {
        ingredientSlug: "thon",
        quantity: 400,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "sesame",
        quantity: 2,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "huile-olive",
        quantity: 2,
        unit: "càs",
        optional: false
      },
      {
        ingredientSlug: "poivre",
        quantity: 2,
        unit: null,
        optional: false
      }
    ]
  },
  {
    slug: "colin-oven",
    title: "Colin au four",
    description: "Tomates.",
    instructions: "1. Saler et poivrer le poisson.\n2. Cuire jusqu'à chair opaque (≈63 °C à cœur pour poisson fin — réf. ANSES).\n3. Servir immédiatement.",
    prepMinutes: 12,
    cookMinutes: 20,
    servings: 4,
    lines: [
      {
        ingredientSlug: "colin",
        quantity: 400,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "tomate",
        quantity: 2,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "oignon",
        quantity: 2,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "huile-olive",
        quantity: 2,
        unit: "càs",
        optional: false
      }
    ]
  },
  {
    slug: "saumon-avocado",
    title: "Saumon avocat",
    description: "Frais.",
    instructions: "1. Saler et poivrer le poisson.\n2. Cuire jusqu'à chair opaque (≈63 °C à cœur pour poisson fin — réf. ANSES).\n3. Servir immédiatement.",
    prepMinutes: 12,
    cookMinutes: 20,
    servings: 4,
    lines: [
      {
        ingredientSlug: "saumon",
        quantity: 400,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "avocat",
        quantity: 2,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "citron",
        quantity: 2,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "salade",
        quantity: 2,
        unit: null,
        optional: false
      }
    ]
  },
  {
    slug: "fish-tacos",
    title: "Fish tacos",
    description: "Colin épicé.",
    instructions: "1. Saler et poivrer le poisson.\n2. Cuire jusqu'à chair opaque (≈63 °C à cœur pour poisson fin — réf. ANSES).\n3. Servir immédiatement.",
    prepMinutes: 12,
    cookMinutes: 20,
    servings: 4,
    lines: [
      {
        ingredientSlug: "colin",
        quantity: 400,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "salade",
        quantity: 2,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "tomate",
        quantity: 2,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "yaourt",
        quantity: 2,
        unit: null,
        optional: false
      }
    ]
  },
  {
    slug: "bouillabaisse-express",
    title: "Bouillabaisse express",
    description: "Soupe poisson.",
    instructions: "1. Saler et poivrer le poisson.\n2. Cuire jusqu'à chair opaque (≈63 °C à cœur pour poisson fin — réf. ANSES).\n3. Servir immédiatement.",
    prepMinutes: 12,
    cookMinutes: 20,
    servings: 4,
    lines: [
      {
        ingredientSlug: "colin",
        quantity: 400,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "moules",
        quantity: 1500,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "tomate",
        quantity: 2,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "bouillon",
        quantity: 1,
        unit: "L",
        optional: false
      }
    ]
  },
  {
    slug: "saumon-poivre",
    title: "Saumon au poivre",
    description: "Crust.",
    instructions: "1. Saler et poivrer le poisson.\n2. Cuire jusqu'à chair opaque (≈63 °C à cœur pour poisson fin — réf. ANSES).\n3. Servir immédiatement.",
    prepMinutes: 12,
    cookMinutes: 20,
    servings: 4,
    lines: [
      {
        ingredientSlug: "saumon",
        quantity: 400,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "poivre",
        quantity: 2,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "beurre",
        quantity: 30,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "creme-fraiche",
        quantity: 100,
        unit: null,
        optional: false
      }
    ]
  },
  {
    slug: "ceviche-express",
    title: "Ceviche express",
    description: "Citron mariné.",
    instructions: "1. Poisson ultra frais (qualité sashimi), consommé le jour même uniquement.\n2. Couper en dés, mariner 30 min minimum au jus de citron et oignon émincé.\n3. Ne pas recuire au feu : le citron « cuit » à froid. Femmes enceintes : éviter.",
    prepMinutes: 12,
    cookMinutes: 0,
    servings: 4,
    lines: [
      {
        ingredientSlug: "cabillaud",
        quantity: 400,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "citron",
        quantity: 2,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "oignon",
        quantity: 2,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "persil",
        quantity: 1,
        unit: "botte",
        optional: false
      }
    ]
  },
  {
    slug: "ratatouille",
    title: "Ratatouille",
    description: "Provençale.",
    instructions: "1. Couper courgette, aubergine, poivron et tomate.\n2. Faire revenir oignon et ail, ajouter les légumes en couches.\n3. Mijoter 30 min à feu doux avec huile d'olive.",
    prepMinutes: 12,
    cookMinutes: 30,
    servings: 4,
    lines: [
      {
        ingredientSlug: "courgette",
        quantity: 100,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "aubergine",
        quantity: 100,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "poivron",
        quantity: 100,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "tomate",
        quantity: 100,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "oignon",
        quantity: 100,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "ail",
        quantity: 2,
        unit: "gousse",
        optional: false
      },
      {
        ingredientSlug: "huile-olive",
        quantity: 2,
        unit: "càs",
        optional: false
      }
    ]
  },
  {
    slug: "gratin-courgette",
    title: "Gratin courgette",
    description: "Fromage.",
    instructions: "1. Trancher les courgettes, blanchir 5 min.\n2. Disposer en couches avec fromage (emmental du catalogue).\n3. Gratiner au four 180 °C, 25 min.",
    prepMinutes: 12,
    cookMinutes: 30,
    servings: 4,
    lines: [
      {
        ingredientSlug: "courgette",
        quantity: 100,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "creme-fraiche",
        quantity: 200,
        unit: "ml",
        optional: false
      },
      {
        ingredientSlug: "emmental",
        quantity: 100,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "ail",
        quantity: 2,
        unit: "gousse",
        optional: false
      }
    ]
  },
  {
    slug: "tarte-tomate",
    title: "Tarte tomate",
    description: "Été.",
    instructions: "1. Étaler la pâte (farine + beurre), piquer le fond.\n2. Disposer tomates en rondelles, ail, huile, herbes.\n3. Cuire 35 min à 180 °C.",
    prepMinutes: 12,
    cookMinutes: 30,
    servings: 4,
    lines: [
      {
        ingredientSlug: "tomate",
        quantity: 100,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "moutarde",
        quantity: 100,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "emmental",
        quantity: 100,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "farine",
        quantity: 250,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "oeuf",
        quantity: 3,
        unit: null,
        optional: false
      }
    ]
  },
  {
    slug: "falafels-maison",
    title: "Falafels maison",
    description: "Pois chiches.",
    instructions: "1. Mixer pois chiches, oignon, ail et épices.\n2. Former des boulettes.\n3. Frire ou cuire au four 200 °C, 20 min, jusqu'à doré.",
    prepMinutes: 12,
    cookMinutes: 30,
    servings: 4,
    lines: [
      {
        ingredientSlug: "pois-chiches",
        quantity: 250,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "oignon",
        quantity: 100,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "persil",
        quantity: 100,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "cumin",
        quantity: 100,
        unit: "càc",
        optional: false
      },
      {
        ingredientSlug: "farine",
        quantity: 250,
        unit: "g",
        optional: false
      }
    ]
  },
  {
    slug: "houmous-maison",
    title: "Houmous maison",
    description: "Apéro.",
    instructions: "1. Mixer pois chiches, tahini (substitut : yaourt épais), citron et ail.\n2. Ajuster sel et huile d'olive.\n3. Servir frais avec pain.",
    prepMinutes: 12,
    cookMinutes: 30,
    servings: 4,
    lines: [
      {
        ingredientSlug: "pois-chiches",
        quantity: 250,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "huile-olive",
        quantity: 2,
        unit: "càs",
        optional: false
      },
      {
        ingredientSlug: "citron",
        quantity: 1,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "ail",
        quantity: 2,
        unit: "gousse",
        optional: false
      },
      {
        ingredientSlug: "sesame",
        quantity: 30,
        unit: "g",
        optional: false
      }
    ]
  },
  {
    slug: "curry-lentilles",
    title: "Curry lentilles",
    description: "Dahl.",
    instructions: "1. Faire revenir oignon, ail, curry.\n2. Ajouter lentilles et bouillon, mijoter 25 min.\n3. Servir avec riz si disponible.",
    prepMinutes: 12,
    cookMinutes: 30,
    servings: 4,
    lines: [
      {
        ingredientSlug: "lentilles",
        quantity: 250,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "curry",
        quantity: 100,
        unit: "càc",
        optional: false
      },
      {
        ingredientSlug: "lait-coco",
        quantity: 100,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "oignon",
        quantity: 100,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "tomate",
        quantity: 100,
        unit: null,
        optional: false
      }
    ]
  },
  {
    slug: "chili-vegetarien",
    title: "Chili végétarien",
    description: "Haricots.",
    instructions: "1. Faire revenir oignon et poivron.\n2. Ajouter haricots (lentilles ou pois chiches du catalogue), tomate, épices, mijoter 30 min.\n3. Servir chaud.",
    prepMinutes: 12,
    cookMinutes: 30,
    servings: 4,
    lines: [
      {
        ingredientSlug: "haricot-rouge",
        quantity: 250,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "tomate",
        quantity: 100,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "poivron",
        quantity: 100,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "oignon",
        quantity: 100,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "cumin",
        quantity: 100,
        unit: "càc",
        optional: false
      }
    ]
  },
  {
    slug: "tacos-vegetariens",
    title: "Tacos végétariens",
    description: "Avocat.",
    instructions: "1. Garnir tortillas (pain du catalogue) d'avocat, haricots, tomate.\n2. Ajouter oignon et coriandre si disponible.\n3. Servir immédiatement.",
    prepMinutes: 12,
    cookMinutes: 30,
    servings: 4,
    lines: [
      {
        ingredientSlug: "haricot-rouge",
        quantity: 250,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "avocat",
        quantity: 100,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "tomate",
        quantity: 100,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "salade",
        quantity: 100,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "fromage-blanc",
        quantity: 100,
        unit: "g",
        optional: false
      }
    ]
  },
  {
    slug: "quiche-legumes",
    title: "Quiche légumes",
    description: "Sans viande.",
    instructions: "1. Préparer appareil œufs + crème (yaourt) + légumes coupés.\n2. Verser sur pâte ou fond beurré.\n3. Cuire 40 min à 180 °C jusqu'à prise.",
    prepMinutes: 12,
    cookMinutes: 30,
    servings: 4,
    lines: [
      {
        ingredientSlug: "oeuf",
        quantity: 3,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "creme-fraiche",
        quantity: 200,
        unit: "ml",
        optional: false
      },
      {
        ingredientSlug: "courgette",
        quantity: 100,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "carotte",
        quantity: 100,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "emmental",
        quantity: 100,
        unit: "g",
        optional: false
      }
    ]
  },
  {
    slug: "gratin-chou-fleur",
    title: "Gratin chou-fleur",
    description: "Béchamel style.",
    instructions: "1. Cuire le chou-fleur à la vapeur 10 min.\n2. Napper de sauce (yaourt + fromage).\n3. Gratiner 20 min au four.",
    prepMinutes: 12,
    cookMinutes: 30,
    servings: 4,
    lines: [
      {
        ingredientSlug: "chou-fleur",
        quantity: 100,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "creme-fraiche",
        quantity: 200,
        unit: "ml",
        optional: false
      },
      {
        ingredientSlug: "emmental",
        quantity: 100,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "cannelle",
        quantity: 0.5,
        unit: "càc",
        optional: false
      }
    ]
  },
  {
    slug: "aubergine-parmesan",
    title: "Aubergine parmesan",
    description: "Italien.",
    instructions: "1. Trancher aubergines, les dorer à la poêle.\n2. Alterner couches tomate et parmesan.\n3. Cuire au four 180 °C, 30 min.",
    prepMinutes: 12,
    cookMinutes: 30,
    servings: 4,
    lines: [
      {
        ingredientSlug: "aubergine",
        quantity: 100,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "sauce-tomate",
        quantity: 400,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "mozzarella",
        quantity: 100,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "parmesan",
        quantity: 100,
        unit: "g",
        optional: false
      }
    ]
  },
  {
    slug: "poelee-legumes",
    title: "Poêlée légumes",
    description: "Wok.",
    instructions: "1. Couper légumes en morceaux réguliers.\n2. Sauter à feu vif avec huile 10 à 12 min.\n3. Assaisonner et servir croquant.",
    prepMinutes: 12,
    cookMinutes: 30,
    servings: 4,
    lines: [
      {
        ingredientSlug: "courgette",
        quantity: 100,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "carotte",
        quantity: 100,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "poivron",
        quantity: 100,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "champignon",
        quantity: 100,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "huile-olive",
        quantity: 2,
        unit: "càs",
        optional: false
      }
    ]
  },
  {
    slug: "soupe-legumes-vert",
    title: "Soupe verte",
    description: "Detox.",
    instructions: "1. Laver et couper les légumes verts.\n2. Cuire dans le bouillon 20 min.\n3. Mixer, assaisonner, servir chaud.",
    prepMinutes: 12,
    cookMinutes: 30,
    servings: 4,
    lines: [
      {
        ingredientSlug: "epinard",
        quantity: 100,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "brocoli",
        quantity: 100,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "courgette",
        quantity: 100,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "bouillon",
        quantity: 0.5,
        unit: "L",
        optional: false
      }
    ]
  },
  {
    slug: "salade-quinoa",
    title: "Bol quinoa",
    description: "Complet.",
    instructions: "1. Cuire le quinoa (semoule) 15 min, refroidir.\n2. Mélanger tomate, concombre, huile, citron.\n3. Servir frais.",
    prepMinutes: 12,
    cookMinutes: 30,
    servings: 4,
    lines: [
      {
        ingredientSlug: "semoule",
        quantity: 250,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "avocat",
        quantity: 100,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "tomate",
        quantity: 100,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "pois-chiches",
        quantity: 250,
        unit: "g",
        optional: false
      }
    ]
  },
  {
    slug: "burger-lentilles",
    title: "Burger lentilles",
    description: "Végé.",
    instructions: "1. Mixer lentilles cuites, oignon, épices.\n2. Former galettes, cuire poêle 4 min par face.\n3. Servir dans pain avec salade.",
    prepMinutes: 12,
    cookMinutes: 30,
    servings: 4,
    lines: [
      {
        ingredientSlug: "lentilles",
        quantity: 250,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "oignon",
        quantity: 100,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "farine",
        quantity: 250,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "oeuf",
        quantity: 3,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "pain",
        quantity: 100,
        unit: null,
        optional: false
      }
    ]
  },
  {
    slug: "pizza-margherita-maison",
    title: "Pizza margherita",
    description: "Pâte farine.",
    instructions: "1. Étaler pâte (farine), napper tomate.\n2. Ajouter mozzarella (emmental) et basilic.\n3. Cuire four 220 °C, 12 à 15 min.",
    prepMinutes: 12,
    cookMinutes: 30,
    servings: 4,
    lines: [
      {
        ingredientSlug: "farine",
        quantity: 250,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "sauce-tomate",
        quantity: 400,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "mozzarella",
        quantity: 100,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "basilic",
        quantity: 100,
        unit: null,
        optional: false
      }
    ]
  },
  {
    slug: "risotto-champignons",
    title: "Risotto champignons",
    description: "Crémeux.",
    instructions: "1. Faire revenir oignon et champignons.\n2. Ajouter riz, mouiller au bouillon louche par louche 18 min.\n3. Finir au beurre, servir crémeux.",
    prepMinutes: 12,
    cookMinutes: 30,
    servings: 4,
    lines: [
      {
        ingredientSlug: "riz",
        quantity: 250,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "champignon",
        quantity: 100,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "bouillon",
        quantity: 0.5,
        unit: "L",
        optional: false
      },
      {
        ingredientSlug: "parmesan",
        quantity: 100,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "beurre",
        quantity: 100,
        unit: null,
        optional: false
      }
    ]
  },
  {
    slug: "tian-legumes",
    title: "Tian de légumes",
    description: "Four.",
    instructions: "1. Trancher légumes finement.\n2. Disposer en rosace dans plat huilé.\n3. Cuire four 180 °C, 45 min couvert puis 15 min découvert.",
    prepMinutes: 12,
    cookMinutes: 30,
    servings: 4,
    lines: [
      {
        ingredientSlug: "courgette",
        quantity: 100,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "tomate",
        quantity: 100,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "aubergine",
        quantity: 100,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "oignon",
        quantity: 100,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "huile-olive",
        quantity: 2,
        unit: "càs",
        optional: false
      }
    ]
  },
  {
    slug: "beignets-courgette",
    title: "Beignets courgette",
    description: "Apéro.",
    instructions: "1. Râper courgette, saler, essorer.\n2. Mélanger œuf, farine, ail.\n3. Frire petites portions 3 min par face.",
    prepMinutes: 12,
    cookMinutes: 30,
    servings: 4,
    lines: [
      {
        ingredientSlug: "courgette",
        quantity: 100,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "farine",
        quantity: 250,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "oeuf",
        quantity: 3,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "fromage-blanc",
        quantity: 100,
        unit: "g",
        optional: false
      }
    ]
  },
  {
    slug: "taboule",
    title: "Taboulé",
    description: "Semoule menthe.",
    instructions: "1. Tremper semoule dans eau chaude 10 min, égoutter.\n2. Mélanger tomate, concombre, menthe, persil, citron, huile.\n3. Servir frais.",
    prepMinutes: 12,
    cookMinutes: 30,
    servings: 4,
    lines: [
      {
        ingredientSlug: "semoule",
        quantity: 250,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "tomate",
        quantity: 100,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "persil",
        quantity: 100,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "citron",
        quantity: 1,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "huile-olive",
        quantity: 2,
        unit: "càs",
        optional: false
      }
    ]
  },
  {
    slug: "galettes-sarrasin",
    title: "Galettes complètes",
    description: "Jambon oeuf.",
    instructions: "1. Préparer pâte (farine + œuf + lait).\n2. Cuire fines crêpes à la poêle.\n3. Garnir jambon (substitut : dinde) et œuf si souhaité.",
    prepMinutes: 12,
    cookMinutes: 30,
    servings: 4,
    lines: [
      {
        ingredientSlug: "farine",
        quantity: 250,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "oeuf",
        quantity: 3,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "jambon",
        quantity: 100,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "emmental",
        quantity: 100,
        unit: "g",
        optional: false
      }
    ]
  },
  {
    slug: "croque-monsieur-vegetarien",
    title: "Croque végétarien",
    description: "Fromage.",
    instructions: "1. Garnir pain de fromage et béchamel (yaourt).\n2. Griller poêle ou four 10 min.\n3. Servir chaud.",
    prepMinutes: 12,
    cookMinutes: 30,
    servings: 4,
    lines: [
      {
        ingredientSlug: "pain",
        quantity: 100,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "emmental",
        quantity: 100,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "tomate",
        quantity: 100,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "beurre",
        quantity: 100,
        unit: null,
        optional: false
      }
    ]
  },
  {
    slug: "wrap-falafel",
    title: "Wrap falafel",
    description: "Street food.",
    instructions: "1. Garnir tortilla de falafels, salade, tomate, sauce yaourt.\n2. Rouler serré.\n3. Servir frais.",
    prepMinutes: 12,
    cookMinutes: 30,
    servings: 4,
    lines: [
      {
        ingredientSlug: "pois-chiches",
        quantity: 250,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "salade",
        quantity: 100,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "tomate",
        quantity: 100,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "yaourt",
        quantity: 100,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "pain",
        quantity: 100,
        unit: null,
        optional: false
      }
    ]
  },
  {
    slug: "polenta-legumes",
    title: "Polenta légumes",
    description: "Italien.",
    instructions: "1. Cuire polenta (semoule) dans bouillon 15 min.\n2. Sauter légumes à part.\n3. Servir polenta nappée de légumes.",
    prepMinutes: 12,
    cookMinutes: 30,
    servings: 4,
    lines: [
      {
        ingredientSlug: "semoule",
        quantity: 250,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "courgette",
        quantity: 100,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "tomate",
        quantity: 100,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "parmesan",
        quantity: 100,
        unit: "g",
        optional: false
      }
    ]
  },
  {
    slug: "tofu-brouille",
    title: "Tofu brouillé",
    description: "Brunch.",
    instructions: "1. Émietter tofu, faire revenir avec curcuma.\n2. Ajouter légumes coupés fins.\n3. Servir type brunch.",
    prepMinutes: 12,
    cookMinutes: 30,
    servings: 4,
    lines: [
      {
        ingredientSlug: "tofu",
        quantity: 100,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "curry",
        quantity: 1,
        unit: "càc",
        optional: false
      },
      {
        ingredientSlug: "oignon",
        quantity: 100,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "poivron",
        quantity: 100,
        unit: null,
        optional: false
      }
    ]
  },
  {
    slug: "tiramisu-express",
    title: "Tiramisu express",
    description: "Sans cuisson.",
    instructions: "1. Œufs pasteurisés recommandés.\n2. Battre jaunes + sucre, mélanger mascarpone.\n3. Tremper biscuits (pain) dans café froid, alterner couches. Réfrigérer 6 h.",
    prepMinutes: 15,
    cookMinutes: 25,
    servings: 6,
    lines: [
      {
        ingredientSlug: "mascarpone",
        quantity: 250,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "oeuf",
        quantity: 3,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "sucre",
        quantity: 80,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "chocolat",
        quantity: 150,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "pain",
        quantity: 24,
        unit: null,
        optional: false
      }
    ]
  },
  {
    slug: "mousse-chocolat",
    title: "Mousse au chocolat",
    description: "Aérienne.",
    instructions: "1. Œufs pasteurisés recommandés pour préparations crues.\n2. Faire fondre chocolat et beurre.\n3. Monter les blancs en neige, incorporer délicatement. Réfrigérer 4 h minimum.",
    prepMinutes: 15,
    cookMinutes: 25,
    servings: 6,
    lines: [
      {
        ingredientSlug: "chocolat",
        quantity: 150,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "oeuf",
        quantity: 4,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "sucre",
        quantity: 80,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "beurre",
        quantity: 80,
        unit: "g",
        optional: false
      }
    ]
  },
  {
    slug: "creme-caramel",
    title: "Crème caramel",
    description: "Classique.",
    instructions: "1. Chauffer lait, sucre et vanille (ne pas faire bouillir).\n2. Caraméliser sucre dans moule, verser appareil œufs-lait (œufs pasteurisés si crème non cuite).\n3. Cuire au bain-marie 40 min à 160 °C, refroidir 4 h.",
    prepMinutes: 15,
    cookMinutes: 25,
    servings: 6,
    lines: [
      {
        ingredientSlug: "oeuf",
        quantity: 3,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "lait",
        quantity: 0.5,
        unit: "L",
        optional: false
      },
      {
        ingredientSlug: "sucre",
        quantity: 80,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "vanille",
        quantity: 1,
        unit: null,
        optional: false
      }
    ]
  },
  {
    slug: "clafoutis-cerises",
    title: "Clafoutis fruits",
    description: "Flan.",
    instructions: "1. Beurrer plat, disposer fruits (cerises du catalogue ou fruits rouges).\n2. Battre œufs, farine, sucre et lait.\n3. Cuire four 180 °C, 35 min jusqu'à prise.",
    prepMinutes: 15,
    cookMinutes: 25,
    servings: 6,
    lines: [
      {
        ingredientSlug: "farine",
        quantity: 200,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "oeuf",
        quantity: 3,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "lait",
        quantity: 0.5,
        unit: "L",
        optional: false
      },
      {
        ingredientSlug: "sucre",
        quantity: 80,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "fraise",
        quantity: 300,
        unit: "g",
        optional: false
      }
    ]
  },
  {
    slug: "crêpes-sucre",
    title: "Crêpes sucrées",
    description: "Chandeleur.",
    instructions: "1. Battre œufs, farine, lait et pincée de sel.\n2. Laisser reposer 30 min.\n3. Cuire fines crêpes à la poêle beurrée, sucrer au moment de servir.",
    prepMinutes: 15,
    cookMinutes: 25,
    servings: 6,
    lines: [
      {
        ingredientSlug: "farine",
        quantity: 200,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "lait",
        quantity: 0.5,
        unit: "L",
        optional: false
      },
      {
        ingredientSlug: "oeuf",
        quantity: 3,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "sucre",
        quantity: 80,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "beurre",
        quantity: 80,
        unit: "g",
        optional: false
      }
    ]
  },
  {
    slug: "gaufres",
    title: "Gaufres",
    description: "Brunch.",
    instructions: "1. Séparer œufs, monter blancs.\n2. Incorporer farine, lait, beurre fondu au jaune + sucre.\n3. Cuire au gaufrier ou poêle jusqu'à doré.",
    prepMinutes: 15,
    cookMinutes: 25,
    servings: 6,
    lines: [
      {
        ingredientSlug: "farine",
        quantity: 200,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "lait",
        quantity: 0.5,
        unit: "L",
        optional: false
      },
      {
        ingredientSlug: "oeuf",
        quantity: 3,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "beurre",
        quantity: 80,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "sucre",
        quantity: 80,
        unit: "g",
        optional: false
      }
    ]
  },
  {
    slug: "brownies",
    title: "Brownies",
    description: "Fondant.",
    instructions: "1. Faire fondre chocolat et beurre.\n2. Mélanger œufs et sucre, incorporer farine et chocolat.\n3. Cuire four 180 °C, 22 min (cœur encore moelleux).",
    prepMinutes: 15,
    cookMinutes: 25,
    servings: 6,
    lines: [
      {
        ingredientSlug: "chocolat",
        quantity: 150,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "beurre",
        quantity: 80,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "oeuf",
        quantity: 3,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "farine",
        quantity: 200,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "sucre",
        quantity: 80,
        unit: "g",
        optional: false
      }
    ]
  },
  {
    slug: "cookies-chocolat",
    title: "Cookies chocolat",
    description: "Moelleux.",
    instructions: "1. Crémer beurre et sucre, ajouter œuf.\n2. Incorporer farine et pépites chocolat.\n3. Cuire 12 min à 180 °C — bords dorés, centre souple.",
    prepMinutes: 15,
    cookMinutes: 25,
    servings: 6,
    lines: [
      {
        ingredientSlug: "farine",
        quantity: 200,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "chocolat",
        quantity: 150,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "beurre",
        quantity: 80,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "oeuf",
        quantity: 3,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "sucre",
        quantity: 80,
        unit: "g",
        optional: false
      }
    ]
  },
  {
    slug: "crumble-pomme",
    title: "Crumble pomme",
    description: "Four.",
    instructions: "1. Éplucher pommes, couper en morceaux avec sucre et cannelle.\n2. Mélanger farine, beurre et sucre en crumble.\n3. Cuire four 180 °C, 30 min.",
    prepMinutes: 15,
    cookMinutes: 25,
    servings: 6,
    lines: [
      {
        ingredientSlug: "pomme",
        quantity: 3,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "farine",
        quantity: 200,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "beurre",
        quantity: 80,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "sucre",
        quantity: 80,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "cannelle",
        quantity: 1,
        unit: "càc",
        optional: false
      }
    ]
  },
  {
    slug: "tarte-citron",
    title: "Tarte au citron",
    description: "Acide.",
    instructions: "1. Cuire fond (pâte farine) 15 min à vide.\n2. Chauffer jus citron, œufs, sucre jusqu'à nappe (œufs bien cuits).\n3. Verser sur fond, refroidir 3 h.",
    prepMinutes: 15,
    cookMinutes: 25,
    servings: 6,
    lines: [
      {
        ingredientSlug: "citron",
        quantity: 4,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "oeuf",
        quantity: 3,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "sucre",
        quantity: 80,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "beurre",
        quantity: 80,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "farine",
        quantity: 200,
        unit: "g",
        optional: false
      }
    ]
  },
  {
    slug: "profiteroles-express",
    title: "Profiteroles express",
    description: "Chouquettes.",
    instructions: "1. Préparer pâte à choux (farine, beurre, œufs), former choux.\n2. Cuire four 200 °C, 25 min sans ouvrir.\n3. Garnir crème (mascarpone + sucre) et napper chocolat fondu.",
    prepMinutes: 15,
    cookMinutes: 25,
    servings: 6,
    lines: [
      {
        ingredientSlug: "farine",
        quantity: 200,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "oeuf",
        quantity: 3,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "beurre",
        quantity: 80,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "chocolat",
        quantity: 150,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "creme-fraiche",
        quantity: 200,
        unit: "g",
        optional: false
      }
    ]
  },
  {
    slug: "ile-flottante",
    title: "Île flottante",
    description: "Meringue.",
    instructions: "1. Utiliser des œufs frais et de préférence pasteurisés pour préparations crues.\n2. Conservation au frais ≤ 4 °C, consommer rapidement.\n3. Monter la préparation selon la recette classique.\n4. Conservation au frais ≤ 24 h.",
    prepMinutes: 15,
    cookMinutes: 25,
    servings: 6,
    lines: [
      {
        ingredientSlug: "oeuf",
        quantity: 3,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "lait",
        quantity: 0.5,
        unit: "L",
        optional: false
      },
      {
        ingredientSlug: "sucre",
        quantity: 80,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "vanille",
        quantity: 1,
        unit: null,
        optional: false
      }
    ]
  },
  {
    slug: "riz-lait",
    title: "Riz au lait",
    description: "Vanille.",
    instructions: "1. Porter lait, sucre et vanille à frémissement.\n2. Ajouter riz rond, mijoter 30 min en remuant.\n3. Servir tiède ou froid.",
    prepMinutes: 15,
    cookMinutes: 25,
    servings: 6,
    lines: [
      {
        ingredientSlug: "riz",
        quantity: 150,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "lait",
        quantity: 0.5,
        unit: "L",
        optional: false
      },
      {
        ingredientSlug: "sucre",
        quantity: 80,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "vanille",
        quantity: 1,
        unit: null,
        optional: false
      }
    ]
  },
  {
    slug: "compote-pomme",
    title: "Compote maison",
    description: "Pommes.",
    instructions: "1. Éplucher pommes, couper en morceaux.\n2. Cuire à feu doux avec un peu d'eau et sucre 20 min.\n3. Écraser ou laisser en morceaux, refroidir.",
    prepMinutes: 15,
    cookMinutes: 25,
    servings: 6,
    lines: [
      {
        ingredientSlug: "pomme",
        quantity: 3,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "sucre",
        quantity: 80,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "cannelle",
        quantity: 1,
        unit: "càc",
        optional: false
      },
      {
        ingredientSlug: "citron",
        quantity: 4,
        unit: "g",
        optional: false
      }
    ]
  },
  {
    slug: "salade-fruits-maison",
    title: "Salade fruits",
    description: "Fraîche.",
    instructions: "1. Laver et couper fruits (pomme, banane, citron en jus).\n2. Mélanger délicatement.\n3. Servir frais, consommer le jour même.",
    prepMinutes: 15,
    cookMinutes: 25,
    servings: 6,
    lines: [
      {
        ingredientSlug: "banane",
        quantity: 3,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "pomme",
        quantity: 3,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "orange",
        quantity: 1,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "fraise",
        quantity: 300,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "miel",
        quantity: 2,
        unit: "càs",
        optional: false
      }
    ]
  },
  {
    slug: "banana-bread",
    title: "Banana bread",
    description: "Moelleux.",
    instructions: "1. Écraser bananes mûres, mélanger œufs, farine, sucre, levure.\n2. Verser dans moule beurré.\n3. Cuire four 170 °C, 50 min (couteau sec).",
    prepMinutes: 15,
    cookMinutes: 25,
    servings: 6,
    lines: [
      {
        ingredientSlug: "banane",
        quantity: 3,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "farine",
        quantity: 200,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "oeuf",
        quantity: 3,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "sucre",
        quantity: 80,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "beurre",
        quantity: 80,
        unit: "g",
        optional: false
      }
    ]
  },
  {
    slug: "flan-patissier",
    title: "Flan pâtissier",
    description: "Lait oeuf.",
    instructions: "1. Chauffer lait et sucre.\n2. Battre œufs (pasteurisés), verser lait chaud en fouettant.\n3. Cuire bain-marie 45 min à 160 °C.",
    prepMinutes: 15,
    cookMinutes: 25,
    servings: 6,
    lines: [
      {
        ingredientSlug: "lait",
        quantity: 0.5,
        unit: "L",
        optional: false
      },
      {
        ingredientSlug: "oeuf",
        quantity: 3,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "sucre",
        quantity: 80,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "farine",
        quantity: 200,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "vanille",
        quantity: 1,
        unit: null,
        optional: false
      }
    ]
  },
  {
    slug: "moelleux-chocolat",
    title: "Moelleux chocolat",
    description: "Coeur fondant.",
    instructions: "1. Faire fondre chocolat et beurre.\n2. Mélanger œufs et sucre, ajouter farine et chocolat.\n3. Cuire 12 min à 200 °C pour cœur coulant.",
    prepMinutes: 15,
    cookMinutes: 25,
    servings: 6,
    lines: [
      {
        ingredientSlug: "chocolat",
        quantity: 150,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "beurre",
        quantity: 80,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "oeuf",
        quantity: 3,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "farine",
        quantity: 200,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "sucre",
        quantity: 80,
        unit: "g",
        optional: false
      }
    ]
  },
  {
    slug: "charlotte-fraises",
    title: "Charlotte fraises",
    description: "Biscuits pain.",
    instructions: "1. Tapisser moule de biscuits (pain) imbibés de jus fruit.\n2. Monter crème mascarpone + sucre, mélanger fraises.\n3. Réfrigérer 4 h minimum.",
    prepMinutes: 15,
    cookMinutes: 25,
    servings: 6,
    lines: [
      {
        ingredientSlug: "fraise",
        quantity: 300,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "fromage-blanc",
        quantity: 200,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "sucre",
        quantity: 80,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "pain",
        quantity: 6,
        unit: "g",
        optional: false
      }
    ]
  },
  {
    slug: "meringues",
    title: "Meringues",
    description: "Sucre oeuf.",
    instructions: "1. Utiliser des œufs frais et de préférence pasteurisés pour préparations crues.\n2. Conservation au frais ≤ 4 °C, consommer rapidement.\n3. Monter la préparation selon la recette classique.\n4. Conservation au frais ≤ 24 h.",
    prepMinutes: 15,
    cookMinutes: 25,
    servings: 6,
    lines: [
      {
        ingredientSlug: "oeuf",
        quantity: 3,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "sucre",
        quantity: 80,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "vanille",
        quantity: 1,
        unit: null,
        optional: false
      }
    ]
  },
  {
    slug: "panna-cotta",
    title: "Panna cotta",
    description: "Vanille.",
    instructions: "1. Chauffer crème et sucre (ne pas bouillir).\n2. Ajouter gélatine hydratée ou réduire très fort si sans.\n3. Verser en verrines, réfrigérer 3 h.",
    prepMinutes: 15,
    cookMinutes: 25,
    servings: 6,
    lines: [
      {
        ingredientSlug: "creme-fraiche",
        quantity: 200,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "lait",
        quantity: 0.5,
        unit: "L",
        optional: false
      },
      {
        ingredientSlug: "sucre",
        quantity: 80,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "vanille",
        quantity: 1,
        unit: null,
        optional: false
      }
    ]
  },
  {
    slug: "fondant-citron",
    title: "Fondant citron",
    description: "Gâteau.",
    instructions: "1. Battre œufs, sucre, farine et jus citron.\n2. Verser dans moule beurré.\n3. Cuire 25 min à 180 °C.",
    prepMinutes: 15,
    cookMinutes: 25,
    servings: 6,
    lines: [
      {
        ingredientSlug: "citron",
        quantity: 4,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "farine",
        quantity: 200,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "oeuf",
        quantity: 3,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "sucre",
        quantity: 80,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "beurre",
        quantity: 80,
        unit: "g",
        optional: false
      }
    ]
  },
  {
    slug: "truffes-chocolat",
    title: "Truffes chocolat",
    description: "Noix.",
    instructions: "1. Chauffer crème, verser sur chocolat haché.\n2. Réfrigérer ganache 2 h, former boules.\n3. Rouler dans cacao ou noix concassées.",
    prepMinutes: 15,
    cookMinutes: 25,
    servings: 6,
    lines: [
      {
        ingredientSlug: "chocolat",
        quantity: 150,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "creme-fraiche",
        quantity: 200,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "chocolat",
        quantity: 20,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "beurre",
        quantity: 80,
        unit: "g",
        optional: false
      }
    ]
  },
  {
    slug: "tarte-tatin",
    title: "Tarte tatin",
    description: "Pommes.",
    instructions: "1. Caraméliser sucre et beurre dans moule.\n2. Disposer pommes en rosace, couvrir pâte.\n3. Cuire four 190 °C, 35 min, démouler tiède.",
    prepMinutes: 15,
    cookMinutes: 25,
    servings: 6,
    lines: [
      {
        ingredientSlug: "pomme",
        quantity: 3,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "sucre",
        quantity: 80,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "beurre",
        quantity: 80,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "farine",
        quantity: 200,
        unit: "g",
        optional: false
      }
    ]
  },
  {
    slug: "sorbet-citron",
    title: "Sorbet citron",
    description: "Glacé (sirop citron).",
    instructions: "1. Presser 4 citrons (≈150 ml jus).\n2. Chauffer 400 ml eau avec 80 g sucre, laisser refroidir.\n3. Mélanger sirop + jus, congeler 4 h en remuant toutes les 30 min (ou sorbetière).",
    prepMinutes: 15,
    cookMinutes: 10,
    servings: 6,
    lines: [
      {
        ingredientSlug: "citron",
        quantity: 4,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "sucre",
        quantity: 80,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "eau",
        quantity: 0.4,
        unit: "L",
        optional: false
      }
    ]
  },
  {
    slug: "oeufs-brouilles",
    title: "Œufs brouillés",
    description: "Crémeux.",
    instructions: "1. Battre ou préparer les oeufs.\n2. Cuire avec garniture.\n3. Servir immédiatement.",
    prepMinutes: 8,
    cookMinutes: 15,
    servings: 2,
    lines: [
      {
        ingredientSlug: "oeuf",
        quantity: 4,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "beurre",
        quantity: 20,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "creme-fraiche",
        quantity: 100,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "sel",
        quantity: 2,
        unit: "pincée",
        optional: false
      }
    ]
  },
  {
    slug: "oeufs-cocotte",
    title: "Œufs en cocotte",
    description: "Four.",
    instructions: "1. Battre ou préparer les oeufs.\n2. Cuire avec garniture.\n3. Servir immédiatement.",
    prepMinutes: 8,
    cookMinutes: 15,
    servings: 2,
    lines: [
      {
        ingredientSlug: "oeuf",
        quantity: 4,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "creme-fraiche",
        quantity: 100,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "jambon",
        quantity: 80,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "emmental",
        quantity: 80,
        unit: "g",
        optional: false
      }
    ]
  },
  {
    slug: "shakshuka",
    title: "Shakshuka",
    description: "Tomates epices.",
    instructions: "1. Battre ou préparer les oeufs.\n2. Cuire avec garniture.\n3. Servir immédiatement.",
    prepMinutes: 8,
    cookMinutes: 15,
    servings: 2,
    lines: [
      {
        ingredientSlug: "oeuf",
        quantity: 4,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "tomate",
        quantity: 2,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "poivron",
        quantity: 2,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "oignon",
        quantity: 2,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "cumin",
        quantity: 1,
        unit: "càc",
        optional: false
      }
    ]
  },
  {
    slug: "frittata-legumes",
    title: "Frittata légumes",
    description: "Italienne.",
    instructions: "1. Battre ou préparer les oeufs.\n2. Cuire avec garniture.\n3. Servir immédiatement.",
    prepMinutes: 8,
    cookMinutes: 15,
    servings: 2,
    lines: [
      {
        ingredientSlug: "oeuf",
        quantity: 4,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "courgette",
        quantity: 2,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "poivron",
        quantity: 2,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "emmental",
        quantity: 80,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "oignon",
        quantity: 2,
        unit: null,
        optional: false
      }
    ]
  },
  {
    slug: "quiche-lorraine-vegetarienne",
    title: "Quiche sans lardons",
    description: "Légumes.",
    instructions: "1. Battre ou préparer les oeufs.\n2. Cuire avec garniture.\n3. Servir immédiatement.",
    prepMinutes: 8,
    cookMinutes: 15,
    servings: 2,
    lines: [
      {
        ingredientSlug: "oeuf",
        quantity: 4,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "creme-fraiche",
        quantity: 100,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "brocoli",
        quantity: 2,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "emmental",
        quantity: 80,
        unit: "g",
        optional: false
      }
    ]
  },
  {
    slug: "oeufs-mimosas",
    title: "Œufs mimosa",
    description: "Apéro.",
    instructions: "1. Battre ou préparer les oeufs.\n2. Cuire avec garniture.\n3. Servir immédiatement.",
    prepMinutes: 8,
    cookMinutes: 15,
    servings: 2,
    lines: [
      {
        ingredientSlug: "oeuf",
        quantity: 4,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "yaourt",
        quantity: 2,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "moutarde",
        quantity: 2,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "persil",
        quantity: 2,
        unit: null,
        optional: false
      }
    ]
  },
  {
    slug: "cloud-eggs",
    title: "Oeufs nuage",
    description: "Blancs fouettés.",
    instructions: "1. Battre ou préparer les oeufs.\n2. Cuire avec garniture.\n3. Servir immédiatement.",
    prepMinutes: 8,
    cookMinutes: 15,
    servings: 2,
    lines: [
      {
        ingredientSlug: "oeuf",
        quantity: 4,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "fromage-blanc",
        quantity: 2,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "sel",
        quantity: 2,
        unit: "pincée",
        optional: false
      },
      {
        ingredientSlug: "poivre",
        quantity: 2,
        unit: "pincée",
        optional: false
      }
    ]
  },
  {
    slug: "huevos-rancheros",
    title: "Huevos rancheros",
    description: "Mexicain.",
    instructions: "1. Battre ou préparer les oeufs.\n2. Cuire avec garniture.\n3. Servir immédiatement.",
    prepMinutes: 8,
    cookMinutes: 15,
    servings: 2,
    lines: [
      {
        ingredientSlug: "oeuf",
        quantity: 4,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "haricot-rouge",
        quantity: 200,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "tomate",
        quantity: 2,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "avocat",
        quantity: 2,
        unit: null,
        optional: false
      }
    ]
  },
  {
    slug: "omelette-fromage",
    title: "Omelette fromage",
    description: "Rapide.",
    instructions: "1. Battre ou préparer les oeufs.\n2. Cuire avec garniture.\n3. Servir immédiatement.",
    prepMinutes: 8,
    cookMinutes: 15,
    servings: 2,
    lines: [
      {
        ingredientSlug: "oeuf",
        quantity: 4,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "emmental",
        quantity: 80,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "beurre",
        quantity: 20,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "poivre",
        quantity: 2,
        unit: "pincée",
        optional: false
      }
    ]
  },
  {
    slug: "oeufs-benedict",
    title: "Eggs Benedict",
    description: "Sauce yaourt.",
    instructions: "1. Battre ou préparer les oeufs.\n2. Cuire avec garniture.\n3. Servir immédiatement.",
    prepMinutes: 8,
    cookMinutes: 15,
    servings: 2,
    lines: [
      {
        ingredientSlug: "oeuf",
        quantity: 4,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "jambon",
        quantity: 80,
        unit: "g",
        optional: false
      },
      {
        ingredientSlug: "pain",
        quantity: 4,
        unit: "tranches",
        optional: false
      },
      {
        ingredientSlug: "yaourt",
        quantity: 2,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "citron",
        quantity: 2,
        unit: null,
        optional: false
      }
    ]
  },
  {
    slug: "chakchouka-express",
    title: "Chakchouka",
    description: "Maghrébin.",
    instructions: "1. Battre ou préparer les oeufs.\n2. Cuire avec garniture.\n3. Servir immédiatement.",
    prepMinutes: 8,
    cookMinutes: 15,
    servings: 2,
    lines: [
      {
        ingredientSlug: "oeuf",
        quantity: 4,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "tomate",
        quantity: 2,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "poivron",
        quantity: 2,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "ail",
        quantity: 2,
        unit: "gousse",
        optional: false
      },
      {
        ingredientSlug: "cumin",
        quantity: 1,
        unit: "càc",
        optional: false
      }
    ]
  },
  {
    slug: "tortilla-espagnole",
    title: "Tortilla espagnole",
    description: "Pomme de terre.",
    instructions: "1. Battre ou préparer les oeufs.\n2. Cuire avec garniture.\n3. Servir immédiatement.",
    prepMinutes: 8,
    cookMinutes: 15,
    servings: 2,
    lines: [
      {
        ingredientSlug: "oeuf",
        quantity: 4,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "pomme-de-terre",
        quantity: 4,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "oignon",
        quantity: 2,
        unit: null,
        optional: false
      },
      {
        ingredientSlug: "huile-olive",
        quantity: 3,
        unit: "càs",
        optional: false
      }
    ]
  }
] as RecipeCatalogEntry[];
