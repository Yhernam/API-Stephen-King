document.addEventListener("DOMContentLoaded", () => {
    loadBooks();
    setupSearchListener();
});

function setupSearchListener() {
    let searchInput = document.getElementById("searchInput");
    searchInput.addEventListener("input", () => {
        let searchTerm = searchInput.value.trim().toLowerCase();
        filterBooks(searchTerm);
    });
}

function loadBooks() {
    fetch(`https://stephen-king-api.onrender.com/api/books`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then(data => {
            data.data.forEach((book, index) => {
                addBookToTable(book);
            });
        })
        .catch(error => {
            console.error("Erreur de récupération de donnée", error);
        });
}

async function addBookToTable(book) {
    let tableBody = document.querySelector("#booksTable tbody");
    let newRow = document.createElement("tr");

    let idshortCell = document.createElement("td");
    idshortCell.textContent = book.id;
    newRow.appendChild(idshortCell);

    let titreCell = document.createElement("td");
    titreCell.textContent = book.Title;
    newRow.appendChild(titreCell);

    let auteurCell = document.createElement("td");
    auteurCell.textContent = book.Publisher;
    newRow.appendChild(auteurCell);

    let dateCell = document.createElement("td");
    dateCell.textContent = book.Year;
    newRow.appendChild(dateCell);



    // Création de la cellule pour l'image
    let imagesCell = document.createElement("td");

    // Suppression des tiret de l'ISBN recupérer dans l'api

    let cleanedISBN = book.ISBN.replace(/\D/g, '');

    // Récupération de l'image depuis l'API Google Books
    fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${cleanedISBN}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur lors de la récupération des données depuis Google Books API');
            }
            return response.json();
        })
        .then(data => {
            let imageURL = data.items[0].volumeInfo.imageLinks.thumbnail;
            let imgElement = document.createElement('img');
            imgElement.src = imageURL;
            imgElement.width = 150;
            imgElement.height = 220;
            imagesCell.appendChild(imgElement);
        })
        .catch(error => {
            console.error('Erreur lors de la récupération des données depuis Google Books API', error);
            let imgElement = document.createElement('img');
            imgElement.src = 'assets/indisponible.jpg'; // Image de remplacement
            imgElement.alt = "Image non disponible";
            imgElement.width = 150; // Définir la largeur de l'image
            imgElement.height = 200; // Définir la hauteur de l'image
            imagesCell.appendChild(imgElement);
        });

    newRow.appendChild(imagesCell);

    // Récuperer les infos dont j'aurais besoins pour mes modals
    newRow.dataset.villains = book.villains ? book.villains.map(villain => villain.name).join(', ') : ''; // tableau donc utilisation de map
    newRow.dataset.notes = book.Notes || '';
    newRow.dataset.pages = book.Pages || '';

    tableBody.appendChild(newRow);
}

function filterBooks(searchTerm) {
    let allRows = document.querySelectorAll("#booksTable tbody tr");
    let resultsFound = false; // Variable pour suivre si des résultats ont été trouvés

    allRows.forEach(row => {
        let title = row.querySelector("td:nth-child(2)").textContent.toLowerCase();
        let id = row.querySelector("td:nth-child(1)").textContent.toLowerCase();

        if (title.includes(searchTerm.toLowerCase()) || id.includes(searchTerm.toLowerCase())) {
            row.style.display = ""; // Afficher la ligne si elle correspond au critère de recherche
            resultsFound = true; // Indiquer qu'au moins un résultat a été trouvé
        } else {
            row.style.display = "none"; // Masquer la ligne si elle ne correspond pas
        }
    });
}

// ========== MODAL ========== //

document.addEventListener("DOMContentLoaded", () => {
    // Récupération du tableau et du modal
    const booksTable = document.getElementById("booksTable");
    const modal = document.getElementById("myModal");
    const modalContent = document.getElementById("modalContent");

    // Écouteur d'événement pour les clics sur les lignes du tableau
    booksTable.addEventListener("click", (event) => {
        let clickedRow = event.target.closest("tr"); // Trouve la ligne <tr> la plus proche
        
        if (clickedRow && clickedRow.parentNode.tagName === "TBODY") {
            // Récupère les données de la ligne cliquée
            let cells = clickedRow.cells;
            let title = cells[1].textContent;
            let author = cells[2].textContent;
            let date = cells[3].textContent;

            // Récupérer les données supplémentaires
            let pages = clickedRow.dataset.pages;
            let villains = clickedRow.dataset.villains;
            let notes = clickedRow.dataset.notes;

            // Contenu modal
            modalContent.innerHTML = `
            <div class="modal-title-container">
                <h2 class="modal-title mb-2">${title}</h2>
            </div>
                <p><strong>Éditeur :</strong> ${author}</p>
                <p><strong>Date :</strong> ${date}</p>
                <p><strong>Nombre de Pages :</strong> ${pages}</p>
                <p><strong>Villains :</strong> ${villains}</p>
                <p><strong>Information :</strong> ${notes}</p>
            `;
            // Afficher mon modal
            modal.style.display = "block";
        }
    });

    // Écouteur d'événement pour fermer le modal en cliquant à l'extérieur du modal
    document.addEventListener("click", (event) => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });
});


//ERREUR 429 Too many request
// tentative de mettre un settime afin de réduire le nombre de requête, cependant la tableau ne s'affichera pas en entier à l'ouverture de la page
//Créer un boutton permettant de vider le cache ??? contourne simplement le problème






// // Mise en cache car trop de requêtes
// document.addEventListener("DOMContentLoaded", () => {
//     loadBooks();
//     setupSearchListener();
// });

// // Cache pour stocker les URLs des images récupérées
// const imageCache = {};

// function setupSearchListener() {
//     let searchInput = document.getElementById("searchInput");
//     searchInput.addEventListener("input", () => {
//         let searchTerm = searchInput.value.trim().toLowerCase();
//         filterBooks(searchTerm);
//     });
// }

// async function loadBooks() {
//     try {
//         const response = await fetch(`https://stephen-king-api.onrender.com/api/books`);
//         if (!response.ok) {
//             throw new Error("Network response was not ok");
//         }
//         const data = await response.json();
//         for (let book of data.data) {
//             await addBookToTable(book);
//         }
//     } catch (error) {
//         console.error("Erreur de récupération de donnée", error);
//     }
// }

// async function addBookToTable(book) {
//     let tableBody = document.querySelector("#booksTable tbody");
//     let newRow = document.createElement("tr");

//     let idshortCell = document.createElement("td");
//     idshortCell.textContent = book.id;
//     newRow.appendChild(idshortCell);

//     let titreCell = document.createElement("td");
//     titreCell.textContent = book.Title;
//     newRow.appendChild(titreCell);

//     let auteurCell = document.createElement("td");
//     auteurCell.textContent = book.Publisher;
//     newRow.appendChild(auteurCell);

//     let dateCell = document.createElement("td");
//     dateCell.textContent = book.Year;
//     newRow.appendChild(dateCell);

//     let nombrePageCell = document.createElement("td");
//     nombrePageCell.textContent = book.Pages;
//     newRow.appendChild(nombrePageCell);

//     // Création de la cellule pour l'image
//     let imagesCell = document.createElement("td");

//     // Suppression des caractères non numériques (comme les tirets '-') de l'ISBN
//     let cleanedISBN = book.ISBN.replace(/\D/g, '');

//     // Vérification si l'image est en cache
//     if (imageCache[cleanedISBN]) {
//         // Utilisation de l'image en cache
//         let imgElement = createImageElement(imageCache[cleanedISBN]);
//         imagesCell.appendChild(imgElement);
//     } else {
//         try {
//             const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${cleanedISBN}`);
//             if (!response.ok) {
//                 throw new Error('Erreur lors de la récupération des données depuis Google Books API');
//             }
//             const data = await response.json();
//             if (data.items && data.items.length > 0 && data.items[0].volumeInfo.imageLinks.thumbnail) {
//                 let imageURL = data.items[0].volumeInfo.imageLinks.thumbnail;
//                 imageCache[cleanedISBN] = imageURL; // Stockage dans le cache
//                 let imgElement = createImageElement(imageURL);
//                 imagesCell.appendChild(imgElement);
//             } else {
//                 throw new Error('Aucune image trouvée pour ce livre');
//             }
//         } catch (error) {
//             console.error('Erreur lors de la récupération des données depuis Google Books API', error);
//             let imgElement = createImageElement('assets/indisponible.jpg'); // Image de remplacement
//             imagesCell.appendChild(imgElement);
//         }
//     }

//     newRow.appendChild(imagesCell);

//     // Stocker les données supplémentaires dans des attributs de la ligne
//     newRow.dataset.villains = book.villains ? book.villains.map(villain => villain.name).join(', ') : '';
//     newRow.dataset.notes = book.Notes || '';

//     tableBody.appendChild(newRow);
// }

// function createImageElement(src) {
//     let imgElement = document.createElement('img');
//     imgElement.src = src;
//     imgElement.alt = "Image de couverture du livre";
//     imgElement.width = 130; // Définir la largeur de l'image
//     imgElement.height = 200; // Définir la hauteur de l'image
//     return imgElement;
// }

// function filterBooks(searchTerm) {
//     let allRows = document.querySelectorAll("#booksTable tbody tr");
//     let resultsFound = false;

//     allRows.forEach(row => {
//         let title = row.querySelector("td:nth-child(2)").textContent.toLowerCase();
//         let id = row.querySelector("td:nth-child(1)").textContent.toLowerCase();

//         if (title.includes(searchTerm.toLowerCase()) || id.includes(searchTerm.toLowerCase())) {
//             row.style.display = ""; // Afficher la ligne si elle correspond au critère de recherche
//             resultsFound = true;
//         } else {
//             row.style.display = "none"; // Masquer la ligne si elle ne correspond pas
//         }
//     });
// }


