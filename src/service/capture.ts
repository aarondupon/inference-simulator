const BASE_URL = 'http://localhost:3000/api';
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
