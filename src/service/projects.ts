import { Project } from 'src/types';

const BASE_URL = process.env.API_URL;

/**
 * Fetches projects from the server.
 *
 * @returns A promise that resolves to an array of projects.
 * @throws An error if the request fails or if there is an error parsing the response.
 */
export async function fetchProjects(): Promise<Project[]> {
  try {
    const response = await fetch(`${BASE_URL}/projects`);
    if (!response.ok) throw new Error('Failed to fetch projects');
    const result = await response.json();
    return result;
  } catch (error) {
    throw new Error('Error fetching projects');
  }
}

/**
 * Fetches a project by its ID.
 *
 * @param id - The ID of the project to fetch.
 * @returns A Promise that resolves to the fetched project.
 * @throws If there is an error fetching the project.
 */
export async function fetchProject(id: number): Promise<Project> {
  try {
    const response = await fetch(`${BASE_URL}/project/${id}`);
    if (!response.ok) throw new Error('Failed to fetch project');
    return response.json();
  } catch (error) {
    throw new Error('Error fetching project');
  }
}

/**
 * Creates a new project.
 *
 * @param project - The project object containing the details of the project to be created.
 * @returns A Promise that resolves to the created project.
 * @throws An error if there is a failure in creating the project.
 */
export async function createProject(
  project: Partial<Project>
): Promise<Project> {
  try {
    const response = await fetch(`${BASE_URL}/project`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(project),
    });
    if (!response.ok) throw new Error('Failed to create project');
    return response.json();
  } catch (error) {
    throw new Error('Error creating project');
  }
}

/**
 * Updates a project.
 *
 * @param project - The project to be updated.
 * @returns A promise that resolves to the updated project.
 * @throws If there is an error updating the project.
 */
export async function updateProject(project: Project): Promise<Project> {
  try {
    const response = await fetch(`${BASE_URL}/project/${project.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(project),
    });
    if (!response.ok) throw new Error('Failed to update project');
    return response.json();
  } catch (error) {
    throw new Error('Error updating project');
  }
}

/**
 * Deletes a project by its name.
 *
 * @param name - The name of the project to delete.
 * @throws If there is an error deleting the project.
 */
export async function deleteProject(name: string): Promise<void> {
  try {
    const response = await fetch(`${BASE_URL}/project/${name}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete project');
  } catch (error) {
    throw new Error('Error deleting project');
  }
}
