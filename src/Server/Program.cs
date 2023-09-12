using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.Filters;
using Server.Hubs;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
//
builder.Services.AddControllers();
builder.Services.AddSignalR();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors(options => {
    options.AddDefaultPolicy(
        corsBuilder => {
            corsBuilder
                .WithOrigins(builder.Configuration["ClientUrls:ReactUrl"]!)
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowCredentials();
        });
});

// Add Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options => {
    options.SwaggerDoc("v1", new OpenApiInfo { Title = "Test", Version = "v1" });
    options.OperationFilter<SecurityRequirementsOperationFilter>();
});


// Configure the HTTP request pipeline.
//
var app = builder.Build();

// Add Swagger when it's running in Development
if (app.Environment.IsDevelopment()) {
    app.UseSwagger();
    app.UseSwaggerUI(options => {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "v1");
    });
}

app.UseHttpsRedirection();

app.UseCors();

app.UseAuthentication();
app.UseAuthorization();

app.UseStaticFiles();
app.UseRouting();
app.MapControllers();

app.MapHub<ChatHub>("/chatHub");
app.MapFallbackToFile("index.html");

app.Run();
