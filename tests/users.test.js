const request = require("supertest");
const app = require("../index.js");
const { User } = require("../models/index.js");
const jwt = require("jsonwebtoken");
const { jwt_secret } = require("../config/config.json")["development"];
describe("testing/users", () => {
  let token;
  let resUser;
  const user = {
    name: "Username",
    email: "test@example.com",
    password: "123456",
    role: "user",
    confirmed: false,
  };

  beforeEach(async () => {
    resUser = await request(app).post("/users/register").send(user).expect(201);
    const emailToken = jwt.sign({ email: user.email }, jwt_secret, {
      expiresIn: "48h",
    });
    await request(app)
      .get("/users/confirm/" + emailToken)
      .expect(201);
    const res = await request(app)
      .post("/users/login")
      .send({ email: "test@example.com", password: "123456" })
      .expect(200);
    token = res.body.token;
  });

  afterAll(() => {
    return User.destroy({ where: {}, truncate: true });
  });

  test("Create a user", async () => {
    let usersCount = await User.count();
    expect(usersCount).toBe(1);
    const sendUser = {
      ...user,
      id: resUser.body.user.id,
      password: resUser.body.user.password,
      createdAt: resUser.body.user.createdAt,
      updatedAt: resUser.body.user.updatedAt,
    };
    const newUser = resUser.body.user;
    usersCount = await User.count();
    expect(usersCount).toBe(1);
    expect(resUser.body.user.id).toBeDefined();
    expect(resUser.body.user.createdAt).toBeDefined();
    expect(resUser.body.user.updatedAt).toBeDefined();
    expect(newUser).toEqual(sendUser);
  });

  test("Login a user", async () => {
    const res = await request(app)
      .post("/users/login")
      .send({ email: "test@example.com", password: "123456" })
      .expect(200);
    token = res.body.token;
  });

  test("Get users", async () => {
    const res = await request(app)
      .get("/users")
      .expect(200)
      .set({ Authorization: token });
    expect(res.body).toBeInstanceOf(Array);
  });

  test("Update a user record", async () => {
    const updateUser = { name: "Updated name" };
    const res = await request(app)
      .put("/users/id/1")
      .send(updateUser)
      .set({ Authorization: token })
      .expect(200);
    expect(res.text).toBe("Usuario actualizado con éxito");
  });

  test("Logout a user record", async () => {
    const res = await request(app)
      .delete("/users/logout")
      .set({ Authorization: token })
      .expect(200);
    expect(res.body.message).toBe("Desconectado con éxito");
  });
});
