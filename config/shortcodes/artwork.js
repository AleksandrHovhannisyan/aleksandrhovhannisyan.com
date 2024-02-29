export default function artworkShortcode(content, description) {
  const artworkId = this.page.fileSlug;
  if (!description) {
    throw new Error(`Artwork ${artworkId} is missing a description.`);
  }
  if (!content) {
    throw new Error(`Artwork ${artworkId} has no content.`);
  }
  const captionId = `${artworkId}-caption`;
  return `<figure class="artwork" id="${artworkId}">
            <a href="#${artworkId}" class="artwork-link">
              <div role="img" aria-labelledby=${captionId}>
                ${content}
              </div>
            </a>
            <figcaption id="${captionId}" class="artwork-caption">${description}</figcaption>
          </figure>`;
}

