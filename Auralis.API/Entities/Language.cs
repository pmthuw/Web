using System.ComponentModel.DataAnnotations;

namespace Auralis.API.Entities;

public class Language
{
    [Key]
    public string LanguageCode { get; set; } = string.Empty;
    public string LanguageName { get; set; } = string.Empty;
    public bool IsDefault { get; set; } = false;
    public bool IsActive { get; set; } = true;
}