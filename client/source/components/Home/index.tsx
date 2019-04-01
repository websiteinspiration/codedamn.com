import React, { useRef } from 'react'
import { Link } from 'react-router-dom'
import styles from './styles.scss'
import css from 'react-css-modules'
import Component from 'decorators/Component'

import { Code, Beenhere, LocalAtm } from '@material-ui/icons'

function Home(props) {

	const learnComplete = useRef(null)

	function handleStartNow() {
		learnComplete.current.scrollIntoView({ behavior: 'smooth' })
	}

	return (
		<>
			<div styleName='splash'>
				<div styleName='tagline'>
					<span styleName="capitalize">Coding, learning and connecting with developers around world</span>
				</div>


				<div styleName="boxes">
					<div styleName="box">
						<Code />
						<p>Learn in demand technologies and skills</p>
					</div>

					<div styleName="box">
						<Beenhere />
						<p>Validate your skills and see them on your dev-profile</p>
					</div>

					<div styleName="box">
						<LocalAtm />
						<p>Win prizes for competitions organized!</p>
					</div>
				</div>
			
				<div styleName='startnow' onClick={_ => handleStartNow()}>
					<span>Start for Free!</span>
				</div>
			
			</div>


			<div styleName="fullblocks">
			<div styleName="block">
					<div styleName="code">
						some code
					</div>
					<div styleName="desc">
						<h1>Frontend Web Development</h1>
						<p>Average Salary: $100,000K</p>
						<div styleName="learnbtn">Start Learning</div>
					</div>
				</div>


				<div styleName="block">
					<div styleName="desc">
						<h1>Backend Development</h1>
						<p>Average Salary: $100,000K</p>
						<div styleName="learnbtn">Start Learning</div>
					</div>
					<div styleName="code">
						some code
					</div>
				</div>


				<div styleName="block">
					<div styleName="code">
						some code
					</div>
					<div styleName="desc">
						<h1>Cross Platform Mobile Development</h1>
						<p>Average Salary: $100,000K</p>
						<div styleName="learnbtn">Start Learning</div>
					</div>
				</div>

				<div styleName="block">
					<div styleName="desc">
						<h1>DevOps</h1>
						<p>Average Salary: $100,000K</p>
						<div styleName="learnbtn">Start Learning</div>
					</div>
					<div styleName="code">
						some code
					</div>
				</div>
			</div>

			{/*

			<div styleName='learn-compete' ref={learnComplete}>
				<div styleName='learn-box'>
					<h1>Learn</h1>

					<p>
						Become a rockstar <strong>developer</strong> and <br />
						<strong> master the hottest tech</strong> in the market right
						now!
					</p>
					<div styleName='learn-iconset'>
						<IconBox source='/assets/images/svg/html-5-logo.svg'
							label='HTML' />
						<IconBox source='/assets/images/svg/css3-logo.svg'
							label='CSS3' />
						<IconBox source='/assets/images/svg/javascript-original.svg'
							label='JavaScript' />
						<IconBox source='/assets/images/svg/angularjs-plain.svg'
							label='AngularJS' />
						<IconBox source='/assets/images/svg/react-original.svg'
							label='ReactJS' />
						<IconBox source='/assets/images/svg/ionic-original.svg'
							label='Ionic 3' />
					</div>
					<div styleName='learn-compete-button'>
						<a href="http://learn.codedamn.com"></a>
						<span>Learn</span>
					</div>
				</div>

				<div styleName='compete-box'>
					<div>
						<h1>Compete</h1>

						<p>
							Show off your skills, <strong> win prizes </strong> (soon)
					and <strong> get hired </strong> (soon) doing it
				</p>
					</div>

					<div styleName='learn-compete-button'>
						<a href="http://do.codedamn.com"></a>
						<span> Compete </span>
					</div>
				</div>
				<input type="hidden" />
			</div> */}
		</>
	)
}

const IconBox = props => (
	<div className={styles['icon-box']}>
		<object type="image/svg+xml" className={styles['icon-box-image']}
			data={props.source}>
		</object>
		<span>
			{props.label}
		</span>
	</div>
)

let com = css(styles, { handleNotFoundStyleName: 'log', allowMultiple: true })(Home)
com = Component({ title: 'codedamn', gridClass: (styles as any).grid, sharedHeightClass: (styles as any).shareHeight })(com)

export default com