export const createMockClient = () => {
    const entries = Array(100).fill(0).map((_, i) => {
        const obj = {
            sys: {
                id: `${i}`,
                type: 'Entry',
                contentType: {
                    sys: {
                        id: 'contentType',
                        type: 'Link',
                        linkType: 'ContentType',
                    },
                },
                createdAt: '2018-01-01T00:00:00.000Z',
                updatedAt: '2018-01-01T00:00:00.000Z',
                environment: {
                    sys: {
                        id: 'master',
                        type: 'Link',
                        linkType: 'Environment',
                    },
                },
                revision: 1,
                locale: 'en-US',
                space: {
                    sys: {
                        id: 'space',
                        type: 'Link',
                        linkType: 'Space',
                    },
                },
            },
            fields: {
                name: `name-${i}`,
                tpe: i % 2 === 0 ? 'pair' : 'odd',
            },
            metadata: {
                tags: [],
            },
        };
        return {
            ...obj,
            toPlainObject: () => obj,
            update: () => Promise.resolve(obj),
        };
    });

    return {
        getEntries: (q: any) => {
            const skip = typeof q.skip === 'number' ? q.skip : 0;
            return Promise.resolve({
                items: entries.slice(skip, 10 + skip),
                total: entries.length,
            });
        },
    };
};
