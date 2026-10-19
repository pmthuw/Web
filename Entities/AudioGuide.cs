using System.ComponentModel.DataAnnotations;

namespace Auralis.API.Entities;

public class AudioGuide
{
    [Key]
    public int AudioGuideID { get; set; }
    public int POIID { get; set; }
    public string LanguageCode { get; set; } = string.Empty;
    public string? Title { get; set; }
    public string? TextContent { get; set; }
    public string? AudioUrl { get; set; }
    public int DurationSeconds { get; set; } = 0;
    public bool IsDeleted { get; set; } = false;
    public DateTime CreatedAt { get; set; } = DateTime.Now;
    public DateTime? UpdatedAt { get; set; }

    public PointOfInterest? PointOfInterest { get; set; }
    public Language? Language { get; set; }
}