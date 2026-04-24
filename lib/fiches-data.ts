export type Categorie =
  | "Démographie"
  | "Social & Éducation"
  | "Emploi & Activité"
  | "Économie"
  | "Territoire & Urbain"
  | "Accidents & Mobilité"
  | "Environnement";

export interface Fiche {
  key: string;
  titre: string;
  categorie: Categorie;
  theme?: string;
  source: string;
  annee: string;
  typeRepresentation: string;
  variables?: string;
  methodologie?: string;
  logiciel?: string;
  auteur?: string;
  messagePrincipal: string; // 2-3 phrases max — essentiel pour l'utilisateur
  imageFilename: string; // nom du fichier original pour référence
}

export const FICHES: Fiche[] = [
  // ─── DÉMOGRAPHIE ───────────────────────────────────────────────────────────
  {
    key: "pop_totale_chomage",
    titre: "Population totale et taux de chômage par province",
    categorie: "Démographie",
    source: "HCP — RGPH 2014",
    annee: "2014",
    typeRepresentation: "Carte choroplèthe + cercles proportionnels",
    variables: "Population totale (taille des cercles) · Taux de chômage (couleur)",
    logiciel: "QGIS",
    auteur: "El Afia Mohamed",
    messagePrincipal:
      "Casablanca concentre la plus grande population de la région avec plus de 3,7 millions d'habitants. Les taux de chômage les plus élevés se retrouvent dans les provinces urbaines denses, contrastant avec les zones rurales de Settat et Sidi Bennour.",
    imageFilename: "Population totale et taux de chômage.jpg",
  },
  {
    key: "pop_rurale",
    titre: "Population rurale par province",
    categorie: "Démographie",
    source: "HCP — RGPH 2014",
    annee: "2014",
    typeRepresentation: "Carte choroplèthe",
    variables: "Part de la population rurale (%)",
    logiciel: "QGIS",
    messagePrincipal:
      "Sidi Bennour et Settat affichent les taux de ruralité les plus élevés de la région (>50%). En revanche, les préfectures de Casablanca, Nouaceur et Médiouna sont quasi exclusivement urbaines.",
    imageFilename: "Population rurale par province.jpg",
  },
  {
    key: "pop_urbaine_rurale",
    titre: "Population urbaine vs rurale",
    categorie: "Démographie",
    source: "HCP — RGPH 2014",
    annee: "2014",
    typeRepresentation: "Carte en barres ou diagrammes comparatifs",
    variables: "Population urbaine · Population rurale",
    logiciel: "QGIS / Philcarto",
    messagePrincipal:
      "La région Casablanca-Settat est l'une des plus urbanisées du Maroc. Le déséquilibre urbain/rural est maximal à Casablanca et Mohammedia, tandis que Sidi Bennour reste majoritairement rurale.",
    imageFilename: "Population urbaine vs rurale.jpg",
  },
  {
    key: "taux_urbanisation",
    titre: "Taux d'urbanisation par province",
    categorie: "Démographie",
    source: "HCP — RGPH 2014",
    annee: "2014",
    typeRepresentation: "Carte choroplèthe",
    variables: "Taux d'urbanisation (%)",
    methodologie: "Seuils naturels (Jenks)",
    logiciel: "QGIS",
    messagePrincipal:
      "Le taux d'urbanisation régional dépasse 80%, bien au-dessus de la moyenne nationale (~62%). Casablanca, Mohammedia et Nouaceur atteignent des taux proches de 100%, reflétant la forte métropolisation du littoral atlantique.",
    imageFilename: "C02_Tx_urbanisation.jpg",
  },
  {
    key: "menages_taille",
    titre: "Nombre de ménages et taille moyenne",
    categorie: "Démographie",
    source: "HCP — RGPH 2014",
    annee: "2014",
    typeRepresentation: "Carte choroplèthe + cercles proportionnels",
    variables: "Nombre de ménages (cercles) · Taille moyenne (couleur)",
    logiciel: "QGIS / Philcarto",
    messagePrincipal:
      "Le nombre de ménages est très concentré dans la préfecture de Casablanca. La taille moyenne des ménages est plus élevée dans les zones rurales (Sidi Bennour, Settat), indiquant des structures familiales plus larges.",
    imageFilename: "Nb_menages_tot et Taille_moy_tot.jpg",
  },
  {
    key: "pop_classif_urb",
    titre: "Population totale et classification urbaine",
    categorie: "Démographie",
    source: "HCP — RGPH 2014",
    annee: "2014",
    typeRepresentation: "Carte choroplèthe + cercles proportionnels",
    variables: "Population totale (cercles) · Classification urbaine (couleur)",
    logiciel: "Philcarto, Inkscape",
    messagePrincipal:
      "La carte met en évidence la macrocéphalie urbaine de Casablanca par rapport aux autres provinces. Elle illustre la classification territoriale (urbain dense, périurbain, rural) et les disparités de peuplement au sein de la région.",
    imageFilename: "ChoroPropo[Pop_tot][Classif_urb].emf.jpg",
  },

  // ─── SOCIAL & ÉDUCATION ────────────────────────────────────────────────────
  {
    key: "analphabetisme",
    titre: "Taux d'analphabétisme par province",
    categorie: "Social & Éducation",
    source: "HCP — RGPH 2014",
    annee: "2014",
    typeRepresentation: "Carte choroplèthe",
    variables: "Taux d'analphabétisme (%)",
    methodologie: "Seuils naturels (Jenks)",
    logiciel: "QGIS",
    messagePrincipal:
      "Le taux d'analphabétisme est inversement corrélé à l'urbanisation : les provinces rurales de Sidi Bennour et Settat présentent les taux les plus élevés (>30%). Casablanca affiche les taux les plus bas grâce à sa concentration d'infrastructures éducatives.",
    imageFilename: "C03—Taux d'analphabétisme.jpg",
  },
  {
    key: "ipm_pauvrete",
    titre: "Indice de Pauvreté Multidimensionnelle (IPM)",
    categorie: "Social & Éducation",
    source: "HCP — Enquête sur la pauvreté",
    annee: "2014",
    typeRepresentation: "Carte choroplèthe",
    variables: "IPM composite (éducation, santé, niveau de vie)",
    methodologie: "Discrétisation par seuils naturels",
    logiciel: "QGIS",
    messagePrincipal:
      "L'IPM révèle de profondes disparités territoriales. Les provinces rurales accumulent des privations dans les trois dimensions (éducation, santé, revenu), tandis que Casablanca et ses préfectures proches bénéficient des meilleures conditions de vie de la région.",
    imageFilename: "C04 IPM Pauvreté.jpg",
  },
  {
    key: "niveau_etude",
    titre: "Niveau d'éducation par province",
    categorie: "Social & Éducation",
    source: "HCP — RGPH 2014",
    annee: "2014",
    typeRepresentation: "Carte choroplèthe",
    variables: "Part de la population avec niveau secondaire ou supérieur (%)",
    logiciel: "QGIS",
    messagePrincipal:
      "Le niveau d'éducation est fortement polarisé autour de Casablanca et Mohammedia, qui concentrent l'essentiel des diplômés de l'enseignement supérieur. Les écarts avec les zones rurales restent importants, reflétant des inégalités d'accès à l'éducation persistantes.",
    imageFilename: "Niveau d'étude.jpg",
  },
  {
    key: "logement_proprietaires",
    titre: "Propriétaires de logement par province",
    categorie: "Social & Éducation",
    source: "HCP — RGPH 2014",
    annee: "2014",
    typeRepresentation: "Carte choroplèthe",
    variables: "Taux de propriété du logement (%)",
    logiciel: "QGIS",
    messagePrincipal:
      "Le taux de propriété est paradoxalement plus élevé dans les zones rurales où les coûts immobiliers sont faibles. À Casablanca, la location et l'habitat collectif dominent, avec moins de 50% de propriétaires dans certains arrondissements denses.",
    imageFilename: "Propriétaires logement.jpg",
  },
  {
    key: "langues",
    titre: "Langues parlées dans la région",
    categorie: "Social & Éducation",
    source: "HCP — RGPH 2014",
    annee: "2014",
    typeRepresentation: "Carte en diagrammes (camemberts)",
    variables: "Répartition des langues parlées par province",
    logiciel: "QGIS / Philcarto",
    messagePrincipal:
      "Le darija (arabe dialectal) domine dans l'ensemble de la région. L'amazighe est plus présent dans les provinces rurales du sud. Le français garde une forte présence fonctionnelle dans les milieux urbains de Casablanca et Mohammedia.",
    imageFilename: "Langues parlees.jpg",
  },

  // ─── EMPLOI & ACTIVITÉ ─────────────────────────────────────────────────────
  {
    key: "chomage_general",
    titre: "Taux de chômage par province",
    categorie: "Emploi & Activité",
    source: "HCP — RGPH 2014",
    annee: "2014",
    typeRepresentation: "Carte choroplèthe",
    variables: "Taux de chômage (%)",
    methodologie: "Seuils naturels (Jenks)",
    logiciel: "QGIS",
    messagePrincipal:
      "Le chômage est structurellement plus élevé dans les préfectures urbaines denses. Casablanca et Mohammedia enregistrent les taux les plus élevés malgré une forte activité économique, révélant un marché du travail sous tension et un chômage de masse urbain.",
    imageFilename: "Taux de chômage.jpg",
  },
  {
    key: "chomage_feminin",
    titre: "Taux de chômage féminin par province",
    categorie: "Emploi & Activité",
    source: "HCP — RGPH 2014",
    annee: "2014",
    typeRepresentation: "Carte choroplèthe",
    variables: "Taux de chômage féminin (%)",
    methodologie: "Seuils naturels (Jenks)",
    logiciel: "Philcarto, Inkscape",
    messagePrincipal:
      "Le chômage féminin est systématiquement supérieur au chômage masculin dans toutes les provinces. Il atteint des niveaux critiques dans les zones urbaines où les femmes diplômées peinent à s'insérer sur le marché du travail.",
    imageFilename: "Taux_chomage_Feminin_pct.jpg",
  },
  {
    key: "chomage_masculin",
    titre: "Taux de chômage masculin par province",
    categorie: "Emploi & Activité",
    source: "HCP — RGPH 2014",
    annee: "2014",
    typeRepresentation: "Carte choroplèthe",
    variables: "Taux de chômage masculin (%)",
    methodologie: "Seuils naturels (Jenks)",
    logiciel: "Philcarto, Inkscape",
    messagePrincipal:
      "Le chômage masculin suit une distribution spatiale similaire au chômage général, avec une concentration dans les zones urbaines. Berrechid et Médiouna, en périphérie de Casablanca, présentent des taux intermédiaires liés à leur profil industriel en mutation.",
    imageFilename: "Taux_chomage_Hommes_pct.jpg",
  },
  {
    key: "ecart_chomage_fh",
    titre: "Écart du taux de chômage Femmes / Hommes",
    categorie: "Emploi & Activité",
    source: "HCP — RGPH 2014",
    annee: "2014",
    typeRepresentation: "Carte choroplèthe (valeurs différentielles)",
    variables: "Écart en points de % entre chômage féminin et masculin",
    logiciel: "QGIS / Philcarto",
    messagePrincipal:
      "L'écart de chômage entre femmes et hommes dépasse 10 points dans plusieurs provinces. Cet écart est plus marqué en milieu urbain qu'en milieu rural, où le faible taux d'activité féminine masque en partie la réalité du sous-emploi.",
    imageFilename: "Ecart_FH_chomage.jpg",
  },
  {
    key: "taux_activite",
    titre: "Taux d'activité économique par province",
    categorie: "Emploi & Activité",
    source: "HCP — RGPH 2014",
    annee: "2014",
    typeRepresentation: "Carte choroplèthe",
    variables: "Taux d'activité de la population en âge de travailler (%)",
    methodologie: "Seuils naturels (Jenks)",
    logiciel: "QGIS",
    messagePrincipal:
      "Le taux d'activité est plus élevé dans les provinces industrielles (Berrechid, Mohammedia). Les zones rurales comme Sidi Bennour affichent des taux plus faibles, liés à la saisonnalité agricole et au faible taux d'activité féminine.",
    imageFilename: "Taux d'activité par province.jpg",
  },
  {
    key: "activite_genre",
    titre: "Taux d'activité économique Hommes / Femmes",
    categorie: "Emploi & Activité",
    source: "HCP — RGPH 2014",
    annee: "2014",
    typeRepresentation: "Carte comparative bipartite",
    variables: "Taux d'activité masculin · Taux d'activité féminin",
    logiciel: "QGIS / Philcarto",
    messagePrincipal:
      "L'écart d'activité entre hommes et femmes est particulièrement prononcé : le taux d'activité masculin dépasse 70% dans la plupart des provinces, tandis que le taux féminin reste inférieur à 25% dans les zones rurales, révélant une forte inégalité de genre dans l'emploi.",
    imageFilename: "Carte activité Hommes Femmes.jpg",
  },
  {
    key: "employes_repartition",
    titre: "Répartition des employés dans la région",
    categorie: "Emploi & Activité",
    source: "HCP — Annuaire statistique 2018",
    annee: "2015–2017",
    typeRepresentation: "Carte choroplèthe",
    variables: "Densité des employés (indice normalisé)",
    methodologie: "Seuils naturels (Jenks)",
    logiciel: "Philcarto, Inkscape",
    auteur: "El Afia Mohamed",
    messagePrincipal:
      "La densité d'employés est massivement concentrée dans la préfecture de Casablanca, qui totalise plus de 65% des employés régionaux. Berrechid et Mohammedia se démarquent comme pôles industriels secondaires avec une densité d'employés notable.",
    imageFilename: "employes.pdf",
  },

  // ─── ÉCONOMIE ──────────────────────────────────────────────────────────────
  {
    key: "etablissements_nb",
    titre: "Nombre d'établissements économiques par province",
    categorie: "Économie",
    source: "HCP — Annuaire statistique 2018",
    annee: "2015–2017",
    typeRepresentation: "Carte choroplèthe",
    variables: "Nombre d'établissements économiques",
    logiciel: "QGIS",
    messagePrincipal:
      "Plus de 60% des établissements économiques de la région sont concentrés dans la préfecture de Casablanca. Cette hyper-concentration crée des effets d'agglomération mais génère aussi d'importants déséquilibres territoriaux entre le centre métropolitain et la périphérie.",
    imageFilename: "Nombre d'établissements.jpg",
  },
  {
    key: "industrie_cercles",
    titre: "Établissements industriels et part de l'industrie",
    categorie: "Économie",
    source: "HCP — Annuaire statistique 2018",
    annee: "2015–2017",
    typeRepresentation: "Carte à cercles proportionnels (nombre d'établissements) + choroplèthe (% industrie)",
    variables: "Nombre total d'établissements (cercles) · Part du secteur industriel (couleur)",
    logiciel: "Philcarto, Inkscape",
    messagePrincipal:
      "Si Casablanca domine en nombre absolu d'établissements, Berrechid et Médiouna se distinguent par une part relative de l'industrie plus élevée, reflétant leur profil de zones industrielles périurbaines. Cette carte illustre la diversification économique progressive de la périphérie casablancaise.",
    imageFilename: "CerclesPropo[Nb_etab_total][pct_industrie]inscape.jpg",
  },
  {
    key: "economie_ca_industrie",
    titre: "Chiffre d'affaires et établissements industriels",
    categorie: "Économie",
    source: "HCP — Annuaire statistique 2018",
    annee: "2015–2017",
    typeRepresentation: "Carte choroplèthe + cercles proportionnels",
    variables: "Chiffre d'affaires (Mdh) · Nombre d'établissements industriels",
    methodologie: "Normalisation, seuils naturels (Jenks)",
    logiciel: "Philcarto, Inkscape",
    auteur: "El Afia Mohamed",
    messagePrincipal:
      "Casablanca génère un chiffre d'affaires industriel qui dépasse 172 milliards de dirhams, soit plus de 80% du total régional. L'écart avec les autres provinces est considérable, Mohammedia et Berrechid occupant une position secondaire grâce à leurs zones industrielles.",
    imageFilename: "economie.pdf",
  },

  // ─── TERRITOIRE & URBAIN ───────────────────────────────────────────────────
  {
    key: "huff_gravitation",
    titre: "Gravitation urbaine — Modèle de Huff",
    categorie: "Territoire & Urbain",
    theme: "Aires d'attraction des pôles urbains",
    source: "HCP — RGPH 2024",
    annee: "2024",
    typeRepresentation: "Carte de synthèse — plages de couleur par pôle dominant",
    variables: "Pôle dominant par province (modèle de Huff) · Indice d'attractivité Aj (cercles proportionnels)",
    methodologie: "Modèle de Huff : P(i→j) = [Aj^α / d_ij^β] / Σk [Ak^α / d_ik^β] · α=1, β=2 · Distances Haversine",
    logiciel: "Python (pandas, numpy) + QGIS 3.x",
    messagePrincipal:
      "Casablanca exerce une domination gravitationnelle écrasante : 6 provinces sur 9 lui sont rattachées, dont Sidi Bennour pourtant à 134 km. El Jadida (99,79%), Mohammedia (91,83%) et Settat (87,47%) maintiennent leur autonomie grâce à l'éloignement ou à leur masse économique propre.",
    imageFilename: "Carte_Huff_Gravitation.png",
  },
  {
    key: "typologie_provinces",
    titre: "Typologie des provinces de la région",
    categorie: "Territoire & Urbain",
    source: "HCP — RGPH 2014 + Annuaire statistique",
    annee: "2014–2017",
    typeRepresentation: "Carte choroplèthe typologique",
    variables: "Profil composite multi-critères (démographie, économie, urbanisation)",
    methodologie: "Classification ascendante hiérarchique (CAH)",
    logiciel: "QGIS / R",
    messagePrincipal:
      "La classification révèle trois profils dominants : la métropole (Casablanca), les pôles industriels périurbains (Berrechid, Mohammedia, Médiouna), et les provinces agro-rurales (Sidi Bennour, Settat, El Jadida). Cette structuration guide les priorités d'aménagement territorial de la région.",
    imageFilename: "Carte_Typologie_Provinces.png",
  },
  {
    key: "synthese",
    titre: "Carte de synthèse régionale",
    categorie: "Territoire & Urbain",
    source: "HCP — RGPH 2024 + Annuaires statistiques",
    annee: "2024",
    typeRepresentation: "Carte de synthèse multi-couches",
    variables: "Indicateurs démographiques, économiques et territoriaux combinés",
    logiciel: "QGIS + Inkscape",
    messagePrincipal:
      "Cette carte de synthèse combine les principales dimensions du territoire régional : structure urbaine, activité économique et organisation spatiale. Elle illustre les déséquilibres structurels entre le pôle métropolitain de Casablanca et les espaces périphériques de la région.",
    imageFilename: "mise en page  de carte de synthèse.png",
  },
  {
    key: "flux_liens_casa",
    titre: "Liens et flux de mobilité — Région Casablanca-Settat",
    categorie: "Territoire & Urbain",
    source: "HCP — RGPH 2024",
    annee: "2024",
    typeRepresentation: "Carte en oursins (flux orientés)",
    variables: "Intensité et direction des flux de mobilité entre provinces",
    logiciel: "QGIS / Python",
    messagePrincipal:
      "La carte en oursins révèle que Casablanca est le pôle attracteur dominant de tous les flux de mobilité régionaux. Les flux les plus intenses convergent depuis Berrechid, Médiouna et Nouaceur, soulignant le rôle structurant de la métropole dans l'organisation des déplacements pendulaires.",
    imageFilename: "Liens_oursins_Casa.png",
  },
  {
    key: "flux_mobilite_2024",
    titre: "Intensité de mobilité — Région Casablanca-Settat",
    categorie: "Territoire & Urbain",
    source: "HCP — RGPH 2024",
    annee: "2024",
    typeRepresentation: "Carte de flux et d'intensité de mobilité",
    variables: "Volume et intensité des flux de déplacement entre communes/provinces",
    logiciel: "QGIS / Python",
    messagePrincipal:
      "Les flux de mobilité inter-provinciaux se structurent autour de Casablanca, qui polarise l'essentiel des déplacements régionaux. L'axe Casablanca–Berrechid–Settat est le couloir de mobilité le plus actif, suivi de l'axe littoral Casablanca–Mohammedia.",
    imageFilename: "carte_flux_casablanca.pdf",
  },

  // ─── ACCIDENTS & MOBILITÉ ──────────────────────────────────────────────────
  {
    key: "accidents_total_semis",
    titre: "Répartition des accidents de la route — Semis de points",
    categorie: "Accidents & Mobilité",
    source: "HCP — Annuaire statistique 2018",
    annee: "2016",
    typeRepresentation: "Carte en densité de points (1 point = 50 accidents)",
    variables: "Nombre d'accidents par localisation",
    methodologie: "Seuils naturels (Jenks) · 1 point = 50 accidents",
    logiciel: "QGIS",
    auteur: "El Afia Mohamed",
    messagePrincipal:
      "La densité d'accidents est maximale dans l'agglomération de Casablanca et sur les axes routiers principaux (A1, A3, A5). Les zones rurales enregistrent moins d'accidents en nombre absolu mais des taux de gravité souvent plus élevés liés à la vitesse excessive.",
    imageFilename: "C1B_Semis_points_colores.jpg",
  },
  {
    key: "accidents_total_choro",
    titre: "Répartition des accidents de la route — Choroplèthe",
    categorie: "Accidents & Mobilité",
    source: "HCP — Annuaire statistique 2018",
    annee: "2016",
    typeRepresentation: "Carte choroplèthe",
    variables: "Part provinciale des accidents (%)",
    methodologie: "Seuils naturels (Jenks)",
    logiciel: "QGIS",
    auteur: "El Afia Mohamed",
    messagePrincipal:
      "Casablanca concentre plus de 40% des accidents de la région, suivie par Settat et El Jadida. Cette répartition reflète à la fois la densité du trafic et la longueur du réseau routier par province.",
    imageFilename: "total acd.pdf",
  },
  {
    key: "accidents_type_usager",
    titre: "Victimes d'accidents selon le type d'usager",
    categorie: "Accidents & Mobilité",
    source: "HCP — Annuaire statistique 2018",
    annee: "2016",
    typeRepresentation: "Carte à cercles proportionnels avec diagrammes en secteurs",
    variables: "Nombre de victimes (cercles) · Type d'usager (secteurs : piétons, véhicules légers, motos…)",
    logiciel: "QGIS",
    auteur: "El Afia Mohamed",
    messagePrincipal:
      "Les piétons et les deux-roues sont les usagers les plus vulnérables, représentant plus de 50% des victimes dans les zones urbaines. En milieu rural, les accidents de véhicules légers à haute vitesse dominent, avec une mortalité proportionnellement plus élevée.",
    imageFilename: "sln-type-usager-camembert.pdf",
  },

  // ─── ENVIRONNEMENT ─────────────────────────────────────────────────────────
  {
    key: "precipitation",
    titre: "Précipitations dans la région Casablanca-Settat",
    categorie: "Environnement",
    source: "Direction de la Météorologie Nationale (DMN)",
    annee: "Moyenne pluriannuelle",
    typeRepresentation: "Carte isohuète / choroplèthe",
    variables: "Précipitations annuelles moyennes (mm)",
    logiciel: "QGIS",
    messagePrincipal:
      "La région présente un gradient pluviométrique nord-sud : le littoral atlantique reçoit entre 350 et 500 mm/an grâce à l'influence océanique, tandis que les zones intérieures (Settat, Sidi Bennour) sont soumises à une semi-aridité avec moins de 300 mm/an. Ce gradient conditionne les pratiques agricoles et les ressources en eau.",
    imageFilename: "precipitation.pdf",
  },
];

export const CATEGORIES: Categorie[] = [
  "Démographie",
  "Social & Éducation",
  "Emploi & Activité",
  "Économie",
  "Territoire & Urbain",
  "Accidents & Mobilité",
  "Environnement",
];

export const CATEGORY_COLORS: Record<Categorie, string> = {
  "Démographie": "#3B82F6",
  "Social & Éducation": "#8B5CF6",
  "Emploi & Activité": "#F59E0B",
  "Économie": "#10B981",
  "Territoire & Urbain": "#EF4444",
  "Accidents & Mobilité": "#F97316",
  "Environnement": "#06B6D4",
};

export const CATEGORY_ICONS: Record<Categorie, string> = {
  "Démographie": "👥",
  "Social & Éducation": "🎓",
  "Emploi & Activité": "💼",
  "Économie": "📊",
  "Territoire & Urbain": "🏙️",
  "Accidents & Mobilité": "🚦",
  "Environnement": "🌍",
};
