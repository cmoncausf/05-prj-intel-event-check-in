const form = document.getElementById("checkInForm");
const nameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");

let count = 0;
const maxCount = 50;

// Load counts from localStorage
function loadCounts() {
  const savedCount = localStorage.getItem("attendeeCount");
  if (savedCount !== null) {
    count = parseInt(savedCount);
  }
  const attendeeCount = document.getElementById("attendeeCount");
  attendeeCount.textContent = count;

  const waterCount = localStorage.getItem("waterCount");
  if (waterCount !== null) {
    document.getElementById("waterCount").textContent = waterCount;
  }
  const zeroCount = localStorage.getItem("zeroCount");
  if (zeroCount !== null) {
    document.getElementById("zeroCount").textContent = zeroCount;
  }
  const powerCount = localStorage.getItem("powerCount");
  if (powerCount !== null) {
    document.getElementById("powerCount").textContent = powerCount;
  }

  updateProgressBar();
}
function updateProgressBar() {
  const percentage = Math.round((count / maxCount) * 100);
  const progressBar = document.getElementById("progressBar");
  progressBar.style.width = `${percentage}%`;
  progressBar.textContent = `${percentage} %`;
}

// Load attendee list from localStorage
function loadAttendeeList() {
  const attendeeList = document.getElementById("attendeeList");
  attendeeList.innerHTML = "";
  const savedList = localStorage.getItem("attendeeList");
  if (savedList) {
    const attendees = JSON.parse(savedList);
    for (let i = 0; i < attendees.length; i++) {
      const card = document.createElement("div");
      card.style.border = "1px solid #ccc";
      card.style.borderRadius = "8px";
      card.style.padding = "8px";
      card.style.marginBottom = "8px";
      card.style.background = "#f9f9f9";
      card.style.display = "flex";
      card.style.alignItems = "center";
      card.style.gap = "10px";

      const emoji = document.createElement("span");
      emoji.textContent = "🧑‍💼";
      emoji.style.fontSize = "1.5em";

      const info = document.createElement("span");
      info.textContent = `${attendees[i].name} (${attendees[i].teamName})`;

      card.appendChild(emoji);
      card.appendChild(info);

      attendeeList.appendChild(card);
    }
  }
}

function saveCounts() {
  localStorage.setItem("attendeeCount", count);
  localStorage.setItem(
    "waterCount",
    document.getElementById("waterCount").textContent
  );
  localStorage.setItem(
    "zeroCount",
    document.getElementById("zeroCount").textContent
  );
  localStorage.setItem(
    "powerCount",
    document.getElementById("powerCount").textContent
  );
}

// Save attendee list to localStorage
function saveAttendeeList(attendees) {
  localStorage.setItem("attendeeList", JSON.stringify(attendees));
}

window.addEventListener("DOMContentLoaded", function () {
  loadCounts();
  loadAttendeeList();
});

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const name = nameInput.value;
  const team = teamSelect.value;
  const teamName = teamSelect.selectedOptions[0].text;

  // Only proceed if a team is selected and name is entered
  if (!name || !team) {
    return;
  }

  // Increment total attendance
  count = count + 1;

  // Update attendance number
  const attendeeCount = document.getElementById("attendeeCount");
  attendeeCount.textContent = count;

  updateProgressBar();

  // Update team counter
  const teamCounter = document.getElementById(team + "Count");
  teamCounter.textContent = parseInt(teamCounter.textContent) + 1;

  // Save counts to localStorage
  saveCounts();

  // Save attendee to list
  let attendees = [];
  const savedList = localStorage.getItem("attendeeList");
  if (savedList) {
    attendees = JSON.parse(savedList);
  }
  attendees.push({ name: name, teamName: teamName });
  saveAttendeeList(attendees);

  // Update attendee list on page
  loadAttendeeList();

  // Show greeting message
  const greeting = document.getElementById("greetingMessage");
  greeting.textContent = `🎉 Welcome, ${name} from ${teamName}!`;

  // Check if attendance goal is reached
  if (count >= maxCount) {
    greeting.textContent = "🎊 Attendance goal reached! 🎊";
    // Find the winning team
    const waterCount = parseInt(
      document.getElementById("waterCount").textContent
    );
    const zeroCount = parseInt(
      document.getElementById("zeroCount").textContent
    );
    const powerCount = parseInt(
      document.getElementById("powerCount").textContent
    );

    let maxTeam = "water";
    let maxValue = waterCount;
    if (zeroCount > maxValue) {
      maxTeam = "zero";
      maxValue = zeroCount;
    }
    if (powerCount > maxValue) {
      maxTeam = "power";
      maxValue = powerCount;
    }

    // Remove highlight from all teams
    document.getElementById("waterCount").parentElement.style.background = "";
    document.getElementById("zeroCount").parentElement.style.background = "";
    document.getElementById("powerCount").parentElement.style.background = "";

    // Highlight the winning team
    document.getElementById(maxTeam + "Count").parentElement.style.background =
      "#ffd700"; // gold
  }

  form.reset();
});
