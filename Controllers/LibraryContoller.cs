using Microsoft.AspNetCore.Mvc;
using Oracle.ManagedDataAccess.Client;
using System;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;

namespace Project_Lib_Management.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LibraryController : ControllerBase
    {
        private readonly string _connectionString = string.Empty; // Initialize it here to avoid the warning

        public LibraryController(IConfiguration configuration)
        {
            // Retrieve connection string from appsettings.json
            _connectionString = configuration.GetConnectionString("OracleDbConnection");
        }
        // Endpoint to get books count by published year
        [HttpGet("books/publishedYear")]
        public async Task<IActionResult> GetBooksByPublishedYear()
        {
            try
            {
                using (var connection = new OracleConnection(_connectionString))
                {
                    await connection.OpenAsync();
                    using (var command = new OracleCommand("LIBRARY_API.get_books_by_year", connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;

                        var outputCursor = command.Parameters.Add("p_year_cursor", OracleDbType.RefCursor);
                        outputCursor.Direction = ParameterDirection.Output;

                        using (var reader = await command.ExecuteReaderAsync())
                        {
                            var booksByYear = new List<object>();
                            while (await reader.ReadAsync())
                            {
                                booksByYear.Add(new
                                {
                                    PublishedYear = reader.GetInt32(0),
                                    Count = reader.GetInt32(1)
                                });
                            }
                            return Ok(booksByYear);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // Endpoint to get demographics for members
        [HttpGet("members/demographics")]
        public async Task<IActionResult> GetMemberDemographics()
        {
            try
            {
                using (var connection = new OracleConnection(_connectionString))
                {
                    await connection.OpenAsync();
                    using (var command = new OracleCommand("LIBRARY_API.get_member_demographics", connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;

                        var outputCursor = command.Parameters.Add("p_demo_cursor", OracleDbType.RefCursor);
                        outputCursor.Direction = ParameterDirection.Output;

                        using (var reader = await command.ExecuteReaderAsync())
                        {
                            var demographics = new List<object>();
                            while (await reader.ReadAsync())
                            {
                                demographics.Add(new
                                {
                                    Demographic = reader.GetString(0),
                                    Count = reader.GetInt32(1)
                                });
                            }
                            return Ok(demographics);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // Endpoint to get the number of books by genre
        [HttpGet("books/genreCount")]
        public async Task<IActionResult> GetBooksCountByGenre()
        {
            try
            {
                using (var connection = new OracleConnection(_connectionString))
                {
                    await connection.OpenAsync();
                    using (var command = new OracleCommand("LIBRARY_API.get_books_count_by_genre", connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;

                        var outputCursor = command.Parameters.Add("p_genre_cursor", OracleDbType.RefCursor);
                        outputCursor.Direction = ParameterDirection.Output;

                        using (var reader = await command.ExecuteReaderAsync())
                        {
                            var booksByGenre = new List<object>();
                            while (await reader.ReadAsync())
                            {
                                booksByGenre.Add(new
                                {
                                    Genre = reader.GetString(0),
                                    Count = reader.GetInt32(1)
                                });
                            }
                            return Ok(booksByGenre);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // Endpoint to get books borrowed by a specific member
        [HttpGet("members/{memberId}/books")]
        public async Task<IActionResult> GetBooksByMember(int memberId)
        {
            try
            {
                using (var connection = new OracleConnection(_connectionString))
                {
                    await connection.OpenAsync();
                    using (var command = new OracleCommand("LIBRARY_API.get_books_by_member", connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;
                        command.Parameters.Add("p_member_id", OracleDbType.Int32).Value = memberId;

                        var outputCursor = command.Parameters.Add("p_book_cursor", OracleDbType.RefCursor);
                        outputCursor.Direction = ParameterDirection.Output;

                        using (var reader = await command.ExecuteReaderAsync())
                        {
                            var books = new List<object>();
                            while (await reader.ReadAsync())
                            {
                                books.Add(new
                                {
                                    Title = reader.GetString(0),
                                    Author = reader.GetString(1),
                                    BorrowDate = reader.GetDateTime(2),
                                    ReturnDate = reader.GetDateTime(3)
                                });
                            }
                            return Ok(books);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }



        // Endpoint to get book details by BOOK_ID
        [HttpGet("books/{bookId}")]
        public async Task<IActionResult> GetBookDetailsById(int bookId)
        {
            try
            {
                using (var connection = new OracleConnection(_connectionString))
                {
                    await connection.OpenAsync();
                    using (var command = new OracleCommand("LIBRARY_API.get_book_details_by_id", connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;
                        command.Parameters.Add("p_book_id", OracleDbType.Int32).Value = bookId;

                        var outputCursor = command.Parameters.Add("p_book_cursor", OracleDbType.RefCursor);
                        outputCursor.Direction = ParameterDirection.Output;

                        using (var reader = await command.ExecuteReaderAsync())
                        {
                            if (await reader.ReadAsync())
                            {
                                var book = new
                                {
                                    Title = reader.GetString(0),
                                    Author = reader.GetString(1),
                                    Genre = reader.GetString(2),
                                    PublishedYear = reader.GetInt32(3),
                                    Rating = reader.GetDecimal(4)
                                };
                                return Ok(book);
                            }
                            return NotFound();
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // Endpoint to get book details by TITLE
        [HttpGet("books/title/{title}")]
        public async Task<IActionResult> GetBookDetailsByTitle(string title)
        {
            try
            {
                using (var connection = new OracleConnection(_connectionString))
                {
                    await connection.OpenAsync();
                    using (var command = new OracleCommand("LIBRARY_API.get_book_details_by_title", connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;
                        command.Parameters.Add("p_title", OracleDbType.Varchar2).Value = title;

                        var outputCursor = command.Parameters.Add("p_book_cursor", OracleDbType.RefCursor);
                        outputCursor.Direction = ParameterDirection.Output;

                        using (var reader = await command.ExecuteReaderAsync())
                        {
                            var books = new List<object>();
                            while (await reader.ReadAsync())
                            {
                                books.Add(new
                                {
                                    BookId = reader.GetInt32(0),
                                    Author = reader.GetString(1),
                                    Genre = reader.GetString(2),
                                    PublishedYear = reader.GetInt32(3),
                                    Rating = reader.GetDecimal(4)
                                });
                            }
                            return Ok(books);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // Endpoint to get book details by GENRE
        [HttpGet("books/genre/{genre}")]
        public async Task<IActionResult> GetBookDetailsByGenre(string genre)
        {
            try
            {
                using (var connection = new OracleConnection(_connectionString))
                {
                    await connection.OpenAsync();
                    using (var command = new OracleCommand("LIBRARY_API.get_book_details_by_genre", connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;
                        command.Parameters.Add("p_genre", OracleDbType.Varchar2).Value = genre;

                        var outputCursor = command.Parameters.Add("p_book_cursor", OracleDbType.RefCursor);
                        outputCursor.Direction = ParameterDirection.Output;

                        using (var reader = await command.ExecuteReaderAsync())
                        {
                            var books = new List<object>();
                            while (await reader.ReadAsync())
                            {
                                books.Add(new
                                {
                                    BookId = reader.GetInt32(0),
                                    Title = reader.GetString(1),
                                    Author = reader.GetString(2),
                                    PublishedYear = reader.GetInt32(3),
                                    Rating = reader.GetDecimal(4)
                                });
                            }
                            return Ok(books);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // POST: Add a new book
        [HttpPost("books")]
        public async Task<IActionResult> AddBook([FromBody] BookModel book)
        {
            try
            {
                using (var connection = new OracleConnection(_connectionString))
                {
                    await connection.OpenAsync();
                    using (var command = new OracleCommand("LIBRARY_API.add_book", connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;
                        command.Parameters.Add("p_title", OracleDbType.Varchar2).Value = book.Title;
                        command.Parameters.Add("p_author", OracleDbType.Varchar2).Value = book.Author;
                        command.Parameters.Add("p_genre", OracleDbType.Varchar2).Value = book.Genre;
                        command.Parameters.Add("p_published_year", OracleDbType.Int32).Value = book.PublishedYear;
                        command.Parameters.Add("p_rating", OracleDbType.Decimal).Value = book.Rating;

                        await command.ExecuteNonQueryAsync();
                        return StatusCode(201, "Book added successfully."); // 201 Created
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // PUT: Update an existing book
        [HttpPut("books/{bookId}")]
        public async Task<IActionResult> UpdateBook(int bookId, [FromBody] BookModel book)
        {
            try
            {
                using (var connection = new OracleConnection(_connectionString))
                {
                    await connection.OpenAsync();
                    using (var command = new OracleCommand("LIBRARY_API.update_book", connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;
                        command.Parameters.Add("p_book_id", OracleDbType.Int32).Value = bookId;
                        command.Parameters.Add("p_title", OracleDbType.Varchar2).Value = book.Title;
                        command.Parameters.Add("p_author", OracleDbType.Varchar2).Value = book.Author;
                        command.Parameters.Add("p_genre", OracleDbType.Varchar2).Value = book.Genre;
                        command.Parameters.Add("p_published_year", OracleDbType.Int32).Value = book.PublishedYear;
                        command.Parameters.Add("p_rating", OracleDbType.Decimal).Value = book.Rating;

                        await command.ExecuteNonQueryAsync();
                        return StatusCode(204); // 204 No Content for successful update
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // DELETE: Delete a book
        [HttpDelete("books/{bookId}")]
        public async Task<IActionResult> DeleteBook(int bookId)
        {
            try
            {
                using (var connection = new OracleConnection(_connectionString))
                {
                    await connection.OpenAsync();
                    using (var command = new OracleCommand("LIBRARY_API.delete_book", connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;
                        command.Parameters.Add("p_book_id", OracleDbType.Int32).Value = bookId;

                        await command.ExecuteNonQueryAsync();
                        return StatusCode(204); // 204 No Content for successful deletion
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }

    public class BookModel
    {
        public required string Title { get; set; }
        public required string Author { get; set; }
        public required string Genre { get; set; }
        public required int PublishedYear { get; set; }
        public required decimal Rating { get; set; } // Add Rating property with required
    }
}
