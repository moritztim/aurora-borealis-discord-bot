export type SIGNED = true;
export type UNSIGNED = false;

export type Coord<Signed extends boolean> = number & { __signed?: Signed };

export type Coords<Signed extends boolean> = {
	longitude: Coord<Signed>;
	latitude: Coord<Signed>;
};

