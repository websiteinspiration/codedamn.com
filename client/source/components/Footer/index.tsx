import React from 'react'
import { Link } from 'react-router-dom'
import styles from './styles.scss'
import css from 'react-css-modules'


function Footer(props) {
	return (
		<footer styleName="footer-wrapper">
				<div styleName="footerimg">
					<img src="/assets/images/logo.jpg" />
				</div>
				<div styleName="officiallinks">
					<h3>codedamn</h3>
					<ul>
						<li><a target="_blank" href="https://blog.codedamn.com">Blog</a></li>
						<li><a target="_blank" href="https://www.youtube.com/c/codedamn">YouTube</a></li>
						<li><a target="_blank" href="http://bit.ly/codedamn-android">Android App</a></li>
						<li><a target="_blank" href="https://bit.ly/codedamn-ios">iOS App</a></li>
					</ul>
				</div>
				<div styleName="internallinks">
					<h3>Quick Links</h3>
					<ul>
						<li><Link to={'/privacy-policy'}>Privacy Policy</Link></li>
						<li><Link to={'/feedback'}>Contact</Link></li>
					</ul>
				</div>
				<div styleName="sociallinks">
					<ul>
						<li><a target="_blank" href="https://www.facebook.com/codedamn.com">Facebook</a></li>
						<li><a target="_blank" href="https://www.twitter.com/codedamncom">Twitter</a></li>
						<li><a target="_blank" href="https://www.instagram.com/codedamn">Instagram</a></li>
						<li><a target="_blank" href="https://github.com/codedamn">GitHub</a></li>
					</ul>

					<p>Copyright &copy; codedamn&trade; 2015-{new Date().getFullYear()} | All Rights Reserved.</p>
				</div>
		</footer>	
	)
}

export default css(styles, { allowMultiple: true })(Footer)