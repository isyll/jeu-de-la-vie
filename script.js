const _SIZE = 41;
const LIGNES = _SIZE;
const COLONNES = _SIZE;
const racine = document.getElementById("root");
const boutonAvancer = document.getElementById("run");
const selectMotifs = document.getElementById("motifs");
const boutonVider = document.getElementById("vider");

const motifs = [
  {
    nom: "pulsar",
    vivants: [
      {i:16, j:19}, {i:17, j:19}, {i:18, j:19}, {i:19, j:19}, {i:20, j:19},
      {i:16, j:23}, {i:17, j:23}, {i:18, j:23}, {i:19, j:23}, {i:20, j:23},
      {i:16, j:21}, {i:20, j:21}
    ],
  },
  {
    nom: "5 cellules",
    vivants: [
      {i:18, j:18}, {i:17, j:19}, {i:18, j:19}, {i:19, j:19}, {i:17, j:20}
    ],
  },
  {
    nom: "10 cellules en lignes",
    vivants: [
      {i:20, j:15}, {i:20, j:16}, {i:20, j:17}, {i:20, j:18}, {i:20, j:19},
      {i:20, j:20}, {i:20, j:21}, {i:20, j:22}, {i:20, j:23}, {i:20, j:24},
    ],
  },
];

const Grille = {
  htmlElement: null,
  contenu: [],

  generer: () => {
    Grille.contenu = [];
    for (let i = 0; i < LIGNES; i++) {
      const ligne = [];
      for (let j = 0; j < COLONNES; j++) ligne.push(false);
      Grille.contenu.push(ligne);
    }
    let html = '<div class="grille">';
    for (let i = 0; i < LIGNES; i++) {
      html += '<div class="ligne">';
      for (let j = 0; j < COLONNES; j++)
        html += `<div class="cellule ${Grille.contenu[i][j] ? "vivant" : "mort"}"></div>`;
      html += "</div>";
    }
    html += "</div>";
    Grille.htmlElement.innerHTML = html;
  },

  maj: () => {
    const cellules = document.querySelectorAll(".cellule");
    cellules.forEach((cellule, index) => {
      const i = Math.floor(index / COLONNES), j = index % COLONNES;
      if (Grille.contenu[i][j]) {
        cellule.classList.remove("mort");
        cellule.classList.add("vivant");
      } else {
        cellule.classList.remove("vivant");
        cellule.classList.add("mort");
      }
    });
  },

  voisinsEnVies: (ligne, col) => {
    return [
      ligne > 0 && col > 0 && Grille.contenu[ligne - 1][col - 1],
      ligne > 0 && Grille.contenu[ligne - 1][col],
      ligne > 0 && col < COLONNES - 1 && Grille.contenu[ligne - 1][col + 1],
      col > 0 && Grille.contenu[ligne][col - 1],
      col < COLONNES - 1 && Grille.contenu[ligne][col + 1],
      col > 0 && ligne < LIGNES - 1 && Grille.contenu[ligne + 1][col - 1],
      ligne < LIGNES - 1 && Grille.contenu[ligne + 1][col] ? 1 : 0,
      ligne < LIGNES - 1 && col < COLONNES - 1 && Grille.contenu[ligne + 1][col + 1],
    ]
      .map((val) => val ? 1 : 0)
      .reduce((acc, nb) => acc + nb, 0);
  },

  suivant: () => {
    const c = [];
    for (let i = 0; i < LIGNES; i++) {
      const k = [];
      for (let j = 0; j < COLONNES; j++) {
        let n = Grille.voisinsEnVies(i, j);
        if (Grille.contenu[i][j]) k.push(n == 3 || n == 2);
        else k.push(n == 3);
      }
      c.push(k);
    }
    Grille.contenu = c;
    Grille.maj();
  },

  updateCell: (val, index) => {
    const i = Math.floor(index / COLONNES), j = index % COLONNES;
    Grille.contenu[i][j] = val;
    Grille.maj();
  },

  getValue: (index) => {
    const i = Math.floor(index / COLONNES), j = index % COLONNES;
    return Grille.contenu[i][j];
  },

  remplir: (valeur) => {
    for (let i = 0; i < LIGNES; i++)
      for (let j = 0; j < COLONNES; j++) Grille.contenu[i][j] = valeur;
  },

  chargerMotif: (nom) => {
    const res = motifs.find((motif) => motif.nom === nom);
    if (res != undefined) {
      Grille.remplir(false);
      res.vivants.forEach((val) => (Grille.contenu[val.i][val.j] = true));
      Grille.maj();
    }
  },

  isVide: () => {
    for (let i = 0; i < LIGNES; i++)
      for (let j = 0; j < COLONNES; j++)
        if (Grille.contenu[i][j]) return false
    return true;
  }
};

function updateBtnVider() {
  if (Grille.isVide()) boutonVider.style.display = "none";
  else boutonVider.style.display = "block";
}

Grille.htmlElement = racine;
Grille.generer();

const cellules = document.querySelectorAll(".cellule");
let runInterval;

selectMotifs.innerHTML = '<option value=""> choisir</option>';
motifs.forEach((val) => selectMotifs.innerHTML += `<option value="${val.nom}">${val.nom}</option>`);

cellules.forEach((cellule, index) => {
  cellule.addEventListener("click", function () {
    if (Grille.getValue(index))
      Grille.updateCell(false, index);
    else Grille.updateCell(true, index);
    updateBtnVider();
  });
});

boutonAvancer.addEventListener("click", function () {
  clearInterval(runInterval);
  if (boutonAvancer.textContent == "Démarrer") {
    boutonAvancer.textContent = "Pause";
    runInterval = setInterval(Grille.suivant, 70);
  } else boutonAvancer.textContent = "Démarrer";
});

selectMotifs.addEventListener("change", function (event) {
  const value = event.target.value;
  if (value) Grille.chargerMotif(value);
  updateBtnVider();
});

boutonVider.addEventListener("click", function() {
  Grille.remplir(false);
  Grille.maj();
  boutonVider.style.display = "none";
});
