declare module '*.svg' {
    import * as React from 'react'
    const ReactComponent: React.FunctionComponent<
        React.SVGProps<SVGSVGElement> & { title?: string }
    >
    export default ReactComponent
}

declare module '*.png' {
    const content: string
    export default content
}

declare module '*.woff' {
    const content: string
    export default content
}

declare module '*.woff2' {
    const content: string
    export default content
}

declare module '*.ttf' {
    const content: string
    export default content
}
