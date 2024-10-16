async function fetchHTML(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const html = await response.text();

    // Extract <h2> and <p> elements from the fetched HTML
    extractH2AndP(html);
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
  }
}

function extractH2AndP(html) {
  // Regular expression to match lines that start with <h2> or <p> tags
  const regex = /<h2.*?>.*?<\/h2>|<p.*?>.*?<\/p>/g;

  // Find all matches using the regex
  const matches = html.match(regex);

  if (matches) {
    matches.forEach((match) => console.log(match));
  } else {
    console.log("No <h2> or <p> elements found.");
  }
}

// Example usage
fetchHTML("https://www.nrk.no/nyheter/");
