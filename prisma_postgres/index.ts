import express from "express";
import { prisma } from "./lib/prisma";

const app = express();

app.use(express.json());

app.get("/ping", (req, res) => {
  res.json("200 OK");
});

app.listen("3000", () => {
  console.log("Listening at port 3000...");
});

app
  .route("/user")
  .get(async (_req, res) => {
    const users = await prisma.user.findMany({
      // Ypu could have also used include, incase you just wanted to add the count field with the other fields as output
      select: {
        email: true,
        name: true,

        // It does a group by of no. of post wrt to the users
        _count: {
          select: {
            posts: true,
            // You can also other field depending on which you want to give the counts
            comments: true,
          },
        },
      },
    });

    res.json(users);
  })
  .post(async (req, res) => {
    const { name, email, bio } = req.body;

    const findUser = await prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
      },
    });

    if (findUser) {
      return res.status(409).json({
        message: "Cannot create duplicate user",
      });
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        profile: {
          // create is a keyword here, where you will place data to also insert profile related to the user
          create: {
            bio,
          },
        },

        // You can also add Posts to be added related to this user
        //   posts: {
        //       create: [
        //           {....},
        //           {....},
        //   ]
        //   }
      },
    });
    res.json({
      status: "200 OK",
      data: user,
    });
  });

app
  .route("/user/:id")
  .get(async (req, res) => {
    const { id } = req.params;

    const findUser = await prisma.user.findFirst({
      where: {
        id: parseInt(id),
      },
      include: {
        // This will show all the data coming up from corresponding posts by the user
        // posts: true,

        posts: {
          // This will select andow  shonly the relevant field mentioned
          select: {
            title: true,
            content: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    res.json({
      data: findUser,
    });
  })
  .put(async (req, res) => {
    const { id } = req.params;

    const findUser = await prisma.user.findFirst({
      where: {
        id: parseInt(id),
      },
    });

    if (!findUser) {
      return res.status(400).json({
        message: "User does not exist",
      });
    }

    const { name, email } = req.body;

    let updatedUser = await prisma.user.update({
      where: {
        id: parseInt(id),
      },
      data: {
        name,
        email,
      },
    });

    return res.json({
      status: "200 OK",
      updatedUser,
    });
  });

app
  .route("/post")
  .post(async (req, res) => {
    const { title, content, authorId } = req.body;

    const post = await prisma.post.create({
      data: {
        title,
        content,
        authorId,
      },
    });
    res.json({
      status: "200 OK",
      data: post,
    });
  })
  .get(async (_req, res) => {
    let data = await prisma.post.findMany({
      include: {
        // comments: true
        comments: {
          select: {
            comment: true,
            createdAt: true,
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },

      orderBy: {
        id: "desc",
      },
    });

    res.json(data);
  });

app.post("/comment", async (req, res) => {
  const { post_id, comment } = req.body;

  let findPost = await prisma.post.findFirst({
    where: {
      id: Number(post_id),
    },
  });

  if (!findPost) {
    return res.json({ message: "Post not present" });
  }

  let newComment = await prisma.comment.create({
    data: {
      user_id: Number(findPost.authorId),
      post_id: Number(post_id),
      comment,
    },
  });

  res.json({
    data: newComment,
  });
});
