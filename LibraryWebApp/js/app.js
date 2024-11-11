// Set the base API URL
const apiUrl = 'https://localhost:7214/api/Library';

// Function to fetch books by genre
async function getBooksByGenre() {
    const genre = document.getElementById("genreInput").value;
    try {
        const response = await fetch(`${apiUrl}/books/genre/${genre}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch books by genre: ${response.status}`);
        }
        const books = await response.json();
        console.log(books); // Log the response to verify structure

        const list = document.getElementById("genreBooksList");
        list.innerHTML = ""; // Clear existing results

        // Create a table element
        const table = document.createElement("table");

        // Add table headers
        const headerRow = document.createElement("tr");
        headerRow.innerHTML = `
            <th>ID</th>
            <th>Title</th>
            <th>Author</th>
            <th>Published Year</th>
            <th>Rating</th>
            <th>Actions</th>
        `;
        table.appendChild(headerRow);

        // Add a row for each book
        books.forEach(book => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${book.bookId || "NA"}
                <td>${book.title || "NA"}</td>
                <td>${book.author || "NA"}</td>
                <td>${book.publishedYear || "NA"}</td>
                <td>${book.rating || "NA"}</td>
                <td><button onclick="deleteBook(${book.bookId})">Delete</button></td>
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
            getBooksByGenre();
        } else {
            throw new Error(`Failed to delete book: ${response.status}`);
        }
    } catch (error) {
        console.error("Error deleting book:", error);
        alert("Error: Could not delete the book. Please try again.");
    }
}

// Function to fetch and display books borrowed by a member
async function filterByMember() {
    const memberId = document.getElementById("memberId").value;
    if (!memberId) {
        alert("Please enter a Member ID.");
        return;
    }

    try {
        const response = await fetch(`${apiUrl}/members/${memberId}/books`);
        if (!response.ok) {
            throw new Error(`Failed to fetch books for member ID ${memberId}: ${response.status}`);
        }
        const books = await response.json();
        const resultsDiv = document.getElementById("member-results");
        resultsDiv.innerHTML = ""; // Clear previous results

        if (books.length === 0) {
            resultsDiv.innerHTML = "<p>No books borrowed by this member.</p>";
            return;
        }

        const bookList = document.createElement("ul");
        books.forEach(book => {
            const listItem = document.createElement("li");
            listItem.textContent = `${book.title || "Unknown Title"} by ${book.author || "Unknown Author"}`;
            bookList.appendChild(listItem);
        });
        resultsDiv.appendChild(bookList);
    } catch (error) {
        console.error("Error fetching books by member:", error);
        alert("Error: Could not fetch books for this member. Please try again.");
    }
}

// Function to update book details
async function updateBookDetails() {
    const bookId = document.getElementById("bookId").value;
    const title = document.getElementById("bookTitle").value;
    const author = document.getElementById("author").value;
    const genre = document.getElementById("genre").value;
    const publishedYear = document.getElementById("publishedYear").value;
    const rating = document.getElementById("rating").value;

    if (!bookId) {
        alert("Please enter the Book ID.");
        return;
    }

    const bookData = {
        title: title || null,
        author: author || null,
        genre: genre || null,
        publishedYear: parseInt(publishedYear) || null,
        rating: parseInt(rating) || null
    };

    try {
        const response = await fetch(`${apiUrl}/books/${bookId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bookData)
        });

        if (response.ok) {
            document.getElementById("update-response").textContent = `Book with ID ${bookId} updated successfully.`;
        } else {
            throw new Error(`Failed to update book: ${response.status}`);
        }
    } catch (error) {
        console.error("Error updating book details:", error);
        document.getElementById("update-response").textContent = "Error: Could not update book details. Please try again.";
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
