import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import css from 'react-css-modules'
import Component from 'decorators/Component'
import Loading from 'components/Loading'
import styles from './styles.scss'
import { getPracticeNodes } from 'reducers/practice/actions'
import { Link } from 'react-router-dom'

function PracticeGround(props) {

	useEffect(() => {
		props.getPracticeNodes({ moduleid: props.moduleid })
	}, [])

	if(!props.pnodes) return <Loading />

	return (<div styleName="pnodes">
		{props.pnodes.map(node => {
			return (<Link key={node.slug} styleName="node" to={`/practice/${props.moduleid}/${node.slug}`}>
				<div styleName={`status ${node.done ? 'done' : '' }`}></div>
				<div styleName="title">{node.title}</div>
			</Link>)
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