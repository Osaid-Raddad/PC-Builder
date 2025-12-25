using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PCBuilder.DAL.Data.Migrations
{
    /// <inheritdoc />
    public partial class UdjustUpdateUserRoleColoms : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AreaOfSpecialization",
                table: "UpgradeUserRoles",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Email",
                table: "UpgradeUserRoles",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "FullName",
                table: "UpgradeUserRoles",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "PhoneNumber",
                table: "UpgradeUserRoles",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "YearsOfExperience",
                table: "UpgradeUserRoles",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AreaOfSpecialization",
                table: "UpgradeUserRoles");

            migrationBuilder.DropColumn(
                name: "Email",
                table: "UpgradeUserRoles");

            migrationBuilder.DropColumn(
                name: "FullName",
                table: "UpgradeUserRoles");

            migrationBuilder.DropColumn(
                name: "PhoneNumber",
                table: "UpgradeUserRoles");

            migrationBuilder.DropColumn(
                name: "YearsOfExperience",
                table: "UpgradeUserRoles");
        }
    }
}
