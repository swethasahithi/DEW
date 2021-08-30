import { Point } from "@angular/cdk/drag-drop";

export interface NodeData {
    id: string;
    name: string;
    showInputBox: boolean;
    disabled: boolean;
    isNode: boolean;
    isLine: boolean;
    nodeIndex: number;
    showInputBoxForText: boolean;
    isNodeSelected: boolean;
    point: Point;
  }