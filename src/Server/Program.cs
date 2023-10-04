using Application.Ranking;
using Application.Services;
using Domain.IServices;
using Infrastructure.DbContexts;
using Infrastructure.Repositories;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.ResponseCompression;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using Server.Hubs;
using Swashbuckle.AspNetCore.Filters;

var builder = WebApplication.CreateBuilder(args);

string googleClientId = Environment.GetEnvironmentVariable("GOOGLE_CLIENTID") ?? builder.Configuration["Authentication:Google:ClientId"]!;
string googleSecret = Environment.GetEnvironmentVariable("GOOGLE_SECRET") ?? builder.Configuration["Authentication:Google:ClientSecret"]!;
string kakaotalkClientId = Environment.GetEnvironmentVariable("KAKAOTALK_CLIENTID") ?? builder.Configuration["Authentication:Kakaotalk:ClientId"]!;
string kakaotalkSecret = Environment.GetEnvironmentVariable("KAKAOTALK_SECRET") ?? builder.Configuration["Authentication:Kakaotalk:ClientSecret"]!;

// Add services to the container.
builder.Services.AddScoped<AccountService>();
builder.Services.AddScoped<AccountRepository>();
builder.Services.AddScoped<ScoreService>();
builder.Services.AddScoped<ScoreRepository>();
builder.Services.AddScoped<GameRepository>();
builder.Services.AddScoped<RankersStaticHelper>();
builder.Services.AddScoped<IEmailService, EmailService>();

builder.Services.AddHttpContextAccessor();

builder.Services.AddCors(corsOpts => {
    corsOpts.AddDefaultPolicy(b => {
        b.WithOrigins(builder.Configuration["ClientUrls:ReactUrl"]!)
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

builder.Services.ConfigureApplicationCookie(o => {
    o.Cookie.SameSite = SameSiteMode.None;
    o.Cookie.SecurePolicy = CookieSecurePolicy.Always;
    o.Cookie.HttpOnly = true;
    o.Cookie.MaxAge = TimeSpan.FromHours(2);
});

builder.Services.AddAuthentication(o => {
    // o.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
    // o.DefaultAuthenticateScheme = CookieAuthenticationDefaults.AuthenticationScheme;
    // o.DefaultSignInScheme = IdentityConstants.ExternalScheme;
    o.DefaultScheme = IdentityConstants.ApplicationScheme;
    o.DefaultAuthenticateScheme = IdentityConstants.ApplicationScheme;
    o.DefaultSignInScheme = IdentityConstants.ExternalScheme;
    o.DefaultSignOutScheme = IdentityConstants.ApplicationScheme;
})
    // .AddCookie(CookieAuthenticationDefaults.AuthenticationScheme ,o => {
    //     o.Cookie.SameSite = SameSiteMode.None;
    //     o.Cookie.SecurePolicy = CookieSecurePolicy.Always;
    //     o.Cookie.HttpOnly = true;
    //     o.Cookie.MaxAge = TimeSpan.FromHours(2);
    // })
    .AddGoogle(o => {
        // o.SignInScheme = CookieAuthenticationDefaults.AuthenticationScheme;
        o.SignInScheme = IdentityConstants.ExternalScheme;
        o.SaveTokens = false;
        o.ClientId = googleClientId;
        o.ClientSecret = googleSecret;
    })
    .AddKakaoTalk(o => {
        // o.SignInScheme = CookieAuthenticationDefaults.AuthenticationScheme;
        o.SignInScheme = IdentityConstants.ExternalScheme;
        o.SaveTokens = false;
        o.CallbackPath = "/signin-kakaotalk";
        o.ClientId = kakaotalkClientId;
        o.ClientSecret = kakaotalkSecret;
    });

builder.Services.AddDefaultIdentity<IdentityUser>(options => {
    // options.SignIn.RequireConfirmedAccount = true;
    options.SignIn.RequireConfirmedEmail = true;
    options.SignIn.RequireConfirmedPhoneNumber = false;
    options.Password.RequiredLength = 5;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireDigit = false;
    options.Password.RequireUppercase = false;
})
    .AddDefaultTokenProviders()
    .AddRoles<IdentityRole>()
    .AddEntityFrameworkStores<AccountDbContext>();

builder.Services.AddAuthorization();

builder.Services.AddDbContext<AccountDbContext>(option => {
    option.UseSqlite(builder.Configuration.GetConnectionString("AccountDbConnectionString")!);
});

builder.Services.AddDbContext<MainDbContext>(option => {
    option.UseSqlite(builder.Configuration.GetConnectionString("MainDbConnectionString")!);
});

builder.Services.AddRazorPages();
builder.Services.AddServerSideBlazor();
builder.Services.AddResponseCompression(opts => {
    opts.MimeTypes = ResponseCompressionDefaults.MimeTypes.Concat(
          new[] { "application/octet-stream" });
});

// Add Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options => {
    options.SwaggerDoc("v1", new OpenApiInfo { Title = "Test", Version = "v1" });
    options.OperationFilter<SecurityRequirementsOperationFilter>();
});
var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment()) {
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}
else {
    app.UseSwagger();
    app.UseSwaggerUI(options => {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "v1");
    });
}

app.UseResponseCompression();

app.UseHttpsRedirection();

app.UseCors();

// react client에서만 iframe 사용 가능하도록 CSR 추가
app.Use(async (context, next) => {
    context.Response.Headers.Add("Content-Security-Policy", "frame-ancestors " + app.Configuration["ClientUrls:ReactUrl"]!);
    await next();
});

// /reactchat 채팅 페이지 iframe으로만 접근되도록 하는 middleware
// cloud에서는 정상적으로 되지 않아 주석 처리
app.Use(async (context, next) => {
    //     string url = context.Request.Path;

    //     if (url.Contains("/reactchat")) {
    //         string referer = context.Request.Headers["Referer"]!;
    //         if (string.IsNullOrEmpty(referer) || !referer.Contains(app.Configuration["ClientUrls:ReactUrl"]!)) {
    //             // context.Response.StatusCode = StatusCodes.Status403Forbidden;
    //             // await context.Response.WriteAsync("Access denied.");
    //             context.Response.Redirect("/");
    //         }
    //     }
    await next();
});

app.UseStaticFiles();

app.UseRouting();

app.UseAuthentication();

app.UseAuthorization();

app.MapHub<ChatHub>("/chathub");

app.MapControllers();

app.MapBlazorHub();

app.MapFallbackToPage("/_Host");

using var scope = app.Services.CreateScope();
await scope.ServiceProvider.GetRequiredService<RankersStaticHelper>().InitializeAsync();

app.Run();
