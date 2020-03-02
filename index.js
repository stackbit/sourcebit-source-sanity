const pkg = require("./package.json");
const sanityClient = require("@sanity/client");
const { debounce } = require("./lib/misc-util");
const { parseEntryId, normalizeEntries } = require("./lib/sanity-util");

module.exports.name = pkg.name;

module.exports.getOptionsFromSetup = ({ answers }) => {
  return {
    accessToken: answers.accessToken,
    dataset: answers.dataset,
    projectId: answers.projectId,
    useCdn: answers.useCdn
  };
};

module.exports.getSetup = ({ chalk, currentOptions }) => {
  return [
    {
      type: "input",
      name: "accessToken",
      message: `What is your Sanity API token? ${chalk.reset(
        "To create one, see https://www.sanity.io/docs/http-auth."
      )}`,
      validate: value =>
        value.length > 0 ? true : "The API token cannot be empty.",
      default: currentOptions.accessToken
    },
    {
      type: "input",
      name: "projectId",
      message: `What is your Sanity project ID?`,
      validate: value =>
        value.length > 0 ? true : "The project ID cannot be empty.",
      default: currentOptions.projectId
    },
    {
      type: "input",
      name: "dataset",
      message: `What is the name of your dataset?`,
      validate: value =>
        value.length > 0 ? true : "The dataset cannot be empty.",
      default: currentOptions.dataset
    },
    {
      type: "confirm",
      name: "useCdn",
      message: `Do you want to use the API CDN? ${chalk.reset(
        "To learn more, see https://www.sanity.io/docs/api-cdn."
      )}`,
      default: currentOptions.useCdn || false
    }
  ];
};

module.exports.options = {
  accessToken: {
    env: "SANITY_ACCESS_TOKEN",
    private: true
  },
  dataset: {},
  isPreview: {},
  projectId: {},
  query: {
    default: `*[!(_id in path("_.**"))]`
  },
  queryParameters: {
    default: {}
  },
  useCdn: {
    default: false
  },
  watch: {
    default: false,
    runtimeParameter: "watch"
  }
};

module.exports.bootstrap = async ({
  getPluginContext,
  options,
  refresh,
  setPluginContext
}) => {
  // If preview is not explicitly set, we default to `true` when in watch mode.
  const isPreview =
    options.preview !== undefined ? options.preview : options.watch;
  const client = sanityClient({
    projectId: options.projectId,
    dataset: options.dataset,
    token: options.accessToken,
    useCdn: options.useCdn
  });
  const entries = await client.fetch(options.query, options.queryParameters);
  const entriesById = entries.reduce((result, entry) => {
    const { canonicalId, isDraft } = parseEntryId(entry._id);

    // We discard the entry if it's a draft and preview is disabled, or if
    // there's already an entry for this ID and the one we're processing now
    // isn't a draft (because drafts take precedence).
    if ((isDraft && !isPreview) || (result[canonicalId] && !isDraft)) {
      return result;
    }

    result[canonicalId] = entry;

    return result;
  }, {});
  const debouncedRefresh = debounce(refresh, 500);

  setPluginContext({
    entries: entriesById
  });

  if (options.watch) {
    client.listen(options.query, options.queryParameters).subscribe(update => {
      const { entries } = getPluginContext();

      if (update.transition === "appear" || update.transition === "update") {
        const { canonicalId, isDraft } = parseEntryId(update.documentId);

        // We discard the entry if it's a draft and preview is disabled.
        if (isDraft && !isPreview) {
          return result;
        }

        const updatedEntries = { ...entries, [canonicalId]: update.result };

        setPluginContext({
          entries: updatedEntries
        });

        debouncedRefresh();
      } else if (update.transition === "disappear") {
        const { canonicalId } = parseEntryId(update.documentId);

        // We discard the entry if it's a draft and preview is disabled, or if
        // it doesn't exist in the first place.
        if ((isDraft && !isPreview) || !entries[canonicalId]) {
          return result;
        }

        const { [canonicalId]: removedId, ...remainingEntries } = entries;

        setPluginContext({
          entries: remainingEntries
        });

        debouncedRefresh();
      }
    });
  }
};

module.exports.transform = ({ data, getPluginContext, options }) => {
  const { entries = {} } = getPluginContext();
  const normalizedEntries = normalizeEntries({ entries, options });
  const models = {};

  normalizedEntries.forEach(entry => {
    const { __metadata: meta, ...fields } = entry;

    if (meta.modelName.indexOf("system.") === 0) return;

    models[meta.modelName] = models[meta.modelName] || {
      fieldNames: Object.keys(fields),
      modelName: meta.modelName,
      projectEnvironment: meta.projectEnvironment,
      projectId: meta.projectId,
      source: meta.source
    };
  });

  return {
    ...data,
    models: Object.values(models),
    objects: data.objects.concat(normalizedEntries)
  };
};
