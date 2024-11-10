using System.ComponentModel.DataAnnotations;

namespace Project_Lib_Management.Models
{
    public class BookModel
    {
        [Key] // Add this annotation to define BookId as the primary key
        public int BookId { get; set; }

        [Required]
        public string Title { get; set; }

        [Required]
        public string Author { get; set; }

        public string Genre { get; set; }

        [Range(0, int.MaxValue)]
        public int PublishedYear { get; set; }

        [Range(0, 5)]
        public decimal Rating { get; set; }
    }
}
