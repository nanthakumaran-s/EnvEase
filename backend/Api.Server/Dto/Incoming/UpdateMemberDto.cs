namespace Api.Server.Dto.Incoming
{
    public class UpdateMemberDto
    {
        public int UserId { get; set; }
        public int AccessId { get; set; }
        public int ProjectId { get; set; }
    }
}
