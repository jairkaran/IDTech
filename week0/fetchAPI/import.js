// Import the fetch.js module with the exported functions.
import { fetchPosts } from "./fetch";

// Display only the first 5 post title and body. Function is not complete, fill in the blanks.
async function displayPosts() {
    const posts = await fetchPosts(url);
    console.log(posts);

    posts.slice(0, 5).forEach(post => {
        console.log(`Title: ${post.auction_name}`);
        console.log(`Date: ${post.dt}`);
    });
}

displayPosts();