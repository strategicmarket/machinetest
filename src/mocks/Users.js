import { fetchData } from './req.js';

export async function userCount() {
  try {
    // Assuming the URL or endpoint to fetch users is 'users.json'
    const users = await fetchData('users.json');
    // Since the mock returns an array of users, the count is just the length of the array.
    return users.length;
  } catch (error) {
    console.error('Failed to fetch user data:', error);
    return 0; // Return 0 if there's an error fetching user data.
  }
}
