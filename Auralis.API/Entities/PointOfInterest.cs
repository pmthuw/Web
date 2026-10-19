using System.ComponentModel.DataAnnotations;

namespace Auralis.API.Entities;

public class PointOfInterest
{
    [Key]
    public int POIID { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Address { get; set; }
    public decimal Latitude { get; set; }
    public decimal Longitude { get; set; }
    public string? ImageUrl { get; set; }
    public string Status { get; set; } = "Active";
    public bool IsDeleted { get; set; } = false;
    public DateTime CreatedAt { get; set; } = DateTime.Now;
    public DateTime? UpdatedAt { get; set; }

    public ICollection<AudioGuide> AudioGuides { get; set; } = new List<AudioGuide>();
}