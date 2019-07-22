import React, { useState } from 'react'
import css from 'react-css-modules'
import styles from './styles.scss'

interface comment {
	id: string
	author: string
	comment: string
	date: string
	avatar: string
	upvotes: number
}

interface CommentSystemProps {
	postComment(comment: string): void
	voteComment?(id: string): void
	comments: comment[]
	profilepic: string
}

function CommentSystem(props: CommentSystemProps) {

	const [comment, setComment] = useState<string>('')

	function postComment() {
		if(comment && comment.trim() !== '') {
			props.postComment(comment)
			setComment('')
		}
	}

	function upVote(id: string) {
		props.voteComment(id) // mainslug, topicslug, creator, id, action
	}

	/*downVote(id) {
		this.props.voteComment({ ...this.props.urlprops, id, action: 'downvote' })
	}*/


	const comments = props.comments || []

	return (
		<div styleName="comments-parent">
			<div styleName="n60">
				<div styleName="comment-count">{ comments.length } Comment{comments.length == 1 ? '' : 's'}</div>
				<div styleName="social-icons"></div>

				<div styleName="add-comment">
					<img src={props.profilepic} styleName="avatar" />
					<div styleName="textbox">
						<textarea placeholder="Join the discussion (markdown enabled)" value={comment} onChange={ e => setComment(e.target.value)}></textarea>
						<div styleName="textbox-footer">
							<div styleName="other-buttons"></div>
							<div styleName="submit-comment" onClick={_ => postComment()}>Post Comment</div>
						</div>
					</div>
				</div>

				<div styleName="comments">
					{comments.map((comment, i) => (<div key={comment.id} styleName="comment">
						<div styleName="main-comment">
							<img styleName="author-pic" src={ comment.avatar } />
							<h2 styleName="author-name">{ comment.author }</h2>
							<h3 styleName="date-of-publish">{new Date(+comment.date).toDateString()}</h3>
							<p styleName="content">{comment.comment}</p>
							{/*<div styleName="votes">
								<div styleName="upvote" onClick={_ => this.upVote(comment.id)}>&#x25B2; ({comment.upvotes || 0 })</div>
								<div styleName="downvote" onClick={_ => this.downVote(comment.id)}>&#x25BC; ({comment.downvotes || 0})</div>
								<div styleName="reply">Reply</div>
							</div>*/}
						</div>

						{/*<div styleName="replies"></div>*/}
					</div>)) }
				</div>
			</div>
		</div>
	)
}

export default css(styles, { handleNotFoundStyleName: 'log' })(CommentSystem)