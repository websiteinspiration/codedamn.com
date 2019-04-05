import React, { useRef } from 'react'
import { Link } from 'react-router-dom'
import styles from './styles.scss'
import css from 'react-css-modules'
import Component from 'decorators/Component'

import { Code, Beenhere, LocalAtm, FormatListBulletedSharp } from '@material-ui/icons'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';

function Home(props) {
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
			
				<Link styleName='startnow' to="/register">
					<span>Start for Free!</span>
				</Link>
			
			</div>
			<div styleName="fullblocks">
			<div styleName="block">
					<div styleName="code">
						<SyntaxHighlighter showLineNumbers={false} customStyle={{
							fontSize: 20
						}} language="javascript">
{`(async () => \{
  const url = "https://codedamn.com/awesome-developer"
  const result = await (await fetch(url)).json()

  if(result.name == 'you') \{
  	alert('You are awesome!')
  \} else \{
  	alert('You are awesome too!')
  \}
\})();`}
						</SyntaxHighlighter>
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
						<SyntaxHighlighter showLineNumbers={false} customStyle={{
							fontSize: 20
						}} language="python">
{`#!/usr/bin/env python
import asyncio as io
import websockets as ws

async def hello(websocket, path):
    name = await websocket.recv()
    greeting = f"Hello {name}!"
    await websocket.send(greeting)

server = ws.serve(hello, 'localhost', 1337)
io.get_event_loop().run_until_complete(server)
io.get_event_loop().run_forever()`}
						</SyntaxHighlighter>
					</div>
				</div>


				<div styleName="block">
					<div styleName="code">
						<SyntaxHighlighter showLineNumbers={false} customStyle={{
							fontSize: 20
						}} language="dart">
{`import 'package:flutter/widgets.dart';
void main() {
  runApp(
    const Center(
      child: Text(
        'Hello, world!',
        textDirection: TextDirection.ltr
      )
    )
  );
}
`}						</SyntaxHighlighter>
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
					<SyntaxHighlighter showLineNumbers={false} customStyle={{
							fontSize: 20
						}} language="yaml">
{`version: 2
jobs:
  build:
    docker:
      - image: circleci/node:8.11.2
    working_directory: ~/codedamn

    steps:
      - checkout
      - run: 
          name: Install Dependencies
          command: npm install
      - run: npm run test
`}						</SyntaxHighlighter>
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