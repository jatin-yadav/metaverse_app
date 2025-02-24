const axios2 = require("axios");

const BACKEND_URL = "http://localhost:3000";
const WS_URL = "ws://localhost:3001";

const axios = {
  post: async (...args) => {
    try {
      const res = await axios2.post(...args);
      return res;
    } catch (e) {
      return e.response;
    }
  },
  get: async (...args) => {
    try {
      const res = await axios2.get(...args);
      return res;
    } catch (e) {
      return e.response;
    }
  },
  put: async (...args) => {
    try {
      const res = await axios2.put(...args);
      return res;
    } catch (e) {
      return e.response;
    }
  },
  delete: async (...args) => {
    try {
      const res = await axios2.delete(...args);
      return res;
    } catch (e) {
      return e.response;
    }
  },
};

const randomNumber = () => {
  return Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
};

test("Check connection to server", async () => {
  const response = await axios.get(`${BACKEND_URL}`);
  expect(response.status).toBe(200);
});

describe("Authentication", () => {
  test("Admin is able to signup", async () => {
    const username = `jatin${randomNumber()}@test.com`;
    const password = "12345678";
    const reqBody = { username, password, type: "admin" };

    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/signup",
        reqBody
      );
      expect(response.status).toBe(200);
    } catch (error) {
      if (error.response) {
        console.error("❌ API Error:", error.response.data);
        console.error("❌ Status Code:", error.response.status);
      } else {
        console.error("❌ Request Failed:", error.message);
      }
      throw error;
    }
  });

  test("User is able to sign up only once", async () => {
    const username = `jatin${Math.random()}@test.com`;
    const password = "12345678";
    await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username,
      password,
      type: "admin",
    });

    const updatedResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username,
      password,
      type: "admin",
    });

    expect(updatedResponse.status).toBe(400);
  });

  test("Signup request fails if the username is empty", async () => {
    const username = `jatin${Math.random()}@test.com`;
    const password = "12345678";

    const response = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      password,
    });

    expect(response.status).toBe(400);
  });

  test("Signin succeeds if the username and password are correct", async () => {
    const username = `jatin${Math.random()}@test.com`;
    const password = "12345678";

    try {
      // Signup
      const signupResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
        username,
        password,
        type: "admin",
      });
      expect(signupResponse.status).toBe(200);

      // Signin
      const signinResponse = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
        username,
        password,
      });

      // Assertions for the signin response
      expect(signinResponse.status).toBe(200);
      expect(signinResponse.data.token).toBeDefined();
    } catch (error) {
      if (error.response) {
        console.error("❌ API Error:", error.response);
        console.error("❌ Status Code:", error.response.status);
      } else {
        console.error("❌ Request Failed:", error.message);
      }
      throw error;
    }
  });

  test("Signin fails if the username and password are incorrect", async () => {
    const username = `jatin${Math.random()}@test.com`;
    const password = "12345678";

    try {
      await axios.post(`${BACKEND_URL}/api/v1/signup`, {
        username,
        password,
        role: "admin",
      });

      const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
        username: "WrongUsername",
        password: "WrongPassword",
      });

      expect(response.status).toBe(400);
    } catch (error) {
      if (error.response) {
        console.error("❌ API Error:", error.response);
        console.error("❌ Status Code:", error.response.status);
      } else {
        console.error("❌ Request Failed:", error.message);
      }
      throw error;
    }
  });
});

// =========================================================================================================================
describe("User metadata endpoint", () => {
  let token = "";
  let avatarId = "";

  beforeAll(async () => {
    const username = `jatin${randomNumber()}@test.com`;
    const password = "12345678";
    const reqBody = { username, password, type: "admin" };

    await axios.post(`${BACKEND_URL}/api/v1/signup`, reqBody);

    const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
      username,
      password,
    });
    token = response.data.token;

    const avatarResponse = await axios.post(
      `${BACKEND_URL}/api/v1/admin/avatar`,
      {
        name: "Timmy",
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s",
      },
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
    avatarId = avatarResponse.data.avatarId;
  });

  test("User cant update their metadata with a wrong avatar id", async () => {
    const response = await axios.post(
      `${BACKEND_URL}/api/v1/user/metadata`,
      {
        avatarId: "123123123",
      },
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );

    expect(response.status).toBe(400);
  });

  test("User can update their metadata with the right avatar id", async () => {
    const response = await axios.post(
      `${BACKEND_URL}/api/v1/user/metadata`,
      {
        avatarId,
      },
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );

    expect(response.status).toBe(200);
  });

  test("User is not able to update their metadata if the auth header is not present", async () => {
    const response = await axios.post(`${BACKEND_URL}/api/v1/user/metadata`, {
      avatarId,
    });

    expect(response.status).toBe(403);
  });
});
// =========================================================================================================================

describe("User avatar information", () => {
  let userId;
  let token = "";
  let avatarId = "";

  beforeAll(async () => {
    const username = `jatin${randomNumber()}@test.com`;
    const password = "12345678";
    const reqBody = { username, password, type: "admin" };

    const signUPresponse = await axios.post(
      `${BACKEND_URL}/api/v1/signup`,
      reqBody
    );
    userId = signUPresponse.data.userID;

    const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
      username,
      password,
    });
    token = response.data.token;

    const avatarResponse = await axios.post(
      `${BACKEND_URL}/api/v1/admin/avatar`,
      {
        name: "Timmy",
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s",
      },
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
    avatarId = avatarResponse.data.avatarId;

    await axios.post(
      `${BACKEND_URL}/api/v1/user/metadata`,
      {
        avatarId,
      },
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
  });

  test("Get back avatar information for a user", async () => {
    const response = await axios.get(
      `${BACKEND_URL}/api/v1/user/metadata/bulk?ids=[${userId}]`,
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );

    expect(response.data.avatars.length).toBe(1);
    expect(response.data.avatars[0].userId).toBe(userId);
  });

  test("Available avatars lists the recently created avatar", async () => {
    const response = await axios.get(`${BACKEND_URL}/api/v1/avatars`);
    expect(response.data.avatars.length).not.toBe(0);
    const currentAvatar = response.data.avatars.find((x) => x.id == avatarId);
    expect(currentAvatar).toBeDefined();
  });
});

// =========================================================================================================================

describe("Space information", () => {
  let mapId;
  let element1Id;
  let element2Id;
  let adminToken;
  let adminId;
  let userToken;
  let userId;

  jest.setTimeout(30000);
  beforeAll(async () => {
    try {
      const username = `jatin${randomNumber()}@test.com`;
      const password = "12345678";
      const reqBody = { username, password, type: "admin" };

      const signupResponse = await axios.post(
        `${BACKEND_URL}/api/v1/signup`,
        reqBody
      );

      adminId = signupResponse.data.userID;

      const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
        username,
        password,
      });

      adminToken = response.data.token;

      const userSignupResponse = await axios.post(
        `${BACKEND_URL}/api/v1/signup`,
        {
          username: `user_${username}`,
          password,
          type: "user",
        }
      );

      userId = userSignupResponse.data.userID;

      const userSigninResponse = await axios.post(
        `${BACKEND_URL}/api/v1/signin`,
        {
          username: `user_${username}`,
          password,
        }
      );

      userToken = userSigninResponse.data.token;

      const element1Response = await axios.post(
        `${BACKEND_URL}/api/v1/admin/element`,
        {
          imageUrl:
            "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
          width: 1,
          height: 1,
          static: true,
        },
        {
          headers: {
            authorization: `Bearer ${adminToken}`,
          },
        }
      );
      element1Id = element1Response.data.id;

      const element2Response = await axios.post(
        `${BACKEND_URL}/api/v1/admin/element`,
        {
          imageUrl:
            "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
          width: 1,
          height: 1,
          static: true,
        },
        {
          headers: {
            authorization: `Bearer ${adminToken}`,
          },
        }
      );
      element2Id = element2Response.data.id;

      const mapResponse = await axios.post(
        `${BACKEND_URL}/api/v1/admin/map`,
        {
          thumbnail: "https://thumbnail.com/a.png",
          dimensions: "100x200",
          name: "Test MAP",
          defaultElements: [
            {
              elementId: element1Id,
              x: 20,
              y: 20,
            },
            {
              elementId: element1Id,
              x: 18,
              y: 20,
            },
            {
              elementId: element2Id,
              x: 19,
              y: 20,
            },
          ],
        },
        {
          headers: {
            authorization: `Bearer ${adminToken}`,
          },
        }
      );
      mapId = mapResponse.data.id;
    } catch (error) {
      console.error("Error in beforeAll setup:", error);
    }
  });

  test("User is able to create a space without mapId (empty space)", async () => {
    const response = await axios.post(
      `${BACKEND_URL}/api/v1/space`,
      {
        name: "Test",
        dimensions: "100x200",
      },
      {
        headers: {
          authorization: `Bearer ${userToken}`,
        },
      }
    );

    expect(response.data.spaceId).toBeDefined();
  });

  test("User is able to create a space with mapId", async () => {
    const response = await axios.post(
      `${BACKEND_URL}/api/v1/space`,
      {
        name: "Test",
        dimensions: "100x200",
        mapId,
      },
      {
        headers: {
          authorization: `Bearer ${userToken}`,
        },
      }
    );
    expect(response.status).toBe(200);
    expect(response.data.spaceId).toBeDefined();
  });

  test("User is not able to create a space without mapId and dimensions", async () => {
    const response = await axios.post(
      `${BACKEND_URL}/api/v1/space`,
      {
        name: "Test",
      },
      {
        headers: {
          authorization: `Bearer ${userToken}`,
        },
      }
    );

    expect(response.status).toBe(400);
  });

  test("User is not able to delete a space that doesnt exist", async () => {
    const response = await axios.delete(
      `${BACKEND_URL}/api/v1/space/randomIdDoesntExist`,
      {
        headers: {
          authorization: `Bearer ${userToken}`,
        },
      }
    );

    expect(response.status).toBe(400);
  });

  test("User is able to delete a space that does exist", async () => {
    const response = await axios.post(
      `${BACKEND_URL}/api/v1/space`,
      {
        name: "Test",
        dimensions: "100x200",
      },
      {
        headers: {
          authorization: `Bearer ${userToken}`,
        },
      }
    );

    const deleteReponse = await axios.delete(
      `${BACKEND_URL}/api/v1/space/${response.data.spaceId}`,
      {
        headers: {
          authorization: `Bearer ${userToken}`,
        },
      }
    );

    expect(deleteReponse.status).toBe(200);
  });

  test("User should not be able to delete a space created by another user", async () => {
    const response = await axios.post(
      `${BACKEND_URL}/api/v1/space`,
      {
        name: "Test",
        dimensions: "100x200",
      },
      {
        headers: {
          authorization: `Bearer ${userToken}`,
        },
      }
    );

    const deleteReponse = await axios.delete(
      `${BACKEND_URL}/api/v1/space/${response.data.spaceId}`,
      {
        headers: {
          authorization: `Bearer ${adminToken}`,
        },
      }
    );

    expect(deleteReponse.status).toBe(403);
  });

  test("Admin has no spaces initially", async () => {
    const response = await axios.get(`${BACKEND_URL}/api/v1/space/all`, {
      headers: {
        authorization: `Bearer ${adminToken}`,
      },
    });
    expect(response.data.spaces.length).toBe(0);
  });

  test("Admin has gets once space after", async () => {
    const spaceCreateReponse = await axios.post(
      `${BACKEND_URL}/api/v1/space`,
      {
        name: "Test",
        dimensions: "100x200",
      },
      {
        headers: {
          authorization: `Bearer ${adminToken}`,
        },
      }
    );
    const response = await axios.get(`${BACKEND_URL}/api/v1/space/all`, {
      headers: {
        authorization: `Bearer ${adminToken}`,
      },
    });
    const filteredSpace = response.data.spaces.find(
      (x) => x.id == spaceCreateReponse.data.spaceId
    );
    expect(response.data.spaces.length).toBe(1);
    expect(filteredSpace).toBeDefined();
  });
});

// =========================================================================================================================

describe("Arena endpoints", () => {
  let mapId;
  let element1Id;
  let element2Id;
  let adminToken;
  let adminId;
  let userToken;
  let userId;
  let spaceId;

  jest.setTimeout(30000);
  beforeAll(async () => {
    try {
      const username = `jatin${randomNumber()}@test.com`;
      const password = "12345678";
      const reqBody = { username, password, type: "admin" };

      const signupResponse = await axios.post(
        `${BACKEND_URL}/api/v1/signup`,
        reqBody
      );

      adminId = signupResponse.data.userId;

      const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
        username,
        password,
      });

      adminToken = response.data.token;

      const userSignupResponse = await axios.post(
        `${BACKEND_URL}/api/v1/signup`,
        {
          username: `user_${username}`,
          password,
          type: "user",
        }
      );

      userId = userSignupResponse.data.userId;

      const userSigninResponse = await axios.post(
        `${BACKEND_URL}/api/v1/signin`,
        {
          username: `user_${username}`,
          password,
        }
      );

      userToken = userSigninResponse.data.token;

      const element1Response = await axios.post(
        `${BACKEND_URL}/api/v1/admin/element`,
        {
          imageUrl:
            "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
          width: 1,
          height: 1,
          static: true,
        },
        {
          headers: {
            authorization: `Bearer ${adminToken}`,
          },
        }
      );
      element1Id = element1Response.data.id;

      const element2Response = await axios.post(
        `${BACKEND_URL}/api/v1/admin/element`,
        {
          imageUrl:
            "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
          width: 1,
          height: 1,
          static: true,
        },
        {
          headers: {
            authorization: `Bearer ${adminToken}`,
          },
        }
      );
      element2Id = element2Response.data.id;

      const mapResponse = await axios.post(
        `${BACKEND_URL}/api/v1/admin/map`,
        {
          thumbnail: "https://thumbnail.com/a.png",
          dimensions: "100x200",
          name: "Test MAP",
          defaultElements: [
            {
              elementId: element1Id,
              x: 20,
              y: 20,
            },
            {
              elementId: element1Id,
              x: 18,
              y: 20,
            },
            {
              elementId: element2Id,
              x: 19,
              y: 20,
            },
          ],
        },
        {
          headers: {
            authorization: `Bearer ${adminToken}`,
          },
        }
      );
      mapId = mapResponse.data.id;

      const spaceResponse = await axios.post(
        `${BACKEND_URL}/api/v1/space`,
        {
          name: "Test",
          dimensions: "100x200",
          mapId: mapId,
        },
        {
          headers: {
            authorization: `Bearer ${userToken}`,
          },
        }
      );
      spaceId = spaceResponse.data.spaceId;
    } catch (error) {
      console.error("Error in beforeAll setup:", error);
    }
  });

  test("Incorrect spaceId returns a 400", async () => {
    const response = await axios.get(`${BACKEND_URL}/api/v1/space/123kasdk01`, {
      headers: {
        authorization: `Bearer ${userToken}`,
      },
    });
    expect(response.status).toBe(400);
  });

  test("Correct spaceId returns all the elements", async () => {
    const response = await axios.get(`${BACKEND_URL}/api/v1/space/${spaceId}`, {
      headers: {
        authorization: `Bearer ${userToken}`,
      },
    });
    expect(response.data.dimensions).toBe("100x200");
    expect(response.data.elements.length).toBe(3);
  });

  test("Delete endpoint is able to delete an element", async () => {
    const response = await axios.get(`${BACKEND_URL}/api/v1/space/${spaceId}`, {
      headers: {
        authorization: `Bearer ${userToken}`,
      },
    });

    let res = await axios.delete(
      `${BACKEND_URL}/api/v1/space/element/${response.data.elements[0].id}`,
      {
        headers: {
          authorization: `Bearer ${userToken}`,
        },
      }
    );

    const newResponse = await axios.get(
      `${BACKEND_URL}/api/v1/space/${spaceId}`,
      {
        headers: {
          authorization: `Bearer ${userToken}`,
        },
      }
    );

    expect(newResponse.data.elements.length).toBe(2);
  });

  test("Adding an element fails if the element lies outside the dimensions", async () => {
    const newResponse = await axios.post(
      `${BACKEND_URL}/api/v1/space/element`,
      {
        elementId: element1Id,
        spaceId: spaceId,
        x: 10000,
        y: 210000,
      },
      {
        headers: {
          authorization: `Bearer ${userToken}`,
        },
      }
    );

    expect(newResponse.status).toBe(400);
  });

  test("Adding an element works as expected", async () => {
    await axios.post(
      `${BACKEND_URL}/api/v1/space/element`,
      {
        elementId: element1Id,
        spaceId: spaceId,
        x: 50,
        y: 20,
      },
      {
        headers: {
          authorization: `Bearer ${userToken}`,
        },
      }
    );

    const newResponse = await axios.get(
      `${BACKEND_URL}/api/v1/space/${spaceId}`,
      {
        headers: {
          authorization: `Bearer ${userToken}`,
        },
      }
    );

    expect(newResponse.data.elements.length).toBe(3);
  });
});

// =========================================================================================================================

describe("Admin Endpoints", () => {
  let adminToken;
  let adminId;
  let userToken;
  let userId;

  beforeAll(async () => {
    const username = `jatin${randomNumber()}@test.com`;
    const password = "12345678";
    const reqBody = { username, password, type: "admin" };

    const signupResponse = await axios.post(
      `${BACKEND_URL}/api/v1/signup`,
      reqBody
    );

    adminId = signupResponse.data.userId;

    const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
      username: username,
      password,
    });

    adminToken = response.data.token;

    const userSignupResponse = await axios.post(
      `${BACKEND_URL}/api/v1/signup`,
      {
        username: `user_${username}`,
        password,
        type: "user",
      }
    );

    userId = userSignupResponse.data.userId;

    const userSigninResponse = await axios.post(
      `${BACKEND_URL}/api/v1/signin`,
      {
        username: `user_${username}`,
        password,
      }
    );

    userToken = userSigninResponse.data.token;
  });

  test("User is not able to hit admin Endpoints", async () => {
    const elementReponse = await axios.post(
      `${BACKEND_URL}/api/v1/admin/element`,
      {
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
        width: 1,
        height: 1,
        static: true,
      },
      {
        headers: {
          authorization: `Bearer ${userToken}`,
        },
      }
    );

    const mapResponse = await axios.post(
      `${BACKEND_URL}/api/v1/admin/map`,
      {
        thumbnail: "https://thumbnail.com/a.png",
        dimensions: "100x200",
        name: "test space",
        defaultElements: [],
      },
      {
        headers: {
          authorization: `Bearer ${userToken}`,
        },
      }
    );

    const avatarResponse = await axios.post(
      `${BACKEND_URL}/api/v1/admin/avatar`,
      {
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s",
        name: "Timmy",
      },
      {
        headers: {
          authorization: `Bearer ${userToken}`,
        },
      }
    );

    const updateElementResponse = await axios.put(
      `${BACKEND_URL}/api/v1/admin/element/123`,
      {
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s",
      },
      {
        headers: {
          authorization: `Bearer ${userToken}`,
        },
      }
    );

    expect(elementReponse.status).toBe(403);
    expect(mapResponse.status).toBe(403);
    expect(avatarResponse.status).toBe(403);
    expect(updateElementResponse.status).toBe(403);
  });

  test("Admin is able to hit admin Endpoints", async () => {
    const elementReponse = await axios.post(
      `${BACKEND_URL}/api/v1/admin/element`,
      {
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
        width: 1,
        height: 1,
        static: true,
      },
      {
        headers: {
          authorization: `Bearer ${adminToken}`,
        },
      }
    );

    const mapResponse = await axios.post(
      `${BACKEND_URL}/api/v1/admin/map`,
      {
        thumbnail: "https://thumbnail.com/a.png",
        name: "Space",
        dimensions: "100x200",
        defaultElements: [],
      },
      {
        headers: {
          authorization: `Bearer ${adminToken}`,
        },
      }
    );

    const avatarResponse = await axios.post(
      `${BACKEND_URL}/api/v1/admin/avatar`,
      {
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s",
        name: "Timmy",
      },
      {
        headers: {
          authorization: `Bearer ${adminToken}`,
        },
      }
    );
    expect(elementReponse.status).toBe(200);
    expect(mapResponse.status).toBe(200);
    expect(avatarResponse.status).toBe(200);
  });

  test("Admin is able to update the imageUrl for an element", async () => {
    const elementResponse = await axios.post(
      `${BACKEND_URL}/api/v1/admin/element`,
      {
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
        width: 1,
        height: 1,
        static: true,
      },
      {
        headers: {
          authorization: `Bearer ${adminToken}`,
        },
      }
    );

    const updateElementResponse = await axios.put(
      `${BACKEND_URL}/api/v1/admin/element/${elementResponse.data.id}`,
      {
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s",
      },
      {
        headers: {
          authorization: `Bearer ${adminToken}`,
        },
      }
    );

    expect(updateElementResponse.status).toBe(200);
  });
});

// =========================================================================================================================

describe("Websocket tests", () => {
  let adminToken;
  let adminUserId;
  let userToken;
  let adminId;
  let userId;
  let mapId;
  let element1Id;
  let element2Id;
  let spaceId;
  let ws1;
  let ws2;
  let ws1Messages = [];
  let ws2Messages = [];
  let userX;
  let userY;
  let adminX;
  let adminY;

  function waitForAndPopLatestMessage(messageArray, timeout = 5000) {
    return new Promise((resolve, reject) => {
      if (messageArray.length > 0) {
        return resolve(messageArray.shift());
      }

      const startTime = Date.now();

      const checkMessage = () => {
        if (messageArray.length > 0) {
          return resolve(messageArray.shift());
        }
        if (Date.now() - startTime >= timeout) {
          return reject(
            new Error("Timeout: No message received within the given time.")
          );
        }
        setTimeout(checkMessage, 100);
      };

      checkMessage();
    });
  }

  async function setupHTTP() {
    const username = `jatin${randomNumber()}@test.com`;
    const password = "12345678";
    const reqBody = { username, password, type: "admin" };

    const adminSignupResponse = await axios.post(
      `${BACKEND_URL}/api/v1/signup`,
      reqBody
    );

    const adminSigninResponse = await axios.post(
      `${BACKEND_URL}/api/v1/signin`,
      {
        username,
        password,
      }
    );

    adminUserId = adminSignupResponse.data.userID;
    adminToken = adminSigninResponse.data.token;

    const userSignupResponse = await axios.post(
      `${BACKEND_URL}/api/v1/signup`,
      {
        username: `user_${username}`,
        password,
        type: "user",
      }
    );
    userId = userSignupResponse.data.userID;

    const userSigninResponse = await axios.post(
      `${BACKEND_URL}/api/v1/signin`,
      {
        username: `user_${username}`,
        password,
      }
    );

    userToken = userSigninResponse.data.token;
    const element1Response = await axios.post(
      `${BACKEND_URL}/api/v1/admin/element`,
      {
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
        width: 1,
        height: 1,
        static: true,
      },
      {
        headers: {
          authorization: `Bearer ${adminToken}`,
        },
      }
    );

    const element2Response = await axios.post(
      `${BACKEND_URL}/api/v1/admin/element`,
      {
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
        width: 1,
        height: 1,
        static: true,
      },
      {
        headers: {
          authorization: `Bearer ${adminToken}`,
        },
      }
    );
    element1Id = element1Response.data.id;
    element2Id = element2Response.data.id;

    const mapResponse = await axios.post(
      `${BACKEND_URL}/api/v1/admin/map`,
      {
        thumbnail: "https://thumbnail.com/a.png",
        dimensions: "100x200",
        name: "Defaul space",
        defaultElements: [
          {
            elementId: element1Id,
            x: 20,
            y: 20,
          },
          {
            elementId: element1Id,
            x: 18,
            y: 20,
          },
          {
            elementId: element2Id,
            x: 19,
            y: 20,
          },
        ],
      },
      {
        headers: {
          authorization: `Bearer ${adminToken}`,
        },
      }
    );
    mapId = mapResponse.data.id;

    const spaceResponse = await axios.post(
      `${BACKEND_URL}/api/v1/space`,
      {
        name: "Test",
        dimensions: "100x200",
        mapId: mapId,
      },
      {
        headers: {
          authorization: `Bearer ${userToken}`,
        },
      }
    );
    spaceId = spaceResponse.data.spaceId;
  }
  async function setupWs() {
    // Close existing connections before opening new ones
    if (ws1) ws1.close();
    if (ws2) ws2.close();

    ws1 = new WebSocket(WS_URL);

    ws1.onopen = () => console.log("WS1 connected ✅");
    ws1.onerror = (error) => console.error("WS1 error ❌", error);
    ws1.onclose = () => console.log("WS1 disconnected 🔌");

    ws1.onmessage = (event) => {
      console.log("Received WS1 message:", event.data);
      ws1Messages.push(JSON.parse(event.data));
    };

    await new Promise((resolve) => (ws1.onopen = resolve));

    ws2 = new WebSocket(WS_URL);

    ws2.onopen = () => console.log("WS2 connected ✅");
    ws2.onerror = (error) => console.error("WS2 error ❌", error);
    ws2.onclose = () => console.log("WS2 disconnected 🔌");

    ws2.onmessage = (event) => {
      console.log("Received WS2 message:", event.data);
      ws2Messages.push(JSON.parse(event.data));
    };

    await new Promise((resolve) => (ws2.onopen = resolve));
  }

  beforeAll(async () => {
    await setupHTTP();
    await setupWs();
  });

  test("Get back ack for joining the space", async () => {
    ws1.send(
      JSON.stringify({
        type: "join",
        payload: {
          spaceId: spaceId,
          token: adminToken,
        },
      })
    );

    try {
      const message1 = await waitForAndPopLatestMessage(ws1Messages, 3000);
      expect(message1.type).toBe("space-joined");
      expect(message1.payload.users.length).toBe(0);

      // Store admin spawn position
      adminX = message1.payload.spawn.x;
      adminY = message1.payload.spawn.y;
    } catch (error) {
      console.error("Timeout waiting for message1:", error.message);
      throw error; // Fail the test explicitly
    }

    ws2.send(
      JSON.stringify({
        type: "join",
        payload: {
          spaceId: spaceId,
          token: userToken,
        },
      })
    );

    try {
      const message2 = await waitForAndPopLatestMessage(ws2Messages, 3000);
      expect(message2.type).toBe("space-joined");
      expect(message2.payload.users.length).toBe(1);
      userY = message2.payload.spawn.y;
      userX = message2.payload.spawn.x;

      const message3 = await waitForAndPopLatestMessage(ws1Messages, 3000);
      expect(message3.type).toBe("user-joined");
      expect(message3.payload.x).toBe(message2.payload.spawn.x);
      expect(message3.payload.y).toBe(message2.payload.spawn.y);
      expect(message3.payload.userId).toBe(userId);

      // Store user spawn position
    } catch (error) {
      console.error(
        "Timeout waiting for messages2 or message3:",
        error.message
      );
      throw error; // Fail the test explicitly
    }
  });

  test("User should not be able to move across the boundary of the wall", async () => {
    ws1.send(
      JSON.stringify({
        type: "move",
        payload: {
          x: 1000000,
          y: 10000,
        },
      })
    );

    const message = await waitForAndPopLatestMessage(ws1Messages);
    expect(message.type).toBe("movement-rejected");
    expect(message.payload.x).toBe(adminX);
    expect(message.payload.y).toBe(adminY);
  });

  test("User should not be able to move two blocks at the same time", async () => {
    ws1.send(
      JSON.stringify({
        type: "move",
        payload: {
          x: adminX + 2,
          y: adminY,
        },
      })
    );

    const message = await waitForAndPopLatestMessage(ws1Messages);
    expect(message.type).toBe("movement-rejected");
    expect(message.payload.x).toBe(adminX);
    expect(message.payload.y).toBe(adminY);
  });

  test("Correct movement should be broadcasted to the other sockets in the room", async () => {
    ws1.send(
      JSON.stringify({
        type: "move",
        payload: {
          x: adminX + 1,
          y: adminY,
          userId: adminId,
        },
      })
    );

    const message = await waitForAndPopLatestMessage(ws2Messages);
    expect(message.type).toBe("movement");
    expect(message.payload.x).toBe(adminX + 1);
    expect(message.payload.y).toBe(adminY);
  });

  test("If a user leaves, the other user receives a leave event", async () => {
    ws1.close();
    const message = await waitForAndPopLatestMessage(ws2Messages);
    expect(message.type).toBe("user-left");
    expect(message.payload.userId).toBe(adminUserId);
  });
});
