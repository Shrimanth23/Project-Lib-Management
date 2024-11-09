const apiUrl = 'https://localhost:7214/api/Library'; // Update this URL if necessary

// Function to fetch books by genre
async function getBooksByGenre() {
    const genre = document.getElementById('genreInput').value;
    try {
        const response = await fetch(`${apiUrl}/books/genre/${genre}`);
        const books = await response.json();

        const list = document.getElementById('genreBooksList');
        list.innerHTML = '';
        books.forEach(book => {
            const listItem = document.createElement('li');
            listItem.textContent = `Title: ${book.title}, Author: ${book.author}, Year: ${book.publishedYear}, Rating: ${book.rating}`;
            list.appendChild(listItem);
        });
    } catch (error) {
        console.error('Error fetching books by genre:', error);
    }
}

// Function to fetch books borrowed by a specific member
async function filterByMember() {
    const memberId = document.getElementById("memberId").value;
    try {
        const response = await fetch(`${apiUrl}/members/${memberId}/books`);
        const data = await response.json();
        const results = document.getElementById("member-results");
        results.innerHTML = `<p>Books borrowed: ${data.length}</p>`;
        data.forEach(book => {
            const item = document.createElement("div");
            item.textContent = `${book.title} by ${book.author}`;
            results.appendChild(item);
        });
    } catch (error) {
        console.error('Error fetching books by member:', error);
    }
}

// Function to add a new book
async function addBook() {
    const title = document.getElementById('bookTitle').value;
    const author = document.getElementById('bookAuthor').value;
    const genre = document.getElementById('bookGenre').value;
    const publishedYear = document.getElementById('bookPublishedYear').value;
    const rating = document.getElementById('bookRating').value;

    const bookData = { title, author, genre, publishedYear: parseInt(publishedYear), rating: parseFloat(rating) };

    try {
        const response = await fetch(`${apiUrl}/books`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bookData)
        });

        if (response.ok) {
            alert('Book added successfully');
        } else {
            alert('Failed to add book');
        }
    } catch (error) {
        console.error('Error adding book:', error);
    }
}

// Additional functions for charts and other API calls if needed
function generateCharts() {
    // Example for Books by Author chart generation
    fetch(`${apiUrl}/books/authors`)
        .then(response => response.json())
        .then(data => {
            const ctx = document.getElementById("booksByAuthorChart").getContext("2d");
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: data.authors,
                    datasets: [{ label: '# of Books', data: data.counts }]
                }
            });
        })
        .catch(error => console.error('Error generating chart:', error));
}

// Function to submit book rating, if required
async function submitRating() {
    const title = document.getElementById("bookTitle").value;
    const rating = document.getElementById("rating").value;
    try {
        const response = await fetch(`${apiUrl}/rate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, rating })
        });
        if (response.ok) {
            document.getElementById("rating-response").textContent = "Rating submitted successfully!";
        } else {
            document.getElementById("rating-response").textContent = "Failed to submit rating.";
        }
    } catch (error) {
        console.error('Error submitting rating:', error);
    }
}

// Event listeners for page load actions, if necessary
document.addEventListener("DOMContentLoaded", () => {
    // Call generateCharts or other functions if needed when the page loads
});
