const express = require("express");
const cors = require("cors");
const app = express();
const models = require("./models");
const product = require("./models/product");
const multer = require("multer");
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
  }),
});
// const upload = multer({ dest: "uploads/" });
const port = 8080;

app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));

app.get("/banners", (req, res) => {
  models.Banner.findAll({
    limit: 2,
  })
    .then((result) => {
      res.send({
        banners: result,
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("에러발생");
    });
});

app.get("/products", (req, res) => {
  models.product
    .findAll({
      order: [["createdAt", "DESC"]],
      attributes: [
        "id",
        "name",
        "price",
        "createdAt",
        "seller",
        "imageUrl",
        "soldout",
      ],
    })
    .then((result) => {
      console.log("products:", result);
      res.send({ products: result });
    })
    .catch((error) => {
      console.error(error);
      res.status(400).send("에러발생");
    });
});

app.post("/products", (req, res) => {
  const body = req.body;
  const { name, description, price, seller, imageUrl } = body;
  if (!name || !description || !price || !seller || !imageUrl) {
    res.status(400).send("모든 필드를 입력해주세요");
  }
  models.product
    .create({
      name,
      description,
      price,
      seller,
      imageUrl,
    })
    .then((result) => {
      console.log("상품 생성 결과", result);
      res.send({
        result,
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(400).send("상품 업로드에 문제가 발생했습니다.");
    });
});

app.get("/products/:id", (req, res) => {
  const params = req.params;
  const { id } = params;
  // res.send(`id는 ${id}입니다`);
  models.product
    .findOne({
      where: {
        id,
      },
    })
    .then((result) => {
      console.log("product:", result);
      res.send({
        product: result,
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(400).send("상품 조회에 문제가 발생했습니다.");
    });
});

app.post("/image", upload.single("image"), (req, res) => {
  const file = req.file;
  console.log(file);
  res.send({
    imageUrl: file.path,
  });
});

app.post("/purchase/:id", (req, res) => {
  const { id } = req.params;
  models.product
    .update(
      {
        soldout: 1,
      },
      {
        where: {
          id,
        },
      }
    )
    .then((result) => {
      res.send({
        result: true,
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("에러발생");
    });
});

app.listen(port, () => {
  console.log("서버돌아가는중");
  models.sequelize
    .sync()
    .then(() => {
      console.log("db 연결 성공");
    })
    .catch((eff) => {
      console.log(err);
      console.log("db 연결 에러");
      process.exit();
    });
});
