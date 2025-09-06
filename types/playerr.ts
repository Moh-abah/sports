// types/player.ts
export type Player = {
    id: string;
    displayName: string;
    firstName: string;
    lastName: string;
    fullName: string;
    shortName: string;
    headshot?: { href: string; alt: string };
    position?: { id: string; name: string; abbreviation: string };
    jersey?: string;
    height?: number;
    displayHeight?: string;
    weight?: number;
    displayWeight?: string;
    age?: number;
    dateOfBirth?: string;
    experience?: { years: number };
    status?: { id: string; name: string; type: string; abbreviation: string };
    college?: { name: string; shortName: string; abbrev: string; mascot: string };
    injuries?: any[];
    rawData: PlayerRawData;
};

export type Coach = {
    id: string;
    firstName: string;
    lastName: string;
    experience?: number;
};

export type Team = {
    id: string;
    abbreviation: string;
    location: string;
    name: string;
    displayName: string;
    logo: string;
    color?: string;
    recordSummary?: string;
    seasonSummary?: string;
    standingSummary?: string;
};


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
