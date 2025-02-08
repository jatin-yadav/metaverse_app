const axios2 = require("axios");
const BACKEND_BASE_URL = "http://localhost:3000";
const WS_URL = "ws://localhost:8081";

// we are doing this because we want to catch the error and return the response object but if we use axios directly then it will throw an error and we will not be able to catch it
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

test("TESTS is able to reach http server", async () => {
  const response = await axios.get(BACKEND_BASE_URL);
  expect(response.status).toBe(200);
});

describe("Authentication", () => {
  test("Admin is able to sign up only once", async () => {
    const username = "jatin" + Math.floor(Math.random() * 1000); //random username like jatin123
    const password = "12345678";

    const response = await axios.post(`${BACKEND_BASE_URL}/api/v1/signup`, {
      username,
      password,
      type: "admin",
    });
    expect(response.statusCode).toBe(200);

    const updatedresponse = await axios.post(
      `${BACKEND_BASE_URL}/api/v1/signup`,
      {
        username,
        password,
        type: "admin",
      }
    );
    expect(updatedresponse.statusCode).toBe(400);
  });

  // test("user is able to sign up only once", async () => {
  //   const username = "jatin" + Math.floor(Math.random() * 1000); //random username like jatin123
  //   const password = "123456";

  //   const response = await axios.post(`${BACKEND_BASE_URL}/api/v1/signup`, {
  //     username,
  //     password,
  //     type: "user",
  //   });
  //   expect(response.statusCode).toBe(200);

  //   const updatedresponse = await axios.post(
  //     `${BACKEND_BASE_URL}/api/v1/signup`,
  //     {
  //       username,
  //       password,
  //       type: "user",
  //     }
  //   );
  //   expect(updatedresponse.statusCode).toBe(400);
  // });

  // test("unable to signup if username is missing", async () => {
  //   const password = "123456";

  //   const response = await axios.post(`${BACKEND_BASE_URL}/api/v1/signup`, {
  //     password,
  //     type: "admin",
  //   });
  //   expect(response.statusCode).toBe(400);

  //   const updatedresponse = await axios.post(
  //     `${BACKEND_BASE_URL}/api/v1/signup`,
  //     {
  //       password,
  //       type: "user",
  //     }
  //   );
  //   expect(updatedresponse.statusCode).toBe(400);
  // });

  // test("signin succeeds if username and password are correct", async () => {
  //   const username = "jatin" + Math.floor(Math.random() * 1000); //random username like jatin123
  //   const password = "123456";

  //   await axios.post(`${BACKEND_BASE_URL}/api/v1/signup`, {
  //     username,
  //     password,
  //     type: "admin",
  //   });

  //   const response = await axios.post(`${BACKEND_BASE_URL}/api/v1/signin`, {
  //     username,
  //     password,
  //   });
  //   expect(response.statusCode).toBe(200);
  //   expect(response.body.token).toBeDefined();
  // });

  // test("signin fails if username and password are incorrect", async () => {
  //   const username = "jatin" + Math.floor(Math.random() * 1000); //random username like jatin123
  //   const password = "123456";

  //   await axios.post(`${BACKEND_BASE_URL}/api/v1/signup`, {
  //     username,
  //     password,
  //     type: "admin",
  //   });

  //   const response = await axios.post(`${BACKEND_BASE_URL}/api/v1/signin`, {
  //     username: "wrongusername",
  //     password,
  //   });
  //   expect(response.statusCode).toBe(403);
  //   expect(response.body.token).toBeDefined();
  // });
});

// describe("User metadata endoints", () => {
//   let token = null;
//   let avatarId = null;

//   beforeAll(async () => {
//     const username = "jatin" + Math.floor(Math.random() * 1000); //random username like jatin123
//     const password = "123456";

//     await axios.post(`${BACKEND_BASE_URL}/api/v1/signup`, {
//       username,
//       password,
//       type: "admin",
//     });

//     const response = await axios.post(
//       `${BACKEND_BASE_URL}/api/v1/signin`,
//       {
//         username,
//         password,
//       },
//       { headers: { Authorization: `Bearer ${token}` } }
//     );

//     token = response.data.body.token;

//     const avatarResponse = await axios.post(
//       `${BACKEND_BASE_URL}/api/v1/admin/avatar`,
//       {
//         imageUrl:
//           "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s",
//         name: "Timmy",
//       },
//       { headers: { Authorization: `Bearer ${token}` } }
//     );
//     avatarId = avatarResponse.data.body.avatarId;
//   });

//   test("User can't update their metadata with wrong avtar id", async () => {
//     const response = await axios.post(
//       `${BACKEND_BASE_URL}/api/v1/user/metadata`,
//       {
//         avatarId: "12356",
//       },
//       { headers: { Authorization: `Bearer ${token}` } }
//     );
//      expect(response.statusCode).toBe(400);
//   });

//   test("User can update their metadata with right avtar id", async () => {
//     const response = await axios.post(
//       `${BACKEND_BASE_URL}/api/v1/user/metadata`,
//       {
//         avatarId,
//       },
//       { headers: { Authorization: `Bearer ${token}` } }
//     );
//      expect(response.statusCode).toBe(200);
//   });

//   test("User can't update their metadata without auth token", async () => {
//     const response = await axios.post(
//       `${BACKEND_BASE_URL}/api/v1/user/metadata`,
//       {
//         avatarId,
//       }
//     );
//      expect(response.statusCode).toBe(403);
//   });
// });

// describe("User avatar info endpoints", () => {
//   let token = null;
//   let avatarId = null;
//   let userId = null;

//   beforeAll(async () => {
//     const username = "jatin" + Math.floor(Math.random() * 1000); //random username like jatin123
//     const password = "123456";

//     const signupResponse = await axios.post(
//       `${BACKEND_BASE_URL}/api/v1/signup`,
//       {
//         username,
//         password,
//         type: "admin",
//       }
//     );
//     userId = signupResponse.data.body.userId;

//     const response = await axios.post(
//       `${BACKEND_BASE_URL}/api/v1/signin`,
//       {
//         username,
//         password,
//       },
//       { headers: { Authorization: `Bearer ${token}` } }
//     );

//     token = response.data.body.token;

//     const avatarResponse = await axios.post(
//       `${BACKEND_BASE_URL}/api/v1/admin/avatar`,
//       {
//         imageUrl:
//           "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s",
//         name: "Timmy",
//       },
//       { headers: { Authorization: `Bearer ${token}` } }
//     );
//     avatarId = avatarResponse.data.body.avatarId;
//   });

//   test("User can get avatar info with userId", async () => {
//     const response = await axios.get(
//       `${BACKEND_BASE_URL}/api/v1/user/metadat/bluk?ids=[${userId}]`,
//       { headers: { Authorization: `Bearer ${token}` } }
//     );
//      expect(response.data.avatars.length).toBe(1);
//      expect(response.data.avatars[0].userId).toBe(userId);
//   });

//   test("Available avtars list the recently created avtar", async () => {
//     const response = await axios.get(`${BACKEND_BASE_URL}/api/v1/avatars`);
//      expect(response.data.avatars.length).not.toBe(0);
//     const currentAvatar = response.data.avatars.find((x) => x.id === avatarId);
//      expect(currentAvatar).toBeDefined();
//   });
// });

// describe("space informatin", () => {
//   let mapId;
//   let element1Id;
//   let element2Id;
//   let adminToken;
//   let userToken;
//   let adminId;
//   let userId;

//   beforeAll(async () => {
//     const adminname = "jatin" + Math.floor(Math.random() * 1000); //random username like jatin123
//     const password = "123456";
//     // -----------------------------------------------------------
//     const signupResponse = await axios.post(
//       `${BACKEND_BASE_URL}/api/v1/signup`,
//       {
//         adminname,
//         password,
//         type: "admin",
//       }
//     );
//     adminId = signupResponse.data.body.userId;

//     const response = await axios.post(
//       `${BACKEND_BASE_URL}/api/v1/signin`,
//       {
//         adminname,
//         password,
//       },
//       { headers: { Authorization: `Bearer ${token}` } }
//     );
//     adminToken = response.data.body.token;
//     // -----------------------------------------------------------
//     const username = "jatin" + Math.floor(Math.random() * 1000); //random username like jatin123
//     const userSignupResponse = await axios.post(
//       `${BACKEND_BASE_URL}/api/v1/signup`,
//       {
//         username,
//         password,
//         type: "admin",
//       }
//     );
//     adminId = userSignupResponse.data.body.userId;

//     const userResponse = await axios.post(
//       `${BACKEND_BASE_URL}/api/v1/signin`,
//       {
//         username,
//         password,
//       },
//       { headers: { Authorization: `Bearer ${token}` } }
//     );
//     adminToken = userResponse.data.body.token;

//     //   -----------------------------------------------------------

//     const element1 = await axios.post(
//       `${BACKEND_BASE_URL}/api/v1/admin/element`,
//       {
//         imageUrl:
//           "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
//         width: 1,
//         height: 1,
//         static: true, // weather or not the user can sit on top of this element (is it considered as a collission or not)
//       },
//       { headers: { Authorization: `Bearer ${adminToken}` } }
//     );
//     element1Id = element1.data.body.id;

//     const element2 = await axios.post(
//       `${BACKEND_BASE_URL}/api/v1/admin/element`,
//       {
//         imageUrl:
//           "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
//         width: 1,
//         height: 1,
//         static: true, // weather or not the user can sit on top of this element (is it considered as a collission or not)
//       },
//       { headers: { Authorization: `Bearer ${adminToken}` } }
//     );
//     element2Id = element2.data.body.id;

//     const map = await axios.post(
//       `${BACKEND_BASE_URL}/api/v1/admin/map`,
//       {
//         thumbnail: "https://thumbnail.com/a.png",
//         dimensions: "100x200",
//         name: "100 person interview room",
//         defaultElements: [
//           {
//             elementId: element1Id,
//             x: 20,
//             y: 20,
//           },
//           {
//             elementId: element2Id,
//             x: 18,
//             y: 20,
//           },
//           {
//             elementId: element1Id,
//             x: 19,
//             y: 20,
//           },
//         ],
//       },
//       { headers: { Authorization: `Bearer ${adminToken}` } }
//     );
//     mapId = map.data.body.id;
//   });

//   test("user is able to create a space", async () => {
//     const response = axios.post(
//       `${BACKEND_BASE_URL}/api/v1/space`,
//       {
//         name: "Test",
//         dimensions: "100x200",
//         mapId: mapId,
//       },
//       { headers: { Authorization: `Bearer ${userToken}` } }
//     );

//      expect(response.spaceId).toBeDefined();
//   });

//   test("user is able to create a space without mapId (empty space)", async () => {
//     const response = axios.post(
//       `${BACKEND_BASE_URL}/api/v1/space`,
//       {
//         name: "Test",
//         dimensions: "100x200",
//       },
//       { headers: { Authorization: `Bearer ${userToken}` } }
//     );
//      expect(response.spaceId).toBeDefined();
//   });

//   test("user is not able to create a space without mapId and dimensions)", async () => {
//     const response = axios.post(
//       `${BACKEND_BASE_URL}/api/v1/space`,
//       {
//         name: "Test",
//       },
//       { headers: { Authorization: `Bearer ${userToken}` } }
//     );

//      expect(response.statusCode).toBe(400);
//   });

//   test("user is not able to delete a space that doesn't exist", async () => {
//     const response = axios.delete(
//       `${BACKEND_BASE_URL}/api/v1/space/randomIdDoesntExist`,
//       { headers: { Authorization: `Bearer ${userToken}` } }
//     );

//      expect(response.statusCode).toBe(400);
//   });

//   test("user is able to delete a space that does exist", async () => {
//     const response = axios.post(
//       `${BACKEND_BASE_URL}/api/v1/space`,
//       {
//         name: "Test",
//         dimensions: "100x200",
//       },
//       { headers: { Authorization: `Bearer ${userToken}` } }
//     );
//     const spaceId = (await response).data.body.spaceId;
//     const deleteResponse = axios.delete(
//       `${BACKEND_BASE_URL}/api/v1/space/${spaceId}`,
//       { headers: { Authorization: `Bearer ${userToken}` } }
//     );

//      expect(deleteResponse.statusCode).toBe(200);
//   });

//   test("user should not able to delete a space created by another user", async () => {
//     const response = axios.post(
//       `${BACKEND_BASE_URL}/api/v1/space`,
//       {
//         name: "Test",
//         dimensions: "100x200",
//       },
//       { headers: { Authorization: `Bearer ${userToken}` } }
//     );
//     const spaceId = (await response).data.body.spaceId;
//     const deleteResponse = axios.delete(
//       `${BACKEND_BASE_URL}/api/v1/space/${spaceId}`,
//       { headers: { Authorization: `Bearer ${adminToken}` } }
//     );

//      expect(deleteResponse.statusCode).toBe(400);
//   });

//   test("Admin has no space initially", async () => {
//     const response = axios.get(`${BACKEND_BASE_URL}/api/v1/space/all`, {
//       headers: { Authorization: `Bearer ${adminToken}` },
//     });

//      expect(response.data.body.spaces.length).toBe(0);
//   });

//   test("Admin can create a space", async () => {
//     const spaceCreateResponse = axios.post(
//       `${BACKEND_BASE_URL}/api/v1/space`,
//       {
//         name: "Test",
//         dimensions: "100x200",
//       },
//       {
//         headers: { Authorization: `Bearer ${adminToken}` },
//       }
//     );

//     const spaceResponse = axios.get(`${BACKEND_BASE_URL}/api/v1/space/all`, {
//       headers: { Authorization: `Bearer ${adminToken}` },
//     });

//     const filteredSpace = spaceResponse.data.body.spaces.filter(
//       (x) => x.id === spaceCreateResponse.data.body.spaceId
//     );
//      expect(spaceResponse.data.body.spaces.length).toBe(1);
//      expect(filteredSpace).toBeDefined();
//   });
// });

// describe("Arena endpoints", () => {
//   let mapId;
//   let element1Id;
//   let element2Id;
//   let adminToken;
//   let userToken;
//   let adminId;
//   let userId;
//   let spaceId;

//   beforeAll(async () => {
//     const adminname = "jatin" + Math.floor(Math.random() * 1000); //random username like jatin123
//     const password = "123456";
//     // -----------------------------------------------------------
//     const signupResponse = await axios.post(
//       `${BACKEND_BASE_URL}/api/v1/signup`,
//       {
//         adminname,
//         password,
//         type: "admin",
//       }
//     );
//     adminId = signupResponse.data.body.userId;

//     const response = await axios.post(
//       `${BACKEND_BASE_URL}/api/v1/signin`,
//       {
//         adminname,
//         password,
//       },
//       { headers: { Authorization: `Bearer ${token}` } }
//     );
//     adminToken = response.data.body.token;
//     // -----------------------------------------------------------
//     const username = "jatin" + Math.floor(Math.random() * 1000); //random username like jatin123
//     const userSignupResponse = await axios.post(
//       `${BACKEND_BASE_URL}/api/v1/signup`,
//       {
//         username,
//         password,
//         type: "admin",
//       }
//     );
//     adminId = userSignupResponse.data.body.userId;

//     const userResponse = await axios.post(
//       `${BACKEND_BASE_URL}/api/v1/signin`,
//       {
//         username,
//         password,
//       },
//       { headers: { Authorization: `Bearer ${token}` } }
//     );
//     adminToken = userResponse.data.body.token;

//     //   -----------------------------------------------------------

//     const element1 = await axios.post(
//       `${BACKEND_BASE_URL}/api/v1/admin/element`,
//       {
//         imageUrl:
//           "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
//         width: 1,
//         height: 1,
//         static: true, // weather or not the user can sit on top of this element (is it considered as a collission or not)
//       },
//       { headers: { Authorization: `Bearer ${adminToken}` } }
//     );
//     element1Id = element1.data.body.id;

//     const element2 = await axios.post(
//       `${BACKEND_BASE_URL}/api/v1/admin/element`,
//       {
//         imageUrl:
//           "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
//         width: 1,
//         height: 1,
//         static: true, // weather or not the user can sit on top of this element (is it considered as a collission or not)
//       },
//       { headers: { Authorization: `Bearer ${adminToken}` } }
//     );
//     element2Id = element2.data.body.id;

//     const map = await axios.post(
//       `${BACKEND_BASE_URL}/api/v1/admin/map`,
//       {
//         thumbnail: "https://thumbnail.com/a.png",
//         dimensions: "100x200",
//         name: "100 person interview room",
//         defaultElements: [
//           {
//             elementId: element1Id,
//             x: 20,
//             y: 20,
//           },
//           {
//             elementId: element2Id,
//             x: 18,
//             y: 20,
//           },
//           {
//             elementId: element1Id,
//             x: 19,
//             y: 20,
//           },
//         ],
//       },
//       { headers: { Authorization: `Bearer ${adminToken}` } }
//     );
//     mapId = map.data.body.id;

//     const space = await axios.post(
//       "`${BACKEND_BASE_URL}/api/v1/space",
//       { name: "Test", dimensions: "100x200", mapId },
//       { headers: { Authorization: `Bearer ${adminToken}` } }
//     );

//     spaceId = space.data.body.spaceId;
//   });

//   test("Incorrect spaceId should return 400", async () => {
//     const response = axios.get(
//       `${BACKEND_BASE_URL}/api/v1/arena/space/randomIdDoesntExist`,
//       { headers: { Authorization: `Bearer ${userToken}` } }
//     );
//     expect(response.statusCode).toBe(400);
//   });

//   test("Correct spaceId should return all elements", async () => {
//     const response = axios.get(
//       `${BACKEND_BASE_URL}/api/v1/arena/space/${spaceId}`,
//       { headers: { Authorization: `Bearer ${userToken}` } }
//     );
//     expect(response.dats.dimensions).toBe("100x200");
//     expect(response.data.elements.length).toBe(3);
//   });

//   test("Delete endpoint is able to delete an element", async () => {
//     const response = axios.get(`${BACKEND_BASE_URL}/api/v1/space/${spaceId}`, {
//       headers: { Authorization: `Bearer ${userToken}` },
//     });

//     axios.delete(`${BACKEND_BASE_URL}/api/v1/arena/space/element`, {
//       spaceId,
//       elementId: response.data.elements[0].id,
//     });

//     const newResponse = axios.get(
//       `${BACKEND_BASE_URL}/api/v1/space/${spaceId}`,
//       { headers: { Authorization: `Bearer ${userToken}` } }
//     );
//     expect(newResponse.data.elements).toBe(2);
//   });

//   test("Adding an element fails if the element lies outside the dimensions", async () => {
//     const newResponse = await axios.post(
//       `${BACKEND_URL}/api/v1/space/element`,
//       {
//         elementId: element1Id,
//         spaceId: spaceId,
//         x: 10000,
//         y: 210000,
//       },
//       {
//         headers: {
//           authorization: `Bearer ${userToken}`,
//         },
//       }
//     );

//     expect(newResponse.status).toBe(400);
//   });

//   test("Adding an element works as expected", async () => {
//     await axios.post(
//       `${BACKEND_URL}/api/v1/space/element`,
//       {
//         elementId: element1Id,
//         spaceId: spaceId,
//         x: 50,
//         y: 20,
//       },
//       {
//         headers: {
//           authorization: `Bearer ${userToken}`,
//         },
//       }
//     );

//     const newResponse = await axios.get(
//       `${BACKEND_URL}/api/v1/space/${spaceId}`,
//       {
//         headers: {
//           authorization: `Bearer ${userToken}`,
//         },
//       }
//     );

//     expect(newResponse.data.elements.length).toBe(3);
//   });
// });

// describe("Admin Endpoints", () => {
//   let adminToken;
//   let adminId;
//   let userToken;
//   let userId;

//   beforeAll(async () => {
//     const username = `kirat-${Math.random()}`;
//     const password = "123456";

//     const signupResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
//       username,
//       password,
//       type: "admin",
//     });

//     adminId = signupResponse.data.userId;

//     const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
//       username: username,
//       password,
//     });

//     adminToken = response.data.token;

//     const userSignupResponse = await axios.post(
//       `${BACKEND_URL}/api/v1/signup`,
//       {
//         username: username + "-user",
//         password,
//         type: "user",
//       }
//     );

//     userId = userSignupResponse.data.userId;

//     const userSigninResponse = await axios.post(
//       `${BACKEND_URL}/api/v1/signin`,
//       {
//         username: username + "-user",
//         password,
//       }
//     );

//     userToken = userSigninResponse.data.token;
//   });

//   test("User is not able to hit admin Endpoints", async () => {
//     const elementReponse = await axios.post(
//       `${BACKEND_URL}/api/v1/admin/element`,
//       {
//         imageUrl:
//           "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
//         width: 1,
//         height: 1,
//         static: true,
//       },
//       {
//         headers: {
//           authorization: `Bearer ${userToken}`,
//         },
//       }
//     );

//     const mapResponse = await axios.post(
//       `${BACKEND_URL}/api/v1/admin/map`,
//       {
//         thumbnail: "https://thumbnail.com/a.png",
//         dimensions: "100x200",
//         name: "test space",
//         defaultElements: [],
//       },
//       {
//         headers: {
//           authorization: `Bearer ${userToken}`,
//         },
//       }
//     );

//     const avatarResponse = await axios.post(
//       `${BACKEND_URL}/api/v1/admin/avatar`,
//       {
//         imageUrl:
//           "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s",
//         name: "Timmy",
//       },
//       {
//         headers: {
//           authorization: `Bearer ${userToken}`,
//         },
//       }
//     );

//     const updateElementResponse = await axios.put(
//       `${BACKEND_URL}/api/v1/admin/element/123`,
//       {
//         imageUrl:
//           "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s",
//       },
//       {
//         headers: {
//           authorization: `Bearer ${userToken}`,
//         },
//       }
//     );

//     expect(elementReponse.status).toBe(403);
//     expect(mapResponse.status).toBe(403);
//     expect(avatarResponse.status).toBe(403);
//     expect(updateElementResponse.status).toBe(403);
//   });

//   test("Admin is able to hit admin Endpoints", async () => {
//     const elementReponse = await axios.post(
//       `${BACKEND_URL}/api/v1/admin/element`,
//       {
//         imageUrl:
//           "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
//         width: 1,
//         height: 1,
//         static: true,
//       },
//       {
//         headers: {
//           authorization: `Bearer ${adminToken}`,
//         },
//       }
//     );

//     const mapResponse = await axios.post(
//       `${BACKEND_URL}/api/v1/admin/map`,
//       {
//         thumbnail: "https://thumbnail.com/a.png",
//         name: "Space",
//         dimensions: "100x200",
//         defaultElements: [],
//       },
//       {
//         headers: {
//           authorization: `Bearer ${adminToken}`,
//         },
//       }
//     );

//     const avatarResponse = await axios.post(
//       `${BACKEND_URL}/api/v1/admin/avatar`,
//       {
//         imageUrl:
//           "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s",
//         name: "Timmy",
//       },
//       {
//         headers: {
//           authorization: `Bearer ${adminToken}`,
//         },
//       }
//     );
//     expect(elementReponse.status).toBe(200);
//     expect(mapResponse.status).toBe(200);
//     expect(avatarResponse.status).toBe(200);
//   });

//   test("Admin is able to update the imageUrl for an element", async () => {
//     const elementResponse = await axios.post(
//       `${BACKEND_URL}/api/v1/admin/element`,
//       {
//         imageUrl:
//           "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
//         width: 1,
//         height: 1,
//         static: true,
//       },
//       {
//         headers: {
//           authorization: `Bearer ${adminToken}`,
//         },
//       }
//     );

//     const updateElementResponse = await axios.put(
//       `${BACKEND_URL}/api/v1/admin/element/${elementResponse.data.id}`,
//       {
//         imageUrl:
//           "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s",
//       },
//       {
//         headers: {
//           authorization: `Bearer ${adminToken}`,
//         },
//       }
//     );

//     expect(updateElementResponse.status).toBe(200);
//   });
// });

// describe("Websocket tests", () => {
//   let adminToken;
//   let adminUserId;
//   let userToken;
//   let adminId;
//   let userId;
//   let mapId;
//   let element1Id;
//   let element2Id;
//   let spaceId;
//   let ws1;
//   let ws2;
//   let ws1Messages = [];
//   let ws2Messages = [];
//   let userX;
//   let userY;
//   let adminX;
//   let adminY;

//   function waitForAndPopLatestMessage(messageArray) {
//     return new Promise((resolve) => {
//       if (messageArray.length > 0) {
//         resolve(messageArray.shift());
//       } else {
//         let interval = setInterval(() => {
//           if (messageArray.length > 0) {
//             resolve(messageArray.shift());
//             clearInterval(interval);
//           }
//         }, 100);
//       }
//     });
//   }

//   async function setupHTTP() {
//     const username = `kirat-${Math.random()}`;
//     const password = "123456";
//     const adminSignupResponse = await axios.post(
//       `${BACKEND_URL}/api/v1/signup`,
//       {
//         username,
//         password,
//         type: "admin",
//       }
//     );

//     const adminSigninResponse = await axios.post(
//       `${BACKEND_URL}/api/v1/signin`,
//       {
//         username,
//         password,
//       }
//     );

//     adminUserId = adminSignupResponse.data.userId;
//     adminToken = adminSigninResponse.data.token;
//     console.log("adminSignupResponse.status");
//     console.log(adminSignupResponse.status);

//     const userSignupResponse = await axios.post(
//       `${BACKEND_URL}/api/v1/signup`,
//       {
//         username: username + `-user`,
//         password,
//         type: "user",
//       }
//     );
//     const userSigninResponse = await axios.post(
//       `${BACKEND_URL}/api/v1/signin`,
//       {
//         username: username + `-user`,
//         password,
//       }
//     );
//     userId = userSignupResponse.data.userId;
//     userToken = userSigninResponse.data.token;
//     console.log("useroktne", userToken);
//     const element1Response = await axios.post(
//       `${BACKEND_URL}/api/v1/admin/element`,
//       {
//         imageUrl:
//           "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
//         width: 1,
//         height: 1,
//         static: true,
//       },
//       {
//         headers: {
//           authorization: `Bearer ${adminToken}`,
//         },
//       }
//     );

//     const element2Response = await axios.post(
//       `${BACKEND_URL}/api/v1/admin/element`,
//       {
//         imageUrl:
//           "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
//         width: 1,
//         height: 1,
//         static: true,
//       },
//       {
//         headers: {
//           authorization: `Bearer ${adminToken}`,
//         },
//       }
//     );
//     element1Id = element1Response.data.id;
//     element2Id = element2Response.data.id;

//     const mapResponse = await axios.post(
//       `${BACKEND_URL}/api/v1/admin/map`,
//       {
//         thumbnail: "https://thumbnail.com/a.png",
//         dimensions: "100x200",
//         name: "Defaul space",
//         defaultElements: [
//           {
//             elementId: element1Id,
//             x: 20,
//             y: 20,
//           },
//           {
//             elementId: element1Id,
//             x: 18,
//             y: 20,
//           },
//           {
//             elementId: element2Id,
//             x: 19,
//             y: 20,
//           },
//         ],
//       },
//       {
//         headers: {
//           authorization: `Bearer ${adminToken}`,
//         },
//       }
//     );
//     mapId = mapResponse.data.id;

//     const spaceResponse = await axios.post(
//       `${BACKEND_URL}/api/v1/space`,
//       {
//         name: "Test",
//         dimensions: "100x200",
//         mapId: mapId,
//       },
//       {
//         headers: {
//           authorization: `Bearer ${userToken}`,
//         },
//       }
//     );

//     console.log(spaceResponse.status);
//     spaceId = spaceResponse.data.spaceId;
//   }

//   async function setupWs() {
//     ws1 = new WebSocket(WS_URL);

//     ws1.onmessage = (event) => {
//       console.log("got back adata 1");
//       console.log(event.data);

//       ws1Messages.push(JSON.parse(event.data));
//     };
//     await new Promise((r) => {
//       ws1.onopen = r;
//     });

//     ws2 = new WebSocket(WS_URL);

//     ws2.onmessage = (event) => {
//       console.log("got back data 2");
//       console.log(event.data);
//       ws2Messages.push(JSON.parse(event.data));
//     };
//     await new Promise((r) => {
//       ws2.onopen = r;
//     });
//   }

//   beforeAll(async () => {
//     await setupHTTP();
//     await setupWs();
//   });

//   test("Get back ack for joining the space", async () => {
//     console.log("insixce first test");
//     ws1.send(
//       JSON.stringify({
//         type: "join",
//         payload: {
//           spaceId: spaceId,
//           token: adminToken,
//         },
//       })
//     );
//     console.log("insixce first test1");
//     const message1 = await waitForAndPopLatestMessage(ws1Messages);
//     console.log("insixce first test2");
//     ws2.send(
//       JSON.stringify({
//         type: "join",
//         payload: {
//           spaceId: spaceId,
//           token: userToken,
//         },
//       })
//     );
//     console.log("insixce first test3");

//     const message2 = await waitForAndPopLatestMessage(ws2Messages);
//     const message3 = await waitForAndPopLatestMessage(ws1Messages);

//     expect(message1.type).toBe("space-joined");
//     expect(message2.type).toBe("space-joined");
//     expect(message1.payload.users.length).toBe(0);
//     expect(message2.payload.users.length).toBe(1);
//     expect(message3.type).toBe("user-joined");
//     expect(message3.payload.x).toBe(message2.payload.spawn.x);
//     expect(message3.payload.y).toBe(message2.payload.spawn.y);
//     expect(message3.payload.userId).toBe(userId);

//     adminX = message1.payload.spawn.x;
//     adminY = message1.payload.spawn.y;

//     userX = message2.payload.spawn.x;
//     userY = message2.payload.spawn.y;
//   });

//   test("User should not be able to move across the boundary of the wall", async () => {
//     ws1.send(
//       JSON.stringify({
//         type: "move",
//         payload: {
//           x: 1000000,
//           y: 10000,
//         },
//       })
//     );

//     const message = await waitForAndPopLatestMessage(ws1Messages);
//     expect(message.type).toBe("movement-rejected");
//     expect(message.payload.x).toBe(adminX);
//     expect(message.payload.y).toBe(adminY);
//   });

//   test("User should not be able to move two blocks at the same time", async () => {
//     ws1.send(
//       JSON.stringify({
//         type: "move",
//         payload: {
//           x: adminX + 2,
//           y: adminY,
//         },
//       })
//     );

//     const message = await waitForAndPopLatestMessage(ws1Messages);
//     expect(message.type).toBe("movement-rejected");
//     expect(message.payload.x).toBe(adminX);
//     expect(message.payload.y).toBe(adminY);
//   });

//   test("Correct movement should be broadcasted to the other sockets in the room", async () => {
//     ws1.send(
//       JSON.stringify({
//         type: "move",
//         payload: {
//           x: adminX + 1,
//           y: adminY,
//           userId: adminId,
//         },
//       })
//     );

//     const message = await waitForAndPopLatestMessage(ws2Messages);
//     expect(message.type).toBe("movement");
//     expect(message.payload.x).toBe(adminX + 1);
//     expect(message.payload.y).toBe(adminY);
//   });

//   test("If a user leaves, the other user receives a leave event", async () => {
//     ws1.close();
//     const message = await waitForAndPopLatestMessage(ws2Messages);
//     expect(message.type).toBe("user-left");
//     expect(message.payload.userId).toBe(adminUserId);
//   });
// });
