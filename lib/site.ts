// Contenu de référence — anciennement Charte SphereWeb v2.0 (Août 2026),
// rebaptisé Kaylow Sphere. Source unique de vérité pour les textes,
// coordonnées et métadonnées.

export const site = {
  name: 'Kaylow Sphere',
  legalName: 'David ANTOINA',
  role: 'Développeur web et web mobile fullstack',
  baseline: 'Kaylow Sphere, le centre de gravité de votre projet web',
  // Domaine officiel (anciennement sphereweb-dev.com, avant ça sphere-web.com).
  url: 'https://kaylowsphere.com',
  email: 'david.antoina@kaylowsphere.com',
  /**
   * Téléphone affiché (pied de page, page Contact). Laisser vide pour le masquer.
   * `phone` = forme lisible (ex. '06 12 34 56 78'), `phoneHref` = forme internationale
   * pour le lien d'appel (ex. '+33612345678').
   */
  phone: '06 58 16 86 89',
  phoneHref: '+33658168689',
  location: 'Eure-et-Loir (28)',
  status: 'Micro-entrepreneur',
  siret: '10673178900017',
  vat: 'TVA non applicable, art. 293 B du CGI',
  // Durée de conservation des messages du formulaire de contact.
  contactRetention: '3 ans à compter du dernier échange',
  // Profils plateformes — liens à compléter quand disponibles (Charte §3.4).
  profiles: {
    malt: '',
    codeur: '',
  },
} as const;

/**
 * Partenaire affiché dans le pied de page.
 * Remplacer `logo` par le fichier définitif dans public/partners/.
 */
export const partner = {
  name: 'ARTNumérique',
  url: 'https://www.xn--artnumrique-gbb.fr',
  logo: '/partners/artnumerique.png',
  contactName: 'Renaud Vaillant',
  // Affichage en unicode, href en punycode pour la compatibilité des clients mail.
  email: 'renaud.vaillant@artnumérique.fr',
  emailHref: 'renaud.vaillant@xn--artnumrique-gbb.fr',
} as const;

export type ServiceKey = 'sites-vitrines' | 'applications-sur-mesure' | 'maintenance';

export interface Service {
  key: ServiceKey;
  title: string;
  short: string;
  description: string;
  points: string[];
  icon: 'window' | 'code' | 'shield';
}

export const services: Service[] = [
  {
    key: 'sites-vitrines',
    title: 'Sites vitrines',
    short:
      'Sites vitrines responsives et rapides, optimisés pour le référencement naturel dès la mise en ligne.',
    description:
      "Je conçois et développe des sites vitrines sur mesure : une présence en ligne claire, rapide à charger et pensée mobile d'abord. Le référencement naturel de base est intégré dès la livraison — titres, descriptions, structure des contenus et sitemap.",
    points: [
      'Design sur mesure, fidèle à votre identité',
      'Responsive, testé mobile en priorité',
      'Temps de chargement optimisés (images compressées, chargement différé)',
      'SEO de base : balises title/description, structure Hn, sitemap.xml',
      'Conformité RGPD (mentions légales, consentement)',
    ],
    icon: 'window',
  },
  {
    key: 'applications-sur-mesure',
    title: 'Applications web sur mesure',
    short:
      'Applications métier full-stack (React, Node.js/Express), du MVP jusqu’à la mise en production.',
    description:
      "Vous avez un besoin métier qu'aucun outil du marché ne couvre ? Je développe l'application de A à Z : cadrage, maquettes, développement front et back, mise en production. Je privilégie une première version utile rapidement (MVP), puis on itère.",
    points: [
      'Cadrage du besoin et priorisation des fonctionnalités',
      'Front-end React, back-end Node.js / Express',
      'Base de données et API sur mesure',
      'Livraison progressive : un MVP utilisable, puis des itérations',
      'Mise en production et accompagnement au démarrage',
    ],
    icon: 'code',
  },
  {
    key: 'maintenance',
    title: 'Maintenance & évolutions',
    short:
      'Suivi technique après la mise en ligne : corrections, mises à jour de sécurité, ajout de fonctionnalités.',
    description:
      'Un site ou une application, ça vit. Je reste disponible après la livraison pour corriger, mettre à jour et faire évoluer votre outil au rythme de votre activité — sans que vous ayez à devenir technique.',
    points: [
      'Corrections de bugs et ajustements',
      'Mises à jour de sécurité et de dépendances',
      'Ajout de nouvelles fonctionnalités',
      'Surveillance de la disponibilité et des performances',
      'Interlocuteur unique, réponses en français clair',
    ],
    icon: 'shield',
  },
];

export interface ProjectImage {
  /** Chemin depuis /public — déposer les fichiers dans public/portfolio/<slug>/. */
  src: string;
  alt: string;
  /** Dimensions réelles, à renseigner pour un visuel vertical (affiché en entier, sans recadrage). */
  width?: number;
  height?: number;
}

export interface Project {
  slug: string;
  name: string;
  tagline: string;
  stack: string[];
  type: string;
  year?: string;
  status?: 'en ligne' | 'en cours' | 'produit personnel';
  context: string;
  solution: string;
  highlights: string[];
  /** Lien public du projet (affiché s'il est renseigné). */
  url?: string;
  /**
   * Captures d'écran. Laisser vide tant qu'elles ne sont pas prêtes :
   * un visuel de remplacement s'affiche automatiquement.
   * Convention : public/portfolio/<slug>/01.png, 02.png, …
   */
  images?: ProjectImage[];
}

export const projects: Project[] = [
  {
    slug: 'trouve-ton-artisan',
    name: 'Trouve Ton Artisan (TTA)',
    tagline: "Plateforme d'annuaire d'artisans.",
    stack: ['React', 'Node.js', 'Express'],
    type: 'Plateforme / annuaire',
    status: 'en ligne',
    context:
      "Mettre en relation des particuliers et des artisans d'une région à travers un annuaire consultable et filtrable par métier et par secteur.",
    solution:
      'Application React côté public, API Node.js/Express côté serveur, avec fiches artisans détaillées, recherche multi-critères et formulaire de mise en relation.',
    highlights: [
      'Recherche et filtres par métier et par secteur géographique',
      'Fiches artisans détaillées',
      'Formulaire de contact vers l’artisan',
    ],
    // url: 'https://…',
    images: [
      {
        src: '/portfolio/trouve-ton-artisan/01.jpg',
        alt: "Page d'accueil de Trouve Ton Artisan : recherche, chiffres clés et artisans populaires",
      },
    ],
  },
  {
    slug: 'maintenance-ramonage-services',
    url: 'https://site-production-fdaa.up.railway.app/',
    name: 'Maintenance Ramonage Services',
    tagline: "Site vitrine d'un artisan ramoneur, avec prise de rendez-vous en ligne.",
    stack: ['Astro', 'TypeScript', 'Tailwind CSS', 'GSAP'],
    type: 'Site vitrine client',
    status: 'en cours',
    context:
      'Kévin, artisan ramoneur en Eure-et-Loir, intervient sur les poêles à granulés, poêles à bois, inserts et cheminées. Les trois quarts de sa clientèle ont plus de 60 ans : le site devait être avant tout lisible et simple à utiliser.',
    solution:
      'Site Astro pré-généré en HTML statique (très peu de JavaScript), avec une petite API Node pour les formulaires : demandes de devis et rendez-vous sont transmis à FacturePro. Texte en grand, boutons larges, téléphone toujours visible, aucun pop-up.',
    highlights: [
      'Pensé pour une clientèle senior : lisibilité, contraste, grandes zones cliquables',
      "Prise de rendez-vous en ligne pour le ramonage et l'entretien",
      'Formulaire de devis relié à FacturePro',
      "Zone d'intervention vérifiée par commune",
    ],
    images: [
      {
        src: '/portfolio/maintenance-ramonage-services/01.jpg',
        alt: "Page d'accueil du site Maintenance Ramonage Services",
      },
    ],
  },
  {
    slug: 'tpak',
    name: 'Touche Pas Au Klaxon (TPAK)',
    tagline: 'Application de covoiturage.',
    stack: ['PHP', 'MVC'],
    type: 'Application de covoiturage',
    context:
      'Proposer une application de covoiturage : publication de trajets, recherche par itinéraire et réservation de places.',
    solution:
      'Application développée en PHP suivant une architecture MVC : gestion des comptes, publication et recherche de trajets, réservation et historique.',
    highlights: [
      'Architecture MVC structurée',
      'Publication et recherche de trajets',
      'Gestion des réservations et de l’historique',
    ],
  },
  {
    slug: 'gdf',
    url: 'https://facturepro.kaylowsphere.com/',
    name: 'FacturePro',
    tagline:
      'SaaS gestion de devis et de facturation et de gestion financière pour freelances, PME et Grande Entreprise.',
    stack: ['TypeScript', 'Express', 'Sequelize'],
    type: 'SaaS de facturation',
    status: 'produit personnel',
    context:
      'Outil personnel devenu produit : aider les freelances à gérer devis, factures et suivi financier au même endroit, sans tableur.',
    solution:
      'Back-end TypeScript / Express avec Sequelize pour la persistance, génération de devis et factures, suivi des encaissements et tableau de bord financier.',
    highlights: [
      'Devis et factures conformes',
      'Suivi des encaissements et des impayés',
      'Tableau de bord financier',
      'Produit développé et maintenu en propre',
    ],
    images: [
      {
        src: '/portfolio/gdf/01.jpg',
        alt: "Page d'accueil de FacturePro : « Vos devis et factures, gérés simplement »",
      },
    ],
  },
  {
    slug: 'nexus',
    name: 'Nexus',
    tagline:
      'Application mobile d’histoires originales à lire et à écouter, avec un studio de création IA.',
    stack: ['React Native', 'Expo', 'Node.js', 'MongoDB'],
    type: 'Application mobile + studio IA',
    status: 'en cours',
    context:
      'Proposer des séries d’histoires originales (science-fiction, fantasy, romance, thriller…) à lire et à écouter sur mobile, sur le modèle d’Audible : de vrais chapitres, une narration audio et des illustrations. Derrière l’application, un studio permet de créer ces histoires avec l’aide de l’IA.',
    solution:
      'Monorepo TypeScript : application mobile React Native / Expo, API Node.js / Express avec MongoDB, tableau de bord d’administration en React, et file de traitements IA (BullMQ, Redis) qui génère textes, images et voix pour chaque chapitre.',
    highlights: [
      'Lecteur d’histoires : texte, narration audio et illustrations',
      'Favoris, historique et reprise de lecture',
      'Monétisation par pièces et contenus premium',
      'Studio IA : bible de série, personnages, storyboard, voix et sous-titres',
    ],
    images: [
      {
        src: '/portfolio/nexus/01.jpg',
        width: 941,
        height: 1672,
        alt: 'Visuel de Nexus : logo et écran d’accueil de l’application sur téléphone',
      },
    ],
  },
];

export interface NavItem {
  label: string;
  to: string;
}

export const nav: NavItem[] = [
  // `label` = texte affiché (le header le met en minuscules).
  // `to`    = URL de la page — NE PAS toucher sauf si le dossier de `app/` est renommé.
  { label: 'Accueil', to: '/' },
  { label: 'Services', to: '/services' },
  { label: 'Tarifs', to: '/tarifs' },
  { label: 'Portfolio', to: '/portfolio' },
  { label: 'Audit gratuit', to: '/audit-gratuit' },
  { label: 'Blog', to: '/blog' },
  { label: 'À propos', to: '/a-propos' },
  { label: 'Contact', to: '/contact' },
];

/* ------------------------------------------------------------------ */
/* Tarifs (page /tarifs)                                               */
/* ------------------------------------------------------------------ */

export interface Offer {
  key: string;
  name: string;
  /** Montant affiché (bas de fourchette). `null` = sur devis. */
  price: number | null;
  /** Haut de fourchette : affiche « 500 – 900 € ». */
  priceMax?: number;
  /** Affiche « à partir de » devant le prix (sans haut de fourchette). */
  from?: boolean;
  /** Suffixe du prix (ex. « / mois »). */
  per?: string;
  pitch: string;
  includes: string[];
  delay?: string;
  highlight?: boolean;
}

/** Créations de sites — artisans, commerçants, indépendants. */
export const offers: Offer[] = [
  {
    key: 'essentiel',
    name: 'Essentiel',
    price: 500,
    priceMax: 900,
    pitch: 'Une page claire pour être trouvé sur Google et contacté en un clic.',
    includes: [
      "Site d'une page : présentation, prestations, zone d'intervention, horaires",
      "Adapté au mobile, bouton d'appel direct",
      'Formulaire de contact',
      'Référencement local de base + aide à la création de votre fiche Google',
      'Mentions légales et conformité RGPD',
      'Mise en ligne et 2 séries de retouches',
    ],
    delay: 'Environ 1 semaine',
  },
  {
    key: 'vitrine',
    name: 'Vitrine',
    price: 1000,
    priceMax: 1900,
    pitch: "Le site complet d'une petite entreprise, pensé pour vous ramener des clients.",
    includes: [
      "Jusqu'à 5 pages, design sur mesure à vos couleurs",
      'Galerie de réalisations ou de photos',
      'Formulaire de demande de devis',
      'Référencement local renforcé : une page par prestation, communes desservies',
      '1 h de prise en main pour gérer votre site',
      'Mise en ligne et 3 séries de retouches',
    ],
    delay: '2 à 3 semaines',
    highlight: true,
  },
  {
    key: 'vitrine-pro',
    name: 'Vitrine Pro',
    price: 2000,
    priceMax: 3500,
    pitch: 'Pour se démarquer : un site premium, animé, qui travaille pour vous.',
    includes: [
      "Jusqu'à 10 pages, design et animations premium",
      'Actualités ou blog',
      'Prise de rendez-vous en ligne ou devis détaillé',
      'Section avis clients et carte de votre zone',
      'Optimisation poussée de la vitesse',
      '1 mois de suivi inclus après la mise en ligne',
    ],
    delay: '3 à 5 semaines',
  },
  {
    key: 'sur-mesure',
    name: 'Application sur mesure',
    price: 3000,
    from: true,
    pitch: "Un outil métier qu'aucun logiciel du marché ne couvre.",
    includes: [
      'Espace client, réservation, gestion interne…',
      'Cadrage du besoin et maquettes',
      'Première version utile rapidement, puis évolutions',
      'Mise en production et accompagnement',
    ],
  },
];

/** Tarif solidaire — associations loi 1901. */
export const assoOffers: Offer[] = [
  {
    key: 'asso-essentielle',
    name: 'Asso Essentielle',
    price: 350,
    priceMax: 600,
    pitch: "Présenter l'association et recevoir adhésions et dons en ligne.",
    includes: [
      "Site d'une page : présentation, activités, agenda",
      "Boutons d'adhésion et de dons en ligne (HelloAsso)",
      'Formulaire de contact',
      'Mentions légales et RGPD',
      'Mise en ligne et 2 séries de retouches',
    ],
    delay: 'Environ 1 semaine',
  },
  {
    key: 'asso-complete',
    name: 'Asso Complète',
    price: 700,
    priceMax: 1200,
    pitch: "Faire vivre l'association en ligne et donner envie de la rejoindre.",
    includes: [
      "Jusqu'à 5 pages : actualités, agenda, galerie photos",
      "Adhésions, dons et billetterie d'événements (HelloAsso)",
      'Page partenaires et soutiens',
      '1 h de prise en main pour les bénévoles',
      'Mise en ligne et 3 séries de retouches',
    ],
    delay: '2 à 3 semaines',
    highlight: true,
  },
];

/** Suivi après la mise en ligne et prestations ponctuelles. */
export const extras: Offer[] = [
  {
    key: 'maintenance',
    name: 'Suivi Sérénité',
    price: 50,
    per: '/ mois',
    pitch: 'Votre site surveillé, à jour et sauvegardé, sans y penser.',
    includes: [
      'Hébergement et nom de domaine gérés pour vous',
      'Surveillance de la disponibilité',
      'Mises à jour de sécurité et sauvegardes',
      '1 h de modifications par mois',
      'Associations : 30 € / mois',
    ],
  },
  {
    key: 'refonte',
    name: 'Refonte',
    price: 800,
    priceMax: 2500,
    pitch: 'Votre site actuel entièrement repensé : plus moderne, plus rapide, adapté au mobile.',
    includes: [
      'Reprise de vos contenus',
      'Nouveau design',
      'Redirections pour garder votre référencement',
      'Prix selon le nombre de pages du site existant',
    ],
  },
  {
    key: 'optimisation',
    name: 'Optimisation',
    price: 150,
    priceMax: 600,
    pitch: "Vitesse, référencement, erreurs : votre site existant remis d'aplomb.",
    includes: ['Audit et rapport clair', 'Corrections prioritaires', 'Vitesse et SEO de base'],
  },
  {
    key: 'a-la-demande',
    name: 'À la demande',
    price: 35,
    per: '/ heure',
    pitch: 'Une modification ponctuelle, sans abonnement.',
    includes: ['Textes, photos, nouvelle section', 'Facturé au temps réel passé'],
  },
];

/** Ce qui place un projet en bas ou en haut de sa fourchette. */
export const priceFactors: { factor: string; low: string; high: string }[] = [
  { factor: 'Nombre de pages', low: 'Une page ou quelques pages', high: '10 pages et plus' },
  {
    factor: 'Design',
    low: 'Mise en page soignée à vos couleurs',
    high: 'Design entièrement sur mesure, animations',
  },
  {
    factor: 'Textes et photos',
    low: 'Vous fournissez vos textes et photos',
    high: 'Je rédige les textes, je sélectionne et retouche les visuels',
  },
  {
    factor: 'Fonctionnalités',
    low: 'Formulaire de contact, bouton d’appel',
    high: 'Rendez-vous en ligne, paiement, espace membres, multilingue',
  },
  {
    factor: 'Référencement',
    low: 'Bases : titres, descriptions, fiche Google',
    high: 'Une page par prestation et par commune desservie',
  },
  {
    factor: 'Existant',
    low: 'Site créé de zéro',
    high: 'Reprise d’un ancien site : contenus, redirections',
  },
  { factor: 'Délai', low: 'Planning standard', high: 'Mise en ligne urgente' },
];

export interface FaqItem {
  q: string;
  a: string;
}

export const pricingFaq: FaqItem[] = [
  {
    q: 'Pourquoi une fourchette de prix ?',
    a: 'Deux sites « vitrine » peuvent demander un travail très différent (nombre de pages, textes à rédiger, fonctionnalités…). La fourchette vous donne un ordre de grandeur honnête ; après un premier échange gratuit, je vous envoie un devis fixe qui ne bouge plus sans votre accord écrit.',
  },
  {
    q: "Qu'est-ce qui n'est pas compris dans le prix ?",
    a: "Le nom de domaine et l'hébergement, souscrits à votre nom pour que le site vous appartienne : comptez quelques euros par mois, je vous aide à choisir. Les photos professionnelles et la rédaction de textes longs peuvent être ajoutées en option.",
  },
  {
    q: 'Puis-je payer en plusieurs fois ?',
    a: 'Oui, en 2 ou 3 fois sans frais : un acompte au démarrage, le solde à la mise en ligne ou étalé sur les mois suivants.',
  },
  {
    q: 'Pourquoi les prix sont-ils sans TVA ?',
    a: 'Je suis micro-entrepreneur : TVA non applicable (article 293 B du CGI). Le prix affiché est donc le prix que vous payez.',
  },
  {
    q: "Je n'ai ni textes ni photos, comment faire ?",
    a: 'Je vous envoie une liste de questions simples pour rédiger ensemble vos textes, et je peux utiliser des photos libres de droits en attendant les vôtres.',
  },
  {
    q: "Le site m'appartient-il ?",
    a: 'Oui. Le nom de domaine est à votre nom et le site vous est entièrement remis à la livraison. Vous restez libre de changer de prestataire.',
  },
  {
    q: 'Comment fonctionnent les adhésions et les dons pour les associations ?',
    a: "J'intègre HelloAsso, une plateforme française gratuite pour les associations : aucun frais ni commission sur les paiements, elle se finance par les contributions volontaires des donateurs. Les fonds arrivent directement sur le compte de l'association.",
  },
  {
    q: 'Mon association peut-elle faire financer son site ?',
    a: "Certaines aides au fonctionnement des associations (FDVA, collectivités locales) peuvent couvrir une partie d'un projet. Je vous fournis un devis détaillé à joindre à votre dossier ; l'attribution reste à la décision du financeur.",
  },
];

/* ------------------------------------------------------------------ */
/* Avis clients                                                        */
/* ------------------------------------------------------------------ */

export interface Testimonial {
  /** Nom affiché, ex. « Camille D. » */
  name: string;
  /** Entreprise, association ou métier (facultatif). */
  role?: string;
  /** Note sur 5. */
  rating: 1 | 2 | 3 | 4 | 5;
  text: string;
  /** Mois de l'avis, ex. « octobre 2026 ». */
  date?: string;
}

/**
 * Avis publiés. Les avis déposés sur /avis arrivent par e-mail, avec un bloc
 * prêt à coller ici : n'ajouter que ceux que vous choisissez de publier.
 * Tant que la liste est vide, aucune section « Avis » ne s'affiche.
 */
export const testimonials: Testimonial[] = [];
