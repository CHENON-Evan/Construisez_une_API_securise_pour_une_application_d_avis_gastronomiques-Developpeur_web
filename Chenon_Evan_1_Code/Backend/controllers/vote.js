const { getSauce, sendClientResponse } = require('./sauces');
const Sauce = require('../models/sauces');

function likeSauce(req, res) {
  // Find the sauce in the data base
  Sauce.findOne({ _id: req.params.id })

    .then((sauce) => {
      // reset like and dislike

      resetUserLikeAndDislike(sauce);

      // Updating like and dislike with incrementation

      switch (req.body.like) {
        case 1:
          // Like

          sauce.usersLiked.push(req.body.userId);

          sauce.likes++;

          break;

        case -1:
          // Dislike

          sauce.usersDisliked.push(req.body.userId);

          sauce.dislikes++;

          break;
      }

      // Save new value of like/dislike

      sauce
        .save()

        .then(() => res.status(200).json({ message: 'Sauce modifiée' }))

        .catch((error) => res.status(400).json({ error }));
    })

    .catch((error) => res.status(400).json({ error }));

  function resetUserLikeAndDislike(sauce) {
    // Find users who liked and disliked the sauce

    const indexUserLiked = sauce.usersLiked.indexOf(req.body.userId);

    const indexUserDisliked = sauce.usersDisliked.indexOf(req.body.userId);

    if (indexUserLiked > -1) {
      // if user liked the sauce

      sauce.usersLiked.splice(indexUserLiked, 1);

      sauce.likes--;
    }

    if (indexUserDisliked > -1) {
      // if user disliked the sauce

      sauce.usersDisliked.splice(indexUserDisliked, 1);

      sauce.dislikes--;
    }
  }
}

function updateVote(product, like, userId, res) {
  if (like === 1 || like === -1) return incrementVote(product, userId, like);
  return resetVote(product, userId, res);
}

function resetVote(product, userId, res) {
  const { usersLiked, usersDisliked } = product;
  if ([usersLiked, usersDisliked].every((arr) => arr.includes(userId)))
    return Promise.reject('User seems to have voted both ways');

  if (![usersLiked, usersDisliked].some((arr) => arr.includes(userId)))
    return Promise.reject('User seems to not have voted');

  if (usersLiked.includes(userId)) {
    --product.likes;
    product.usersLiked = product.usersLiked.filter((id) => id !== userId);
  } else {
    --product.dislikes;
    product.usersDisliked = product.usersDisliked.filter((id) => id !== userId);
  }

  return product;
}

function incrementVote(product, userId, like) {
  const { usersLiked, usersDisliked } = product;

  const votersArray = like === 1 ? usersLiked : usersDisliked;
  if (votersArray.includes(userId)) return product;
  votersArray.push(userId);

  like === 1 ? ++product.likes : ++product.dislikes;
  return product;
}

module.exports = { likeSauce };
