import { Project } from 'src/types';

const BASE_URL = 'http://localhost:3000/api';

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

export async function fetchProject(id: number): Promise<Project> {
  try {
    const response = await fetch(`${BASE_URL}/project/${id}`);
    if (!response.ok) throw new Error('Failed to fetch project');
    return response.json();
  } catch (error) {
    throw new Error('Error fetching project');
  }
}

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
