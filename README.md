# gatsby-source-google-reviews

```
npm i gatsby-source-google-reviews
```

```
yarn add gatsby-source-google-reviews
```

Want to show your Google reviews in your Gatsby application? Then this is the package for you.

Install this package, and add `'gatsby-source-google-reviews'` to your plugins array in `gatsby-config.js` as shown below:

```
plugins: [
  {
    resolve: `gatsby-source-google-reviews`,
    options: {
      placeId: `placeid`,
    },
  },
]
```

You can find your place id [here](https://developers.google.com/maps/documentation/javascript/examples/places-placeid-finder). Simply input the business or location name and Google will do the rest.

Once you have added the environment variable above, you can run `gatsby develop`. Proceed to the GraphQL interface e.g. `localhost:3000/___graphql`.

You can then run the following query to fetch all your Google reviews.

```
{
  GoogleReview {
    edges {
      node {
        id
        author
        content
        score
        createdAt
      }
    }
  }
}
```


