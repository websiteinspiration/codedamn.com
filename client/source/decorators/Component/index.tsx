import React, { useEffect } from 'react'

const ComponentDecorator = args => Component => {

	function Base(props) {

		function updateComponentState(newprops) {
			const props = args.async(newprops)
			if(props) {
				if(props.title) {
					document.title = props.title
				}
			}
		}

		useEffect(() => {
			if(args.title) {
				document.title = args.title
			}
			if(args.async) {
				updateComponentState(props)
			}
			if(args.gridClass) {
				document.querySelector('.asyncComponent').className = `asyncComponent ${args.gridClass}`
			}
			if(args.sharedHeightClass) {
				document.querySelector('.shareHeight').classList.add(args.sharedHeightClass)
			}

			return () => {
				if(args.gridClass) { // if component ever decorated with the class
					document.querySelector('.asyncComponent').classList.remove(args.gridClass)
				}
				if(args.sharedHeightClass) {
					document.querySelector('.shareHeight').classList.remove(args.sharedHeightClass)
				}
			}
		}, [])

		/*componentWillReceiveProps(nextProps) {
			if(args.async) {
				this.updateComponentState(nextProps)
			}
		}*/

		const passDownProps = {...props}
		return <Component {...passDownProps} />
	}

	return Base
}

export default ComponentDecorator