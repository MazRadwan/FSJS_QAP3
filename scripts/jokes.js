document.getElementById("submit").addEventListener("click", async () => {
  try {
    const response = await fetch("/jokes/random");
    const joke = await response.json();
    document.getElementById(
      "joke-display"
    ).innerText = `${joke.setup} - ${joke.punchline}`;
  } catch (error) {
    document.getElementById("joke-display").innerText = "Failed to fetch joke";
  }
});
