using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PCBuilder.DAL.Data.Migrations
{
    /// <inheritdoc />
    public partial class AdjustRateType : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "NumberOfSessionsDone",
                table: "Users");

            migrationBuilder.AlterColumn<double>(
                name: "Rating",
                table: "Appointments",
                type: "float",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "NumberOfSessionsDone",
                table: "Users",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "Rating",
                table: "Appointments",
                type: "int",
                nullable: true,
                oldClrType: typeof(double),
                oldType: "float",
                oldNullable: true);
        }
    }
}
