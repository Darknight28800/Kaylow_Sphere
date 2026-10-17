// Articles du blog (app/blog). Contenu structuré : un article = des sections
// (titre H2 + paragraphes et/ou liste). Liens internes au format markdown
// minimal [texte](/chemin), rendus par components/RichText.tsx.

export interface PostSection {
  h2: string;
  paragraphs?: string[];
  list?: string[];
}

export interface Post {
  slug: string;
  title: string;
  description: string;
  /** Date de publication, AAAA-MM-JJ. */
  date: string;
  readingMinutes: number;
  category: string;
  intro: string;
  sections: PostSection[];
  /** Sources consultées (affichées en fin d'article). */
  sources?: { label: string; url: string }[];
}

export const posts: Post[] = [
  {
    slug: 'prix-site-internet-artisan-2026',
    title: 'Combien coûte un site internet pour un artisan en 2026 ?',
    description:
      'Prix d’un site internet pour artisan ou petite entreprise en 2026 : fourchettes du marché, ce qui fait varier le prix, coûts annuels à prévoir et pièges à éviter.',
    date: '2026-10-17',
    readingMinutes: 6,
    category: 'Prix et budget',
    intro:
      'C’est la première question que se posent les artisans et commerçants : combien faut-il prévoir pour un site internet professionnel ? La réponse honnête est « ça dépend », mais on peut donner des repères précis.',
    sections: [
      {
        h2: 'Les prix du marché en 2026',
        paragraphs: [
          'Selon le baromètre 2026 de La Fabrique du Net, établi à partir de plus de 1 300 projets réels, le prix médian d’un site vitrine réalisé par une agence tourne autour de 3 500 à 3 800 €, la plupart des projets se situant entre 2 000 et 8 000 €.',
          'Un développeur freelance est en général moins cher qu’une agence pour un résultat comparable : il n’a pas de commerciaux ni de locaux à financer, et vous parlez directement à la personne qui construit votre site.',
        ],
      },
      {
        h2: 'Ce qui fait varier le prix',
        list: [
          'Le nombre de pages : une page unique bien construite suffit souvent pour démarrer ; un site de 10 pages demande plus de travail.',
          'Le design : une mise en page soignée à vos couleurs, ou un design entièrement sur mesure avec animations.',
          'Les textes et les photos : les fournir vous-même, ou les faire rédiger et retoucher.',
          'Les fonctionnalités : simple formulaire de contact, ou prise de rendez-vous, paiement en ligne, espace client.',
          'Le référencement : les bases, ou une page par prestation et par commune desservie.',
        ],
      },
      {
        h2: 'Les coûts annuels à ne pas oublier',
        paragraphs: [
          'Au prix de création s’ajoutent le nom de domaine (votre adresse, par exemple mon-entreprise.fr) et l’hébergement : comptez quelques euros par mois pour un site vitrine. Ils doivent être à votre nom, pour que le site vous appartienne.',
          'Un suivi technique (mises à jour, sauvegardes, petites modifications) est facultatif mais évite les mauvaises surprises. Il se facture en général au mois.',
        ],
      },
      {
        h2: 'Les pièges à éviter',
        list: [
          'Un nom de domaine enregistré au nom du prestataire : si vous vous séparez, vous perdez votre adresse.',
          'Un « site gratuit » financé par un abonnement sans fin, sans jamais être propriétaire de rien.',
          'Un devis flou, sans liste précise de ce qui est inclus.',
          'Un site magnifique sur ordinateur mais illisible sur téléphone, alors que la majorité de vos visiteurs arrivent par mobile.',
        ],
      },
      {
        h2: 'Mes tarifs, pour vous donner un repère',
        paragraphs: [
          'Pour les artisans, commerçants et associations d’Eure-et-Loir, je propose des formules de 500 à 900 € pour un site d’une page, et de 1 000 à 1 900 € pour un site vitrine complet, avec un paiement possible en 2 ou 3 fois. Le détail est sur la page [Tarifs](/tarifs).',
          'Vous avez déjà un site ? Commencez par un [audit gratuit](/audit-gratuit) : vous saurez ce qui mérite d’être amélioré avant de dépenser quoi que ce soit.',
        ],
      },
    ],
    sources: [
      {
        label: 'La Fabrique du Net — combien coûte un site vitrine',
        url: 'https://www.lafabriquedunet.fr/creation-site-vitrine/articles/combien-coute-creation-site-vitrine/',
      },
    ],
  },
  {
    slug: 'fiche-google-business-profile-artisan',
    title: 'Fiche Google : le guide pour artisans et commerçants',
    description:
      'Créer et optimiser sa fiche Google (Google Business Profile) quand on est artisan ou commerçant : les étapes, les informations à remplir et comment obtenir des avis.',
    date: '2026-10-17',
    readingMinutes: 5,
    category: 'Visibilité locale',
    intro:
      'Quand quelqu’un cherche « plombier Chartres » ou « boulangerie Bonneval », Google affiche d’abord une carte avec quelques entreprises. Pour y apparaître, il faut une fiche Google Business Profile. Elle est gratuite et c’est souvent la première chose à faire.',
    sections: [
      {
        h2: 'Créer sa fiche, étape par étape',
        list: [
          'Rendez-vous sur google.com/business avec un compte Google (idéalement celui de l’entreprise).',
          'Saisissez le nom exact de votre entreprise et choisissez la catégorie qui décrit le mieux votre métier.',
          'Indiquez votre adresse si vous recevez des clients, ou votre zone d’intervention si vous vous déplacez chez eux.',
          'Ajoutez votre téléphone et l’adresse de votre site internet.',
          'Validez la fiche : Google vous demande de prouver que vous êtes bien le gérant (selon les cas par vidéo, téléphone, e-mail ou courrier).',
        ],
      },
      {
        h2: 'Les informations qui font la différence',
        list: [
          'Des horaires à jour, y compris les jours fériés et les congés.',
          'Une description claire de vos prestations, avec les communes où vous intervenez.',
          'Des photos réelles : vous, votre équipe, vos réalisations, votre véhicule ou votre boutique.',
          'La liste de vos services, avec un prix indicatif si vous le souhaitez.',
        ],
      },
      {
        h2: 'Les avis : le nerf de la guerre',
        paragraphs: [
          'Les avis comptent énormément, pour Google comme pour vos futurs clients. Le plus simple est de les demander au bon moment : juste après un chantier réussi, avec le lien direct vers votre fiche par SMS ou e-mail.',
          'Répondez à tous les avis, y compris les négatifs, calmement et poliment : c’est souvent la réponse qui rassure le lecteur. N’achetez jamais de faux avis et n’en écrivez pas vous-même : c’est interdit et Google les supprime.',
        ],
      },
      {
        h2: 'Fiche Google et site internet : le bon duo',
        paragraphs: [
          'La fiche Google vous fait apparaître ; votre site convainc. Un visiteur qui hésite entre deux artisans clique presque toujours sur le site pour voir des réalisations et des tarifs.',
          'Je propose une aide à la création de votre fiche Google dans toutes mes [formules](/tarifs). Vous voulez savoir où vous en êtes ? Demandez un [audit gratuit](/audit-gratuit), qui inclut votre visibilité locale.',
        ],
      },
    ],
  },
  {
    slug: 'site-internet-ou-page-facebook',
    title: 'Site internet ou page Facebook : que choisir pour une petite entreprise ?',
    description:
      'Page Facebook ou site internet pour un artisan, un commerce ou une association : avantages, limites, et pourquoi les deux se complètent.',
    date: '2026-10-17',
    readingMinutes: 4,
    category: 'Stratégie',
    intro:
      'Beaucoup de petites entreprises démarrent avec une page Facebook : c’est gratuit et rapide. Est-ce suffisant ? Pas vraiment, et voici pourquoi.',
    sections: [
      {
        h2: 'Ce que Facebook fait bien',
        list: [
          'Publier rapidement des nouvelles, des photos de chantier, une promotion.',
          'Échanger avec une communauté qui vous suit déjà.',
          'Toucher le bouche-à-oreille local grâce aux partages.',
        ],
      },
      {
        h2: 'Ses limites',
        list: [
          'Vous n’êtes pas chez vous : la plateforme décide de ce qui est montré, et peut changer les règles du jour au lendemain.',
          'Une page Facebook ressort peu sur Google quand un client cherche votre métier dans sa ville.',
          'L’information est dispersée dans un fil de publications : difficile de trouver vos tarifs, vos horaires ou votre zone d’intervention.',
          'Une partie de votre clientèle n’utilise pas Facebook.',
        ],
      },
      {
        h2: 'Ce qu’apporte un site internet',
        list: [
          'Être trouvé sur Google par des gens qui ne vous connaissent pas encore.',
          'Présenter clairement vos prestations, vos réalisations et vos avis.',
          'Recevoir des demandes de devis structurées, avec toutes les informations utiles.',
          'Une image professionnelle qui rassure, et que vous contrôlez entièrement.',
        ],
      },
      {
        h2: 'La bonne réponse : les deux',
        paragraphs: [
          'Le site est votre vitrine permanente et votre point d’entrée sur Google ; Facebook (ou Instagram) sert à faire vivre votre activité au quotidien et à renvoyer vers le site.',
          'Pour démarrer avec un petit budget, un site d’une page bien référencé suffit souvent : voir la formule Essentiel sur la page [Tarifs](/tarifs).',
        ],
      },
    ],
  },
  {
    slug: 'site-internet-association',
    title: 'Site internet pour une association : ce qu’il faut vraiment',
    description:
      'Créer le site internet d’une association avec un petit budget : les pages utiles, les adhésions et dons en ligne avec HelloAsso, les mentions légales et le financement.',
    date: '2026-10-17',
    readingMinutes: 5,
    category: 'Associations',
    intro:
      'Une association n’a pas besoin d’un site compliqué. Elle a besoin d’être trouvée, de donner envie de la rejoindre, et de simplifier la vie des bénévoles. Voici l’essentiel.',
    sections: [
      {
        h2: 'Les pages vraiment utiles',
        list: [
          'Accueil : qui vous êtes et ce que vous faites, en une phrase.',
          'Activités : quoi, où, quand, pour qui, à quel tarif.',
          'Agenda : les prochains événements, tenus à jour.',
          'Adhérer et soutenir : adhésions, dons, bénévolat.',
          'Contact : un formulaire et les coordonnées du bureau.',
        ],
      },
      {
        h2: 'Adhésions, dons et billetterie en ligne',
        paragraphs: [
          'HelloAsso est une plateforme française qui permet aux associations de recevoir adhésions, dons et paiements de billetterie. Elle ne prend ni frais ni commission sur les paiements : elle se finance par des contributions volontaires proposées aux payeurs.',
          'Le site affiche des boutons qui mènent vers vos formulaires HelloAsso : les bénévoles n’ont plus à gérer de chèques ni de listes papier.',
        ],
      },
      {
        h2: 'Les obligations à ne pas oublier',
        list: [
          'Les mentions légales : nom de l’association, siège, téléphone, directeur de la publication (en général le président) et hébergeur.',
          'Une politique de confidentialité si vous collectez des données (formulaire, adhésions).',
          'L’accord des personnes reconnaissables sur les photos, et des parents pour les mineurs.',
        ],
      },
      {
        h2: 'Et le budget ?',
        paragraphs: [
          'Certaines aides au fonctionnement des associations (FDVA, collectivités locales) peuvent couvrir une partie d’un projet : un devis détaillé est alors utile pour constituer le dossier. L’attribution reste à la décision du financeur.',
          'Je propose un [tarif solidaire pour les associations](/tarifs#associations), à partir de 350 €, avec HelloAsso intégré.',
        ],
      },
    ],
    sources: [{ label: 'HelloAsso', url: 'https://www.helloasso.com' }],
  },
  {
    slug: 'mentions-legales-site-artisan',
    title: 'Mentions légales : ce que doit afficher le site d’un artisan',
    description:
      'Les mentions légales obligatoires sur le site internet d’un artisan, commerçant ou micro-entrepreneur, la politique de confidentialité, les cookies et les sanctions encourues.',
    date: '2026-10-17',
    readingMinutes: 5,
    category: 'Réglementation',
    intro:
      'Tout site professionnel doit afficher des mentions légales, même un site d’une seule page. Voici ce qu’elles doivent contenir, d’après la fiche officielle de service-public.fr.',
    sections: [
      {
        h2: 'Les mentions obligatoires',
        list: [
          'Votre identité : nom et prénom suivis de « EI » pour un entrepreneur individuel, ou dénomination, forme juridique et capital pour une société.',
          'Votre adresse, votre e-mail et votre téléphone.',
          'Votre numéro d’immatriculation : RNE pour un artisan, RCS et/ou RNE pour un commerçant.',
          'Votre numéro de TVA si vous y êtes assujetti.',
          'Le directeur de la publication et les coordonnées de l’hébergeur du site.',
        ],
      },
      {
        h2: 'Données personnelles et cookies',
        paragraphs: [
          'Dès qu’un formulaire collecte des informations, une politique de confidentialité doit expliquer ce qui est collecté, pourquoi, combien de temps et comment exercer ses droits. Elle doit être accessible depuis toutes les pages.',
          'Les cookies publicitaires ou les contenus tiers (vidéos, cartes) demandent un consentement préalable : refuser doit être aussi simple qu’accepter.',
        ],
      },
      {
        h2: 'Si vous travaillez avec des particuliers',
        paragraphs: [
          'Tout professionnel qui vend à des consommateurs doit leur permettre de recourir gratuitement à un médiateur de la consommation et en afficher les coordonnées, notamment sur son site.',
        ],
      },
      {
        h2: 'Les sanctions',
        paragraphs: [
          'L’absence de mentions légales peut coûter jusqu’à 75 000 € pour un entrepreneur individuel et 375 000 € pour une société. Des contrôles existent, et un site incomplet donne surtout une image peu sérieuse.',
          'Tous les sites que je réalise sont livrés avec leurs mentions légales et leur politique de confidentialité. Vous doutez de votre site actuel ? L’[audit gratuit](/audit-gratuit) vérifie aussi ce point.',
        ],
      },
    ],
    sources: [
      {
        label: 'Service-public — mentions obligatoires sur le site internet d’une entreprise',
        url: 'https://entreprendre.service-public.gouv.fr/vosdroits/F37351',
      },
      {
        label: 'CNIL — cookies et traceurs : que dit la loi ?',
        url: 'https://www.cnil.fr/fr/cookies-et-autres-traceurs/regles/cookies/que-dit-la-loi',
      },
    ],
  },
];
