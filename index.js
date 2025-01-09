const express = require("express");

const app = express();

require("dotenv").config();

app.use(express.json());

const connectDB = require("./connectMongo");

connectDB();

const BookModel = require("./models/book.model");
// const redis = require('./redis')

// const deleteKeys = async (pattern) => {
//   const keys = await redis.keys(`${pattern}::*`)
//   console.log(keys)
//   if (keys.length > 0) {
//     redis.del(keys)
//   }
// }

app.get("/", (req, res) => res.type('html').send(`
  <!DOCTYPE html>
  <html>
    <head>
      <title>Hello from Render!</title>
      <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.5.1/dist/confetti.browser.min.js"></script>
      <script>
        setTimeout(() => {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            disableForReducedMotion: true
          });
        }, 500);
      </script>
      <style>
        @import url("https://p.typekit.net/p.css?s=1&k=vnd5zic&ht=tk&f=39475.39476.39477.39478.39479.39480.39481.39482&a=18673890&app=typekit&e=css");
        @font-face {
          font-family: "neo-sans";
          src: url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("woff2"), url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/d?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("woff"), url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/a?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("opentype");
          font-style: normal;
          font-weight: 700;
        }
        html {
          font-family: neo-sans;
          font-weight: 700;
          font-size: calc(62rem / 16);
        }
        body {
          background: white;
        }
        section {
          border-radius: 1em;
          padding: 1em;
          position: absolute;
          top: 50%;
          left: 50%;
          margin-right: -50%;
          transform: translate(-50%, -50%);
        }
      </style>
    </head>
    <body>
      <section>
        Hello from Render!
      </section>
    </body>
  </html>
  `));

app.get("/api/v1/books", async (req, res) => {
  const { limit = 5, orderBy = "name", sortBy = "asc", keyword } = req.query;
  let page = +req.query?.page;

  if (!page || page <= 0) page = 1;

  const skip = (page - 1) * + limit;

  const query = {};

  if (keyword) query.name = { $regex: keyword, $options: "i" };

  // const key = `Book::${JSON.stringify({query, page, limit, orderBy, sortBy})}`
  let response = null
  try {
    // const cache = await redis.get(key)
    // if (cache) {
    //   response = JSON.parse(cache)
    // } else {
      const data = await BookModel.find(query).skip(skip).limit(limit).sort({ [orderBy]: sortBy });
      const totalItems = await BookModel.countDocuments(query);

      response = {
        msg: "Ok",
        data,
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
        limit: +limit,
        currentPage: page,
      }

    //   redis.setex(key, 600, JSON.stringify(response))
    // }
    
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      msg: error.message,
    });
  }
});

app.get("/api/v1/books/:id", async (req, res) => {
  try {
    const data = await BookModel.findById(req.params.id);

    if (data) {
      return res.status(200).json({
        msg: "Ok",
        data,
      });
    }

    return res.status(404).json({
      msg: "Not Found",
    });
  } catch (error) {
    return res.status(500).json({
      msg: error.message,
    });
  }
});

app.post("/api/v1/books", async (req, res) => {
  try {
    const { name, author, price, description } = req.body;
    const book = new BookModel({
      name,
      author,
      price,
      description,
    });
    const data = await book.save();
    // deleteKeys('Book')
    return res.status(200).json({
      msg: "Ok",
      data,
    });
  } catch (error) {
    return res.status(500).json({
      msg: error.message,
    });
  }
});

app.put("/api/v1/books/:id", async (req, res) => {
  try {
    const { name, author, price, description } = req.body;
    const { id } = req.params;

    const data = await BookModel.findByIdAndUpdate(
      id,
      {
        name,
        author,
        price,
        description,
      },
      { new: true }
    );
    // deleteKeys('Book')
    return res.status(200).json({
      msg: "Ok",
      data,
    });
  } catch (error) {
    return res.status(500).json({
      msg: error.message,
    });
  }
});

app.delete("/api/v1/books/:id", async (req, res) => {
  try {
    await BookModel.findByIdAndDelete(req.params.id);
    // deleteKeys('Book')
    return res.status(200).json({
      msg: "Ok",
    });
  } catch (error) {
    return res.status(500).json({
      msg: error.message,
    });
  }
});

const PORT = process.env.PORT;

const server = app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});

server.keepAliveTimeout = 120 * 1000;
server.headersTimeout = 120 * 1000;
