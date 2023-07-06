namespace Api.Server.Dto.Incoming
{
    public class CreateProjectDto
    {
        public string Name { get; set; } = string.Empty;
    }

    public class UpdateProjectDto
    {
        public int ProjectId { get; set; }
        public string Name { get; set; }
    }

    public class AddMemberToProjectDto
    {
        public string Email { get; set; } = string.Empty;
        public int AccessId { get; set; }
        public int ProjectId { get; set; }
    }

    public class DeleteMemberDto
    {
        public int UserId { get; set; }
        public int ProjectId { get; set; }
    }

    public class GetMembersDto
    {
        public int ProjectId { get; set; }
    }

    public class UpdateMemberDto
    {
        public int UserId { get; set; }
        public int AccessId { get; set; }
        public int ProjectId { get; set; }
    }
}
