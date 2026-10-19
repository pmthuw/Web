using Microsoft.EntityFrameworkCore;
using Auralis.API.Entities;

namespace Auralis.API.Data;

public class AuralisDbContext : DbContext
{
    public AuralisDbContext(DbContextOptions<AuralisDbContext> options) : base(options) { }

    public DbSet<User> Users { get; set; }
    public DbSet<PointOfInterest> PointsOfInterest { get; set; }
    public DbSet<Language> Languages { get; set; }
    public DbSet<AudioGuide> AudioGuides { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Thiết lập ràng buộc Unique cho cặp (POIID + LanguageCode) đúng chuẩn BR03
        modelBuilder.Entity<AudioGuide>()
            .HasIndex(a => new { a.POIID, a.LanguageCode })
            .IsUnique();
    }
}