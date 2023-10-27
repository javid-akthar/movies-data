const axios = require("axios");
const { Item } = require("../../config/mongoose");

const OMDB_API_URL = process.env.OMDB_API_URL;
const OMDB_API_KEY = process.env.OMDB_API_KEY;

async function fetchMovieData(movie_title) {
  const OMDBResponse = await axios.get(OMDB_API_URL, {
    params: {
      apikey: OMDB_API_KEY,
      t: movie_title,
    },
  });

  return OMDBResponse.data;
}

async function updateOrCreateItem(data, is_favourite) {
  const query = { movie_id: data.imdbID };
  const update = {
    $set: {
      movie_id: data.imdbID,
      movie_title: data.Title,
      extra_info: data,
    },
  };

  if (is_favourite !== undefined && is_favourite !== null) {
    update.$set.is_favourite = is_favourite;
  }

  const options = { upsert: true, new: true, projection: { _id: 0, __v: 0 } };

  return Item.findOneAndUpdate(query, update, options).lean();
}

function handleResponse(res, updatedDocument, data) {
  if (data?.Error) {
    return res.status(400).json({ error: data.Error });
  }

  if (updatedDocument) {
    return res.status(200).json({ ...updatedDocument, success: true });
  }
}

// Controller to search for movies
module.exports.search = async function (req, res) {
  try {
    const { movie_title } = req.query;

    if (!movie_title) {
      return res.status(400).json({
        error: "Please send a valid movie_title",
      });
    }

    const data = await fetchMovieData(movie_title);
    const updatedDocument = await updateOrCreateItem(data);
    handleResponse(res, updatedDocument, data);
  } catch (error) {
    console.error("Error in the search controller:", error);
    return res.status(error?.response?.status || 500).json({
      error: error?.response?.data?.Error || "Internal Server Error",
    });
  }
};

// Controller to add a movie to favorites
module.exports.favourite = async function (req, res) {
  try {
    const { movie_title, is_favourite } = req.query;

    if (!movie_title || is_favourite === undefined || (is_favourite !== 'true' && is_favourite !== 'false')) {
      return res.status(400).json({
        error: !movie_title ? "Please send a valid movie_title" : "Please send a valid is_favourite",
      });
    }

    const data = await fetchMovieData(movie_title);
    const updatedDocument = await updateOrCreateItem(data, is_favourite);
    handleResponse(res, updatedDocument, data);

  } catch (error) {
    console.error("Error in the favorite controller:", error);
    return res.status(error?.response?.status || 500).json({
      error: error?.response?.data?.Error || "Internal Server Error",
    });
  }
};
