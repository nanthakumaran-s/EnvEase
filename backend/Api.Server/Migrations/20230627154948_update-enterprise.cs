using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Api.Server.Migrations
{
    /// <inheritdoc />
    public partial class updateenterprise : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "HashKey",
                table: "Enterprise",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "HashKey",
                table: "Enterprise");
        }
    }
}
