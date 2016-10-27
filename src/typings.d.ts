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
        postprocessValue?: Function;
        sortObjectKeys?: Function | boolean;
    }
    export class JSONTree extends Component<Props, {}> { }

    export default JSONTree;

}
