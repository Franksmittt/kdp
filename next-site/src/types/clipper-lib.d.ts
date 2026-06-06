declare module "clipper-lib" {
  export enum JoinType {
    jtSquare = 0,
    jtRound = 1,
    jtMiter = 2,
  }
  export enum EndType {
    etOpenSquare = 0,
    etOpenRound = 1,
    etOpenButt = 2,
    etClosedLine = 3,
    etClosedPolygon = 4,
  }
  export type IntPoint = { X: number; Y: number };
  export type Path = IntPoint[];
  export type Paths = Path[];

  export class ClipperOffset {
    AddPath(path: Path, joinType: JoinType, endType: EndType): void;
    AddPaths(paths: Paths, joinType: JoinType, endType: EndType): void;
    Execute(solution: Paths, delta: number): void;
  }

  export class Clipper {
    static Clean(polygon: Path, distance: number): Path;
  }
}
