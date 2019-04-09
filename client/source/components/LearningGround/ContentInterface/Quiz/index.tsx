import React from 'react'
import styles from './styles.scss'
import { connect } from 'react-redux'
import css from 'react-css-modules'
import Component from 'decorators/Component'
import { withRouter } from 'react-router-dom'

import { Light as SyntaxHighlighter } from 'react-syntax-highlighter'
import xml from 'react-syntax-highlighter/dist/esm/languages/hljs/xml'
import { atomOneLight as docco } from 'react-syntax-highlighter/dist/esm/styles/hljs'

SyntaxHighlighter.registerLanguage('xml', xml)


const mapStateToProps = ({ learn }) => ({
	currentTitle: learn.dotInfo.currentTitle,
	quiz: learn.dotInfo.quizExtras,
	nextURL: learn.dotInfo.nextURL
})

function Quiz(props) {

	function checkAnswer(e, isCorrect) {
		if(isCorrect) {
			e.target.classList.add(styles.correct)
			// TODO: store quiz result maybe?
			setTimeout(() => {
				props.history.push(props.nextURL)
			}, 1000)
		} else {
			e.target.classList.add(styles.incorrect)
		}
	}

	const { quiz, currentTitle } = props
	return (
		<div styleName="quiz">
			<h1 styleName="question">{currentTitle}</h1>
			<div styleName="code">
			<SyntaxHighlighter
				style={docco}
				language="xml"
				lineNumbers={true}
			>{quiz.code}</SyntaxHighlighter>
			</div>
			<div styleName="options">
				{quiz.options.map((option, i) => <div key={i} styleName="option" onClick={e => checkAnswer(e, option.correct)}>{option.text}</div>)}
			</div>
		</div>
	)
}

let com = css(styles, { handleNotFoundStyleName: 'log' })(Quiz)
com = Component({ })(com)
com = connect(mapStateToProps, {})(com)
com = withRouter(com)

export default com