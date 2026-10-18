// Pages métier « Site internet pour <métier> » (app/site-internet/[metier]).
// Comme pour les pages locales (lib/local.ts), chaque métier a un texte propre :
// des pages identiques au nom près seraient ignorées, voire pénalisées, par Google.
// Aucun prix ici : les prix ne figurent que sur la page Tarifs.

import type { FaqItem } from './site';

export interface Trade {
  slug: string;
  /** Nom court, ex. « Artisans du bâtiment ». */
  name: string;
  /** Complément du titre : « pour artisan du bâtiment ». */
  forWho: string;
  seoTitle: string;
  /** Accroche courte pour la page qui liste les métiers. */
  short: string;
  description: string;
  intro: string;
  /** Ce que les clients de ce métier cherchent avant d'appeler. */
  needs: string[];
  /** Ce que le site contient, adapté au métier. */
  features: { title: string; text: string }[];
  /** Réalisation du portfolio à montrer en exemple (slug), si pertinente. */
  example?: string;
  faq: FaqItem[];
}

const delayFaq: FaqItem = {
  q: 'En combien de temps mon site peut-il être en ligne ?',
  a: 'Environ une semaine pour un site d’une page, deux à trois semaines pour un site vitrine, à partir du moment où j’ai vos textes et vos photos. Je peux vous aider à les préparer.',
};

export const trades: Trade[] = [
  {
    slug: 'artisan-batiment',
    name: 'Artisans du bâtiment',
    forWho: 'pour artisan du bâtiment',
    seoTitle: 'Site internet pour artisan du bâtiment',
    short:
      'Maçon, plombier, électricien, menuisier, couvreur : vos chantiers en photos et des demandes de devis qualifiées.',
    description:
      'Création de site internet pour artisans du bâtiment (maçon, plombier, électricien, menuisier, couvreur…) en Eure-et-Loir : réalisations en photos, zone d’intervention, demandes de devis qualifiées.',
    intro:
      'Maçon, plombier, électricien, menuisier, couvreur, peintre : vos futurs clients vous cherchent sur Google et regardent vos chantiers avant de vous appeler. Un site clair montre votre savoir-faire et vous amène des demandes de devis plutôt que des appels pour comparer.',
    needs: [
      'Voir des chantiers réalisés, avant/après si possible.',
      'Savoir si vous intervenez dans leur commune.',
      'Vérifier vos qualifications et garanties (décennale, RGE, Qualibat…).',
      'Vous joindre facilement depuis leur téléphone, sur le chantier ou le soir.',
    ],
    features: [
      {
        title: 'Galerie de réalisations',
        text: 'Vos chantiers classés par type de travaux, des photos légères qui s’affichent vite même en 4G.',
      },
      {
        title: 'Zone d’intervention',
        text: 'Les communes que vous couvrez, écrites en clair : c’est aussi ce qui vous fait apparaître sur « votre métier + votre ville ».',
      },
      {
        title: 'Demande de devis guidée',
        text: 'Un formulaire qui demande le type de travaux, la commune et des photos : vous rappelez avec les bonnes infos.',
      },
      {
        title: 'Certifications mises en avant',
        text: 'Assurance décennale, labels et qualifications affichés là où le client les cherche, pour rassurer avant le premier appel.',
      },
    ],
    faq: [
      {
        q: 'Je n’ai pas de photos de mes chantiers, est-ce un problème ?',
        a: 'Non. On peut démarrer avec quelques photos prises au téléphone sur vos prochains chantiers ; je vous explique comment les cadrer. La galerie s’enrichit ensuite au fil du temps.',
      },
      {
        q: 'Mon site m’aidera-t-il à apparaître sur Google dans ma commune ?',
        a: 'Oui, c’est un des objectifs : chaque page est construite pour vos métiers et votre zone d’intervention, et je vous aide à relier le site à votre fiche Google.',
      },
      delayFaq,
    ],
  },
  {
    slug: 'ramoneur-chauffagiste',
    name: 'Ramoneurs et chauffagistes',
    forWho: 'pour ramoneur et chauffagiste',
    seoTitle: 'Site internet pour ramoneur et chauffagiste',
    short:
      'Ramonage, poêles, chaudières : la prise de rendez-vous en ligne avant le rush de l’hiver.',
    description:
      'Création de site internet pour ramoneurs et chauffagistes en Eure-et-Loir : prise de rendez-vous en ligne, prestations détaillées, certificat de ramonage, saison de chauffe anticipée.',
    intro:
      'Ramonage, débistrage, entretien de poêles et de chaudières : la demande arrive par vagues avant chaque hiver, et vos clients veulent un rendez-vous rapidement. Un site bien pensé prend les demandes à votre place et vous évite des dizaines d’appels.',
    needs: [
      'Réserver un créneau sans attendre que vous décrochiez.',
      'Savoir quelles installations vous traitez (cheminée, insert, poêle à bois ou à granulés, chaudière).',
      'Être sûrs d’obtenir le certificat de ramonage exigé par leur assurance.',
      'Vérifier que vous passez dans leur secteur.',
    ],
    features: [
      {
        title: 'Prise de rendez-vous en ligne',
        text: 'Le client choisit sa prestation et sa disponibilité ; vous recevez une demande complète, prête à confirmer.',
      },
      {
        title: 'Prestations expliquées simplement',
        text: 'Une page par type d’intervention, avec ce qui est compris : moins de questions au téléphone.',
      },
      {
        title: 'Rappels de saison',
        text: 'Des contenus qui remontent sur Google à l’approche de l’hiver, au moment où vos clients cherchent.',
      },
      {
        title: 'Avis et confiance',
        text: 'Vos avis Google et vos garanties mis en avant : on laisse entrer chez soi quelqu’un en qui on a confiance.',
      },
    ],
    example: 'maintenance-ramonage-services',
    faq: [
      {
        q: 'La prise de rendez-vous en ligne remplace-t-elle mon agenda ?',
        a: 'Elle s’adapte à votre façon de travailler : simple demande de créneau que vous confirmez, ou agenda synchronisé si vous en utilisez déjà un.',
      },
      {
        q: 'Puis-je mettre à jour mes disponibilités moi-même ?',
        a: 'Oui. Je vous montre comment faire, et le suivi technique est là si vous préférez me les confier.',
      },
      delayFaq,
    ],
  },
  {
    slug: 'commercant',
    name: 'Commerçants',
    forWho: 'pour commerçant',
    seoTitle: 'Site internet pour commerçant',
    short:
      'Boutique, restaurant, salon : horaires à jour, produits mis en valeur, réservation ou commande.',
    description:
      'Création de site internet pour commerçants en Eure-et-Loir (boutique, boulangerie, restaurant, salon de coiffure…) : horaires à jour, produits mis en valeur, itinéraire et réservation.',
    intro:
      'Boutique, boulangerie, restaurant, salon de coiffure, fleuriste : avant de se déplacer, vos clients vérifient vos horaires, regardent vos produits et cherchent l’itinéraire. Un site à jour leur donne envie de passer la porte, et vous démarque des grandes enseignes.',
    needs: [
      'Connaître vos horaires du jour, y compris les fermetures exceptionnelles.',
      'Voir vos produits, votre carte ou vos prestations avant de venir.',
      'Trouver comment venir et où se garer.',
      'Réserver, commander ou prendre rendez-vous sans téléphoner.',
    ],
    features: [
      {
        title: 'Horaires toujours justes',
        text: 'Horaires et fermetures exceptionnelles faciles à modifier, cohérents avec votre fiche Google.',
      },
      {
        title: 'Vitrine de vos produits',
        text: 'Votre carte, vos nouveautés ou vos prestations présentées avec de belles photos, lisibles sur téléphone.',
      },
      {
        title: 'Réservation ou commande',
        text: 'Selon votre activité : réservation de table, prise de rendez-vous, commande à retirer en boutique.',
      },
      {
        title: 'Accès et itinéraire',
        text: 'Plan, stationnement, accessibilité : tout ce qui lève les hésitations avant de se déplacer.',
      },
    ],
    faq: [
      {
        q: 'Ai-je besoin d’une boutique en ligne ?',
        a: 'Pas forcément. Pour beaucoup de commerces de proximité, un site vitrine avec réservation ou « commander et retirer » suffit et reste simple à gérer. On en parle selon votre activité.',
      },
      {
        q: 'Pourrai-je changer mes horaires ou ma carte moi-même ?',
        a: 'Oui, c’est prévu dès la conception : les informations qui changent souvent sont modifiables sans compétence technique.',
      },
      delayFaq,
    ],
  },
  {
    slug: 'association',
    name: 'Associations',
    forWho: 'pour association',
    seoTitle: 'Site internet pour association',
    short:
      'Activités, agenda, adhésions et dons en ligne avec HelloAsso, simple à transmettre au prochain bureau.',
    description:
      'Création de site internet pour associations en Eure-et-Loir : présentation des activités, agenda, adhésions et dons en ligne avec HelloAsso, espace pour les bénévoles.',
    intro:
      'Club sportif, association culturelle, comité des fêtes, association caritative : un site rassemble au même endroit vos activités, votre agenda et les infos pratiques. Il facilite les adhésions, rassure les partenaires et soulage les bénévoles qui répondent toujours aux mêmes questions.',
    needs: [
      'Découvrir vos activités, vos horaires et vos lieux.',
      'Adhérer, s’inscrire à un événement ou faire un don en quelques clics.',
      'Suivre l’agenda et les actualités de l’association.',
      'Contacter le bon responsable sans passer par un réseau social.',
    ],
    features: [
      {
        title: 'Adhésions et dons en ligne',
        text: 'Intégration de HelloAsso, gratuit pour les associations : paiements sécurisés, reçus automatiques.',
      },
      {
        title: 'Agenda et actualités',
        text: 'Événements, résultats, comptes rendus : publiés facilement par les membres du bureau.',
      },
      {
        title: 'Présentation claire',
        text: 'Vos activités, vos équipes et vos lieux, pour donner envie de vous rejoindre ou de vous soutenir.',
      },
      {
        title: 'Simple à transmettre',
        text: 'Un site que le prochain bureau pourra reprendre, avec un nom de domaine au nom de l’association.',
      },
    ],
    faq: [
      {
        q: 'Proposez-vous des conditions particulières pour les associations ?',
        a: 'Oui, un tarif solidaire dédié aux associations, détaillé sur la page Tarifs.',
      },
      {
        q: 'Plusieurs bénévoles pourront-ils mettre le site à jour ?',
        a: 'Oui. Je prévois des accès pour les membres du bureau et une courte prise en main, pour que le site ne repose pas sur une seule personne.',
      },
      delayFaq,
    ],
  },
];
