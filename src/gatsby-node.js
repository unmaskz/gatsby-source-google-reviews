
const axios = require('axios');

exports.sourceNodes = async ({ actions, createNodeId, createContentDigest }, { placeId, apiKey }) => {
  const { createNode } = actions;

  if (!apiKey || typeof apiKey !== 'string') {
    throw new Error("You must supply a valid API Key from Scale Serp. Visit https://scaleserp.com/ for more information.");
  }

  if (!placeId || typeof placeId !== 'string') {
    throw new Error("You must supply a valid place id from Google. You can find your place id at https://developers.google.com/maps/documentation/javascript/examples/places-placeid-finder.");
  }

  const params = {
    api_key: apiKey,
    search_type: "place_reviews",
    place_id: placeId,
  };

  axios.get('https://api.scaleserp.com/search', { params })
  .then(response => {
    const reviews = response.data.place_reviews_results;

    reviews.forEach(review => {
      const nodeContent = JSON.stringify(review);
      const nodeMeta = {
        id: createNodeId(`google-review-${review.source}`),
        parent: null,
        children: [],
        internal: {
          type: `GoogleReview`,
          content: nodeContent,
          contentDigest: createContentDigest(review)
        }
      };
      const node = Object.assign({}, review, nodeMeta);
      createNode(node);
    });

    return;
  }).catch(error => {
    throw new Error(`Error fetching results from ScaleSerp API: ${error}`);
  });
};
