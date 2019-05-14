import React, { useEffect } from 'react'
import styles from './styles.scss'
import css from 'react-css-modules'
import Loading from 'components/Loading'

import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import { connect } from 'react-redux'
import { getDamnTable } from 'reducers/system/actions'
import Component from 'decorators/Component'

const mapStateToProps = ({ system }) => ({
	damntable: system.damntable
})


function DamnTable(props) {

	useEffect(() => {
		props.getDamnTable()
	}, [])

	const { damntable } = props
	if (!damntable) return <Loading />

	return (
		<Paper styleName="root">
			<Table styleName="table">
				<TableHead>
					<TableRow>
						<TableCell>Rank</TableCell>
						<TableCell>Username</TableCell>
						<TableCell>Name</TableCell>
						<TableCell>Date of join</TableCell>
						<TableCell>Damns</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{damntable.sort((u1, u2) => u2.damns - u1.damns).map((entry, index) => {
						return (
							<TableRow key={index}>
								<TableCell>#{index + 1}</TableCell>
								<TableCell>{entry.username}</TableCell>
								<TableCell>{entry.name}</TableCell>
								<TableCell>{new Date(entry.doj).toDateString()}</TableCell>
								<TableCell>{entry.damns}</TableCell>
							</TableRow>
						)
					})}
				</TableBody>
			</Table>
		</Paper>
	)
}

let com: any = css(styles, { handleNotFoundStyleName: 'log' })(DamnTable)
com = Component({ headerTitle: 'Damn Table', title: 'Damn Table' })(com)
com = connect(mapStateToProps, { getDamnTable })(com)

export default com