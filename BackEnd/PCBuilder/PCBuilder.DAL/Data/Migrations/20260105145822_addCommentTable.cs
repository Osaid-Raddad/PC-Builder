using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PCBuilder.DAL.Data.Migrations
{
    /// <inheritdoc />
    public partial class addCommentTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PostComment_PostComment_ParentCommentId",
                table: "PostComment");

            migrationBuilder.DropForeignKey(
                name: "FK_PostComment_Posts_PostId",
                table: "PostComment");

            migrationBuilder.DropForeignKey(
                name: "FK_PostComment_Users_UserId",
                table: "PostComment");

            migrationBuilder.DropPrimaryKey(
                name: "PK_PostComment",
                table: "PostComment");

            migrationBuilder.RenameTable(
                name: "PostComment",
                newName: "PostComments");

            migrationBuilder.RenameIndex(
                name: "IX_PostComment_UserId",
                table: "PostComments",
                newName: "IX_PostComments_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_PostComment_PostId",
                table: "PostComments",
                newName: "IX_PostComments_PostId");

            migrationBuilder.RenameIndex(
                name: "IX_PostComment_ParentCommentId",
                table: "PostComments",
                newName: "IX_PostComments_ParentCommentId");

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "PostComments",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddPrimaryKey(
                name: "PK_PostComments",
                table: "PostComments",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_PostComments_PostComments_ParentCommentId",
                table: "PostComments",
                column: "ParentCommentId",
                principalTable: "PostComments",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_PostComments_Posts_PostId",
                table: "PostComments",
                column: "PostId",
                principalTable: "Posts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_PostComments_Users_UserId",
                table: "PostComments",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PostComments_PostComments_ParentCommentId",
                table: "PostComments");

            migrationBuilder.DropForeignKey(
                name: "FK_PostComments_Posts_PostId",
                table: "PostComments");

            migrationBuilder.DropForeignKey(
                name: "FK_PostComments_Users_UserId",
                table: "PostComments");

            migrationBuilder.DropPrimaryKey(
                name: "PK_PostComments",
                table: "PostComments");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "PostComments");

            migrationBuilder.RenameTable(
                name: "PostComments",
                newName: "PostComment");

            migrationBuilder.RenameIndex(
                name: "IX_PostComments_UserId",
                table: "PostComment",
                newName: "IX_PostComment_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_PostComments_PostId",
                table: "PostComment",
                newName: "IX_PostComment_PostId");

            migrationBuilder.RenameIndex(
                name: "IX_PostComments_ParentCommentId",
                table: "PostComment",
                newName: "IX_PostComment_ParentCommentId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_PostComment",
                table: "PostComment",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_PostComment_PostComment_ParentCommentId",
                table: "PostComment",
                column: "ParentCommentId",
                principalTable: "PostComment",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_PostComment_Posts_PostId",
                table: "PostComment",
                column: "PostId",
                principalTable: "Posts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_PostComment_Users_UserId",
                table: "PostComment",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id");
        }
    }
}
