import React from 'react'

const ComponentDecorator = args => Component => {

	class Base extends React.Component {

		updateComponentState(newprops) {
			const props = args.async(newprops)
			if(props) {
				if(props.title) {
					document.title = props.title
				}
			}
		}

		componentDidMount() {
			if(args.title) {
				document.title = args.title
			}
			if(args.async) {
				this.updateComponentState(this.props)
			}
			if(args.gridClass) {
				document.querySelector('.asyncComponent').className = `asyncComponent ${args.gridClass}`
			}
			if(args.sharedHeightClass) {
				document.querySelector('.shareHeight').classList.add(args.sharedHeightClass)
			}
		}

		componentWillReceiveProps(nextProps) {
			if(args.async) {
				this.updateComponentState(nextProps)
			}
		}

		componentWillUnmount() {
			if(args.gridClass) { // if component ever decorated with the class
				document.querySelector('.asyncComponent').classList.remove(args.gridClass)
			}
			if(args.sharedHeightClass) {
				document.querySelector('.shareHeight').classList.remove(args.sharedHeightClass)
			}
		}

		render() {
			const passDownProps = {...this.props}
			//console.log('SuperComponent is sending these props down ', passDownProps)
			return <Component {...passDownProps} />
		}
	}

	return Base
 }

export default ComponentDecorator