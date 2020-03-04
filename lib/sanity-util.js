const pkg = require("../package.json");

function getMetadataBlock({ entry, options }) {
  if (!entry || !entry._type) {
    return {};
  }

  const modelName =
    entry._type === "sanity.imageAsset" ? "__asset" : entry._type;

  const metadata = {
    id: entry._id,
    source: pkg.name,
    modelName,
    projectId: options.projectId,
    projectEnvironment: options.dataset,
    createdAt: entry._createdAt,
    updatedAt: entry._updatedAt
  };

  // Getting rid of falsy values.
  const sanitizedMetadata = Object.entries(metadata).reduce(
    (result, [key, value]) => (value ? { ...result, [key]: value } : result),
    {}
  );

  return {
    __metadata: sanitizedMetadata
  };
}

function normalizeAsset({ entry, options }) {
  return {
    ...getMetadataBlock({ entry, options }),
    contentType: entry.mimeType,
    fileName: entry.originalFilename,
    url: entry.url
  };
}

function normalizeAssetReference({
  cache,
  entry,
  entriesById,
  options,
  visitedIds
}) {
  const { _ref: referenceId } = entry.asset;
  const referencedAsset = entriesById[referenceId];

  if (!referencedAsset) return null;

  const normalizedAsset = normalizeAsset({
    entry: referencedAsset,
    options
  });
  const normalizedEntry = Object.keys(entry).reduce((result, fieldName) => {
    if (fieldName === "_type" || fieldName === "asset") {
      return result;
    }

    return {
      ...result,
      [fieldName]: normalizeEntry({
        cache,
        entriesById,
        entry: entry[fieldName]
      })
    };
  }, {});
  const normalizedAssetReference = {
    ...getMetadataBlock({ entry, options }),
    ...normalizedAsset,
    ...normalizedEntry
  };

  return normalizedAssetReference;
}

function normalizeEntries({ entries, options }) {
  const cache = new Map();

  return Object.values(entries).map(entry =>
    normalizeEntry({ cache, entriesById: entries, entry, options })
  );
}

function normalizeEntry({
  cache,
  entriesById,
  entry,
  options,
  visitedIds = new Set()
}) {
  if (!entry) return null;

  if (Array.isArray(entry)) {
    return entry.map(childEntry =>
      normalizeEntry({
        cache,
        entriesById,
        entry: childEntry,
        options,
        visitedIds
      })
    );
  }

  if (
    (entry._type === "file" || entry._type === "image") &&
    entry.asset &&
    entry.asset._ref
  ) {
    return normalizeAssetReference({
      cache,
      entry,
      entriesById,
      options,
      visitedIds
    });
  }

  if (entry._type === "slug") {
    return entry.current;
  }

  if (entry._type === "reference") {
    const { _ref: referenceId } = entry;

    if (visitedIds.has(referenceId)) {
      return entry;
    }

    visitedIds.add(referenceId);

    if (cache.has(entry._id)) {
      return cache.get(entry._id);
    }

    const referencedEntry = entriesById[referenceId];

    if (!referencedEntry) return null;

    const normalizedReference = normalizeObject({
      cache,
      entry: referencedEntry,
      entriesById,
      options,
      visitedIds
    });

    cache.set(entry._id, normalizedReference);

    return normalizedReference;
  }

  if (entry._type === "sanity.imageAsset") {
    return normalizeAsset({ cache, entry, entriesById, options, visitedIds });
  }

  if (entry._id) {
    if (visitedIds.has(entry._id)) {
      return entry;
    }

    visitedIds.add(entry._id);

    if (cache.has(entry._id)) {
      return cache.get(entry._id);
    }

    const normalizedEntry = normalizeObject({
      cache,
      entry,
      entriesById,
      options,
      visitedIds
    });

    cache.set(entry._id, normalizedEntry);

    return normalizedEntry;
  }

  if (entry.toString() === "[object Object]") {
    return normalizeObject({ cache, entry, entriesById, options, visitedIds });
  }

  return entry;
}

function normalizeObject({ cache, entry, entriesById, options, visitedIds }) {
  const initialObject = getMetadataBlock({ entry, options });

  const result = Object.keys(entry).reduce((result, fieldName) => {
    if (fieldName.startsWith("_")) {
      return result;
    }

    const normalizedEntry = normalizeEntry({
      cache,
      entry: entry[fieldName],
      entriesById,
      options,
      visitedIds
    });

    return {
      ...result,
      [fieldName]: normalizedEntry
    };
  }, initialObject);

  return result;
}

function parseEntryId(entryId) {
  const draftPrefix = "drafts.";
  const isDraft = entryId.startsWith(draftPrefix);
  const canonicalId = isDraft ? entryId.substring(draftPrefix.length) : entryId;

  return {
    canonicalId,
    isDraft
  };
}

module.exports = {
  getMetadataBlock,
  normalizeAssetReference,
  normalizeEntries,
  normalizeEntry,
  normalizeObject,
  parseEntryId
};
