import { Section } from '@/components/Section';
import { LegalDoc } from '@/components/LegalDoc';
import { site } from '@/lib/site';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Politique de confidentialité',
  description: `Comment sont traitées les données personnelles collectées sur ${site.url.replace('https://', '')}, conformément au RGPD.`,
  path: '/confidentialite',
  noindex: true,
});

export default function PrivacyPage() {
  return (
    <Section className="aura">
      <LegalDoc title="Politique de confidentialité" updated="Août 2026">
        <p>
          Cette politique décrit comment {site.legalName} («&nbsp;{site.name}&nbsp;») traite les
          données personnelles collectées sur {site.url}, conformément au Règlement général sur la
          protection des données (RGPD) et à la loi «&nbsp;Informatique et Libertés&nbsp;».
        </p>

        <h2>1. Responsable du traitement</h2>
        <p>
          {site.legalName} — {site.status} — {site.location}. Contact :{' '}
          <a href={`mailto:${site.email}`}>{site.email}</a>.
        </p>

        <h2>2. Données collectées via le formulaire de contact</h2>
        <ul>
          <li>Nom</li>
          <li>Adresse e-mail</li>
          <li>Type de projet et contenu du message</li>
          <li>Date et heure d&apos;envoi</li>
        </ul>
        <p>
          <strong>Finalité :</strong> répondre à votre demande et, le cas échéant, établir un devis.
          <br />
          <strong>Base légale :</strong> votre consentement (case à cocher) et l&apos;intérêt
          légitime à répondre à une sollicitation commerciale.
          <br />
          <strong>Durée de conservation :</strong> les messages sont conservés{' '}
          {site.contactRetention}, puis supprimés.
        </p>

        <h3>Avis clients (page « Laisser un avis »)</h3>
        <ul>
          <li>Nom, adresse e-mail, structure (facultative)</li>
          <li>Note et texte de l&apos;avis</li>
        </ul>
        <p>
          <strong>Finalité :</strong> publier, après relecture, les avis des clients sur ce site.
          Seuls le prénom, l&apos;initiale du nom, la structure, la note et le texte sont publiés ;
          l&apos;adresse e-mail ne l&apos;est jamais.
          <br />
          <strong>Base légale :</strong> votre consentement (case à cocher), retirable à tout moment
          sur simple demande par e-mail.
          <br />
          <strong>Durée de conservation :</strong> tant que l&apos;avis est publié ; les avis non
          publiés sont supprimés sous 1 an.
        </p>

        <h2>3. Destinataires</h2>
        <p>
          Les données sont adressées uniquement à {site.legalName}. Elles transitent par
          l&apos;hébergeur du site (Hostinger) et par le serveur SMTP de la boîte e-mail
          professionnelle. Aucune donnée n&apos;est vendue ni transmise à des fins publicitaires.
        </p>

        <h2>4. Cookies et mesure d&apos;audience</h2>
        <p>
          Ce site ne dépose <strong>aucun cookie</strong> et n&apos;utilise{' '}
          <strong>aucun outil de mesure d&apos;audience</strong> ni traceur publicitaire. Aucune
          bannière de consentement n&apos;est donc nécessaire.
        </p>
        <p>
          Si un outil de statistiques respectueux de la vie privée était ajouté à l&apos;avenir (par
          exemple Plausible ou Matomo, sans cookie et avec anonymisation des adresses IP), cette
          politique serait mise à jour en conséquence et, le cas échéant, votre consentement serait
          recueilli au préalable.
        </p>

        <h2>5. Vos droits</h2>
        <p>
          Vous disposez d&apos;un droit d&apos;accès, de rectification, d&apos;effacement, de
          limitation et d&apos;opposition, ainsi que du droit de retirer votre consentement à tout
          moment. Pour les exercer, écrivez à <a href={`mailto:${site.email}`}>{site.email}</a>.
        </p>
        <p>
          Vous pouvez également introduire une réclamation auprès de la CNIL —{' '}
          <a href="https://www.cnil.fr" target="_blank" rel="noreferrer">
            www.cnil.fr
          </a>
          .
        </p>

        <h2>6. Sécurité</h2>
        <p>
          Les échanges avec le site sont chiffrés (HTTPS). L&apos;accès aux messages reçus est
          protégé par authentification.
        </p>
      </LegalDoc>
    </Section>
  );
}
