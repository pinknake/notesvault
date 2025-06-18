let notes = [];
let userKey = "";

function generateKey(username) {
  const code = Math.random().toString(36).substring(2, 6);
  return `notes_${username}_${code}`;
}

function startVault() {
  const username = document.getElementById("username").value.trim();
  if (!username) return alert("Enter your name!");

  let savedKey = localStorage.getItem("user_key_" + username);
  if (!savedKey) {
    savedKey = generateKey(username);
    localStorage.setItem("user_key_" + username, savedKey);
  }

  userKey = savedKey;
  notes = JSON.parse(localStorage.getItem(userKey) || "[]");

  document.getElementById("login").style.display = "none";
  document.getElementById("vault").style.display = "block";
  document.getElementById("welcome").innerText = "Welcome, " + username;
  showNotes();
}

function addNote() {
  const note = document.getElementById("newNote").value.trim();
  if (!note) return;

  notes.push(note);
  localStorage.setItem(userKey, JSON.stringify(notes));
  document.getElementById("newNote").value = "";
  showNotes();
}

function showNotes() {
  const list = document.getElementById("notesList");
  list.innerHTML = "";
  notes.forEach((n, i) => {
    const li = document.createElement("li");
    li.textContent = n;
    li.onclick = () => {
      if (confirm("Delete this note?")) {
        notes.splice(i, 1);
        localStorage.setItem(userKey, JSON.stringify(notes));
        showNotes();
      }
    };
    list.appendChild(li);
  });
}

function filterNotes() {
  const term = document.getElementById("search").value.toLowerCase();
  const list = document.getElementById("notesList").children;
  for (let li of list) {
    li.style.display = li.textContent.toLowerCase().includes(term) ? "block" : "none";
  }
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



