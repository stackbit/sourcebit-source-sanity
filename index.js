const pkg = require("./package.json");
const sanityClient = require("@sanity/client");
const { debounce } = require("./lib/misc-util");
const { parseEntryId, normalizeEntries } = require("./lib/sanity-util");

module.exports.name = pkg.name;

module.exports.options = {
  accessToken: {
    env: "SANITY_ACCESS_TOKEN",
    private: true
  },
  dataset: {},
  isPreview: {},
  projectId: {},
  query: {
    default: "*[]"
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
    options.isPreview !== undefined ? options.isPreview : options.watch;
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

      // Not interested in mutations to internal objects (e.g. `_.listeners.*`)
      if (update.documentId[0] === "_") return;

      if (update.transition === "appear" || update.transition === "update") {
        const { canonicalId } = parseEntryId(update.documentId);
        const updatedEntries = { ...entries, [canonicalId]: update.result };

        setPluginContext({
          entries: updatedEntries
        });

        debouncedRefresh();
      } else if (update.transition === "disappear") {
        const { canonicalId } = parseEntryId(update.documentId);

        if (!entries[canonicalId]) return;

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

  return {
    ...data,
    objects: data.objects.concat(normalizedEntries)
  };
};
