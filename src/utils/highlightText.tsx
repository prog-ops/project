export const highlightText = (text: string, highlight: string) => {
    if (!highlight.trim()) return text;

    // Normalize the highlight term to lowercase for case-insensitive matching
    const normalizedHighlight = highlight.toLowerCase();
    let highlighted = text;

    // Create a regex pattern that matches the highlight term in order
    const regex = new RegExp(`(${normalizedHighlight})`, 'gi');

    // Replace all occurrences of the matched terms with highlighted versions
    highlighted = highlighted.replace(regex, (match) => `<mark>${match}</mark>`);

    // Return the highlighted text wrapped in a span
    return <span dangerouslySetInnerHTML={{ __html: highlighted }} />;
};

// All occurrence of typing
export const highlightText2 = (text: string, highlight: string) => {
    if (!highlight.trim()) return text;

    // Split the highlight string into individual characters and substrings
    const terms = highlight.toLowerCase().split('');
    let highlighted = text;

    // Create a regex pattern that matches all terms
    const regexPattern = terms.map(term => `(${term})`).join('|');
    const regex = new RegExp(regexPattern, 'gi');

    // Replace all occurrences of the matched terms with highlighted versions
    highlighted = highlighted.replace(regex, (match) => `<mark>${match}</mark>`);

    // Return the highlighted text wrapped in a span
    return <span dangerouslySetInnerHTML={{ __html: highlighted }} />;
};
