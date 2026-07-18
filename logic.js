// HTML-Elemente auswählen
const track = document.getElementById('sliderTrack');
const openModalBtn = document.getElementById('openModalBtn');
const closeModalBtn = document.getElementById('closeModalBtn');
const updateDialog = document.getElementById('updateDialog');
const updateForm = document.getElementById('updateForm');

// Absolute, korrekte Pfade ohne Variablen-Risiko
const REPO_API_URL = "https://github.com/IBimsHedebe/ALL-ABOUT-RC";
const FETCH_URL = "https://ibimshedebe.github.io/ALL-ABOUT-RC/";

let allUpdates = [];

// Funktion: Eine Update-Box im Slider anzeigen
function renderUpdate(date, title, content) {
  const newItem = document.createElement('div');
  newItem.classList.add('slider-item');
  newItem.innerHTML = `
    <span class="update-date" style="font-size: 0.85em; color: #666;">${date}</span>
    <h4 style="margin: 5px 0 10px 0;">${title}</h4>
    <p style="margin: 0; white-space: normal;">${content}</p>
  `;
  track.appendChild(newItem);
}

// DATEN BEIM START VON GITHUB LADEN
async function loadUpdatesFromGitHub() {
  try {
    // Cache-Busting (?t=...), um alte Browser-Zwischenspeicher zu umgehen
    const response = await fetch(`${FETCH_URL}?t=${new Date().getTime()}`);
    
    if (response.status === 404) {
      console.log("Datei existiert noch nicht auf GH Pages. Starte leer.");
      allUpdates = [];
      return;
    }
    
    if (!response.ok) throw new Error("Datei konnte nicht geladen werden");
    
    allUpdates = await response.json();
    track.innerHTML = "";
    allUpdates.forEach(up => renderUpdate(up.date, up.title, up.content));
  } catch (error) {
    console.error("Fehler beim Laden von GitHub:", error);
    track.innerHTML = "<p style='color:red;'>Updates konnten nicht geladen werden.</p>";
  }
}

// Automatischen Start ausführen
loadUpdatesFromGitHub();

// Modals öffnen/schließen
openModalBtn.addEventListener('click', () => {
  document.getElementById('inputDate').valueAsDate = new Date();
  updateDialog.showModal(); 
});
closeModalBtn.addEventListener('click', () => updateDialog.close());

// NEUES UPDATE HOCHLADEN
updateForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const token = prompt("Bitte gib deinen GitHub Personal Access Token (Classic) ein:");
  if (!token) return alert("Abgebrochen.");

  const dateValue = document.getElementById('inputDate').value;
  const titleValue = document.getElementById('inputTitle').value;
  const contentValue = document.getElementById('inputContent').value;

  const newUpdate = { date: dateValue, title: titleValue, content: contentValue };
  allUpdates.push(newUpdate);

  try {
    // 1. SHA-Schlüssel der existierenden Datei über die korrekte API-URL abrufen
    const fileInfoResponse = await fetch(REPO_API_URL, {
      headers: { "Authorization": `token ${token}` }
    });
    if (!fileInfoResponse.ok) throw new Error("Konnte Datei-Informationen von GitHub nicht abrufen.");
    const fileInfo = await fileInfoResponse.json();
    const sha = fileInfo.sha;

    // 2. Inhalt lesbar für GitHub in Base64 umwandeln
    const updatedContentBase64 = btoa(unescape(encodeURIComponent(JSON.stringify(allUpdates, null, 2))));

    // 3. Upload-Anfrage per PUT an die api.github.com senden
    const uploadResponse = await fetch(REPO_API_URL, {
      method: "PUT",
      headers: {
        "Authorization": `token ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: `Neues Update: ${titleValue}`,
        content: updatedContentBase64,
        sha: sha
      })
    });

    if (uploadResponse.ok) {
      alert("Erfolgreich auf GitHub gespeichert! Aktualisierung im Web-Standard dauert ca. 1-2 Minuten.");
      updateForm.reset();
      updateDialog.close();
      renderUpdate(dateValue, titleValue, contentValue);
    } else {
      throw new Error("Fehler beim Hochladen.");
    }

  } catch (error) {
    alert("Fehler: " + error.message);
    allUpdates.pop(); // Bei Fehlern das Element lokal zurücknehmen
  }
});
