import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import css from 'react-css-modules'
import Component from 'decorators/Component'
import Loading from 'components/Loading'
import styles from './styles.scss'
import { getPracticeNodes } from 'reducers/practice/actions'

function PracticeGround(props) {

	useEffect(() => {
		props.getPracticeNodes({ moduleid: props.moduleid })
	}, [])

	if(!props.pnodes) return <Loading />

	return (<div styleName="pnodes">
		{props.pnodes.map(node => {
			return (<div styleName="node">
				<div styleName={`status ${node.done ? 'done' : '' }`}></div>
				<div styleName="title">{node.title}</div>
			</div>)
		})}
	</div>)
}

const mapStateToProps = ({ practice }, { match : { params } }) => ({
	moduleid: params.moduleid,
	pnodes: practice.activeNodes
})

let com: any = css(styles, { handleNotFoundStyleName: 'log', allowMultiple: true })(PracticeGround)
com = Component({ title: 'Practice' })(com)
com = connect(mapStateToProps, { getPracticeNodes })(com)
export default com