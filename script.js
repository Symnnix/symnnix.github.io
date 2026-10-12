/* Bewerbungs-Website David Hoffmann – Verhalten
   Zeigt immer genau einen Abschnitt an (wie eine Folie).
   Gesteuert wird über Tastatur, Buttons, Kacheln und den URL-Hash (z. B. #demo). */

// Sofort kennzeichnen, dass JavaScript läuft. Das CSS blendet dann alle Abschnitte
// bis auf den aktiven aus. Ohne JavaScript bleiben alle Abschnitte untereinander sichtbar.
document.documentElement.classList.add("js");

// Reihenfolge der Abschnitte – entspricht den IDs der <section>-Elemente im HTML
const ABSCHNITTE = [
  "start",            // 0: Übersicht
  "whoami",           // 1
  "warum_dual",       // 2
  "warum_informatik", // 3
  "demo",             // 4
  "warum_accenture",  // 5
  "warum_ich",        // 6
  "exit",             // 7: Abschluss
];

let aktuellerIndex = 0;     // Nummer des sichtbaren Abschnitts
const besucht = new Set();  // besuchte Abschnitte – nur im Arbeitsspeicher, nach Neuladen leer

// Animationen sind aus, wenn im Betriebssystem "weniger Bewegung" eingestellt ist. Taste A schaltet um.
let animationenAn = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Zustand der Tipp-Animation
let tippTimer = null;    // läuft gerade eine Animation?
let tippElement = null;  // der Befehl, der gerade getippt wird
let tippText = "";       // sein vollständiger Text

// Liest den Abschnitt aus dem URL-Hash, z. B. "#demo" → 4. Leer oder unbekannt → Startseite.
function indexAusHash() {
  const index = ABSCHNITTE.indexOf(location.hash.slice(1));
  return index === -1 ? 0 : index;
}

// Wechselt den Abschnitt, indem nur der Hash geändert wird. Der Browser speichert
// das im Verlauf – deshalb funktioniert die Zurück-Taste des Browsers.
function geheZu(index) {
  if (index < 0 || index >= ABSCHNITTE.length) return;  // vor dem Anfang / nach dem Ende: nichts tun
  location.hash = ABSCHNITTE[index];                     // löst das Ereignis "hashchange" aus
}

// Zeigt den Abschnitt mit dieser Nummer an und versteckt alle anderen
function zeigeAbschnitt(index) {
  aktuellerIndex = index;
  const id = ABSCHNITTE[index];

  for (const abschnitt of document.querySelectorAll(".folie")) {
    abschnitt.classList.toggle("aktiv", abschnitt.id === id);
  }

  // Haken auf der Startseite: besuchte Abschnitte bekommen "✓ ausgeführt"
  besucht.add(id);
  for (const kachel of document.querySelectorAll(".kachel")) {
    const ziel = kachel.getAttribute("href").slice(1);
    kachel.classList.toggle("besucht", besucht.has(ziel));
  }

  // Fortschritt unten rechts, z. B. "3 / 7" (auf der Startseite leer)
  const letzterIndex = ABSCHNITTE.length - 1;
  document.getElementById("fortschritt").textContent = index === 0 ? "" : index + " / " + letzterIndex;

  // Am Anfang gibt es kein "zurück", am Ende kein "weiter"
  document.getElementById("knopf-zurueck").disabled = index === 0;
  document.getElementById("knopf-weiter").disabled = index === letzterIndex;

  // Nach oben springen und den Fokus auf den neuen Abschnitt setzen (für Tastatur und Screenreader)
  window.scrollTo(0, 0);
  document.getElementById(id).focus({ preventScroll: true });

  tippeBefehl(document.getElementById(id));
}

// Tipp-Effekt: schreibt den Befehl oben im Abschnitt Zeichen für Zeichen – insgesamt höchstens 0,5 s
function tippeBefehl(abschnitt) {
  beendeTippen();
  const befehl = abschnitt.querySelector(".befehl");
  if (!animationenAn || !befehl) return;

  tippElement = befehl;
  tippText = befehl.textContent;
  const msProZeichen = Math.min(40, 450 / tippText.length);
  let anzahl = 0;

  befehl.textContent = "";
  befehl.classList.add("tippt");  // zeigt im CSS einen Cursor hinter dem Text
  tippTimer = setInterval(() => {
    anzahl++;
    befehl.textContent = tippText.slice(0, anzahl);
    if (anzahl >= tippText.length) beendeTippen();
  }, msProZeichen);
}

// Beendet eine laufende Tipp-Animation und zeigt sofort den ganzen Befehl
function beendeTippen() {
  if (!tippTimer) return;
  clearInterval(tippTimer);
  tippTimer = null;
  tippElement.textContent = tippText;
  tippElement.classList.remove("tippt");
}

// Taste F: Vollbild an/aus (Fullscreen-API des Browsers)
function schalteVollbild() {
  if (document.fullscreenElement) {
    document.exitFullscreen();
  } else if (document.documentElement.requestFullscreen) {
    document.documentElement.requestFullscreen().catch(() => {});  // falls der Browser ablehnt
  }
}

// Taste A: Animationen aus/an
function schalteAnimationen() {
  animationenAn = !animationenAn;
  beendeTippen();
}

// Tastatursteuerung – Bild ↑/↓ sind wichtig, weil Präsentations-Clicker diese Tasten senden
function beiTastendruck(ereignis) {
  // Jeder Tastendruck überspringt eine laufende Tipp-Animation
  beendeTippen();
  // Kombinationen mit Strg, Alt oder Cmd gehören dem Browser (z. B. Strg+F, Alt+←)
  if (ereignis.ctrlKey || ereignis.altKey || ereignis.metaKey) return;
  // Gedrückt gehaltene Taste: nur einmal reagieren
  if (ereignis.repeat) return;
  // Im Video steuern Leertaste und Pfeiltasten die Wiedergabe
  if (ereignis.target.closest("video")) return;
  // Leertaste/Enter auf einem Button oder Link lösen diesen ganz normal aus
  if ((ereignis.key === " " || ereignis.key === "Enter") && ereignis.target.closest("a, button")) return;

  switch (ereignis.key) {
    case "ArrowRight":
    case "PageDown":
    case " ":
      geheZu(aktuellerIndex + 1);
      break;
    case "ArrowLeft":
    case "PageUp":
      geheZu(aktuellerIndex - 1);
      break;
    case "Escape":
    case "Home":  // Pos1
    case "h":
    case "H":
      geheZu(0);
      break;
    case "f":
    case "F":
      schalteVollbild();
      break;
    case "a":
    case "A":
      schalteAnimationen();
      break;
    case "1":
    case "2":
    case "3":
    case "4":
    case "5":
    case "6":
      geheZu(Number(ereignis.key));
      break;
    default:
      return;  // alle anderen Tasten: normales Verhalten des Browsers
  }
  ereignis.preventDefault();  // verhindert z. B., dass die Leertaste die Seite scrollt
}

// Start, sobald das HTML vollständig geladen ist
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("knopf-zurueck").addEventListener("click", () => geheZu(aktuellerIndex - 1));
  document.getElementById("knopf-home").addEventListener("click", () => geheZu(0));
  document.getElementById("knopf-weiter").addEventListener("click", () => geheZu(aktuellerIndex + 1));

  document.addEventListener("keydown", beiTastendruck);
  // Vor dem Drucken eine laufende Tipp-Animation fertigstellen, damit im PDF der ganze Befehl steht
  window.addEventListener("beforeprint", beendeTippen);
  // Kachel-Klick, Browser-Zurück oder Tastendruck ändern den Hash → passenden Abschnitt zeigen
  window.addEventListener("hashchange", () => zeigeAbschnitt(indexAusHash()));

  zeigeAbschnitt(indexAusHash());
});
