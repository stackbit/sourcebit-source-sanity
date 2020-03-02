const pkg = require("../package.json");

function normalizeEntries({ entries, options }) {
  return Object.values(entries).map(entry =>
    normalizeEntry({ entriesById: entries, entry, options })
  );
}

function normalizeEntry({ entriesById, entry, options }) {
  const isAsset =
    entry.metadata && entry.metadata._type === "sanity.imageMetadata";

  let fields;

  if (isAsset) {
    fields = {
      contentType: entry.mimeType,
      fileName: entry.originalFilename,
      url: entry.url
    };
  } else {
    // Using only fields whose name is not prefixed with an underscore.
    fields = Object.keys(entry).reduce((result, fieldName) => {
      if (fieldName.indexOf("_") !== 0) {
        const value = entry[fieldName];

        result[fieldName] = Array.isArray(value)
          ? value.map(entry => resolveLinks({ entry, entriesById, options }))
          : resolveLinks({ entry: value, entriesById, options });
      }

      return result;
    }, {});
  }

  const metadata = {
    id: entry._id,
    source: pkg.name,
    modelName: isAsset ? "__asset" : entry._type,
    projectId: options.projectId,
    projectEnvironment: options.dataset,
    createdAt: entry._createdAt,
    updatedAt: entry._updatedAt
  };

  return Object.assign({}, fields, { __metadata: metadata });
}

function parseEntryId(entryId) {
  const idParts = entryId.split("drafts.");
  const isDraft = idParts.length === 2;
  const canonicalId = idParts.filter(Boolean).pop();

  return {
    canonicalId,
    isDraft
  };
}

function resolveLinks({ entry, entriesById, options }) {
  if (!entry || entry.toString() !== "[object Object]" || !entry._type) {
    return entry;
  }

  const { _type, ...entryFields } = entry;
  const { asset } = entryFields;

  if (
    asset &&
    asset._type === "reference" &&
    asset._ref &&
    entriesById[asset._ref]
  ) {
    return normalizeEntry({
      entry: entriesById[asset._ref],
      entriesById,
      options
    });
  }

  return entry;
}

module.exports = {
  normalizeEntries,
  normalizeEntry,
  parseEntryId
};
