export function checkURLIsImage(url: string) {
  return url.match(/\.(jpeg|jpg|gif|png)$/) != null;
}

// export async function fetchGraphQL(query: string) {
//   console.log(process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID);
//   return fetch(
//     `https://graphql.contentful.com/content/v1/spaces/${process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID}`,
//     {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN}`,
//       },
//       body: JSON.stringify({ query }),
//     }
//   ).then((response) => response.json());
// }
