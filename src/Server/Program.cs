using Application.Services;
using Infrastructure.DbContexts;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.ResponseCompression;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using Server;
using Server.Hubs;
using Swashbuckle.AspNetCore.Filters;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddScoped<AccountService>();

builder.Services.AddCors(corsOpts => {
    corsOpts.AddDefaultPolicy(b => {
        b.WithOrigins(builder.Configuration["ClientUrls:ReactUrl"]!)
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

builder.Services.AddAuthentication(o => {
    o.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
    o.DefaultSignInScheme = CookieAuthenticationDefaults.AuthenticationScheme;
    o.DefaultAuthenticateScheme = CookieAuthenticationDefaults.AuthenticationScheme;
})
    .AddCookie(o => {
        o.LoginPath = "/api/account/signin";
    });

builder.Services.AddDefaultIdentity<IdentityUser>(options => {
    options.SignIn.RequireConfirmedAccount = false;
    options.Password.RequiredLength = 5;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireDigit = false;
    options.Password.RequireUppercase = false;
})
    .AddDefaultTokenProviders()
    .AddRoles<IdentityRole>()
    .AddEntityFrameworkStores<IdentityDbContext>();

builder.Services.AddDbContext<IdentityDbContext>(option => {
    option.UseSqlite(builder.Configuration.GetConnectionString("BlogDbConnectionString")!);
});

// Add Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options => {
    options.SwaggerDoc("v1", new OpenApiInfo { Title = "Test", Version = "v1" });
    options.OperationFilter<SecurityRequirementsOperationFilter>();
});

builder.Services.AddRazorPages();
builder.Services.AddServerSideBlazor();
builder.Services.AddResponseCompression(opts => {
    opts.MimeTypes = ResponseCompressionDefaults.MimeTypes.Concat(
          new[] { "application/octet-stream" });
});
var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment()) {
    app.UseExceptionHandler("/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();

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

app.UseAuthentication();

app.UseAuthorization();

app.UseStaticFiles();

app.UseRouting();

app.MapHub<ChatHub>("/chathub");

app.MapControllers();

app.MapBlazorHub();

app.MapFallbackToPage("/_Host");

app.Run();
