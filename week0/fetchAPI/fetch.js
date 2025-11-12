// Write a module that fetches a dataset e.g. 'fake' posts from Json Placeholder. https://jsonplaceholder.typicode.com/posts Use async await, use fetch.

async function fetchPosts(url) {
    return (await fetch(url)).json();
}

const data = await fetchPosts('https://whiskyhunter.net/api/auctions_data/?format=json');
console.log(data);

export { fetchPosts };
