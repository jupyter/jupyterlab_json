// For a Thenable reference in jupyter-js-services

type Thenable<T> = Promise<T>

// Type definitions for react-json-tree 0.6.5
// Project: https://github.com/alexkuz/react-json-tree/
// Definitions by: Grant Nestor <https://github.com/gnestor/>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

declare module 'react-json-tree' {

    import { Component, ClassAttributes } from 'react';

    interface Props extends ClassAttributes<JSONTree> {
        data: [any] | {};
        hideRoot?: boolean;
        theme?: {} | string;
        invertTheme?: boolean;
        keyPath?: [string | number];
        sortObjectKeys?: Function | boolean;
        shouldExpandNode?: (keyName: string, data: any, level: number) => boolean;
        getItemString?: (type: string, data: any, itemType: string, itemString: string) => JSX.Element;
        labelRenderer?: (raw: [string, string]) => JSX.Element;
        valueRenderer?: (raw: string) => JSX.Element;
        postprocessValue?: (raw: string) => JSX.Element;
        isCustomNode?: () => boolean;
        collectionLimit?: number;
    }
    export class JSONTree extends Component<Props, {}> { }

    export default JSONTree;

}
