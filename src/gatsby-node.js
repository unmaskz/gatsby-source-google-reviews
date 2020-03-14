import { https } from 'follow-redirects';
import fetch from 'node-fetch';
import cheerio from 'cheerio';
import { v4 as uuidv4 } from 'uuid';
import stripHtml from 'string-strip-html';
import moment from 'moment';

const now = moment();

const formatDate = (dateString) => {
  var dateStringArray = dateString.split(' ');
  return now().subtract(dateStringArray[0], dateStringArray[1]).toISOString();
}

exports.sourceNodes = async ({ actions, createNodeId, createContentDigest }, { placeId }) => {
  const { createNode } = actions;

  if (!placeId || typeof placeId !== 'string') {
    throw new Error("You must supply a valid place id from Google. You can find your place id at https://developers.google.com/maps/documentation/javascript/examples/places-placeid-finder.");
  }

  https.get(`https://search.google.com/local/reviews?placeid=${placeId}`, response => {
    return fetch(response.responseUrl)
      .then(res => res.text())
      .then(body => {
        const $ = cheerio.load(body);
        let reviews = [];

        $('.gws-localreviews__general-reviews-block .gws-localreviews__google-review').each(function () {
          let review = {
            id: '',
            author: '',
            content: '',
            score: '',
            createdAt: '',
          };
          review.id = uuidv4();
          review.author = $(this).find('img').attr('alt');
          review.content = stripHtml($(this).find('.review-full-text').text());
          review.score = $(this).find('g-review-stars > span').attr('aria-label').replace('Rated ', '').replace('.0 out of 5,', '');
          review.createdAt = formatDate($(this).find('g-review-stars + span').text());

          reviews.push(review);
        });

        reviews.forEach(review => {
          const nodeContent = JSON.stringify(review);
          const nodeMeta = {
            id: createNodeId(`google-review-${review.id}`),
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
      });
  }).on('error', err => {
    throw new Error("Error accessing the Google page. Try again later..")
  });
};
