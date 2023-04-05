const request = require("supertest");
const app = require("../index.js");
const { User } = require("../models/index.js");
const jwt = require("jsonwebtoken");
const { jwt_secret } = require("../config/config.json")["development"];
describe("testing/users", () => {
  afterAll(() => {
    return User.destroy({ where: {}, truncate: true });
  });

  let token;
  const user = {
    name: "Username",
    email: "test@example.com",
    password: "123456",
    role: "user",
    confirmed: false,
  };

  test("Create a user", async () => {
    let usersCount = await User.count();
    expect(usersCount).toBe(0);

    const res = await request(app)
      .post("/users/register")
      .send(user)
      .expect(201);
    const sendUser = {
      ...user,
      id: res.body.user.id,
      password: res.body.user.password,
      createdAt: res.body.user.createdAt,
      updatedAt: res.body.user.updatedAt,
    };
    const newUser = res.body.user;
    usersCount = await User.count();
    expect(usersCount).toBe(1);
    expect(res.body.user.id).toBeDefined();
    expect(res.body.user.createdAt).toBeDefined();
    expect(res.body.user.updatedAt).toBeDefined();
    expect(newUser).toEqual(sendUser);
  });
  test("Confirm a user", async () => {
    const emailToken = jwt.sign({ email: user.email }, jwt_secret, {
      expiresIn: "48h",
    });
    const res = await request(app)
      .get("/users/confirm/" + emailToken)
      .expect(201);
    expect(res.text).toBe("Usuario confirmado con éxito");
  });
  test("Login a user", async () => {
    const res = await request(app)
      .post("/users/login")
      .send({ email: "test@example.com", password: "123456" })
      .expect(200);
    console.warn(res.body.token);
    token = res.body.token;
  });
  test("Get users", async () => {
    setTimeout(async () => {
      const res = await request(app)
        .get("/users")
        .expect(200)
        .set({ Authorization: token });
      expect(res.body).toBeInstanceOf(Array);
    }, 2000);
  });
  test("Update a user record", async () => {
    const updateUser = { name: "Updated name" };
    setTimeout(async () => {
      const res = await request(app)
        .put("/users/id/1")
        .send(updateUser)
        .set({ Authorization: token })
        .expect(200);
      expect(res.text).toBe("Usuario actualizado con éxito");
    });
  }, 2000);
  test("Logout a user record", async () => {
    const res = await request(app)
      .delete("/users/logout")
      .set({ Authorization: token })
      .expect(200);
    expect(res.body.message).toBe("Desconectado con éxito");
  });
});
