import React, { useEffect, useState, useRef } from 'react'
import { connect } from 'react-redux'
import css from 'react-css-modules'
import Component from 'decorators/Component'
import Loading from 'components/Loading'
import { getPracticeBlock, clearReduxProps } from 'reducers/practice/actions'
import MonacoEditor from 'react-monaco-editor'
import styles from './styles.scss'
import IFrame from './iFrame'
import { Link } from 'react-router-dom'

const langmap = {
	js: "javascript",
	html: "html",
	ts: "typescript"
}

function PracticeGround(props) {

	const [value, setValue] = useState(null)
	const [currentUID, setcurrentUID] = useState(1)
	const [challengesDone, setChallengesDone] = useState({})
	const coder = useRef(null)

	useEffect(() => {
		props.getPracticeBlock({ moduleid: props.moduleid, challengeid: props.challengeid })
		return () => {
			setValue('')
			props.clearReduxProps()
		}
	}, [props.moduleid, props.challengeid])

	useEffect(() => {
		
		if(props.pblock) {
			setValue(props.pblock.defaultValue)
			coder.current.editor.addCommand(67, () => {
				setcurrentUID(Math.random())
				console.log('Key pressed')
			}) // F9 key
		}
	}, [props.pblock])

	if(!props.pblock) return <Loading />
	

	return (
		<div styleName="practice-ground">
			<div styleName="left">
				<h2>Instructions</h2>
				<div styleName="left-content" dangerouslySetInnerHTML={{ __html: props.pblock.description }}></div>
			</div>
			<div styleName="center">
				<MonacoEditor
					theme="vs-dark"
					value={value}
					ref={coder}
					onChange={(value, event) => setValue(value)}
					language={langmap[props.pblock.type]}
					options={{
						lineNumbers: "on",
						roundedSelection: false,
						scrollBeyondLastLine: false,
						readOnly: false,
					}}
				/>
			</div>
			<div styleName="right">

				<div styleName="preview">
					<IFrame key={currentUID} tests={props.pblock.challenges} rawCode={value} parentUpdateState={setTaskerState} />
				</div>

				<div styleName="challenges">
					{props.pblock.challenges.map(challenge => {
						return (<div styleName="challenge" key={challenge.text}>
							<span styleName="status" data-now={currentUID === 1 ? 'X' : challengesDone[challenge.text] === 1 ? 'OK' : 'X'}>{currentUID === 1 ? 'X' : challengesDone[challenge.text] === 1 ? 'OK' : 'X'}</span>
							<span styleName="instruction" dangerouslySetInnerHTML={{ __html: challenge.text }}></span>
						</div>)
					})}

					{Object.keys(challengesDone).map(t => challengesDone[t]).reduce((a, b) => a && b, true) ? <Link styleName="next" to={props.pblock.nextslug}>Go to next challenge</Link> : null}
				</div>
			</div>
		</div>
	)

	function setTaskerState(event) {
		setChallengesDone({
			...challengesDone,
			...event
		})
	}
}

const mapStateToProps = ({ practice }, { match : { params } }) => ({
	moduleid: params.moduleid,
	challengeid: params.challengeid,
	pblock: practice.activeBlock
})

let com: any = css(styles, { handleNotFoundStyleName: 'log', allowMultiple: true })(PracticeGround)
com = Component({ title: 'Challenge', sharedHeightClass: styles.turnFlex, gridClass: styles.turnGrid })(com)
com = connect(mapStateToProps, { getPracticeBlock, clearReduxProps })(com)
export default com