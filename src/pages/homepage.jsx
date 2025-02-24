import React, { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet";

import { faMailBulk } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faTwitter,
	faGithub,
	faStackOverflow,
	faInstagram,
} from "@fortawesome/free-brands-svg-icons";

import Logo from "../components/common/logo";
import Footer from "../components/common/footer";
import NavBar from "../components/common/navBar";
import Article from "../components/homepage/article";
import Works from "../components/homepage/works";
import AllProjects from "../components/projects/allProjects";

import INFO from "../data/user";
import SEO from "../data/seo";
import myArticles from "../data/articles";

import "./styles/homepage.css";

const Homepage = () => {
	const [stayLogo, setStayLogo] = useState(false);
	const [logoSize, setLogoSize] = useState(80);
	const [oldLogoSize, setOldLogoSize] = useState(80);
	
	// Cursor following dot states
	const canvasRef = useRef(null);
	const mouseRef = useRef({ x: 0, y: 0 });
	const dotsRef = useRef([]);
	const requestRef = useRef();
	const [isHovering, setIsHovering] = useState(false);

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	// Initialize canvas for cursor effect
	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const handleResize = () => {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
		};

		handleResize();
		window.addEventListener('resize', handleResize);

		// Initialize dots
		const dotCount = 12; // Number of dots in the trail
		const dots = [];
		
		for (let i = 0; i < dotCount; i++) {
			dots.push({
				x: 0,
				y: 0,
				size: 8 - (i * 0.5), // Progressively smaller dots
				color: `rgba(88, 101, 242, ${1 - i * 0.08})` // Fading opacity
			});
		}
		
		dotsRef.current = dots;

		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, []);

	// Handle mouse movement
	useEffect(() => {
		const handleMouseMove = (e) => {
			mouseRef.current = { x: e.clientX, y: e.clientY };
		};

		// Handle hover states
		const handleInteractiveElements = () => {
			const interactiveElements = document.querySelectorAll('a, button, .homepage-social-icon, .logo');
			
			interactiveElements.forEach(el => {
				el.addEventListener('mouseenter', () => setIsHovering(true));
				el.addEventListener('mouseleave', () => setIsHovering(false));
			});
		};

		window.addEventListener('mousemove', handleMouseMove);
		// Set up after a small delay to ensure all elements are mounted
		setTimeout(handleInteractiveElements, 500);

		return () => {
			window.removeEventListener('mousemove', handleMouseMove);
			const interactiveElements = document.querySelectorAll('a, button, .homepage-social-icon, .logo');
			interactiveElements.forEach(el => {
				el.removeEventListener('mouseenter', () => {});
				el.removeEventListener('mouseleave', () => {});
			});
		};
	}, []);

	// Animation loop for following dots
	useEffect(() => {
		if (!canvasRef.current) return;
		
		const ctx = canvasRef.current.getContext('2d');
		
		const animate = () => {
			ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
			
			const dots = dotsRef.current;
			
			// Each dot follows the previous one with a delay
			for (let i = dots.length - 1; i >= 0; i--) {
				if (i === 0) {
					// First dot follows the mouse with easing
					dots[i].x += (mouseRef.current.x - dots[i].x) * 0.3;
					dots[i].y += (mouseRef.current.y - dots[i].y) * 0.3;
				} else {
					// Other dots follow the previous dot
					dots[i].x += (dots[i-1].x - dots[i].x) * 0.3;
					dots[i].y += (dots[i-1].y - dots[i].y) * 0.3;
				}
				
				// Draw the dot
				ctx.beginPath();
				
				// If hovering over interactive element, make dots expand
				const size = isHovering ? dots[i].size * 1.5 : dots[i].size;
				
				ctx.arc(dots[i].x, dots[i].y, size, 0, Math.PI * 2);
				ctx.fillStyle = dots[i].color;
				ctx.fill();
			}
			
			requestRef.current = requestAnimationFrame(animate);
		};
		
		requestRef.current = requestAnimationFrame(animate);
		
		return () => {
			cancelAnimationFrame(requestRef.current);
		};
	}, [isHovering]);

	useEffect(() => {
		const handleScroll = () => {
			let scroll = Math.round(window.pageYOffset, 2);

			let newLogoSize = 80 - (scroll * 4) / 10;

			if (newLogoSize < oldLogoSize) {
				if (newLogoSize > 40) {
					setLogoSize(newLogoSize);
					setOldLogoSize(newLogoSize);
					setStayLogo(false);
				} else {
					setStayLogo(true);
				}
			} else {
				setLogoSize(newLogoSize);
				setStayLogo(false);
			}
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, [logoSize, oldLogoSize]);

	const currentSEO = SEO.find((item) => item.page === "home");

	const logoStyle = {
		display: "flex",
		position: stayLogo ? "fixed" : "relative",
		top: stayLogo ? "3vh" : "auto",
		zIndex: 999,
		border: stayLogo ? "1px solid white" : "none",
		borderRadius: stayLogo ? "50%" : "none",
		boxShadow: stayLogo ? "0px 4px 10px rgba(0, 0, 0, 0.25)" : "none",
	};

	return (
		<React.Fragment>
			<Helmet>
				<title>{INFO.main.title}</title>
				<meta name="description" content={currentSEO.description} />
				<meta
					name="keywords"
					content={currentSEO.keywords.join(", ")}
				/>
				<style>
					{`
						body {
							cursor: none;
						}
						a, button, .homepage-social-icon, .logo {
							cursor: none;
						}
					`}
				</style>
			</Helmet>

			{/* Canvas for cursor effect */}
			<canvas 
				ref={canvasRef} 
				style={{
					position: 'fixed',
					top: 0,
					left: 0,
					pointerEvents: 'none',
					zIndex: 9999
				}}
			/>

			<div className="page-content">
				<NavBar active="home" />
				<div className="content-wrapper">
					<div className="homepage-logo-container">
						<div style={logoStyle} className="logo">
							<Logo width={logoSize} link={false} />
						</div>
					</div>

					<div className="homepage-container">
						<div className="homepage-first-area">
							<div className="homepage-first-area-left-side">
								<div className="title homepage-title">
									{INFO.homepage.title}
								</div>

								<div className="subtitle homepage-subtitle">
									{INFO.homepage.description}
								</div>
							</div>

							<div className="homepage-first-area-right-side">
								<div className="homepage-image-container">
									<div className="homepage-image-wrapper">
										<img
											src="hp.jpg"
											alt="about"
											className="homepage-image"
										/>
									</div>
								</div>
							</div>
						</div>

						<div className="homepage-socials">
							<a
								href={INFO.socials.twitter}
								target="_blank"
								rel="noreferrer"
							>
								<FontAwesomeIcon
									icon={faTwitter}
									className="homepage-social-icon"
								/>
							</a>
							<a
								href={INFO.socials.github}
								target="_blank"
								rel="noreferrer"
							>
								<FontAwesomeIcon
									icon={faGithub}
									className="homepage-social-icon"
								/>
							</a>
							<a
								href={INFO.socials.stackoverflow}
								target="_blank"
								rel="noreferrer"
							>
								<FontAwesomeIcon
									icon={faStackOverflow}
									className="homepage-social-icon"
								/>
							</a>
							<a
								href={INFO.socials.instagram}
								target="_blank"
								rel="noreferrer"
							>
								<FontAwesomeIcon
									icon={faInstagram}
									className="homepage-social-icon"
								/>
							</a>
							<a
								href={`mailto:${INFO.main.email}`}
								target="_blank"
								rel="noreferrer"
							>
								<FontAwesomeIcon
									icon={faMailBulk}
									className="homepage-social-icon"
								/>
							</a>
						</div>

						<div className="homepage-projects">
							<AllProjects />
						</div>

						<div className="homepage-after-title">
							<div className="homepage-articles">
								{myArticles.map((article, index) => (
									<div
										className="homepage-article"
										key={(index + 1).toString()}
									>
										<Article
											key={(index + 1).toString()}
											date={article().date}
											title={article().title}
											description={article().description}
											link={"/article/" + (index + 1)}
										/>
									</div>
								))}
							</div>

							<div className="homepage-works">
								<Works />
							</div>
						</div>

						<div className="page-footer">
							<Footer />
						</div>
					</div>
				</div>
			</div>
		</React.Fragment>
	);
};

export default Homepage;