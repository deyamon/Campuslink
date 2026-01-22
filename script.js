const students = [
  {
    id: 1,
    name: "Deyamon",
    branch: "CSE",
    year: "3rd Year",
    status: "Open to projects",
    skills: ["Web Dev", "Photography", "Guitar"],
    about: "Learning to build clean web experiences. Likes gradients, riffs, and rainy evenings.",
    link: "#",
    projects: [
      "Basic portfolio page using HTML/CSS",
      "Nature photo gallery",
    ],
  },
  {
    id: 2,
    name: "Aarav Singh",
    branch: "ECE",
    year: "2nd Year",
    status: "Looking for teammates",
    skills: ["C++", "DSA", "Problem Solving"],
    about: "Competitive programmer trying to touch the stars and not WA on test 3.",
    link: "#",
    projects: ["CP tracker CLI tool", "College event registration site"],
  },
  {
    id: 3,
    name: "Meera Nair",
    branch: "ME",
    year: "3rd Year",
    status: "Available for collabs",
    skills: ["CAD", "3D Modeling", "Thermodynamics"],
    about: "Loves designing things that don't fall apart on first use.",
    link: "#",
    projects: ["Mini-CNC design model", "3D-printed drone frame"],
  },
  {
    id: 4,
    name: "Rohan Das",
    branch: "CE",
    year: "4th Year",
    status: "Internship ready",
    skills: ["AutoCAD", "Site Planning", "Estimation"],
    about: "Believes strong foundations matter in both buildings and life.",
    link: "#",
    projects: ["Bridge model project", "Campus drainage redesign proposal"],
  },
];

const cardsContainer = document.getElementById("cardsContainer");
const searchInput = document.getElementById("searchInput");
const filterButtons = document.querySelectorAll(".filter-btn");
const modalOverlay = document.getElementById("modalOverlay");
const modalContent = document.getElementById("modalContent");
const modalClose = document.getElementById("modalClose");
const themeToggle = document.getElementById("themeToggle");

let activeBranch = "all";

function renderCards(list) {
  if (!list.length) {
    cardsContainer.innerHTML =
      `<p style="color: var(--muted); font-size: 0.9rem;">No profiles match your search. Try a different name or skill.</p>`;
    return;
  }

  cardsContainer.innerHTML = list
    .map((student) => {
      const initials = student.name
        .split(" ")
        .map((p) => p[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

      const skillsHtml = student.skills
        .map((skill) => `<span class="skill-pill">${skill}</span>`)
        .join("");

      return `
        <article class="card" data-id="${student.id}">
          <div class="card-header">
            <div class="avatar">${initials}</div>
            <div>
              <div class="card-name">${student.name}</div>
              <div class="card-meta">${student.branch} • ${student.year}</div>
              <div class="chip">${student.status}</div>
            </div>
          </div>
          <p class="card-about">${student.about}</p>
          <div class="skills">${skillsHtml}</div>
          <div class="card-footer">
            <button class="link-btn" data-view="${student.id}">View Profile</button>
            <span class="status-tag">CampusLink</span>
          </div>
        </article>
      `;
    })
    .join("");
}

function applyFilters() {
  const query = searchInput.value.trim().toLowerCase();

  const filtered = students.filter((student) => {
    const branchMatch =
      activeBranch === "all" || student.branch === activeBranch;
    const searchable =
      `${student.name} ${student.skills.join(" ")}`.toLowerCase();
    const searchMatch = searchable.includes(query);

    return branchMatch && searchMatch;
  });

  renderCards(filtered);
}

searchInput.addEventListener("input", () => {
  applyFilters();
});

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    activeBranch = btn.getAttribute("data-branch");
    applyFilters();
  });
});

cardsContainer.addEventListener("click", (e) => {
  const viewBtn = e.target.closest("[data-view]");
  if (!viewBtn) return;
  const id = Number(viewBtn.getAttribute("data-view"));
  const student = students.find((s) => s.id === id);
  if (!student) return;
  openModal(student);
});

function openModal(student) {
  const projectsHtml = (student.projects || [])
    .map((p) => `<li>${p}</li>`)
    .join("");

  modalContent.innerHTML = `
    <h2 style="margin-bottom: 0.25rem;">${student.name}</h2>
    <p style="font-size: 0.85rem; color: var(--muted); margin-bottom: 0.6rem;">
      ${student.branch} • ${student.year} • ${student.status}
    </p>
    <p style="font-size: 0.9rem; margin-bottom: 0.8rem;">
      ${student.about}
    </p>
    ${
      projectsHtml
        ? `<h3 style="font-size: 0.9rem; margin-bottom: 0.3rem;">Projects</h3>
           <ul style="font-size: 0.85rem; color: var(--muted); margin-left: 1rem; margin-bottom: 0.8rem;">
             ${projectsHtml}
           </ul>`
        : ""
    }
    <a href="${student.link}" style="font-size: 0.85rem; text-decoration: underline; color: var(--accent);">
      View external profile (placeholder)
    </a>
  `;
  modalOverlay.classList.remove("hidden");
}

modalClose.addEventListener("click", () => {
  modalOverlay.classList.add("hidden");
});

modalOverlay.addEventListener("click", (e) => {
  if (e.target === modalOverlay) {
    modalOverlay.classList.add("hidden");
  }
});

function loadTheme() {
  const stored = localStorage.getItem("campuslink-theme");
  if (stored === "light") {
    document.body.classList.add("light");
    themeToggle.textContent = "☀";
  } else {
    themeToggle.textContent = "☾";
  }
}

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light");
  const isLight = document.body.classList.contains("light");
  localStorage.setItem("campuslink-theme", isLight ? "light" : "dark");
  themeToggle.textContent = isLight ? "☀" : "☾";
});

loadTheme();
renderCards(students);
