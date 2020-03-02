const sanityClient = require("@sanity/client");
const sanityPlugin = require("../index");

jest.mock("@sanity/client");

const MOCK_ENTRIES = [
  {
    _createdAt: "2020-01-29T14:48:14Z",
    _id: "author",
    _rev: "icb22HOpscEJNDFs0yLkRP",
    _type: "author",
    _updatedAt: "2020-01-29T14:48:14Z",
    avatar: {
      _type: "image",
      asset: {
        _ref: "image-54944af18882e795452e43957aa43e004e4f8cfc-803x803-png",
        _type: "reference"
      }
    },
    email: "email@example.com",
    name: "Stackbit Fresh",
    stackbit_file_path: "_data/author.json",
    stackbit_model_type: "data"
  },
  {
    _createdAt: "2020-01-29T14:48:13Z",
    _id: "image-54944af18882e795452e43957aa43e004e4f8cfc-803x803-png",
    _rev: "6G9t1tsVJxTZwJNSmWsNzt",
    _type: "sanity.imageAsset",
    _updatedAt: "2020-01-29T14:48:13Z",
    assetId: "54944af18882e795452e43957aa43e004e4f8cfc",
    extension: "png",
    metadata: {
      _type: "sanity.imageMetadata",
      dimensions: {
        _type: "sanity.imageDimensions",
        aspectRatio: 1,
        height: 803,
        width: 803
      },
      hasAlpha: false,
      isOpaque: true,
      lqip:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAIAAAAC64paAAAACXBIWXMAAAsSAAALEgHS3X78AAADEElEQVQ4y2OwXfcbF7JZ89N09gP1ik1KGXOcW7c27nk25+qf5tN/grZDFTDg1Lz+t/WqzwYTLioXLNPMWxA+42jfiffTr/wtOvLHc/Nvm7U4Nf+yWf3Navl709n3NOt3KWbNs6hZU7Th1sxLP3rO/4nb/dthPQ6bbdb+sFj0Qr/7lHr5epX8pQpZ89Vy5vlN2Nd5+NWsK38qj//x3YpQjKp57U/z+U/VytaJeBXzWcaIeBTKxE8wKluRueLS9PNfJ178k7rvt/MGqJtRNa//bbXio1bDHiHnbBZle3YtdxHPIsXU6W4dOxr3Pp195Xfjqb/B23/brcNi8y/b9b/M5j2RS57KruXBJG/FYx4pGd6qU7g4fv7pyWc+Tb38J+fgH7eNv23W4XC2ycy7UuFtrCqOrKrOQq658omT7Ro3VW67P+vyz/YzfyJ3/rZfjxJAKM42m/tINq6fXdODyyBQPLhBI2de2LQjfcffzb76t+LYH+8tKNZi+Hn5e/WKjUKOGYKOGTJxfebVa/LX3phz+fvKO387zv4J2IZHMyi0f5hMv6WUNU8qokMlY6Zv/962gy9X3v5z8sW/nY/+5h3647gej+b1vy0WvwIGuEL6bMOSpenLLgJjaPvDv48+/7v78X/v+b+QtGWHy2az2Q/VKzYrZ811bd9Wv/vJkhu/gdZ+/Pn/2df/M678BaYQHJqBiXnFR4Oes0q5S7QLFsXNOzXp9MeN9//e+fDvx5//9z/978Fr8y9g8tKo3aGYOde2fn3F1nsLrv089Ozf62//P/z8v/fJv1ygnzfg8LPNqq9Gk64oF6xQz5kfOvVQz7G3K279PfLs3/V3//Y9+ddw6o/PFvQshNBsufi1dtMBYB4yrVyVv+b6jIvf5lz9O/Xy385zoLQF1Gm3Hodmm9XfTabfVi1Zp5I117t3d9vBF7Ou/AbaFrnrt8em347rsed5BmjyWPZet+O4Ys4i/ZKlaUsvTD33ZdKlP+n7/zhv/G29FmdRA7XZfP4zjZrtSsCgalhfvf3BrCu/gEkKMzGjIQB3zN8xKbfrYwAAAABJRU5ErkJggg==",
      palette: {
        _type: "sanity.imagePalette",
        darkMuted: {
          _type: "sanity.imagePaletteSwatch",
          background: "#3c4a60",
          foreground: "#fff",
          population: 0.01,
          title: "#fff"
        },
        darkVibrant: {
          _type: "sanity.imagePaletteSwatch",
          background: "#04499c",
          foreground: "#fff",
          population: 0.01,
          title: "#fff"
        },
        dominant: {
          _type: "sanity.imagePaletteSwatch",
          background: "#3cacfc",
          foreground: "#fff",
          population: 57.68,
          title: "#fff"
        },
        lightMuted: {
          _type: "sanity.imagePaletteSwatch",
          background: "#a4b4c6",
          foreground: "#000",
          population: 0.01,
          title: "#fff"
        },
        lightVibrant: {
          _type: "sanity.imagePaletteSwatch",
          background: "#64dcfc",
          foreground: "#000",
          population: 0.01,
          title: "#fff"
        },
        muted: {
          _type: "sanity.imagePaletteSwatch",
          background: "#7492ae",
          foreground: "#fff",
          population: 0.01,
          title: "#fff"
        },
        vibrant: {
          _type: "sanity.imagePaletteSwatch",
          background: "#3cacfc",
          foreground: "#fff",
          population: 57.68,
          title: "#fff"
        }
      }
    },
    mimeType: "image/png",
    originalFilename: "avatar.png",
    path:
      "images/kz6i252u/production/54944af18882e795452e43957aa43e004e4f8cfc-803x803.png",
    sha1hash: "54944af18882e795452e43957aa43e004e4f8cfc",
    size: 42244,
    uploadId: "8wuwizczsLo1ibusTDGnssdhAHTiW3zX",
    url:
      "https://cdn.sanity.io/images/kz6i252u/production/54944af18882e795452e43957aa43e004e4f8cfc-803x803.png"
  }
];

describe("`bootstrap()`", () => {
  test("creates a Sanity client with the right parameters", async () => {
    const mockSanityClient = {
      fetch: jest.fn(async () => MOCK_ENTRIES.slice(0, 2))
    };

    sanityClient.mockImplementationOnce(() => mockSanityClient);

    const getPluginContext = jest.fn();
    const options = {
      accessToken: "1q2w3e4r5t6y7u8i9o0p",
      dataset: "my-dataset",
      projectId: "my-project-id",
      query: sanityPlugin.options.query.default,
      queryParameters: sanityPlugin.options.queryParameters.default,
      useCdn: true
    };
    const refresh = jest.fn();
    const setPluginContext = jest.fn();

    await sanityPlugin.bootstrap({
      getPluginContext,
      options,
      refresh,
      setPluginContext
    });

    expect(sanityClient).toHaveBeenCalledTimes(1);
    expect(sanityClient.mock.calls[0][0].token).toBe(options.accessToken);
    expect(sanityClient.mock.calls[0][0].dataset).toBe(options.dataset);
    expect(sanityClient.mock.calls[0][0].projectId).toBe(options.projectId);
    expect(sanityClient.mock.calls[0][0].useCdn).toBe(options.useCdn);

    expect(mockSanityClient.fetch).toHaveBeenCalledTimes(1);
    expect(mockSanityClient.fetch.mock.calls[0][0]).toBe(
      `*[!(_id in path("_.**"))]`
    );
    expect(mockSanityClient.fetch.mock.calls[0][1]).toEqual({});
  });

  test("sets up a listening socket with the right parameters", async () => {
    const mockSubscribeFn = jest.fn();
    const mockSanityClient = {
      fetch: jest.fn(async () => MOCK_ENTRIES.slice(0, 2)),
      listen: jest.fn(() => ({
        subscribe: mockSubscribeFn
      }))
    };

    sanityClient.mockImplementationOnce(() => mockSanityClient);

    const getPluginContext = jest.fn();
    const options = {
      accessToken: "1q2w3e4r5t6y7u8i9o0p",
      dataset: "my-dataset",
      projectId: "my-project-id",
      query: sanityPlugin.options.query.default,
      queryParameters: sanityPlugin.options.queryParameters.default,
      useCdn: true,
      watch: true
    };
    const refresh = jest.fn();
    const setPluginContext = jest.fn();

    await sanityPlugin.bootstrap({
      getPluginContext,
      options,
      refresh,
      setPluginContext
    });

    expect(mockSanityClient.listen).toHaveBeenCalledTimes(1);
    expect(mockSanityClient.listen.mock.calls[0][0]).toBe(
      `*[!(_id in path("_.**"))]`
    );
    expect(mockSanityClient.listen.mock.calls[0][1]).toEqual({});

    expect(mockSubscribeFn).toHaveBeenCalledTimes(1);
    expect(mockSubscribeFn.mock.calls[0][0]).toBeInstanceOf(Function);
  });

  test("retrieves entries and saves them to the context hashed by ID", async () => {
    const mockSanityClient = {
      fetch: jest.fn(async () => MOCK_ENTRIES.slice(0, 2))
    };

    sanityClient.mockImplementationOnce(() => mockSanityClient);

    const getPluginContext = jest.fn();
    const options = {
      watch: false
    };
    const refresh = jest.fn();
    const setPluginContext = jest.fn();

    await sanityPlugin.bootstrap({
      getPluginContext,
      options,
      refresh,
      setPluginContext
    });

    expect(setPluginContext).toHaveBeenCalledTimes(1);
    expect(setPluginContext.mock.calls[0][0]).toEqual({
      entries: {
        [MOCK_ENTRIES[0]._id]: MOCK_ENTRIES[0],
        [MOCK_ENTRIES[1]._id]: MOCK_ENTRIES[1]
      }
    });
  });
});

describe("`transform()`", () => {
  test("normalizes models (from any entries found) and adds them to the `models` data bucket", async () => {
    const mockContext = {
      entries: {
        [MOCK_ENTRIES[0]._id]: MOCK_ENTRIES[0],
        [MOCK_ENTRIES[1]._id]: MOCK_ENTRIES[1]
      }
    };
    const mockData = {
      files: [],
      models: [],
      objects: []
    };
    const mockOptions = {
      dataset: "my-dataset",
      projectId: "my-project-id"
    };
    const getPluginContext = jest.fn(() => mockContext);
    const data = sanityPlugin.transform({
      data: mockData,
      getPluginContext,
      options: mockOptions
    });

    const { models } = data;

    expect(models.length).toBe(2);

    const [model1, model2] = models;

    expect(model1.fieldNames).toEqual([
      "avatar",
      "email",
      "name",
      "stackbit_file_path",
      "stackbit_model_type"
    ]);
    expect(model1.modelName).toBe("author");
    expect(model1.projectEnvironment).toBe(mockOptions.dataset);
    expect(model1.projectId).toBe(mockOptions.projectId);
    expect(model1.source).toBe("sourcebit-source-sanity");

    expect(model2.fieldNames).toEqual(["contentType", "fileName", "url"]);
    expect(model2.modelName).toBe("__asset");
    expect(model2.projectEnvironment).toBe(mockOptions.dataset);
    expect(model2.projectId).toBe(mockOptions.projectId);
    expect(model2.source).toBe("sourcebit-source-sanity");
  });

  test("normalizes models (from any entries found) and adds them to the `models` data bucket", async () => {
    const mockContext = {
      entries: {
        [MOCK_ENTRIES[0]._id]: MOCK_ENTRIES[0],
        [MOCK_ENTRIES[1]._id]: MOCK_ENTRIES[1]
      }
    };
    const mockData = {
      files: [],
      models: [],
      objects: []
    };
    const mockOptions = {
      dataset: "my-dataset",
      projectId: "my-project-id"
    };
    const getPluginContext = jest.fn(() => mockContext);
    const data = sanityPlugin.transform({
      data: mockData,
      getPluginContext,
      options: mockOptions
    });

    const { models } = data;

    expect(models.length).toBe(2);

    const [model1, model2] = models;

    expect(model1.fieldNames).toEqual([
      "avatar",
      "email",
      "name",
      "stackbit_file_path",
      "stackbit_model_type"
    ]);
    expect(model1.modelName).toBe("author");
    expect(model1.projectEnvironment).toBe(mockOptions.dataset);
    expect(model1.projectId).toBe(mockOptions.projectId);
    expect(model1.source).toBe("sourcebit-source-sanity");

    expect(model2.fieldNames).toEqual(["contentType", "fileName", "url"]);
    expect(model2.modelName).toBe("__asset");
    expect(model2.projectEnvironment).toBe(mockOptions.dataset);
    expect(model2.projectId).toBe(mockOptions.projectId);
    expect(model2.source).toBe("sourcebit-source-sanity");
  });

  test("normalizes entries and adds them to the `objects` data bucket", async () => {
    const mockContext = {
      entries: {
        [MOCK_ENTRIES[0]._id]: MOCK_ENTRIES[0],
        [MOCK_ENTRIES[1]._id]: MOCK_ENTRIES[1]
      }
    };
    const mockData = {
      files: [],
      models: [],
      objects: []
    };
    const mockOptions = {
      dataset: "my-dataset",
      projectId: "my-project-id"
    };
    const getPluginContext = jest.fn(() => mockContext);
    const data = sanityPlugin.transform({
      data: mockData,
      getPluginContext,
      options: mockOptions
    });

    expect(data.objects.length).toBe(2);

    const [object1, object2] = data.objects;

    // Asserting object1's metadata block.
    expect(object1.__metadata.id).toBe(MOCK_ENTRIES[0]._id);
    expect(object1.__metadata.source).toBe("sourcebit-source-sanity");
    expect(object1.__metadata.modelName).toBe(MOCK_ENTRIES[0]._type);
    expect(object1.__metadata.projectId).toBe(mockOptions.projectId);
    expect(object1.__metadata.projectEnvironment).toBe(mockOptions.dataset);
    expect(object1.__metadata.createdAt).toBe(MOCK_ENTRIES[0]._createdAt);
    expect(object1.__metadata.updatedAt).toBe(MOCK_ENTRIES[0]._updatedAt);

    // Asserting object1's fields.
    expect(object1.email).toBe(MOCK_ENTRIES[0].email);
    expect(object1.name).toBe(MOCK_ENTRIES[0].name);
    expect(object1.stackbit_file_path).toBe(MOCK_ENTRIES[0].stackbit_file_path);
    expect(object1.stackbit_model_type).toBe(
      MOCK_ENTRIES[0].stackbit_model_type
    );

    // Asserting object1's relationship to object2.
    expect(object1.avatar.__metadata).toEqual(object1.avatar.__metadata);
    expect(object1.avatar.contentType).toBe(MOCK_ENTRIES[1].mimeType);
    expect(object1.avatar.fileName).toBe(MOCK_ENTRIES[1].originalFilename);
    expect(object1.avatar.url).toBe(MOCK_ENTRIES[1].url);

    // Asserting object2's metadata block.
    expect(object2.__metadata.id).toBe(MOCK_ENTRIES[1]._id);
    expect(object2.__metadata.source).toBe("sourcebit-source-sanity");
    expect(object2.__metadata.modelName).toBe("__asset");
    expect(object2.__metadata.projectId).toBe(mockOptions.projectId);
    expect(object2.__metadata.projectEnvironment).toBe(mockOptions.dataset);
    expect(object2.__metadata.createdAt).toBe(MOCK_ENTRIES[1]._createdAt);
    expect(object2.__metadata.updatedAt).toBe(MOCK_ENTRIES[1]._updatedAt);

    // Asserting object2's fields.
    expect(object2.contentType).toBe(MOCK_ENTRIES[1].mimeType);
    expect(object2.fileName).toBe(MOCK_ENTRIES[1].originalFilename);
    expect(object2.url).toBe(MOCK_ENTRIES[1].url);
  });
});
