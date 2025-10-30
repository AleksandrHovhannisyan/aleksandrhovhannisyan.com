export default function artworkShortcode(content, id, description) {
  if (!id) {
    throw new Error(`Artwork is missing an id.`);
  }
  if (!description) {
    throw new Error(`Artwork "${id}" is missing a description.`);
  }
  if (!content) {
    throw new Error(`Artwork "${id}" has no content.`);
  }
  const captionId = `${id}-caption`;
  return `<figure class="artwork" id="${id}">
            <a href="#${id}" class="artwork-link">
              <div role="img" aria-labelledby=${captionId}>
                ${content}
              </div>
            </a>
            <figcaption id="${captionId}" class="artwork-caption">${description}</figcaption>
          </figure>`;
}
