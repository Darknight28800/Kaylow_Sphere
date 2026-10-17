"""
Questionnaires clients Kaylow Sphere — un PDF remplissable par formule.

Le client ouvre le PDF (Adobe Reader, Edge, Chrome, Aperçu…), répond dans les
champs, coche la check-list, enregistre et renvoie le fichier par e-mail.

Prérequis (une fois) :
    python -m pip install reportlab fonttools brotli

Génération :
    python scripts/questionnaires/generate.py
→ docs/questionnaires/Kaylow-Sphere_Questionnaire_<Formule>.pdf

Les questions sont dans questions.py (même dossier) : modifier là, relancer.
"""

from __future__ import annotations

import io
import math
import os
import random
import sys
import tempfile
from pathlib import Path

from fontTools.ttLib import TTFont as FTFont
from reportlab.lib.colors import Color, HexColor, white
from reportlab.lib.pagesizes import A4
from reportlab.lib.utils import simpleSplit
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas

sys.path.insert(0, str(Path(__file__).parent))
from questions import CONTACT, OFFERS  # noqa: E402

ROOT = Path(__file__).resolve().parents[2]
OUT_DIR = ROOT / 'docs' / 'questionnaires'
LOGO = ROOT / 'public' / 'logo-sphere.png'
FONT_DIR = ROOT / 'app' / 'fonts'

W, H = A4
M = 50  # marge latérale

# Charte Kaylow Sphere
NAVY = HexColor('#050B2B')
NAVY_2 = HexColor('#0A1238')
NAVY_3 = HexColor('#141D52')
BRAND = HexColor('#5B3DF6')
BRAND_LIGHT = HexColor('#7B62F8')
ACCENT = HexColor('#5B8CFF')
INK = HexColor('#1F2937')
MUTED = HexColor('#6B7280')
PAPER = HexColor('#F7F7FB')
LINE = HexColor('#DCDFEC')
FIELD_BG = HexColor('#FFFFFF')

# --------------------------------------------------------------------------
# Polices : les WOFF2 du site convertis en TTF (reportlab ne lit pas le WOFF2)
# --------------------------------------------------------------------------
FONTS = {
    'Poppins-Medium': 'poppins-latin-500-normal.woff2',
    'Poppins-SemiBold': 'poppins-latin-600-normal.woff2',
    'Poppins-Bold': 'poppins-latin-700-normal.woff2',
    'Inter': 'inter-latin-400-normal.woff2',
    'Inter-Medium': 'inter-latin-500-normal.woff2',
    'Inter-SemiBold': 'inter-latin-600-normal.woff2',
    'Mono': 'jetbrains-mono-latin-400-normal.woff2',
    'Mono-Medium': 'jetbrains-mono-latin-500-normal.woff2',
}


def register_fonts() -> None:
    tmp = Path(tempfile.mkdtemp(prefix='ks-fonts-'))
    for name, file in FONTS.items():
        f = FTFont(str(FONT_DIR / file))
        f.flavor = None
        ttf = tmp / f'{name}.ttf'
        f.save(str(ttf))
        pdfmetrics.registerFont(TTFont(name, str(ttf)))


# --------------------------------------------------------------------------
# Outils de dessin
# --------------------------------------------------------------------------
def wrap(text: str, font: str, size: float, width: float) -> list[str]:
    return simpleSplit(text, font, size, width)


def gradient_bar(c: canvas.Canvas, x: float, y: float, w: float, h: float) -> None:
    """Filet dégradé bleu électrique → violet."""
    c.saveState()
    p = c.beginPath()
    p.rect(x, y, w, h)
    c.clipPath(p, stroke=0, fill=0)
    c.linearGradient(x, y, x + w, y, (ACCENT, BRAND), extend=False)
    c.restoreState()


def starfield(c: canvas.Canvas, seed: int, n: int, x0=0, y0=0, x1=W, y1=H) -> None:
    rnd = random.Random(seed)
    c.saveState()
    for _ in range(n):
        x = rnd.uniform(x0, x1)
        y = rnd.uniform(y0, y1)
        r = rnd.choice([0.35, 0.45, 0.55, 0.7, 0.9, 1.2])
        a = rnd.uniform(0.25, 0.9)
        col = rnd.choice([white, white, HexColor('#C7D6FF'), HexColor('#B9A9FF')])
        c.setFillColor(col)
        c.setFillAlpha(a)
        c.circle(x, y, r, stroke=0, fill=1)
    c.restoreState()


def glow(c: canvas.Canvas, x: float, y: float, r: float, inner: Color) -> None:
    """Halo radial fondu dans le navy."""
    c.saveState()
    p = c.beginPath()
    p.circle(x, y, r)
    c.clipPath(p, stroke=0, fill=0)
    c.radialGradient(x, y, r, (inner, NAVY), extend=False)
    c.restoreState()


def accretion_disk(c: canvas.Canvas, cx: float, cy: float, rx: float, ry: float) -> None:
    """Disque d'accrétion stylisé : ellipses lumineuses autour d'un horizon noir."""
    c.saveState()
    rnd = random.Random(7)
    for i in range(46):
        t = i / 45
        col = ACCENT if t < 0.45 else BRAND_LIGHT
        c.setStrokeColor(col)
        c.setStrokeAlpha(0.05 + 0.22 * (1 - abs(t - 0.4)))
        c.setLineWidth(0.6 + rnd.random() * 1.4)
        k = 0.72 + t * 0.62
        c.ellipse(cx - rx * k, cy - ry * k, cx + rx * k, cy + ry * k, stroke=1, fill=0)
    # horizon
    c.setFillColor(HexColor('#01030C'))
    c.setFillAlpha(1)
    c.circle(cx, cy + ry * 0.15, ry * 1.55, stroke=0, fill=1)
    # anneau de photons
    c.setStrokeColor(HexColor('#AFC4FF'))
    c.setStrokeAlpha(0.85)
    c.setLineWidth(1.2)
    c.circle(cx, cy + ry * 0.15, ry * 1.58, stroke=1, fill=0)
    c.setStrokeColor(ACCENT)
    c.setStrokeAlpha(0.35)
    c.setLineWidth(4)
    c.circle(cx, cy + ry * 0.15, ry * 1.66, stroke=1, fill=0)
    # bande avant du disque, devant l'horizon
    for i in range(14):
        t = i / 13
        c.setStrokeColor(HexColor('#E4EAFF') if t < 0.3 else ACCENT)
        c.setStrokeAlpha(0.5 - 0.3 * t)
        c.setLineWidth(1.2)
        k = 0.98 + t * 0.12
        c.saveState()
        p = c.beginPath()
        p.rect(cx - rx * 2, cy - ry * 2, rx * 4, ry * 2.02)
        c.clipPath(p, stroke=0, fill=0)
        c.ellipse(cx - rx * k, cy - ry * 0.32 * k, cx + rx * k, cy + ry * 0.32 * k, stroke=1, fill=0)
        c.restoreState()
    c.restoreState()


def wordmark(c: canvas.Canvas, x: float, y: float, size: float, dark_bg: bool) -> None:
    logo = size * 1.9
    c.drawImage(str(LOGO), x, y - logo * 0.32, logo, logo, mask='auto')
    tx = x + logo + 6
    c.setFont('Poppins-SemiBold', size)
    c.setFillColor(white if dark_bg else NAVY)
    c.drawString(tx, y, 'Kaylow ')
    tw = pdfmetrics.stringWidth('Kaylow ', 'Poppins-SemiBold', size)
    c.setFillColor(ACCENT)
    c.drawString(tx + tw, y, 'Sphere')


def eyebrow(c: canvas.Canvas, x: float, y: float, text: str, color=ACCENT) -> None:
    c.saveState()
    gradient_bar(c, x, y + 3, 26, 0.8)
    c.setFont('Mono-Medium', 8)
    c.setFillColor(color)
    c.drawString(x + 34, y, text.upper())
    c.restoreState()


def spaced(c: canvas.Canvas, x: float, y: float, text: str, font: str, size: float, spacing: float):
    """Texte espacé (lettres) — t.setCharSpace."""
    # saveState/restoreState : sinon l'espacement s'applique à tout le texte suivant
    c.saveState()
    t = c.beginText(x, y)
    t.setFont(font, size)
    t.setCharSpace(spacing)
    t.textOut(text)
    c.drawText(t)
    c.restoreState()


# --------------------------------------------------------------------------
# Champs de formulaire
# --------------------------------------------------------------------------
FIELD_H = {'S': 24, 'M': 52, 'L': 86}


def text_field(c, name, x, y, w, h, tooltip, multiline, dark=False):
    """Fond arrondi dessiné + champ AcroForm légèrement en retrait."""
    c.saveState()
    if dark:
        c.setFillColor(NAVY_2)
        c.setStrokeColor(HexColor('#2B3A80'))
    else:
        c.setFillColor(FIELD_BG)
        c.setStrokeColor(LINE)
    c.setLineWidth(0.8)
    c.roundRect(x, y, w, h, 6, stroke=1, fill=1)
    c.restoreState()
    c.acroForm.textfield(
        name=name,
        tooltip=tooltip[:200],
        x=x + 3,
        y=y + 2,
        width=w - 6,
        height=h - 4,
        fontName='Helvetica',
        fontSize=10 if multiline else 10.5,
        borderWidth=0,
        borderColor=NAVY_2 if dark else FIELD_BG,
        fillColor=NAVY_2 if dark else FIELD_BG,
        textColor=white if dark else INK,
        forceBorder=False,
        fieldFlags='multiline' if multiline else '',
        maxlen=0 if multiline else 300,
    )


def check_field(c, name, x, y, size, tooltip):
    c.acroForm.checkbox(
        name=name,
        tooltip=tooltip[:200],
        x=x,
        y=y,
        size=size,
        buttonStyle='check',
        borderColor=BRAND,
        fillColor=FIELD_BG,
        textColor=BRAND,
        borderWidth=1,
        forceBorder=True,
    )


# --------------------------------------------------------------------------
# Pages
# --------------------------------------------------------------------------
class Doc:
    def __init__(self, path: Path, offer: dict):
        self.offer = offer
        self.c = canvas.Canvas(str(path), pagesize=A4)
        self.c.setTitle(f"Questionnaire — {offer['title']} — Kaylow Sphere")
        self.c.setAuthor('Kaylow Sphere — David ANTOINA')
        self.c.setSubject('Questionnaire de projet à remplir et à renvoyer')
        self.page_no = 0
        self.y = 0
        self.qn = 0

    # ---- couverture -------------------------------------------------------
    def cover(self):
        c, o = self.c, self.offer
        self.page_no += 1
        c.setFillColor(NAVY)
        c.rect(0, 0, W, H, stroke=0, fill=1)
        glow(c, W * 0.82, H * 0.82, 260, HexColor('#2A1F7A'))
        glow(c, W * 0.1, H * 0.12, 220, HexColor('#132C6E'))
        starfield(c, seed=len(o['slug']) * 31, n=260)
        accretion_disk(c, W * 0.72, H * 0.73, 150, 40)

        wordmark(c, M, H - 70, 15, dark_bg=True)
        c.setFont('Mono', 8)
        c.setFillColor(HexColor('#8A93B8'))
        c.drawRightString(W - M, H - 66, 'kaylowsphere.com')

        y = H * 0.53
        eyebrow(c, M, y, 'Questionnaire de projet')
        y -= 46
        c.setFillColor(white)
        c.setFont('Poppins-Bold', 38)
        for line in wrap(o['title'], 'Poppins-Bold', 38, W - 2 * M):
            c.drawString(M, y, line)
            y -= 42
        c.setFont('Mono-Medium', 11)
        c.setFillColor(ACCENT)
        c.drawString(M, y + 6, o['price'])
        y -= 18
        c.setFont('Inter', 11)
        c.setFillColor(HexColor('#C4CBE6'))
        for line in wrap(o['pitch'], 'Inter', 11, W - 2 * M - 40):
            c.drawString(M, y, line)
            y -= 16

        # Coordonnées du client
        y -= 18
        box_h = 132
        c.saveState()
        c.setFillColor(NAVY_2)
        c.setFillAlpha(0.88)
        c.setStrokeColor(HexColor('#24306A'))
        c.setLineWidth(0.8)
        c.roundRect(M, y - box_h, W - 2 * M, box_h, 12, stroke=1, fill=1)
        c.restoreState()
        c.setFont('Mono-Medium', 7.5)
        c.setFillColor(ACCENT)
        spaced(c, M + 18, y - 22, 'VOS COORDONNÉES', 'Mono-Medium', 7.5, 1.4)
        fw = (W - 2 * M - 18 * 2 - 14) / 2
        rows = [
            ('Nom et prénom', 'Entreprise ou association'),
            ('E-mail', 'Téléphone'),
        ]
        fy = y - 50
        for left, right in rows:
            for i, label in enumerate((left, right)):
                fx = M + 18 + i * (fw + 14)
                c.setFont('Inter-Medium', 8.5)
                c.setFillColor(HexColor('#B5BEDF'))
                c.drawString(fx, fy + 4, label)
                text_field(c, f'client_{label}', fx, fy - 26, fw, 22, label, False, dark=True)
            fy -= 46

        # Mode d'emploi
        y = 100
        steps = [
            ('1', 'Répondez', 'directement dans les cases, même en quelques mots.'),
            ('2', 'Enregistrez', 'le fichier (Fichier › Enregistrer ou Ctrl + S).'),
            ('3', 'Renvoyez-le', f"à {CONTACT['email']}"),
        ]
        sw = (W - 2 * M - 2 * 14) / 3
        for i, (n, head, txt) in enumerate(steps):
            sx = M + i * (sw + 14)
            c.saveState()
            c.setStrokeColor(HexColor('#24306A'))
            c.setLineWidth(0.8)
            c.line(sx, y + 22, sx + sw, y + 22)
            c.restoreState()
            c.setFont('Mono-Medium', 9)
            c.setFillColor(ACCENT)
            c.drawString(sx, y + 6, f'0{n}')
            c.setFont('Poppins-SemiBold', 10.5)
            c.setFillColor(white)
            c.drawString(sx + 22, y + 6, head)
            c.setFont('Inter', 8.5)
            c.setFillColor(HexColor('#AAB3D6'))
            ty = y - 10
            for line in wrap(txt, 'Inter', 8.5, sw):
                c.drawString(sx, ty, line)
                ty -= 12
        c.setFont('Inter', 8)
        c.setFillColor(HexColor('#7E88B0'))
        c.drawString(
            M,
            40,
            "Vous ne savez pas répondre à une question ? Laissez-la vide : on en parlera ensemble.",
        )
        c.showPage()

    # ---- pages intérieures -----------------------------------------------
    def new_page(self):
        c = self.c
        self.page_no += 1
        c.setFillColor(PAPER)
        c.rect(0, 0, W, H, stroke=0, fill=1)
        # bandeau
        c.setFillColor(NAVY)
        c.rect(0, H - 46, W, 46, stroke=0, fill=1)
        starfield(c, seed=self.page_no * 13, n=40, y0=H - 46, y1=H)
        gradient_bar(c, 0, H - 48, W, 2)
        wordmark(c, M, H - 29, 9.5, dark_bg=True)
        c.setFont('Mono', 7.5)
        c.setFillColor(HexColor('#9AA3C7'))
        c.drawRightString(W - M, H - 28, f"QUESTIONNAIRE · {self.offer['short'].upper()}")
        # pied
        c.setStrokeColor(LINE)
        c.setLineWidth(0.6)
        c.line(M, 40, W - M, 40)
        c.setFont('Mono', 7.5)
        c.setFillColor(MUTED)
        c.drawString(M, 27, f"kaylowsphere.com · {CONTACT['phone']}")
        c.drawRightString(W - M, 27, f'{self.page_no:02d}')
        self.y = H - 84

    def ensure(self, need: float):
        if self.y - need < 60:
            self.c.showPage()
            self.new_page()

    def section(self, number: int, title: str, intro: str | None):
        c = self.c
        need = 70 + (14 * len(wrap(intro, 'Inter', 9.5, W - 2 * M)) if intro else 0)
        self.ensure(need + 60)
        self.y -= 8
        c.setFont('Mono-Medium', 9)
        c.setFillColor(BRAND)
        c.drawString(M, self.y, f'{number:02d}')
        gradient_bar(c, M + 24, self.y + 3, 40, 1)
        self.y -= 26
        c.setFont('Poppins-SemiBold', 19)
        c.setFillColor(NAVY)
        c.drawString(M, self.y, title)
        self.y -= 16
        if intro:
            c.setFont('Inter', 9.5)
            c.setFillColor(MUTED)
            for line in wrap(intro, 'Inter', 9.5, W - 2 * M):
                c.drawString(M, self.y, line)
                self.y -= 13.5
        self.y -= 8

    def subsection(self, title: str):
        self.ensure(70)
        c = self.c
        self.y -= 6
        c.setFillColor(BRAND)
        spaced(c, M, self.y, title.upper(), 'Mono-Medium', 8, 1.2)
        self.y -= 14

    def question(self, text: str, size: str):
        c = self.c
        self.qn += 1
        lines = wrap(text, 'Inter-Medium', 9.6, W - 2 * M - 26)
        fh = FIELD_H[size]
        self.ensure(len(lines) * 13 + fh + 22)
        c.setFont('Mono', 7.5)
        c.setFillColor(ACCENT)
        c.drawString(M, self.y, f'{self.qn:02d}')
        c.setFont('Inter-Medium', 9.6)
        c.setFillColor(INK)
        for line in lines:
            c.drawString(M + 22, self.y, line)
            self.y -= 13
        self.y -= 3
        text_field(c, f'q{self.qn:02d}', M + 22, self.y - fh, W - 2 * M - 22, fh, text, size != 'S')
        self.y -= fh + 16

    def checklist(self, title: str, items: list[str]):
        self.section(self.sections_done + 1, title, 'Cochez au fur et à mesure. Fichiers à envoyer par e-mail ou lien de partage (WeTransfer, Google Drive…).')
        c = self.c
        for i, item in enumerate(items):
            lines = wrap(item, 'Inter', 9.6, W - 2 * M - 30)
            self.ensure(len(lines) * 13 + 14)
            check_field(c, f'check_{i:02d}', M, self.y - 4, 12, item)
            c.setFont('Inter', 9.6)
            c.setFillColor(INK)
            ty = self.y
            for line in lines:
                c.drawString(M + 22, ty, line)
                ty -= 13
            self.y = ty - 8

    def closing(self):
        """Carte de fin sombre : remarques libres + envoi."""
        c = self.c
        need = 230
        self.ensure(need)
        self.y -= 14
        top = self.y
        h = 210
        c.saveState()
        c.setFillColor(NAVY)
        c.roundRect(M, top - h, W - 2 * M, h, 14, stroke=0, fill=1)
        p = c.beginPath()
        p.roundRect(M, top - h, W - 2 * M, h, 14)
        c.clipPath(p, stroke=0, fill=0)
        glow(c, W - M - 40, top - 30, 160, HexColor('#2A1F7A'))
        starfield(c, seed=99, n=70, x0=M, y0=top - h, x1=W - M, y1=top)
        c.restoreState()
        gradient_bar(c, M + 24, top - 26, 26, 0.8)
        c.setFillColor(ACCENT)
        spaced(c, M + 58, top - 29, 'POUR FINIR', 'Mono-Medium', 7.5, 1.4)
        c.setFont('Poppins-SemiBold', 17)
        c.setFillColor(white)
        c.drawString(M + 24, top - 54, 'Une remarque, une idée, une question ?')
        text_field(c, 'remarques', M + 24, top - 128, W - 2 * M - 48, 60, 'Remarques libres', True, dark=True)
        c.setFont('Inter', 9.5)
        c.setFillColor(HexColor('#C4CBE6'))
        c.drawString(M + 24, top - 152, 'Merci ! Enregistrez ce fichier puis renvoyez-le à :')
        c.setFont('Poppins-SemiBold', 12)
        c.setFillColor(white)
        c.drawString(M + 24, top - 172, CONTACT['email'])
        c.setFont('Mono', 8.5)
        c.setFillColor(ACCENT)
        c.drawString(M + 24, top - 190, f"{CONTACT['phone']} · réponse sous 48 h ouvrées")
        self.y = top - h - 10

    # ---- assemblage --------------------------------------------------------
    def build(self):
        o = self.offer
        self.cover()
        self.new_page()
        self.sections_done = 0
        for sec in o['sections']:
            self.sections_done += 1
            self.section(self.sections_done, sec['title'], sec.get('intro'))
            for block in sec['blocks']:
                if block.get('title'):
                    self.subsection(block['title'])
                for q, size in block['questions']:
                    self.question(q, size)
        self.checklist('Les éléments à m’envoyer', o['checklist'])
        self.closing()
        self.c.showPage()
        self.c.save()


def main():
    register_fonts()
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    only = set(sys.argv[1:])
    for offer in OFFERS:
        if only and offer['slug'] not in only:
            continue
        path = OUT_DIR / f"Kaylow-Sphere_Questionnaire_{offer['file']}.pdf"
        Doc(path, offer).build()
        print(f'OK  {path.relative_to(ROOT)}')


if __name__ == '__main__':
    main()
