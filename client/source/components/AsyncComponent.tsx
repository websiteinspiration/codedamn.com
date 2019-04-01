import React, { useEffect, useState } from "react"
import Loading from './Loading'

export default function asyncComponent(getComponent) {
    return getComponent()
    function AsyncComponent(props) {
        const [Component, setComponent] = useState(null)

        if (!Component) {
            getComponent().then(Component => {
                setComponent(Component)
            })
            return <Loading />
        }
        
        return <Component {...props} />
    }
    return AsyncComponent
}