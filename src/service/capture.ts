const BASE_URL = process.env.API_URL;
/**
 * Uploads an image to the server.
 *
 * @param data - The image data to upload.
 * @param projectname - The name of the project associated with the image.
 * @throws Error if there is an error uploading the image.
 */
export async function uploadImage(
  data: string,
  projectname: string
): Promise<void> {
  try {
    const urlencoded = new URLSearchParams({ data, name: projectname });
    const response = await fetch(`${BASE_URL}/upload/${projectname}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: urlencoded,
      redirect: 'follow',
    });
    if (!response.ok) throw new Error('Failed to upload image');
  } catch (error) {
    throw new Error('Error uploading image');
  }
}

/**
 * Updates the tags of an image.
 *
 * @param tags - The new tags to assign to the image.
 * @param image - The name of the image to update.
 * @throws Error if there is an error adding the tags.
 */
export async function updateTags(tags: string[], image: string): Promise<void> {
  try {
    const urlencoded = new URLSearchParams();
    urlencoded.append('tags', tags.join(','));
    const response = await fetch(`${BASE_URL}/tag/${image}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: urlencoded,
      redirect: 'follow',
    });
    if (!response.ok) throw new Error('Failed to add tags');
  } catch (error) {
    throw new Error('Error adding tags');
  }
}
