# Bewerbungs-Website David Hoffmann

Meine Selbstpräsentation für die Bewerbung zum dualen Studium Informatik mit
Vertiefung Cyber Security – im Stil eines Terminals. Jeder Abschnitt ist ein
„Befehl“ (`whoami`, `./warum_dual`, `./demo` …) und wird wie eine Folie angezeigt.

Live: <https://symnnix.github.io>

## Wie die Seite gebaut ist

- Reines HTML, CSS und JavaScript, erstellt mit [Claude Code](https://claude.com/claude-code).
- Kein Framework, kein Build-Schritt, keine externen Schriften, keine CDNs,
  kein Tracking, keine Cookies.

| Datei | Aufgabe |
| --- | --- |
| `index.html` | Inhalt: alle Abschnitte als `<section>` |
| `style.css` | Aussehen: Farben als CSS-Variablen, Layout, Handy-Ansicht, Druckversion |
| `script.js` | Verhalten: zeigt immer genau einen Abschnitt, Tastatursteuerung, Tipp-Animation |
| `assets/favicon.svg` | Symbol im Browser-Tab |

## Bedienung

| Aktion | Tasten / Bedienung |
| --- | --- |
| Nächster Abschnitt | `→`, `Bild ↓`, `Leertaste`, Button „weiter“ |
| Vorheriger Abschnitt | `←`, `Bild ↑`, Button „zurück“ |
| Zur Startseite | `Esc`, `H`, `Pos1`, Button „home“ |
| Direkt zu Abschnitt 1–6 | Zifferntasten `1`–`6` oder Kachel auf der Startseite |
| Vollbild an/aus | `F` |
| Animationen aus/an | `A` |

- `Bild ↑`/`Bild ↓` senden auch Präsentations-Clicker.
- Im Vollbild beendet `Esc` zuerst das Vollbild (Verhalten des Browsers).
  Zur Startseite dann mit `H` oder `Pos1`.
- Der aktuelle Abschnitt steht in der Adresse (z. B. `#demo`). Deshalb
  funktioniert die Zurück-Taste des Browsers, und Abschnitte lassen sich direkt verlinken.
- Ohne JavaScript werden alle Abschnitte untereinander angezeigt.

## Lokal öffnen

`index.html` doppelklicken. Es wird kein Server benötigt.

## Sicherheit und Datenschutz

- **Content-Security-Policy** (als `<meta>`-Tag): Der Browser lädt nur Dateien
  dieser Seite selbst und führt keinen Inline-Code aus. Deshalb gibt es keine
  Inline-Skripte und keine Inline-Styles. Getestet auch lokal per Doppelklick
  (`file://`) in Microsoft Edge.
- Die Seite lädt nichts von Drittanbietern. Links zu GitHub öffnen sich in
  einem neuen Tab mit `rel="noopener noreferrer"`.
- `noindex`: Die Seite soll nicht in Suchmaschinen erscheinen.
- Keine Adresse, Telefonnummer, E-Mail-Adresse und kein Geburtsdatum auf der Seite.

## Druckversion

Chrome oder Edge → Drucken → „Als PDF speichern“, Option „Hintergrundgrafiken“
einschalten. Jeder Abschnitt wird eine Seite im Format 16:9 im dunklen Design.

## Veröffentlichung

Über GitHub Pages: Repository `symnnix.github.io`, Einstellungen →
Pages → „Deploy from a branch“ → Branch `main`, Ordner `/ (root)`.
