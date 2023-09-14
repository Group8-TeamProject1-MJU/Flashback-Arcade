
using System.Runtime.Serialization;
using Microsoft.AspNetCore.SignalR;

namespace Application.DTOs;

[DataContract]
public class ResponseDTO {
    [DataMember]
    public bool Succeeded {get;set;} = false;

    [DataMember]
    public List<string> Errors { get; set; } = new List<string>();
}
