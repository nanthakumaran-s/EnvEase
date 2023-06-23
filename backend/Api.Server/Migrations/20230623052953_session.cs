using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Api.Server.Migrations
{
    /// <inheritdoc />
    public partial class session : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ExpiryTime",
                table: "Session",
                newName: "Expiry_Time");

            migrationBuilder.AlterColumn<string>(
                name: "Device",
                table: "Session",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(bool),
                oldType: "bit");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Expiry_Time",
                table: "Session",
                newName: "ExpiryTime");

            migrationBuilder.AlterColumn<bool>(
                name: "Device",
                table: "Session",
                type: "bit",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");
        }
    }
}
