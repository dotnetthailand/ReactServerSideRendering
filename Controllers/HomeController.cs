using Microsoft.AspNetCore.Mvc;

namespace ReactServerSideRendering.Controllers;

public class HomeController : Controller
{
    public IActionResult Index() => View();
}
