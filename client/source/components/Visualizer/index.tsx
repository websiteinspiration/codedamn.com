import React, { useEffect } from 'react'
import { getTimelineInfo } from 'reducers/learn/actions'
import { connect } from 'react-redux'
import Loading from 'components/Loading'

function Visualizer(props) {

	useEffect(() => {
		props.getTimelineInfo({
			slug: props.slug
		})
		window.scrollTo(0,0)
    }, [])

    if(!props.currentTimeline) {
        return <Loading from="visualizer" />
    }

    const { flow } = props.currentTimeline

    props.history.push(props.slug+'/'+flow[0].slug)

	return <Loading />
}

const mapStateToProps = ({learn},{match:{params}}) => ({
	slug: params.slug,
	currentTimeline: learn.currentTimeline,
	userflow: learn.userflow
})

export default connect(mapStateToProps, { getTimelineInfo })(Visualizer)