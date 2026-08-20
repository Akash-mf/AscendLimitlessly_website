document.addEventListener("DOMContentLoaded", function () {

  /* ---------- Mobile sidebar toggle ---------- */
  var sidebar = document.getElementById("admin-sidebar");
  var toggle = document.getElementById("admin-sidebar-toggle");
  if (sidebar && toggle) {
    toggle.addEventListener("click", function () {
      sidebar.classList.toggle("open");
    });
    document.addEventListener("click", function (e) {
      if (window.innerWidth > 720) return;
      if (!sidebar.contains(e.target) && !toggle.contains(e.target)) {
        sidebar.classList.remove("open");
      }
    });
  }

  if (typeof Chart === "undefined") return;

  var brandGreen = "#16a673";
  var textMuted = "#5b6470";
  var borderColor = "#e6e9ec";

  Chart.defaults.font.family = "'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
  Chart.defaults.color = textMuted;

  /* ---------- Leads overview line chart ---------- */
  var leadsCanvas = document.getElementById("leadsChart");
  if (leadsCanvas) {
    var ctx = leadsCanvas.getContext("2d");
    var gradient = ctx.createLinearGradient(0, 0, 0, 230);
    gradient.addColorStop(0, "rgba(22, 166, 115, 0.28)");
    gradient.addColorStop(1, "rgba(22, 166, 115, 0)");

    new Chart(ctx, {
      type: "line",
      data: {
        labels: ["16 May", "17 May", "18 May", "19 May", "20 May", "21 May", "22 May"],
        datasets: [{
          data: [28, 38, 82, 55, 33, 39, 34],
          borderColor: brandGreen,
          backgroundColor: gradient,
          borderWidth: 2.5,
          pointBackgroundColor: "#fff",
          pointBorderColor: brandGreen,
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: {
            min: 0, max: 100, ticks: { stepSize: 20 },
            grid: { color: borderColor },
            border: { display: false }
          },
          x: {
            grid: { display: false },
            border: { display: false }
          }
        }
      }
    });
  }

  /* ---------- Most requested services donut ---------- */
  var donutCanvas = document.getElementById("servicesDonut");
  if (donutCanvas) {
    new Chart(donutCanvas.getContext("2d"), {
      type: "doughnut",
      data: {
        labels: ["Websites", "E-Commerce", "AI Automation", "Mobile Apps", "Web Applications"],
        datasets: [{
          data: [45, 32, 20, 18, 13],
          backgroundColor: ["#16a673", "#57c9a5", "#7c5cf2", "#2f7de1", "#e08a2e"],
          borderWidth: 3,
          borderColor: "#ffffff"
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "72%",
        plugins: {
          legend: { display: false },
          tooltip: { enabled: true }
        }
      }
    });
  }
});
