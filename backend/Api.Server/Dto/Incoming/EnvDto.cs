namespace Api.Server.Dto.Incoming
{
    public class CreateEnvDto
    {
        public string Key { get; set; } = string.Empty;
        public string Value { get; set; } = string.Empty;
        public int ProjectId { get; set; }
        public string Type { get; set; } = string.Empty;
    }

    public class GetEnvDto
    {
        public int ProjectId { get; set; }
        public string Type { get; set; } = string.Empty;
    }

    public class UpdateEnvDto
    {
        public int Id { get; set; }
        public string Value { get; set; } = string.Empty;
        public int ProjectId { get; set; }
    }

    public class DeleteEnvDto
    {
        public int Id { get; set; }
    }
}
