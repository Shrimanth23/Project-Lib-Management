using Microsoft.EntityFrameworkCore;
using Project_Lib_Management.Models;

namespace Project_Lib_Management.Data
{
    public class LibraryContext : DbContext
    {
        public LibraryContext(DbContextOptions<LibraryContext> options) : base(options) { }

        public DbSet<BookModel> Books { get; set; }
        public DbSet<MemberModel> Members { get; set; }
    }
}
