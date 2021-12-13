export declare const createMockClient: () => {
    getEntries: (q: any) => Promise<{
        items: {
            toPlainObject: () => {
                sys: {
                    id: string;
                    type: string;
                    contentType: {
                        sys: {
                            id: string;
                            type: string;
                            linkType: string;
                        };
                    };
                    createdAt: string;
                    updatedAt: string;
                    environment: {
                        sys: {
                            id: string;
                            type: string;
                            linkType: string;
                        };
                    };
                    revision: number;
                    locale: string;
                    space: {
                        sys: {
                            id: string;
                            type: string;
                            linkType: string;
                        };
                    };
                };
                fields: {
                    name: string;
                    tpe: string;
                };
                metadata: {
                    tags: never[];
                };
            };
            update: () => Promise<{
                sys: {
                    id: string;
                    type: string;
                    contentType: {
                        sys: {
                            id: string;
                            type: string;
                            linkType: string;
                        };
                    };
                    createdAt: string;
                    updatedAt: string;
                    environment: {
                        sys: {
                            id: string;
                            type: string;
                            linkType: string;
                        };
                    };
                    revision: number;
                    locale: string;
                    space: {
                        sys: {
                            id: string;
                            type: string;
                            linkType: string;
                        };
                    };
                };
                fields: {
                    name: string;
                    tpe: string;
                };
                metadata: {
                    tags: never[];
                };
            }>;
            sys: {
                id: string;
                type: string;
                contentType: {
                    sys: {
                        id: string;
                        type: string;
                        linkType: string;
                    };
                };
                createdAt: string;
                updatedAt: string;
                environment: {
                    sys: {
                        id: string;
                        type: string;
                        linkType: string;
                    };
                };
                revision: number;
                locale: string;
                space: {
                    sys: {
                        id: string;
                        type: string;
                        linkType: string;
                    };
                };
            };
            fields: {
                name: string;
                tpe: string;
            };
            metadata: {
                tags: never[];
            };
        }[];
        total: number;
    }>;
};
