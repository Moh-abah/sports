// types/player.ts
export interface Player {
    id: string;
    name: string;
    photo?: string;
    team: string;
    position: string;
    stats: any;
    rawData: PlayerRawData;
}

export interface PlayerRawData {
    id: string;
    uid: string;
    guid: string;
    alternateIds: {
        sdr: string;
    };
    firstName: string;
    lastName: string;
    fullName: string;
    displayName: string;
    shortName: string;
    weight: number;
    displayWeight: string;
    height: number;
    displayHeight: string;
    age: number;
    dateOfBirth: string;
    links: Array<{
        language: string;
        rel: string[];
        href: string;
        text: string;
        shortText: string;
        isExternal: boolean;
        isPremium: boolean;
    }>;
    birthPlace: {
        city: string;
        state: string;
        country: string;
    };
    college: {
        id: string;
        guid: string;
        mascot: string;
        name: string;
        shortName: string;
        abbrev: string;
        logos: Array<{
            href: string;
            width: number;
            height: number;
            alt: string;
            rel: string[];
            lastUpdated: string;
        }>;
    };
    slug: string;
    headshot: {
        href: string;
        alt: string;
    };
    jersey: string;
    position: {
        id: string;
        name: string;
        displayName: string;
        abbreviation: string;
        leaf: boolean;
        parent: {
            id: string;
            name: string;
            displayName: string;
            abbreviation: string;
            leaf: boolean;
        };
    };
    injuries: any[];
    teams: Array<{
        $ref: string;
    }>;
    contracts: any[];
    experience: {
        years: number;
    };
    status: {
        id: string;
        name: string;
        type: string;
        abbreviation: string;
    };
    debutYear?: number;
}