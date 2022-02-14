const blockToHTML = require('@sanity/block-content-to-html');
const blockToMarkdown = require('@sanity/block-content-to-markdown');
const pkg = require('../package.json');

function convertBlockToHTML({ blocks, cache, entriesById, options, visitedIds }) {
    const imageSerializer = ({ node }) => {
        const normalizedImage = normalizeValue({
            cache,
            entriesById,
            options,
            value: node,
            visitedIds
        });

        if (!normalizedImage) return null;

        return blockToHTML.h('img', { src: normalizedImage.url });
    };

    return blockToHTML({
        blocks,
        serializers: {
            types: {
                image: imageSerializer
            }
        }
    });
}

function convertBlockToMarkdown({ blocks, cache, entriesById, options, visitedIds }) {
    const imageSerializer = ({ node }) => {
        const normalizedImage = normalizeValue({
            cache,
            entriesById,
            options,
            value: node,
            visitedIds
        });

        if (!normalizedImage) return null;

        return `![](${normalizedImage.url})`;
    };

    return blockToMarkdown(blocks, {
        serializers: {
            types: {
                image: imageSerializer
            }
        }
    });
}

function getMetadataBlock({ entry, options }) {
    if (!entry || !entry._type) {
        return {};
    }

    const modelName = entry._type === 'sanity.imageAsset' ? '__asset' : entry._type;
    const metadata = {
        id: entry._id,
        canonicalId: parseEntryId(entry._id).canonicalId,
        source: pkg.name,
        modelName,
        projectId: options.projectId,
        projectEnvironment: options.dataset,
        createdAt: entry._createdAt,
        updatedAt: entry._updatedAt
    };

    // Getting rid of falsy values.
    const sanitizedMetadata = Object.entries(metadata).reduce((result, [key, value]) => (value ? { ...result, [key]: value } : result), {});

    return {
        __metadata: sanitizedMetadata
    };
}

function normalizeAsset({ entry, options }) {
    const asset = {
        ...getMetadataBlock({ entry, options }),
        contentType: entry.mimeType,
        fileName: entry.originalFilename,
        url: entry.url
    };

    if (entry.metadata) {
        asset.metadata = entry.metadata;
    }

    return asset;
}

function normalizeEntries({ entries, options }) {
    const cache = new Map();

    return Object.values(entries).map(entry => normalizeEntry({ cache, entriesById: entries, entry, options }));
}

function normalizeEntry({ cache, entriesById, entry, options, visitedIds = [] }) {
    const { canonicalId: entryId } = parseEntryId(entry._id);

    // If we've already visited this ID, it means we found a circular reference,
    // so we return the raw entry.
    if (visitedIds.includes(entryId)) {
        return entry;
    }

    // If we already normalized this entry, we return it from cache.
    if (cache.has(entryId)) {
        return cache.get(entryId);
    }

    const normalizedEntry =
        entry._type === 'sanity.imageAsset'
            ? normalizeAsset({ entry, options })
            : normalizeObject({
                  cache,
                  entriesById,
                  object: entry,
                  options,
                  visitedIds: visitedIds.concat(entryId)
              });

    // Cache normalized entry.
    cache.set(entryId, normalizedEntry);

    return normalizedEntry;
}

function normalizeObject({ cache, entriesById, object, options, visitedIds }) {
    const initialObject = getMetadataBlock({ entry: object, options });
    const result = Object.keys(object).reduce((result, fieldName) => {
        if (fieldName.startsWith('_')) {
            return result;
        }

        const normalizedValue = normalizeValue({
            cache,
            entriesById,
            options,
            value: object[fieldName],
            visitedIds
        });

        // If the value is null, we simply omit it from the formatted object.
        if (normalizedValue === null) {
            return result;
        }

        return {
            ...result,
            [fieldName]: normalizedValue
        };
    }, initialObject);

    return result;
}

function normalizeValue({ cache, entriesById, options, value, visitedIds }) {
    if (Array.isArray(value)) {
        const hasBlocks = value.some(({ _type }) => _type === 'block');

        // If the array has a block, we run it through the transformation process
        // defined by the `richTextOutputFormat` option.
        if (hasBlocks) {
            if (options.richTextOutputFormat === 'html') {
                return convertBlockToHTML({
                    blocks: value,
                    cache,
                    entriesById,
                    options,
                    visitedIds
                });
            }

            if (options.richTextOutputFormat === 'markdown') {
                return convertBlockToMarkdown({
                    blocks: value,
                    cache,
                    entriesById,
                    options,
                    visitedIds
                });
            }
        }

        // If the value is an array, we filter out any null members from it.
        // If, by the end, we're left with an empty array, we omit it from
        // the formatted object.
        const normalizedValue = value
            .map(childValue =>
                normalizeValue({
                    cache,
                    entriesById,
                    options,
                    value: childValue,
                    visitedIds
                })
            )
            .filter(item => item !== null);

        return normalizedValue.length > 0 ? normalizedValue : null;
    }

    if (!value || typeof value !== 'object' || value.toString() !== '[object Object]') {
        return value;
    }

    if (value._type === 'slug') {
        return value.current;
    }

    if (value._type === 'color') {
        return value.hex;
    }

    if (value._type === 'reference') {
        const { _ref: referenceId } = value;
        const referencedEntry = entriesById[referenceId];

        if (!referencedEntry) return null;

        return normalizeEntry({
            cache,
            entriesById,
            entry: referencedEntry,
            options,
            visitedIds
        });
    }

    // At this point, `value` is an object, so we run it through the
    // `normalizeObject` function.
    const normalizedValue = normalizeObject({
        cache,
        entriesById,
        object: value,
        options,
        visitedIds
    });

    if ((value._type === 'file' || value._type === 'image') && value.asset) {
        const { asset, ...customFields } = normalizedValue;

        return {
            ...customFields,
            ...asset
        };
    }

    return normalizedValue;
}

function parseEntryId(entryId) {
    const draftPrefix = 'drafts.';
    const isDraft = entryId && entryId.startsWith(draftPrefix);
    const canonicalId = isDraft ? entryId.substring(draftPrefix.length) : entryId;

    return {
        canonicalId,
        isDraft
    };
}

module.exports = {
    getMetadataBlock,
    normalizeEntries,
    normalizeEntry,
    normalizeObject,
    parseEntryId
};
