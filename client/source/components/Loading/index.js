import React from 'react'
import styles from './styles.scss'
import css from 'react-css-modules'
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

const material = theme => ({
	progress: {
	  margin: theme.spacing.unit * 2,
	},
  })

@withStyles(material)
@css(styles)
export default class Loading extends React.Component {
    render() {
		const { classes } = this.props
        return (
            <div styleName="applicationLoader">
				<CircularProgress className={classes.progress} size={50} />
			</div>
        )
    }
}