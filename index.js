const pkg = require('./package.json');
const sanityClient = require('@sanity/client');
const { debounce } = require('./lib/misc-util');
const { parseEntryId, normalizeEntries } = require('./lib/sanity-util');

module.exports.name = pkg.name;

module.exports.getOptionsFromSetup = ({ answers }) => {
    return {
        accessToken: answers.accessToken,
        dataset: answers.dataset,
        projectId: answers.projectId,
        useCdn: answers.useCdn
    };
};

module.exports.getSetup = ({ chalk, currentOptions, inquirer, log }) => {
    return async () => {
        const options = await inquirer.prompt([
            {
                type: 'input',
                name: 'accessToken',
                message: `What is your Sanity API token? ${chalk.reset('To create one, see https://www.sanity.io/docs/http-auth.')}`,
                validate: value => (value.length > 0 ? true : 'The API token cannot be empty.'),
                default: currentOptions.accessToken
            },
            {
                type: 'input',
                name: 'projectId',
                message: `What is your Sanity project ID?`,
                validate: value => (value.length > 0 ? true : 'The project ID cannot be empty.'),
                default: currentOptions.projectId
            },
            {
                type: 'input',
                name: 'dataset',
                message: `What is the name of your dataset?`,
                validate: value => (value.length > 0 ? true : 'The dataset cannot be empty.'),
                default: currentOptions.dataset
            },
            {
                type: 'confirm',
                name: 'useCdn',
                message: `Do you want to use the API CDN? ${chalk.reset('To learn more, see https://www.sanity.io/docs/api-cdn.')}`,
                default: currentOptions.useCdn || false
            }
        ]);

        try {
            const client = sanityClient({
                projectId: options.projectId,
                dataset: options.dataset,
                token: options.accessToken,
                useCdn: options.useCdn
            });

            await client.fetch('1', {});
        } catch (error) {
            console.log('');
            log("We couldn't connect to Sanity using the credentials you provided. Please check they are correct and try again.", 'fail');
            console.log('');

            return module.exports.getSetup({
                chalk,
                currentOptions,
                inquirer,
                log
            })();
        }

        return options;
    };
};

module.exports.options = {
    accessToken: {
        env: 'SANITY_ACCESS_TOKEN',
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
    richTextOutputFormat: {
        default: 'html'
    },
    useCdn: {
        default: false
    },
    watch: {
        default: false,
        runtimeParameter: 'watch'
    },
    serializers: {
        marks: {
            annotations: [],
        },
        types: {},
    }
};

module.exports.bootstrap = async ({ getPluginContext, options, refresh, setPluginContext }) => {
    const client = sanityClient({
        projectId: options.projectId,
        dataset: options.dataset,
        token: options.accessToken,
        useCdn: options.useCdn
    });
    const entries = await client.fetch(options.query, options.queryParameters);
    const entriesById = entries.reduce((result, entry) => {
        if (!entry._id) return result;

        return {
            ...result,
            [entry._id]: entry
        };
    }, {});
    const debouncedRefresh = debounce(refresh, 500);

    setPluginContext({
        entries: entriesById
    });

    if (options.watch) {
        client.listen(options.query, options.queryParameters).subscribe(update => {
            const { documentId } = update;

            if (!documentId) return;

            const { entries } = getPluginContext();

            if (update.transition === 'appear' || update.transition === 'update') {
                const updatedEntries = { ...entries, [documentId]: update.result };

                setPluginContext({
                    entries: updatedEntries
                });

                debouncedRefresh();
            } else if (update.transition === 'disappear') {
                const { [documentId]: removedEntry, ...remainingEntries } = entries;

                setPluginContext({
                    entries: remainingEntries
                });

                debouncedRefresh();
            }
        });
    }
};

module.exports.transform = ({ data, getPluginContext, options }) => {
    // If preview is not explicitly set, we default to `true` when in watch mode.
    const isPreview = options.preview !== undefined ? options.preview : options.watch;
    const { entries = {} } = getPluginContext();

    // Merging published entries with drafts.
    const mergedEntries = Object.keys(entries).reduce((result, entryId) => {
        const { canonicalId, isDraft } = parseEntryId(entryId);

        // We discard this entry if it's a draft and preview mode is disabled, or
        // if there's already an entry for this canonical ID and the entry we are
        // processing now is not a draft (if it is, it takes precedence).
        if ((isDraft && !isPreview) || (result[canonicalId] && !isDraft)) {
            return result;
        }

        return {
            ...result,
            [canonicalId]: entries[entryId]
        };
    }, {});

    // Normalizing entries and resolving links. They're also converted to an
    // array.
    const normalizedEntries = normalizeEntries({
        entries: mergedEntries,
        options
    });

    // Iterating through the entries to compile a hash of models and normalize
    // it.
    const models = normalizedEntries.reduce((result, entry) => {
        const { __metadata: meta, ...fields } = entry;

        if (result[meta.modelName]) return result;

        return {
            ...result,
            [meta.modelName]: {
                fieldNames: Object.keys(fields),
                modelName: meta.modelName,
                projectEnvironment: meta.projectEnvironment,
                projectId: meta.projectId,
                source: meta.source
            }
        };
    }, {});

    return {
        ...data,
        models: data.models.concat(Object.values(models)),
        objects: data.objects.concat(normalizedEntries)
    };
};
