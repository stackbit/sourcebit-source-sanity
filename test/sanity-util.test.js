const sanityUtil = require('../lib/sanity-util');

describe('`normalizeEntries()`', () => {
    const mockEntries = {
        icb22HOpscEJNDFs0yLkbZ: {
            _createdAt: '2020-01-29T14:48:14Z',
            _id: 'icb22HOpscEJNDFs0yLkbZ',
            _rev: 'ic6ac1-ez9-k4e-hhk-d4kyrtanh',
            _type: 'post',
            _updatedAt: '2020-03-02T16:53:44Z',
            nullyField: null,
            slug: {
                _type: 'slug',
                current: 'fragments-of-iceland'
            },
            content_img_path: {
                _type: 'image',
                asset: {
                    _ref: 'image-48ef6974717f0ff28c9fe64392d487423c5f041b-1000x667-jpg',
                    _type: 'reference'
                },
                myCustomField: 'my custom value'
            },
            excerpt:
                'Iceland is a Nordic country between the North Atlantic and the Arctic Ocean. It has a population of 325,671 and an area of 103,000 km2 (40,000 sq mi), making it the most sparsely populated country in Europe.',
            title: 'Fragments of Iceland',
            foxVillageRef: {
                _type: 'reference',
                _ref: 'icb22HOpscEJNDFs0yLkZX'
            },
            arrayOfNumbers: [0, 1, 2],
            nonExistingReferenceSingle: {
                _ref: 'i-do-not-exist',
                _type: 'reference'
            },
            nonExistingReferenceMultiple1: [
                {
                    _ref: 'image-48ef6974717f0ff28c9fe64392d487423c5f041b-1000x667-jpg',
                    _type: 'reference'
                },
                {
                    _ref: 'i-do-not-exist',
                    _type: 'reference'
                }
            ],
            nonExistingReferenceMultiple2: [
                {
                    _ref: 'i-do-not-exist',
                    _type: 'reference'
                },
                {
                    _ref: 'i-do-not-exist-either',
                    _type: 'reference'
                }
            ],
            myObject1: {
                _type: 'someType',
                firstName: 'John',
                lastName: 'Doe'
            },
            mixedArray1: [
                {
                    _type: 'someType',
                    firstName: 'John',
                    lastName: 'Doe'
                },
                {
                    firstName: 'Jane',
                    lastName: 'Doe'
                },
                {
                    _ref: 'image-48ef6974717f0ff28c9fe64392d487423c5f041b-1000x667-jpg',
                    _type: 'reference'
                }
            ]
        },
        icb22HOpscEJNDFs0yLkZX: {
            _createdAt: '2020-01-29T14:48:14Z',
            _id: 'icb22HOpscEJNDFs0yLkZX',
            _rev: 'icb22HOpscEJNDFs0yLkRP',
            _type: 'post',
            _updatedAt: '2020-01-29T14:48:14Z',
            slug: {
                _type: 'slug',
                current: 'fox-village-in-japan'
            },
            content_img_path: {
                _type: 'image',
                asset: {
                    _ref: 'image-48ef6974717f0ff28c9fe64392d487423c5f041b-1000x667-jpg',
                    _type: 'reference'
                }
            },
            date: '2018-01-11',
            excerpt:
                'Miyagi Zao Fox Village, aka Kitsune Mura, is a popular tourist attraction situated in Shiroishi, Miyagi it based in the Miyagi Zao mountains. Visitors can visit a village where there is a vast population of foxes.',
            title: 'Fox Village In Japan',
            foxVillageRef: {
                _type: 'reference',
                _ref: 'icb22HOpscEJNDFs0yLkZX'
            }
        },
        icb22HOpscEJNDFs0yLkdb: {
            _createdAt: '2020-01-29T14:48:14Z',
            _id: 'icb22HOpscEJNDFs0yLkdb',
            _rev: 'icb22HOpscEJNDFs0yLkRP',
            _type: 'post',
            _updatedAt: '2020-01-29T14:48:14Z',
            slug: {
                _type: 'slug',
                current: 'hiking-the-grand-canyon'
            },
            content_img_path: {
                _type: 'image',
                asset: {
                    _ref: 'image-48ef6974717f0ff28c9fe64392d487423c5f041b-1000x667-jpg',
                    _type: 'reference'
                }
            },
            date: '2019-03-10',
            excerpt:
                'The Grand Canyon is a steep-sided canyon carved by the Colorado River in Arizona, United States. The Grand Canyon is 277 miles (446 km) long, up to 18 miles (29 km) wide and attains a depth of over a mile (6,093 feet or 1,857 meters).',
            title: 'Hiking The Grand Canyon',
            foxVillageRef: {
                _type: 'reference',
                _ref: 'icb22HOpscEJNDFs0yLkZX'
            }
        },
        'image-48ef6974717f0ff28c9fe64392d487423c5f041b-1000x667-jpg': {
            _createdAt: '2020-01-29T14:00:00Z',
            _id: 'image-48ef6974717f0ff28c9fe64392d487423c5f041b-1000x667-jpg',
            _rev: '6G9t1tsVJxTZwJNSmWsNmG',
            _type: 'sanity.imageAsset',
            _updatedAt: '2020-01-29T15:00:00Z',
            assetId: '48ef6974717f0ff28c9fe64392d487423c5f041b',
            extension: 'jpg',
            metadata: {
                _type: 'sanity.imageMetadata',
                dimensions: {
                    _type: 'sanity.imageDimensions',
                    aspectRatio: 1.4992503748125936,
                    height: 667,
                    width: 1000
                },
                hasAlpha: false,
                isOpaque: true,
                lqip:
                    'data:image/jpeg;base64,/9j/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAANABQDASIAAhEBAxEB/8QAGAAAAgMAAAAAAAAAAAAAAAAAAAYCBQf/xAAjEAABBAIBAwUAAAAAAAAAAAABAgMEBQARBhIhMhQVQYGR/8QAFQEBAQAAAAAAAAAAAAAAAAAAAgP/xAAcEQEAAgEFAAAAAAAAAAAAAAABAAMUAgQRIVH/2gAMAwEAAhEDEQA/AJe5U9ZBEiVLQN+KEnalfWUg5oiTXWsoQVNNRE9TfWdFzM54fUCe0uQ5IcC2/HY3jajh6bWOn1VjJ0r4AAH5lHc3LyMONRpETuFRyyBZQxIk6YdKiCjeGJ1vw5mDOWw1Me6B37pwymVZ7BjVM//Z',
                palette: {
                    _type: 'sanity.imagePalette',
                    darkMuted: {
                        _type: 'sanity.imagePaletteSwatch',
                        background: '#57433c',
                        foreground: '#fff',
                        population: 6.59,
                        title: '#fff'
                    },
                    darkVibrant: {
                        _type: 'sanity.imagePaletteSwatch',
                        background: '#4c1307',
                        foreground: '#fff',
                        population: 0.05,
                        title: '#fff'
                    },
                    dominant: {
                        _type: 'sanity.imagePaletteSwatch',
                        background: '#57433c',
                        foreground: '#fff',
                        population: 6.59,
                        title: '#fff'
                    },
                    lightMuted: {
                        _type: 'sanity.imagePaletteSwatch',
                        background: '#93afbf',
                        foreground: '#000',
                        population: 5,
                        title: '#fff'
                    },
                    lightVibrant: {
                        _type: 'sanity.imagePaletteSwatch',
                        background: '#84a4d4',
                        foreground: '#000',
                        population: 0.01,
                        title: '#fff'
                    },
                    muted: {
                        _type: 'sanity.imagePaletteSwatch',
                        background: '#5c84ac',
                        foreground: '#fff',
                        population: 2.28,
                        title: '#fff'
                    },
                    vibrant: {
                        _type: 'sanity.imagePaletteSwatch',
                        background: '#638fb4',
                        foreground: '#fff',
                        population: 6.05,
                        title: '#fff'
                    }
                }
            },
            mimeType: 'image/jpeg',
            originalFilename: '7.jpg',
            path: 'images/kz6i252u/production/48ef6974717f0ff28c9fe64392d487423c5f041b-1000x667.jpg',
            sha1hash: '48ef6974717f0ff28c9fe64392d487423c5f041b',
            size: 61380,
            uploadId: 'V7L0CFhzWOEozZ4zUh7FxTblpKObWtRU',
            url: 'https://cdn.sanity.io/images/kz6i252u/production/48ef6974717f0ff28c9fe64392d487423c5f041b-1000x667.jpg'
        }
    };
    const mockOptions = {
        dataset: 'my-dataset',
        projectId: 'my-project-id'
    };

    test('normalizes entries and assets and resolves references', () => {
        const normalizedEntries = sanityUtil.normalizeEntries({
            entries: mockEntries,
            options: mockOptions
        });

        // Checking that image field reference was resolved on all entries, and
        // that it contains a __metadata block.
        normalizedEntries.slice(0, 3).forEach(entry => {
            expect(entry.content_img_path.contentType).toBe('image/jpeg');
            expect(entry.content_img_path.fileName).toBe('7.jpg');
            expect(entry.content_img_path.url).toBe(
                'https://cdn.sanity.io/images/kz6i252u/production/48ef6974717f0ff28c9fe64392d487423c5f041b-1000x667.jpg'
            );
            expect(entry.content_img_path.__metadata.id).toBe('image-48ef6974717f0ff28c9fe64392d487423c5f041b-1000x667-jpg');
            expect(entry.content_img_path.__metadata.source).toBe('sourcebit-source-sanity');
            expect(entry.content_img_path.__metadata.modelName).toBe('__asset');
            expect(entry.content_img_path.__metadata.projectId).toBe(mockOptions.projectId);
            expect(entry.content_img_path.__metadata.projectEnvironment).toBe(mockOptions.dataset);
            expect(entry.content_img_path.__metadata.createdAt).toBe('2020-01-29T14:00:00Z');
            expect(entry.content_img_path.__metadata.updatedAt).toBe('2020-01-29T15:00:00Z');
        });

        // Checking that the `foxVillageRef` reference was resolved for all entries.
        expect(normalizedEntries[0].foxVillageRef.__metadata.id).toBe(normalizedEntries[1].__metadata.id);
        expect(normalizedEntries[0].foxVillageRef.title).toBe(normalizedEntries[1].title);
        expect(normalizedEntries[2].foxVillageRef.__metadata.id).toBe(normalizedEntries[1].__metadata.id);
        expect(normalizedEntries[2].foxVillageRef.title).toBe(normalizedEntries[1].title);

        // Checking that the `slug` field was properly handled.
        normalizedEntries.slice(0, 3).forEach(normalizedEntry => {
            const originalEntry = mockEntries[normalizedEntry.__metadata.id];

            expect(normalizedEntry.slug).toBe(originalEntry.slug.current);
        });

        // Checking that any custom fields present in image fields are preserved.
        expect(normalizedEntries[0].content_img_path.myCustomField).toBe('my custom value');
        expect(normalizedEntries[1].content_img_path.myCustomField).not.toBeDefined();
        expect(normalizedEntries[2].content_img_path.myCustomField).not.toBeDefined();

        // Checking that arrays of numbers are handled properly.
        expect(normalizedEntries[0].arrayOfNumbers).toEqual([0, 1, 2]);

        // Single references pointing to objects that don't exist should not be
        // included in the formatted object.
        expect(normalizedEntries[0].nonExistingReferenceSingle).not.toBeDefined();

        // Arrays of references should contain only referenced entries that exist.
        // If an element references an entry that doesn't exist, it should not be
        // included in the formatted object.
        expect(normalizedEntries[0].nonExistingReferenceMultiple1).toEqual([
            {
                __metadata: {
                    id: 'image-48ef6974717f0ff28c9fe64392d487423c5f041b-1000x667-jpg',
                    source: 'sourcebit-source-sanity',
                    modelName: '__asset',
                    projectId: 'my-project-id',
                    projectEnvironment: 'my-dataset',
                    createdAt: '2020-01-29T14:00:00Z',
                    updatedAt: '2020-01-29T15:00:00Z'
                },
                contentType: 'image/jpeg',
                fileName: '7.jpg',
                url: 'https://cdn.sanity.io/images/kz6i252u/production/48ef6974717f0ff28c9fe64392d487423c5f041b-1000x667.jpg'
            }
        ]);

        // Arrays of references should contain only referenced entries that exist.
        // If all the elements in the array point to references that don't exist,
        // the field should not be included in the formatted object.
        expect(normalizedEntries[0].nonExistingReferenceMultiple2).not.toBeDefined();

        // Custom objects should have a proper metadata block.
        expect(normalizedEntries[0].myObject1.firstName).toBe('John');
        expect(normalizedEntries[0].myObject1.lastName).toBe('Doe');
        expect(normalizedEntries[0].myObject1.__metadata.modelName).toBe('someType');

        // Arrays can contain elements of mixed types.
        expect(normalizedEntries[0].mixedArray1[0].firstName).toBe('John');
        expect(normalizedEntries[0].mixedArray1[0].lastName).toBe('Doe');
        expect(normalizedEntries[0].mixedArray1[0].__metadata.modelName).toBe('someType');

        expect(normalizedEntries[0].mixedArray1[1].firstName).toBe('Jane');
        expect(normalizedEntries[0].mixedArray1[1].lastName).toBe('Doe');
        expect(normalizedEntries[0].mixedArray1[1].__metadata).not.toBeDefined();

        // Checking that `null` values are not present in the normalized value.
        expect(normalizedEntries[0].nullyField).not.toBeDefined();

        // Checking that the `foxVillageRef` reference was resolved for all entries.
        expect(normalizedEntries[0].foxVillageRef.__metadata.id).toBe(normalizedEntries[1].__metadata.id);
        expect(normalizedEntries[0].foxVillageRef.title).toBe(normalizedEntries[1].title);
        expect(normalizedEntries[2].foxVillageRef.__metadata.id).toBe(normalizedEntries[1].__metadata.id);
        expect(normalizedEntries[2].foxVillageRef.title).toBe(normalizedEntries[1].title);

        // Checking that the `slug` field was properly handled.
        normalizedEntries.slice(0, 3).forEach(normalizedEntry => {
            const originalEntry = mockEntries[normalizedEntry.__metadata.id];

            expect(normalizedEntry.slug).toBe(originalEntry.slug.current);
        });

        // Checking that any custom fields present in image fields are preserved.
        expect(normalizedEntries[0].content_img_path.myCustomField).toBe('my custom value');
        expect(normalizedEntries[1].content_img_path.myCustomField).not.toBeDefined();
        expect(normalizedEntries[2].content_img_path.myCustomField).not.toBeDefined();

        // Checking that arrays of numbers are handled properly.
        expect(normalizedEntries[0].arrayOfNumbers).toEqual([0, 1, 2]);

        // Single references pointing to objects that don't exist should not be
        // included in the formatted object.
        expect(normalizedEntries[0].nonExistingReferenceSingle).not.toBeDefined();

        // Arrays of references should contain only referenced entries that exist.
        // If an element references an entry that doesn't exist, it should not be
        // included in the formatted object.
        expect(normalizedEntries[0].nonExistingReferenceMultiple1).toEqual([
            {
                __metadata: {
                    id: 'image-48ef6974717f0ff28c9fe64392d487423c5f041b-1000x667-jpg',
                    source: 'sourcebit-source-sanity',
                    modelName: '__asset',
                    projectId: 'my-project-id',
                    projectEnvironment: 'my-dataset',
                    createdAt: '2020-01-29T14:00:00Z',
                    updatedAt: '2020-01-29T15:00:00Z'
                },
                contentType: 'image/jpeg',
                fileName: '7.jpg',
                url: 'https://cdn.sanity.io/images/kz6i252u/production/48ef6974717f0ff28c9fe64392d487423c5f041b-1000x667.jpg'
            }
        ]);

        // Arrays of references should contain only referenced entries that exist.
        // If all the elements in the array point to references that don't exist,
        // the field should not be included in the formatted object.
        expect(normalizedEntries[0].nonExistingReferenceMultiple2).not.toBeDefined();

        // Custom objects should have a proper metadata block.
        expect(normalizedEntries[0].myObject1.firstName).toBe('John');
        expect(normalizedEntries[0].myObject1.lastName).toBe('Doe');
        expect(normalizedEntries[0].myObject1.__metadata.modelName).toBe('someType');

        // Arrays can contain elements of mixed types.
        expect(normalizedEntries[0].mixedArray1[0].firstName).toBe('John');
        expect(normalizedEntries[0].mixedArray1[0].lastName).toBe('Doe');
        expect(normalizedEntries[0].mixedArray1[0].__metadata.modelName).toBe('someType');

        expect(normalizedEntries[0].mixedArray1[1].firstName).toBe('Jane');
        expect(normalizedEntries[0].mixedArray1[1].lastName).toBe('Doe');
        expect(normalizedEntries[0].mixedArray1[1].__metadata).not.toBeDefined();

        expect(normalizedEntries[0].mixedArray1[2]).toEqual({
            __metadata: {
                id: 'image-48ef6974717f0ff28c9fe64392d487423c5f041b-1000x667-jpg',
                source: 'sourcebit-source-sanity',
                modelName: '__asset',
                projectId: 'my-project-id',
                projectEnvironment: 'my-dataset',
                createdAt: '2020-01-29T14:00:00Z',
                updatedAt: '2020-01-29T15:00:00Z'
            },
            contentType: 'image/jpeg',
            fileName: '7.jpg',
            url: 'https://cdn.sanity.io/images/kz6i252u/production/48ef6974717f0ff28c9fe64392d487423c5f041b-1000x667.jpg'
        });
    });
});

describe('`parseEntryId()`', () => {
    test('returns an object with a `canonicalId` property, indicating the root/canonical ID of the entry', () => {
        const op1 = sanityUtil.parseEntryId('drafts.icb22HOpscEJNDFs0yLkbZ');
        const op2 = sanityUtil.parseEntryId('icb22HOpscEJNDFs0yLkbZ');
        const op3 = sanityUtil.parseEntryId('icb22HOpscEJNDFs0yLkbZ.drafts.whatever');

        expect(op1.canonicalId).toBe('icb22HOpscEJNDFs0yLkbZ');
        expect(op2.canonicalId).toBe('icb22HOpscEJNDFs0yLkbZ');
        expect(op3.canonicalId).toBe('icb22HOpscEJNDFs0yLkbZ.drafts.whatever');
    });

    test('returns an object with a `isDraft` property, indicating whether the entry ID corresponds to a draft entry', () => {
        const op1 = sanityUtil.parseEntryId('drafts.icb22HOpscEJNDFs0yLkbZ');
        const op2 = sanityUtil.parseEntryId('icb22HOpscEJNDFs0yLkbZ');
        const op3 = sanityUtil.parseEntryId('icb22HOpscEJNDFs0yLkbZ.drafts.whatever');

        expect(op1.isDraft).toBe(true);
        expect(op2.isDraft).toBe(false);
        expect(op3.isDraft).toBe(false);
    });
});
