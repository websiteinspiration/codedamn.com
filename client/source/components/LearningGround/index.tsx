import React, { useEffect } from 'react'
// import Slices from './Slices'
import Timeline from './Timeline'
import ContentInterface from './ContentInterface'
import { connect } from 'react-redux'
import css from 'react-css-modules'
import styles from './styles.scss'
import Component from 'decorators/Component'
import { clearLearningGround } from 'reducers/learn/actions'

const mapStateToProps = (_, {match: {params}}) => ({
	parentslug: params.parentslug,
	dotslug: params.dotslug,
})


function LearningGround(props) {

	useEffect(() => {
		return () => props.clearLearningGround()
	}, [])

	const { parentslug, dotslug } = props
	const urlprops = { parentslug, dotslug }
	// dot is read to be rendered

	return (
		<>
			<Timeline {...urlprops} />
			<ContentInterface {...urlprops} />
		</>
	)
}

let com = css(styles)(LearningGround)
com = connect(mapStateToProps, { clearLearningGround })(com)
com = Component({ gridClass: styles.grid })(com)

export default com