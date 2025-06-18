let userKey = "";
let notes = [];

function enterVault() {
  const username = document.getElementById("username").value.trim();
  if (!username) return alert("Please enter a name.");

  userKey = "vault_" + username.toLowerCase().replace(/\s+/g, "_");
  notes = JSON.parse(localStorage.getItem(userKey)) || [];
  document.getElementById("vault").style.display = "block";
  document.getElementById("userDisplay").innerText = username;
  showNotes();
}

function addNote() {
  const noteText = document.getElementById("noteInput").value.trim();
  if (!noteText) return;

  notes.push(noteText);
  localStorage.setItem(userKey, JSON.stringify(notes));
  document.getElementById("noteInput").value = "";
  showNotes();
}

function showNotes(filtered = null) {
  const noteList = document.getElementById("noteList");
  noteList.innerHTML = "";

  const displayNotes = filtered || notes;
  displayNotes.forEach((note, i) => {
    const li = document.createElement("li");
    li.textContent = note;
    li.onclick = () => deleteNote(i);
    noteList.appendChild(li);
  });
}

function deleteNote(index) {
  if (!confirm("Delete this note?")) return;
  notes.splice(index, 1);
  localStorage.setItem(userKey, JSON.stringify(notes));
  showNotes();
}

function searchNotes() {
  const q = document.getElementById("search").value.toLowerCase();
  const filtered = notes.filter(note => note.toLowerCase().includes(q));
  showNotes(filtered);
}

function exportNotes() {
  const dataStr = JSON.stringify(notes);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${userKey}_notes_backup.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function importNotes() {
  const file = document.getElementById("importFile").files[0];
  if (!file) return alert("No file selected");

  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const imported = JSON.parse(e.target.result);
      if (Array.isArray(imported)) {
        notes = imported;
        localStorage.setItem(userKey, JSON.stringify(notes));
        showNotes();
        alert("✅ Notes imported successfully!");
      } else {
        alert("❌ Invalid file format.");
      }
    } catch {
      alert("❌ Failed to import file.");
    }
  };
  reader.readAsText(file);
}
