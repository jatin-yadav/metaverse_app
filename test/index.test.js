const { default: axios } = require("axios");

const BACKEND_BASE_URL = "http://localhost:8080";

describe("Authentication", () => {
  test("Admin is able to sign up only once", async () => {
    const username = "jatin" + Math.floor(Math.random() * 1000); //random username like jatin123
    const password = "123456";

    const response = await axios.post(`${BACKEND_BASE_URL}/api/v1/signup`, {
      username,
      password,
      type: "admin",
    });
    except(response.statusCode).toBe(200);

    const updatedresponse = await axios.post(
      `${BACKEND_BASE_URL}/api/v1/signup`,
      {
        username,
        password,
        type: "admin",
      }
    );
    except(updatedresponse.statusCode).toBe(400);
  });

  test("user is able to sign up only once", async () => {
    const username = "jatin" + Math.floor(Math.random() * 1000); //random username like jatin123
    const password = "123456";

    const response = await axios.post(`${BACKEND_BASE_URL}/api/v1/signup`, {
      username,
      password,
      type: "user",
    });
    except(response.statusCode).toBe(200);

    const updatedresponse = await axios.post(
      `${BACKEND_BASE_URL}/api/v1/signup`,
      {
        username,
        password,
        type: "user",
      }
    );
    except(updatedresponse.statusCode).toBe(400);
  });

  test("unable to signup if username is missing", async () => {
    const password = "123456";

    const response = await axios.post(`${BACKEND_BASE_URL}/api/v1/signup`, {
      password,
      type: "admin",
    });
    except(response.statusCode).toBe(400);

    const updatedresponse = await axios.post(
      `${BACKEND_BASE_URL}/api/v1/signup`,
      {
        password,
        type: "user",
      }
    );
    except(updatedresponse.statusCode).toBe(400);
  });

  test("signin succeeds if username and password are correct", async () => {
    const username = "jatin" + Math.floor(Math.random() * 1000); //random username like jatin123
    const password = "123456";

    await axios.post(`${BACKEND_BASE_URL}/api/v1/signup`, {
      username,
      password,
      type: "admin",
    });

    const response = await axios.post(`${BACKEND_BASE_URL}/api/v1/signin`, {
      username,
      password,
    });
    except(response.statusCode).toBe(200);
    except(response.body.token).toBeDefined();
  });

  test("signin fails if username and password are incorrect", async () => {
    const username = "jatin" + Math.floor(Math.random() * 1000); //random username like jatin123
    const password = "123456";

    await axios.post(`${BACKEND_BASE_URL}/api/v1/signup`, {
      username,
      password,
      type: "admin",
    });

    const response = await axios.post(`${BACKEND_BASE_URL}/api/v1/signin`, {
      username: "wrongusername",
      password,
    });
    except(response.statusCode).toBe(403);
    except(response.body.token).toBeDefined();
  });
});

describe("User metadata endoints", () => {
  let token = null;
  let avatarId = null;

  beforeAll(async () => {
    const username = "jatin" + Math.floor(Math.random() * 1000); //random username like jatin123
    const password = "123456";

    await axios.post(`${BACKEND_BASE_URL}/api/v1/signup`, {
      username,
      password,
      type: "admin",
    });

    const response = await axios.post(
      `${BACKEND_BASE_URL}/api/v1/signin`,
      {
        username,
        password,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    token = response.data.body.token;

    const avatarResponse = await axios.post(
      `${BACKEND_BASE_URL}/api/v1/admin/avatar`,
      {
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s",
        name: "Timmy",
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    avatarId = avatarResponse.data.body.avatarId;
  });

  test("User can't update their metadata with wrong avtar id", async () => {
    const response = await axios.post(
      `${BACKEND_BASE_URL}/api/v1/user/metadata`,
      {
        avatarId: "12356",
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    except(response.statusCode).toBe(400);
  });

  test("User can update their metadata with right avtar id", async () => {
    const response = await axios.post(
      `${BACKEND_BASE_URL}/api/v1/user/metadata`,
      {
        avatarId,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    except(response.statusCode).toBe(200);
  });

  test("User can't update their metadata without auth token", async () => {
    const response = await axios.post(
      `${BACKEND_BASE_URL}/api/v1/user/metadata`,
      {
        avatarId,
      }
    );
    except(response.statusCode).toBe(403);
  });
});

describe("User avatar info endpoints", () => {
  let token = null;
  let avatarId = null;
  let userId = null;

  beforeAll(async () => {
    const username = "jatin" + Math.floor(Math.random() * 1000); //random username like jatin123
    const password = "123456";

    const signupResponse = await axios.post(
      `${BACKEND_BASE_URL}/api/v1/signup`,
      {
        username,
        password,
        type: "admin",
      }
    );
    userId = signupResponse.data.body.userId;

    const response = await axios.post(
      `${BACKEND_BASE_URL}/api/v1/signin`,
      {
        username,
        password,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    token = response.data.body.token;

    const avatarResponse = await axios.post(
      `${BACKEND_BASE_URL}/api/v1/admin/avatar`,
      {
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s",
        name: "Timmy",
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    avatarId = avatarResponse.data.body.avatarId;
  });

  test("User can get avatar info with userId", async () => {
    const response = await axios.get(
      `${BACKEND_BASE_URL}/api/v1/user/metadat/bluk?ids=[${userId}]`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    except(response.data.avatars.length).toBe(1);
    except(response.data.avatars[0].userId).toBe(userId);
  });

  test("Available avtars list the recently created avtar", async () => {
    const response = await axios.get(`${BACKEND_BASE_URL}/api/v1/avatars`);
    except(response.data.avatars.length).not.toBe(0);
    const currentAvatar = response.data.avatars.find((x) => x.id === avatarId);
    except(currentAvatar).toBeDefined();
  });
});

describe("space informatin", () => {
  let mapId;
  let element1Id;
  let element2Id;
  let adminToken;
  let userToken;
  let adminId;
  let userId;

  beforeAll(async () => {
    const adminname = "jatin" + Math.floor(Math.random() * 1000); //random username like jatin123
    const password = "123456";
    // -----------------------------------------------------------
    const signupResponse = await axios.post(
      `${BACKEND_BASE_URL}/api/v1/signup`,
      {
        adminname,
        password,
        type: "admin",
      }
    );
    adminId = signupResponse.data.body.userId;

    const response = await axios.post(
      `${BACKEND_BASE_URL}/api/v1/signin`,
      {
        adminname,
        password,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    adminToken = response.data.body.token;
    // -----------------------------------------------------------
    const username = "jatin" + Math.floor(Math.random() * 1000); //random username like jatin123
    const userSignupResponse = await axios.post(
      `${BACKEND_BASE_URL}/api/v1/signup`,
      {
        username,
        password,
        type: "admin",
      }
    );
    adminId = userSignupResponse.data.body.userId;

    const userResponse = await axios.post(
      `${BACKEND_BASE_URL}/api/v1/signin`,
      {
        username,
        password,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    adminToken = userResponse.data.body.token;

    //   -----------------------------------------------------------

    const element1 = await axios.post(
      `${BACKEND_BASE_URL}/api/v1/admin/element`,
      {
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
        width: 1,
        height: 1,
        static: true, // weather or not the user can sit on top of this element (is it considered as a collission or not)
      },
      { headers: { Authorization: `Bearer ${adminToken}` } }
    );
    element1Id = element1.data.body.id;

    const element2 = await axios.post(
      `${BACKEND_BASE_URL}/api/v1/admin/element`,
      {
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
        width: 1,
        height: 1,
        static: true, // weather or not the user can sit on top of this element (is it considered as a collission or not)
      },
      { headers: { Authorization: `Bearer ${adminToken}` } }
    );
    element2Id = element2.data.body.id;

    const map = await axios.post(
      `${BACKEND_BASE_URL}/api/v1/admin/map`,
      {
        thumbnail: "https://thumbnail.com/a.png",
        dimensions: "100x200",
        name: "100 person interview room",
        defaultElements: [
          {
            elementId: element1Id,
            x: 20,
            y: 20,
          },
          {
            elementId: element2Id,
            x: 18,
            y: 20,
          },
          {
            elementId: element1Id,
            x: 19,
            y: 20,
          },
        ],
      },
      { headers: { Authorization: `Bearer ${adminToken}` } }
    );
    mapId = map.data.body.id;
  });

  test("user is able to create a space", async () => {
    const response = axios.post(
      `${BACKEND_BASE_URL}/api/v1/space`,
      {
        name: "Test",
        dimensions: "100x200",
        mapId: mapId,
      },
      { headers: { Authorization: `Bearer ${userToken}` } }
    );

    except(response.spaceId).toBeDefined();
  });

  test("user is able to create a space without mapId (empty space)", async () => {
    const response = axios.post(
      `${BACKEND_BASE_URL}/api/v1/space`,
      {
        name: "Test",
        dimensions: "100x200",
      },
      { headers: { Authorization: `Bearer ${userToken}` } }
    );
    except(response.spaceId).toBeDefined();
  });

  test("user is not able to create a space without mapId and dimensions)", async () => {
    const response = axios.post(
      `${BACKEND_BASE_URL}/api/v1/space`,
      {
        name: "Test",
      },
      { headers: { Authorization: `Bearer ${userToken}` } }
    );

    except(response.statusCode).toBe(400);
  });

  test("user is not able to delete a space that doesn't exist", async () => {
    const response = axios.delete(
      `${BACKEND_BASE_URL}/api/v1/space/randomIdDoesntExist`,
      { headers: { Authorization: `Bearer ${userToken}` } }
    );

    except(response.statusCode).toBe(400);
  });

  test("user is able to delete a space that does exist", async () => {
    const response = axios.post(
      `${BACKEND_BASE_URL}/api/v1/space`,
      {
        name: "Test",
        dimensions: "100x200",
      },
      { headers: { Authorization: `Bearer ${userToken}` } }
    );
    const spaceId = (await response).data.body.spaceId;
    const deleteResponse = axios.delete(
      `${BACKEND_BASE_URL}/api/v1/space/${spaceId}`,
      { headers: { Authorization: `Bearer ${userToken}` } }
    );

    except(deleteResponse.statusCode).toBe(200);
  });

  test("user should not able to delete a space created by another user", async () => {
    const response = axios.post(
      `${BACKEND_BASE_URL}/api/v1/space`,
      {
        name: "Test",
        dimensions: "100x200",
      },
      { headers: { Authorization: `Bearer ${userToken}` } }
    );
    const spaceId = (await response).data.body.spaceId;
    const deleteResponse = axios.delete(
      `${BACKEND_BASE_URL}/api/v1/space/${spaceId}`,
      { headers: { Authorization: `Bearer ${adminToken}` } }
    );

    except(deleteResponse.statusCode).toBe(400);
  });

  test("Admin has no space initially", async () => {
    const response = axios.get(`${BACKEND_BASE_URL}/api/v1/space/all`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });

    except(response.data.body.spaces.length).toBe(0);
  });

  test("Admin can create a space", async () => {
    const spaceCreateResponse = axios.post(
      `${BACKEND_BASE_URL}/api/v1/space`,
      {
        name: "Test",
        dimensions: "100x200",
      },
      {
        headers: { Authorization: `Bearer ${adminToken}` },
      }
    );

    const spaceResponse = axios.get(`${BACKEND_BASE_URL}/api/v1/space/all`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });

    const filteredSpace = spaceResponse.data.body.spaces.filter(
      (x) => x.id === spaceCreateResponse.data.body.spaceId
    );
    except(spaceResponse.data.body.spaces.length).toBe(1);
    except(filteredSpace).toBeDefined();
  });
});

describe("Arena endpoints", () => {
  let mapId;
  let element1Id;
  let element2Id;
  let adminToken;
  let userToken;
  let adminId;
  let userId;
  let spaceId;

  beforeAll(async () => {
    const adminname = "jatin" + Math.floor(Math.random() * 1000); //random username like jatin123
    const password = "123456";
    // -----------------------------------------------------------
    const signupResponse = await axios.post(
      `${BACKEND_BASE_URL}/api/v1/signup`,
      {
        adminname,
        password,
        type: "admin",
      }
    );
    adminId = signupResponse.data.body.userId;

    const response = await axios.post(
      `${BACKEND_BASE_URL}/api/v1/signin`,
      {
        adminname,
        password,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    adminToken = response.data.body.token;
    // -----------------------------------------------------------
    const username = "jatin" + Math.floor(Math.random() * 1000); //random username like jatin123
    const userSignupResponse = await axios.post(
      `${BACKEND_BASE_URL}/api/v1/signup`,
      {
        username,
        password,
        type: "admin",
      }
    );
    adminId = userSignupResponse.data.body.userId;

    const userResponse = await axios.post(
      `${BACKEND_BASE_URL}/api/v1/signin`,
      {
        username,
        password,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    adminToken = userResponse.data.body.token;

    //   -----------------------------------------------------------

    const element1 = await axios.post(
      `${BACKEND_BASE_URL}/api/v1/admin/element`,
      {
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
        width: 1,
        height: 1,
        static: true, // weather or not the user can sit on top of this element (is it considered as a collission or not)
      },
      { headers: { Authorization: `Bearer ${adminToken}` } }
    );
    element1Id = element1.data.body.id;

    const element2 = await axios.post(
      `${BACKEND_BASE_URL}/api/v1/admin/element`,
      {
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
        width: 1,
        height: 1,
        static: true, // weather or not the user can sit on top of this element (is it considered as a collission or not)
      },
      { headers: { Authorization: `Bearer ${adminToken}` } }
    );
    element2Id = element2.data.body.id;

    const map = await axios.post(
      `${BACKEND_BASE_URL}/api/v1/admin/map`,
      {
        thumbnail: "https://thumbnail.com/a.png",
        dimensions: "100x200",
        name: "100 person interview room",
        defaultElements: [
          {
            elementId: element1Id,
            x: 20,
            y: 20,
          },
          {
            elementId: element2Id,
            x: 18,
            y: 20,
          },
          {
            elementId: element1Id,
            x: 19,
            y: 20,
          },
        ],
      },
      { headers: { Authorization: `Bearer ${adminToken}` } }
    );
    mapId = map.data.body.id;

    const space = await axios.post(
      "`${BACKEND_BASE_URL}/api/v1/space",
      { name: "Test", dimensions: "100x200", mapId },
      { headers: { Authorization: `Bearer ${adminToken}` } }
    );

    spaceId = space.data.body.spaceId;
  });

  test("Incorrect spaceId should return 400", async () => {
    const response = axios.get(
      `${BACKEND_BASE_URL}/api/v1/arena/space/randomIdDoesntExist`
    );
    expect(response.statusCode).toBe(400);
  });

  test("Correct spaceId should return all elements", async () => {
    const response = axios.get(
      `${BACKEND_BASE_URL}/api/v1/arena/space/${spaceId}`
    );
    expect(response.dats.dimensions).toBe("100x200");
    expect(response.data.elements.length).toBe(3);
  });

  test("Delete endpoint is able to delete an element", async () => {
    const response = axios.get(`${BACKEND_BASE_URL}/api/v1/space/${spaceId}`);

    axios.delete(`${BACKEND_BASE_URL}/api/v1/arena/space/element`, {
      spaceId,
      elementId: response.data.elements[0].id,
    });

    const newResponse = axios.get(
      `${BACKEND_BASE_URL}/api/v1/space/${spaceId}`,
      { headers: { Authorization: `Bearer ${userToken}` } }
    );
    expect(newResponse.data.elements).toBe(2);
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

describe("Admin Endpoints", () => {
  let adminToken;
  let adminId;
  let userToken;
  let userId;

  beforeAll(async () => {
    const username = `kirat-${Math.random()}`;
    const password = "123456";

    const signupResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username,
      password,
      type: "admin",
    });

    adminId = signupResponse.data.userId;

    const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
      username: username,
      password,
    });

    adminToken = response.data.token;

    const userSignupResponse = await axios.post(
      `${BACKEND_URL}/api/v1/signup`,
      {
        username: username + "-user",
        password,
        type: "user",
      }
    );

    userId = userSignupResponse.data.userId;

    const userSigninResponse = await axios.post(
      `${BACKEND_URL}/api/v1/signin`,
      {
        username: username + "-user",
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
