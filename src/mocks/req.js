// This is a simple implementation that assumes fetch is globally available,
// which is true in environments like modern browsers and recent versions of Node.js with global fetch support.

const users = [
  {
    "name": "jim",
    "emoji": "😄"
  },
  {
    "name": "jen",
    "emoji": "😊"
  }
]

export async function fetchData(url) {
    // const response = await fetch(url);
    // if (!response.ok) {
    //   throw new Error('Network response was not ok');
    // }
    // return response.json();
    return users
  }
  