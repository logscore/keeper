namespace api.Services.Auth;

public class AuthEmailOptions
{
    public const string SectionName = "AuthEmail";

    public string FromAddress { get; set; } = string.Empty;
    public string FromName { get; set; } = "Keeper";
}
