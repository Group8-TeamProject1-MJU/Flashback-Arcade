using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations.MainDb
{
    /// <inheritdoc />
    public partial class QuickSpeedMaster게임추가 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Game",
                columns: new[] { "Id", "Descending", "Title" },
                values: new object[] { 8, false, "Qucik Speed Master" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Game",
                keyColumn: "Id",
                keyValue: 8);
        }
    }
}
