"""
Contenu des questionnaires clients (une entrée de OFFERS = un PDF).
Taille du champ de réponse : 'S' une ligne, 'M' quelques lignes, 'L' un paragraphe.
"""

CONTACT = {
    'email': 'david.antoina@kaylowsphere.com',
    'phone': '06 58 16 86 89',
}

# --------------------------------------------------------------------------
# Blocs communs
# --------------------------------------------------------------------------
ACTIVITE = {
    'title': 'Vous et votre activité',
    'questions': [
        ("Nom de votre entreprise ou de votre structure, tel qu'il doit apparaître sur le site", 'S'),
        ('Votre activité en une phrase : que faites-vous, pour qui ?', 'M'),
        ('Depuis combien de temps exercez-vous ? Une qualification, un label, une assurance à mettre en avant ?', 'M'),
        ('Coordonnées à afficher : téléphone, e-mail, adresse (ou seulement la ville)', 'M'),
        ("Vos horaires et jours d'ouverture", 'S'),
        ("Votre zone d'intervention : communes, département, rayon en km", 'S'),
    ],
}

OBJECTIFS = {
    'title': 'Vos objectifs',
    'questions': [
        ('Pourquoi voulez-vous un site maintenant ? (être trouvé sur Google, rassurer, recevoir des demandes, remplacer un ancien site…)', 'M'),
        ("Qu'attendez-vous d'un visiteur ? (qu'il appelle, demande un devis, prenne rendez-vous, passe vous voir…)", 'M'),
        ("Comment vos clients vous trouvent-ils aujourd'hui ? (bouche-à-oreille, Google, Facebook, Pages Jaunes…)", 'M'),
        ('Dans un an, à quoi verrez-vous que le site a été utile ?', 'M'),
    ],
}

CLIENTS = {
    'title': 'Vos clients',
    'questions': [
        ('Qui sont vos clients ? (particuliers, entreprises, âge, situation…)', 'M'),
        ('Quelles questions vous posent-ils le plus souvent avant de vous choisir ?', 'M'),
        ("Qu'est-ce qui vous différencie de vos concurrents ?", 'M'),
        ('Des concurrents locaux dont le site vous plaît, ou vous déplaît ? (liens)', 'M'),
    ],
}

PUBLIC_ASSO = {
    'title': 'Votre public',
    'questions': [
        ("Qui voulez-vous toucher ? (futurs adhérents, familles, bénévoles, partenaires, mairie…)", 'M'),
        ("Quelles questions vous pose-t-on le plus souvent sur l'association ?", 'M'),
        ("Qu'est-ce qui rend votre association unique dans votre commune ou votre secteur ?", 'M'),
    ],
}

IMAGE = {
    'title': 'Votre image',
    'questions': [
        ('Avez-vous un logo ? Sous quel format ? (fichier, photo, carte de visite…)', 'S'),
        ('Avez-vous des couleurs à respecter ?', 'S'),
        ('Quelle impression voulez-vous donner ? 3 mots (ex. : sérieux, chaleureux, moderne, artisanal, haut de gamme, accessible)', 'S'),
        ("2 ou 3 sites que vous aimez, même hors de votre métier, et ce qui vous plaît dedans", 'M'),
        ('Ce que vous ne voulez surtout pas voir sur votre site', 'M'),
    ],
}

CONTENUS = {
    'title': 'Contenus',
    'questions': [
        ('Avez-vous déjà des textes de présentation ? (plaquette, flyer, ancien site, page Facebook)', 'M'),
        ('Avez-vous des photos de vous, de votre équipe, de vos réalisations, de vos locaux ? Combien environ ?', 'M'),
        ('Souhaitez-vous que je rédige les textes à partir de vos réponses ?', 'S'),
        ('Avez-vous des avis clients (Google, Facebook, messages) que l’on pourrait reprendre ?', 'M'),
        ('Êtes-vous présent sur les réseaux sociaux ou sur une fiche Google ? (liens)', 'M'),
    ],
}

DOMAINE = {
    'title': 'Nom de domaine et hébergement',
    'questions': [
        ('Avez-vous déjà un nom de domaine (ex. : mon-entreprise.fr) ? Chez qui ?', 'S'),
        ('Avez-vous une adresse e-mail professionnelle ? Souhaitez-vous en créer une ?', 'S'),
        ('Sinon, quel nom de domaine aimeriez-vous ? (2 ou 3 idées)', 'S'),
    ],
}

DELAIS = {
    'title': 'Délais et budget',
    'questions': [
        ('Avez-vous une date limite ? (ouverture, salon, saison, événement)', 'S'),
        ('Quel budget pouvez-vous y consacrer ? Une fourchette suffit.', 'S'),
        ('Préférez-vous payer en une fois, en 2 ou en 3 fois ?', 'S'),
        ('Qui validera les maquettes et les textes de votre côté ?', 'S'),
        ('Le meilleur moyen et le meilleur moment pour vous joindre', 'S'),
    ],
}


def commun(public=CLIENTS):
    return {
        'title': 'Faisons connaissance',
        'intro': 'Ces questions servent à toutes les formules. Pas besoin de phrases parfaites : des mots-clés suffisent.',
        'blocks': [ACTIVITE, OBJECTIFS, public, IMAGE, CONTENUS, DOMAINE, DELAIS],
    }


# --------------------------------------------------------------------------
# Blocs par formule
# --------------------------------------------------------------------------
ESSENTIEL = {
    'title': 'Votre site d’une page',
    'intro': "Tout tient sur une page : il faut aller à l'essentiel et choisir ce qui compte le plus.",
    'blocks': [{
        'questions': [
            ('Vos 3 à 6 prestations principales, de la plus demandée à la moins demandée', 'M'),
            ('Pour chacune, une phrase : en quoi elle consiste, pour qui', 'L'),
            ('Affichez-vous des prix ou des « à partir de » ? Lesquels ?', 'M'),
            ('Le message le plus important en haut de page (ex. : « Intervention sous 48 h », « Devis gratuit »)', 'S'),
            ('Quel bouton doit être le plus visible : appeler, demander un devis, envoyer un message ?', 'S'),
            ('Quelles informations le formulaire de contact doit-il demander ? (nom, téléphone, commune, type de demande…)', 'M'),
            ('À quelle adresse e-mail les demandes doivent-elles arriver ?', 'S'),
            ('Avez-vous une fiche Google (Google Business Profile) ? Sinon, voulez-vous que je vous aide à la créer ?', 'S'),
            ('Une ou deux photos fortes pour le haut de page (vous au travail, une réalisation, votre véhicule…)', 'M'),
        ],
    }],
}

VITRINE = {
    'title': 'Votre site vitrine',
    'intro': 'Ces questions servent à découper le site en pages et à bien vous référencer dans votre secteur.',
    'blocks': [{
        'questions': [
            ('Quelles pages imaginez-vous ? (ex. : Accueil, Prestations, Réalisations, À propos, Contact)', 'M'),
            ('Liste complète de vos prestations, regroupées par grandes familles', 'L'),
            ('Quelles prestations méritent leur propre page ? (celles qui rapportent le plus ou que vous voulez développer)', 'M'),
            ('Les communes ou secteurs où vous voulez être trouvé en priorité sur Google', 'M'),
            ('Avec quels mots vos clients vous cherchent-ils ? (ex. : « plombier Chartres », « dépannage chaudière »)', 'M'),
            ('Galerie : combien de réalisations montrer ? Avec un texte court pour chacune (lieu, travaux, durée) ?', 'M'),
            ('Page À propos : votre parcours, vos valeurs, votre équipe, une photo de vous ?', 'L'),
            ("Formulaire de devis : quelles informations vous faut-il pour chiffrer ? (type de travaux, surface, délai, photos…)", 'M'),
            ('Certifications, labels, partenaires ou assurances à afficher (RGE, Qualibat, décennale…)', 'M'),
            ('Qui modifiera le site après la livraison : vous, moi, une autre personne ? Pour changer quoi ?', 'M'),
        ],
    }],
}

VITRINE_PRO = {
    'title': 'Les fonctions avancées',
    'intro': 'Ces questions préparent la prise de rendez-vous, le blog, les avis et l’image premium du site.',
    'blocks': [
        {
            'title': 'Prise de rendez-vous ou devis détaillé',
            'questions': [
                ("Que doit-on pouvoir réserver ? (type d'intervention, durée de chacune)", 'M'),
                ('Vos créneaux disponibles, vos jours off, vos périodes de congés', 'M'),
                ('Utilisez-vous déjà un agenda (Google Agenda, Outlook, logiciel métier) ?', 'S'),
                ('Un rendez-vous doit-il être confirmé par vous, ou validé automatiquement ?', 'S'),
                ("Faut-il un délai minimum avant un rendez-vous, et un délai d'annulation ?", 'S'),
                ('Quels rappels envoyer au client ? (e-mail, SMS, la veille…)', 'S'),
            ],
        },
        {
            'title': 'Actualités ou blog',
            'questions': [
                ('Sur quels sujets voulez-vous publier ? (chantiers récents, conseils, nouveautés)', 'M'),
                ('À quel rythme pensez-vous pouvoir publier ? (1 par mois, par trimestre…)', 'S'),
                ('Qui écrira les articles : vous, moi à partir de vos notes ?', 'S'),
            ],
        },
        {
            'title': 'Avis, carte et image premium',
            'questions': [
                ("D'où viennent les avis à afficher ? (Google, Facebook, messages reçus)", 'S'),
                ('Faut-il une carte de votre zone ? Votre adresse exacte ou seulement la zone ?', 'S'),
                ('Avez-vous des vidéos ou des photos de qualité pro ? Faut-il prévoir un photographe ?', 'M'),
                ('Des animations vous font-elles envie, ou préférez-vous un site sobre ? (exemples bienvenus)', 'M'),
                ('Faut-il une version dans une autre langue ?', 'S'),
            ],
        },
    ],
}

SUR_MESURE = {
    'title': 'Votre application',
    'intro': "Ces questions cadrent le besoin avant le devis ; on les approfondira ensemble lors d'un rendez-vous.",
    'blocks': [
        {
            'title': 'Le problème à résoudre',
            'questions': [
                ("Quelle tâche voulez-vous simplifier ou automatiser ? Décrivez comment vous faites aujourd'hui, étape par étape", 'L'),
                ("Qu'est-ce qui vous fait perdre du temps ou de l'argent dans la façon actuelle ?", 'M'),
                ('Avez-vous essayé des logiciels existants ? Pourquoi ne conviennent-ils pas ?', 'M'),
                ("À quoi verrez-vous que l'application est réussie ? (temps gagné, erreurs évitées, chiffre d'affaires)", 'M'),
            ],
        },
        {
            'title': 'Les utilisateurs et les données',
            'questions': [
                ("Qui utilisera l'application ? (vous, vos salariés, vos clients) Combien de personnes ?", 'M'),
                ('Chacun a-t-il des droits différents ? (qui voit quoi, qui modifie quoi)', 'M'),
                ("Quelles informations l'application doit-elle gérer ? (clients, devis, stock, plannings, documents…)", 'L'),
                ('Ces données existent-elles déjà ? (fichier Excel, logiciel, papier) Faut-il les reprendre ?', 'M'),
                ("Doit-elle communiquer avec d'autres outils ? (comptabilité, paiement, agenda, e-mails)", 'M'),
                ('Sera-t-elle utilisée sur ordinateur, sur téléphone, sur le terrain sans connexion ?', 'S'),
            ],
        },
        {
            'title': 'Priorités',
            'questions': [
                ('Les 3 fonctions indispensables pour une première version utilisable', 'L'),
                ('Ce qui peut attendre une deuxième version', 'M'),
                ('Y a-t-il des contraintes légales ou de sécurité ? (données de santé, paiements, documents confidentiels)', 'M'),
            ],
        },
    ],
}

ASSOCIATION = {
    'title': 'Votre association',
    'intro': "À remplir de préférence avec le bureau de l'association.",
    'blocks': [
        {
            'title': "L'association",
            'questions': [
                ("Nom complet de l'association et numéro RNA (W…), si vous l'avez", 'S'),
                ("Objet de l'association en une ou deux phrases", 'M'),
                ("Nombre d'adhérents et de bénévoles, environ", 'S'),
                ('Les membres du bureau à présenter (président, trésorier…) et leur accord pour apparaître', 'M'),
                ("Qui sera l'interlocuteur pour le site, et qui validera ?", 'S'),
            ],
        },
        {
            'title': 'Activités et événements',
            'questions': [
                ('Vos activités régulières : quoi, où, quand, pour qui ?', 'L'),
                ("Vos événements de l'année (fêtes, lotos, tournois, sorties…) avec leurs dates habituelles", 'M'),
                ("Faut-il un agenda tenu à jour ? Qui m'enverra les nouvelles dates ?", 'S'),
                ("Avez-vous des photos d'activités ? Les personnes reconnaissables ont-elles donné leur accord (et les parents pour les mineurs) ?", 'M'),
            ],
        },
        {
            'title': 'Adhésions, dons et billetterie (HelloAsso)',
            'questions': [
                ("Avez-vous déjà un compte HelloAsso ? Sinon, qui pourra le créer au nom de l'association ?", 'S'),
                ("Montants d'adhésion (par personne, famille, tarif réduit) et période (année civile, saison)", 'M'),
                ('Souhaitez-vous recevoir des dons ? Pour un projet précis ?', 'M'),
                ('Événements avec billetterie en ligne : lesquels, combien de places, quels tarifs ?', 'M'),
                ('Votre association peut-elle délivrer des reçus fiscaux pour les dons ?', 'S'),
            ],
        },
        {
            'title': 'Partenaires et financement',
            'questions': [
                ('Partenaires, sponsors ou collectivités à remercier sur le site (avec leurs logos)', 'M'),
                ('Comptez-vous demander une subvention pour financer le site ? Pour quel dossier et quelle date limite ?', 'M'),
            ],
        },
    ],
}

REFONTE = {
    'title': 'Votre site actuel',
    'intro': 'Ces questions servent à reprendre votre site existant sans rien perdre de ce qui fonctionne.',
    'blocks': [{
        'questions': [
            ('Adresse de votre site actuel', 'S'),
            ("Qui l'a réalisé, et avec quel outil si vous le savez ? (WordPress, Wix, Jimdo, sur mesure…)", 'S'),
            ('Chez qui sont le nom de domaine et l’hébergement ? Avez-vous les identifiants ?', 'S'),
            ('Ce qui ne vous plaît plus : design, lenteur, difficulté à modifier, mauvais résultats sur Google, affichage sur téléphone…', 'M'),
            ('Ce qui fonctionne bien et qu’il faut garder', 'M'),
            ('Les pages et contenus à conserver, à supprimer, à ajouter', 'L'),
            ("Le site vous apporte-t-il des demandes aujourd'hui ? Combien par mois, environ ?", 'S'),
            ('Avez-vous accès à des statistiques de visite (Google Analytics, Search Console) ?', 'S'),
            ('Des adresses e-mail sont-elles liées au nom de domaine ? (elles ne doivent pas être coupées pendant la refonte)', 'M'),
            ('Pour une optimisation seule : quels problèmes avez-vous remarqués ? (lenteur, pages en erreur, mauvais classement)', 'M'),
        ],
    }],
}

SUIVI = {
    'title': 'Mise en place du suivi',
    'intro': 'Ces questions servent à prendre en main votre site et à organiser nos échanges.',
    'blocks': [{
        'questions': [
            ("Adresse du site à suivre, s'il n'a pas été réalisé par moi", 'S'),
            ("Accès à l'hébergement et au nom de domaine : pouvez-vous m'ajouter comme gestionnaire, ou me transmettre les accès ?", 'M'),
            ('Quelles modifications pensez-vous demander le plus souvent ? (horaires, photos, actualités, prix, promotions)', 'M'),
            ('À quelle fréquence environ ?', 'S'),
            ('Comment préférez-vous me transmettre vos demandes ? (e-mail, SMS, appel)', 'S'),
            ("Qui contacter en cas de panne ou d'urgence, et à quel numéro ?", 'S'),
            ('Souhaitez-vous un petit bilan mensuel (visites, mises à jour faites) ?', 'S'),
        ],
    }],
}

# --------------------------------------------------------------------------
# Check-lists
# --------------------------------------------------------------------------
CHECK_BASE = [
    "Votre logo, dans la meilleure qualité possible (le fichier d'origine si vous l'avez)",
    'Vos photos : vous, votre équipe, vos réalisations, vos locaux (les originaux, pas des captures de Facebook)',
    'Vos textes existants : plaquette, flyer, ancien site, carte de visite',
    "Vos coordonnées, horaires et zone d'intervention définitifs",
    'Votre numéro SIRET (pour les mentions légales)',
    "Vos certifications, labels et attestations d'assurance à afficher",
    'Les avis clients que vous souhaitez reprendre',
    'Les liens vers vos réseaux sociaux et votre fiche Google',
    'Les accès à votre nom de domaine et à votre hébergement actuels, si vous en avez',
]

CHECK_ASSO = [
    "Le logo de l'association, dans la meilleure qualité possible",
    "Des photos d'activités et d'événements (avec l'accord des personnes reconnaissables)",
    'Vos textes existants : plaquette, affiches, statuts (objet de l’association)',
    'Le numéro RNA et, si vous en avez un, le numéro SIRET',
    'Le calendrier des activités et des prochains événements',
    'Les logos des partenaires et soutiens à afficher',
    "L'accès au compte HelloAsso, ou la personne qui peut le créer",
    'Les accès à votre nom de domaine et à votre hébergement actuels, si vous en avez',
]

CHECK_SUR_MESURE = [
    'Des exemples de vos documents actuels (devis, fiches, tableaux Excel…)',
    'Des captures des logiciels que vous utilisez ou avez essayés',
    'La liste des futurs utilisateurs et de leurs rôles',
    'Votre logo et vos couleurs, si l’application doit les reprendre',
]

CHECK_REFONTE = [
    "Les accès à l'hébergement et au nom de domaine du site actuel",
    "Les accès à l'administration du site (WordPress, Wix…), si vous les avez",
    'Les accès aux statistiques (Google Analytics, Search Console), si vous en avez',
    'Votre logo et vos nouvelles photos, si vous en avez',
    'Les nouveaux textes ou corrections à apporter',
]

CHECK_SUIVI = [
    "Les accès à l'hébergement et au nom de domaine (ou mon ajout comme gestionnaire)",
    "Les accès à l'administration du site, s'il n'a pas été réalisé par moi",
    "Le contact à prévenir en cas d'urgence",
]

# --------------------------------------------------------------------------
# Formules (un PDF chacune)
# --------------------------------------------------------------------------
OFFERS = [
    {
        'slug': 'essentiel',
        'file': '1-Essentiel',
        'short': 'Essentiel',
        'title': 'Formule Essentiel',
        'price': '500 – 900 € · site d’une page',
        'pitch': 'Une page claire pour être trouvé sur Google et contacté en un clic.',
        'sections': [commun(), ESSENTIEL],
        'checklist': CHECK_BASE,
    },
    {
        'slug': 'vitrine',
        'file': '2-Vitrine',
        'short': 'Vitrine',
        'title': 'Formule Vitrine',
        'price': '1 000 – 1 900 € · jusqu’à 5 pages',
        'pitch': "Le site complet d'une petite entreprise, pensé pour vous ramener des clients.",
        'sections': [commun(), VITRINE],
        'checklist': CHECK_BASE,
    },
    {
        'slug': 'vitrine-pro',
        'file': '3-Vitrine-Pro',
        'short': 'Vitrine Pro',
        'title': 'Formule Vitrine Pro',
        'price': '2 000 – 3 500 € · jusqu’à 10 pages',
        'pitch': 'Pour se démarquer : un site premium, animé, qui travaille pour vous.',
        'sections': [commun(), VITRINE, VITRINE_PRO],
        'checklist': CHECK_BASE,
    },
    {
        'slug': 'sur-mesure',
        'file': '4-Application-sur-mesure',
        'short': 'Application sur mesure',
        'title': 'Application sur mesure',
        'price': 'À partir de 3 000 € · sur devis',
        'pitch': "Un outil métier qu'aucun logiciel du marché ne couvre.",
        'sections': [
            {
                'title': 'Faisons connaissance',
                'intro': 'Quelques questions sur vous avant de parler de l’application.',
                'blocks': [ACTIVITE, DELAIS],
            },
            SUR_MESURE,
        ],
        'checklist': CHECK_SUR_MESURE,
    },
    {
        'slug': 'associations',
        'file': '5-Associations',
        'short': 'Associations',
        'title': 'Associations',
        'price': 'Tarif solidaire · 350 – 600 € ou 700 – 1 200 €',
        'pitch': "Présenter l'association, annoncer vos événements, recevoir adhésions et dons en ligne.",
        'sections': [commun(PUBLIC_ASSO), ASSOCIATION],
        'checklist': CHECK_ASSO,
    },
    {
        'slug': 'refonte',
        'file': '6-Refonte-et-optimisation',
        'short': 'Refonte',
        'title': 'Refonte et optimisation',
        'price': 'Refonte 800 – 2 500 € · optimisation 150 – 600 €',
        'pitch': 'Votre site actuel repensé ou remis d’aplomb : plus moderne, plus rapide, mieux référencé.',
        'sections': [commun(), REFONTE],
        'checklist': CHECK_REFONTE,
    },
    {
        'slug': 'suivi',
        'file': '7-Suivi-Serenite',
        'short': 'Suivi Sérénité',
        'title': 'Suivi Sérénité',
        'price': '50 € / mois · associations 30 € / mois',
        'pitch': 'Votre site surveillé, à jour et sauvegardé, sans y penser.',
        'sections': [
            {
                'title': 'Faisons connaissance',
                'intro': 'Quelques informations pour vous identifier.',
                'blocks': [ACTIVITE],
            },
            SUIVI,
        ],
        'checklist': CHECK_SUIVI,
    },
]
