// Set the base API URL
const apiUrl = 'https://localhost:7214/api/Library';

// Function to fetch books by id or genre
async function getBooks() {
    const searchType = document.getElementById("searchType").value;
    const searchValue = document.getElementById("searchInput").value;

    if (!searchValue) {
        alert("Please enter a genre or book ID.");
        return;
    }

    try {
        let response;
        if (searchType === "genre") {
            response = await fetch(`${apiUrl}/books/genre/${searchValue}`);
        } else if (searchType === "bookid") {
            response = await fetch(`${apiUrl}/books/${searchValue}`);
        }

        if (!response.ok) {
            throw new Error(`Failed to fetch books: ${response.status}`);
        }

        const books = searchType === "genre" ? await response.json() : [await response.json()];
        console.log(books); // Log the response to verify structure

        const list = document.getElementById("genreBooksList");
        list.innerHTML = ""; // Clear existing results

        if (books.length === 0) {
            list.innerHTML = "<p>No books found matching your search.</p>";
            return;
        }

        // Create a table element
        const table = document.createElement("table");

        // Add table headers
        const headerRow = document.createElement("tr");
        headerRow.innerHTML = `
            <th>ID</th>
            <th>Title</th>
            <th>Author</th>
            <th>Genre</th>
            <th>Published Year</th>
            <th>Rating</th>
            <th>Actions</th>
        `;
        table.appendChild(headerRow);

        // Add a row for each book
        books.forEach(book => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${book.bookId || searchValue || "NA"}</td>
                <td>${book.title || "NA"}</td>
                <td>${book.author || "NA"}</td>
                <td>${book.genre || searchValue || "NA"}</td>
                <td>${book.publishedYear || "NA"}</td>
                <td>${book.rating || "NA"}</td>
                <td>
                    <button onclick="deleteBook(${book.bookId || searchValue})">Delete</button>
                    <button onclick="updateBookDetails(${book.bookId || searchValue})">Update</button>
                </td>
            `;
            table.appendChild(row);
        });

        // Append the table to the container
        list.appendChild(table);

    } catch (error) {
        console.error("Error fetching books by genre:", error);
    }
}


// Function for the DELETE button to delete a book
async function deleteBook(bookId) {
    try {
        const response = await fetch(`${apiUrl}/books/${bookId}`, {
            method: 'DELETE'
        });
        if (response.ok) {
            alert(`Book with ID ${bookId} deleted successfully.`);
            // Refresh the list of books by genre
            getBooks();
        } else {
            throw new Error(`Failed to delete book: ${response.status}`);
        }
    } catch (error) {
        console.error("Error deleting book:", error);
        alert("Error: Could not delete the book. Please try again.");
    }
}

function updateBookDetails(bookId) {
    window.currentBookId = bookId;

    // Show the update popup
    document.getElementById("updatePopup").style.display = "flex";
}
function closeUpdatePopup() {
    document.getElementById("updatePopup").style.display = "none";
}


// Function to handle updating the book details
async function updateBook() {
    const bookId = window.currentBookId;
    const updatedBook = {
        title: document.getElementById("updateBookTitle").value,
        author: document.getElementById("updateAuthor").value,
        genre: document.getElementById("updateGenre").value,
        publishedYear: document.getElementById("updatePublishedYear").value,
        rating: document.getElementById("updateRating").value
    };

    try {
        const response = await fetch(`${apiUrl}/books/${bookId}`, {
            method: 'PUT', // Assuming you are using PUT to update
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedBook)
        });

        // Log the response to check if there is content
        console.log('Response Status:', response.status);
        const responseBody = await response.text(); // Get raw text response

        // Check if the response is not empty
        if (responseBody) {
            try {
                const parsedResponse = JSON.parse(responseBody); // Parse the JSON response
                console.log('Response Body:', parsedResponse);
            } catch (e) {
                console.error('Failed to parse response:', e);
            }
        } else {
            console.error('Empty response body');
        }

        if (!response.ok) {
            throw new Error(`Failed to update book: ${response.status}`);
        }

        alert('Book updated successfully!');
        closeUpdatePopup();
        getBooks(); // Refresh the book list
    } catch (error) {
        console.error("Error updating book:", error);
        alert('Failed to update the book.');
    }
}


// Function to add new bbook
async function insertNewBook() {
    const title = document.getElementById("newBookTitle").value;
    const author = document.getElementById("newAuthor").value;
    const genre = document.getElementById("newGenre").value;
    const publishedYear = document.getElementById("newPublishedYear").value;
    const rating = document.getElementById("newRating").value;

    if (!title || !author || !genre || !publishedYear || !rating) {
        alert("Please fill in all book details.");
        return;
    }

    const newBookData = {
        title: title,
        author: author,
        genre: genre,
        publishedYear: parseInt(publishedYear),
        rating: parseInt(rating)
    };

    try {
        const response = await fetch(`${apiUrl}/books`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newBookData)
        });

        if (response.ok) {
            document.getElementById("insert-response").textContent = "New book record inserted successfully.";
        } else {
            throw new Error(`Failed to insert new book: ${response.status}`);
        }
    } catch (error) {
        console.error("Error inserting new book:", error);
        document.getElementById("insert-response").textContent = "Error: Could not insert new book. Please try again.";
    }
}

// Chart for Books by Published Year
async function generateBooksByPublishedYearChart() {
    try {
        const response = await fetch(`${apiUrl}/books/publishedYear`);
        if (!response.ok) throw new Error(`Failed to fetch books by published year: ${response.status}`);

        const data = await response.json();
        console.log("Books by Published Year Data:", data); // Log the full data to confirm structure

        const years = data.map(d => d.publishedYear);  // Adjust field names here if needed
        const counts = data.map(d => d.count);         // Adjust field names here if needed

        new Chart(document.getElementById("booksByPublishedYearChart").getContext("2d"), {
            type: 'bar',
            data: {
                labels: years,
                datasets: [{
                    label: 'Books Published',
                    data: counts,
                    backgroundColor: years.map(() => getRandomColor())
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: false },
                    title: { display: true, text: 'Books by Published Year' }
                }
            }
        });
    } catch (error) {
        console.error("Error generating books by published year chart:", error);
    }
}
// Chart for Member Demographics
async function generateMemberDemographicsChart() {
    try {
        const response = await fetch(`${apiUrl}/members/demographics`);
        if (!response.ok) throw new Error(`Failed to fetch member demographics: ${response.status}`);

        const data = await response.json();
        const demographics = data.map(d => d.demographic);
        const counts = data.map(d => d.count);

        console.log(demographics, counts); // Verify data

        new Chart(document.getElementById("memberDemographicsChart").getContext("2d"), {
            type: 'pie',
            data: {
                labels: demographics,
                datasets: [{
                    label: 'Member Demographics',
                    data: counts,
                    backgroundColor: demographics.map(() => getRandomColor())
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: true },
                    title: { display: true, text: 'Demographics for Members' }
                }
            }
        });
    } catch (error) {
        console.error("Error generating member demographics chart:", error);
    }
}

// Chart for Number of Books by Genre
async function generateBooksByGenreCountChart() {
    try {
        const response = await fetch(`${apiUrl}/books/genreCount`);
        if (!response.ok) throw new Error(`Failed to fetch books by genre count: ${response.status}`);

        const data = await response.json();
        const genres = data.map(d => d.genre);
        const counts = data.map(d => d.count);

        console.log(genres, counts); // Verify data

        new Chart(document.getElementById("booksByGenreCountChart").getContext("2d"), {
            type: 'pie',
            data: {
                labels: genres,
                datasets: [{
                    label: 'Books by Genre',
                    data: counts,
                    backgroundColor: genres.map(() => getRandomColor())
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: true },
                    title: { display: true, text: 'Number of Books by Genre' }
                }
            }
        });
    } catch (error) {
        console.error("Error generating books by genre count chart:", error);
    }
}
// Helper function to generate random color
function getRandomColor() {
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
}

// Popup
const openPopupButton = document.getElementById('openPopupButton');
const popup = document.getElementById('popup');

openPopupButton.addEventListener('click', () => {
    popup.style.display = 'flex';
});
function closePopup() {
    popup.style.display = 'none';
}