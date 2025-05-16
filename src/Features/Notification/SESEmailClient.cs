using Amazon.Runtime.CredentialManagement;
using Amazon.SimpleEmail;
using Amazon.SimpleEmail.Model;

namespace Aptabase.Features.Notification;

public class SESEmailClient : IEmailClient
{
    private readonly IAmazonSimpleEmailService _ses;
    private readonly EnvSettings _env;
    private readonly TemplateEngine _engine = new();

    public SESEmailClient(EnvSettings env)
    {
        _env = env ?? throw new ArgumentNullException(nameof(env));
        _ses = CreateClient();
    }

    public async Task SendEmailAsync(string to, string subject, string templateName, Dictionary<string, string>? properties, CancellationToken cancellationToken)
    {
        var body = await _engine.Render(templateName, subject, properties);
        var request = NewRequest(to, subject, body);
        await _ses.SendEmailAsync(request, cancellationToken);
    }

    private AmazonSimpleEmailServiceClient CreateClient()
    {
        if (_env.IsProduction)
            return new AmazonSimpleEmailServiceClient();

        var chain = new CredentialProfileStoreChain();
        if (!chain.TryGetAWSCredentials("aptabase", out var credentials))
            throw new Exception("Failed to find the aptabase profile");

        return new AmazonSimpleEmailServiceClient(credentials, Amazon.RegionEndpoint.USEast1);
    }

    private static SendEmailRequest NewRequest(string to, string subject, string body)
    {
        return new SendEmailRequest
        {
            Source = "Aptabase <goenning@aptabase.com>",
            Destination = new Destination
            {
                ToAddresses =
                new List<string> { to }
            },
            Message = new Message
            {
                Subject = new Content(subject),
                Body = new Body
                {
                    Html = new Content
                    {
                        Charset = "UTF-8",
                        Data = body
                    },
                }
            },
        };
    }
}