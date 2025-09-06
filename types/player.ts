// types/player.ts
export type PlayerLink = {
    language: string;
    rel: string[];
    href: string;
    text: string;
    shortText: string;
    isExternal: boolean;
    isPremium: boolean;
};

export type College = {
    id: string;
    guid: string;
    mascot: string;
    name: string;
    shortName: string;
    abbrev: string;
    logos: any[];
};

export type PositionParent = {
    id: string;
    name: string;
    displayName: string;
    abbreviation: string;
    leaf: boolean;
};

export type Position = {
    id: string;
    name: string;
    displayName: string;
    abbreviation: string;
    leaf: boolean;
    parent: PositionParent;
};

export type Status = {
    id: string;
    name: string;
    type: string;
    abbreviation: string;
};

export type BirthPlace = {
    city: string;
    state: string;
    country: string;
};

export type PlayerRawData = {
    id: string;
    uid: string;
    guid: string;
    alternateIds: { sdr: string };
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
    debutYear: number;
    links: PlayerLink[];
    birthPlace: BirthPlace;
    college: College;
    slug: string;
    headshot: { href: string; alt: string };
    jersey: string;
    position: Position;
    injuries: any[];
    teams: any[];
    contracts: any[];
    experience: { years: number };
    status: Status;
};

export type Player = {
    id: string;
    name: string;
    photo?: string;
    team?: string;
    position?: string;
    stats?: any;
    rawData?: PlayerRawData;
};
