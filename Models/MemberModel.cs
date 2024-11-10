using System.ComponentModel.DataAnnotations;

namespace Project_Lib_Management.Models
{
    public class MemberModel
    {
        [Key] // Add this annotation to define MemberId as the primary key
        public int MemberId { get; set; }

        [Required]
        public string Name { get; set; }

        public int Age { get; set; }

        public string Contact { get; set; }

        public string Gender { get; set; }
    }
}
