/**
 * Created by Moyu on 16/10/20.
 */
import React from 'react';
import {Link} from 'react-router'
import {Map} from 'immutable'
import {renderFrame, positiveHashCode} from "../../common/utils";

class Article extends React.Component {
    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return !Map(this.props).equals(Map(nextProps));
    }

    static defaultProps = {
        showBack: false,
        tags: [],
        method: "_blank"
    }
    componentWillMount() {
        // document.body.scrollTop = 0;
    }
    componentDidMount() {
        document.body.scrollTop = 0;
        // this.refs.main.style.visibility = 'hidden';
        setTimeout(()=> {
            if(this.refs.main) {
                this.refs.main.classList.remove('animated')
                this.refs.main.classList.remove('fadeIn')
            }
            // this.refs.main.style.visibility = '';
        }, 1300)
    }
    componentWillUpdate(nextProps, nextState, nextContext) {

    }
    componentDidUpdate(prevProps, prevState)  {

    }

    render() {
        const {
            title, showBack, date, realDate, tags, cover, content, profile, method, mDate,
            publisher, author_img, author_name, author_url, summary, logo, hrefTitle
        } = this.props;
        return (
            <article ref="main" className="fadeIn animated" itemScope itemType="//schema.org/Article">
                <header className="section-padding--lg mast">
                {
                    !!showBack &&
                    <Link className="nav nav--white" to="/">
                      <i className="fa fa-lg fa-arrow-left"></i>
                      <span>Back to Posts</span>
                    </Link>
                }
                    <figure className="absolute-bg mast__img" style={{backgroundImage: cover&&"url("+cover+")"}}></figure>
                    <div className="mast__container">
                        <span>
                            <time itemProp="datePublished" dateTime={realDate} content={realDate} >{date}</time>
                            <time itemProp="dateModified" dateTime={mDate} content={mDate} style={{display: 'none'}} >{mDate}</time>
                        </span>
                        <div itemType="//schema.org/Organization" itemScope style={{display: 'none'}} itemProp="publisher">
                            <meta itemProp="name" content={publisher}/>
                            <span itemProp="logo" itemType="//schema.org/imageObject" itemScope>
                                <meta itemProp="url" content={logo} />
                            </span>
                        </div>
                        <meta itemProp="mainEntityOfPage" content={"/article/"+hrefTitle} />
                        <div itemType="//schema.org/Person" itemScope style={{display: 'none'}} itemProp="author">
                            <meta itemProp="name" content={author_name}/>
                            <meta itemProp="url" content={author_url}/>
                            <span itemProp="image" itemScope itemType="//schema.org/imageObject">
                                <meta itemProp="url" content={author_img}/>
                            </span>
                        </div>
                        <div itemType="//schema.org/imageObject" itemScope style={{display: 'none'}} itemProp="image">
                            <img itemProp="url" src={cover} title={title} alt={title} />
                            <meta itemProp="width" content="500"/>
                            <meta itemProp="height" content="500"/>
                        </div>
                        <meta itemProp="description" content={summary}/>
                        <h1 itemProp="name headline">{title}</h1>
                        <ul className="tags">
                            {tags && tags.map(tag => 
                                tag &&
                                <li key={tag} itemProp="about" itemScope itemType="https://schema.org/Thing">
                                    <Link itemProp="url" rel="tag" to={"/tags/"+tag}><span itemProp="name">{tag}</span></Link>
                                </li>
                            )}
                        </ul>
                    </div>
                </header>
                <section itemProp="articleBody" className="section-padding markdown-body animated fadeIn" dangerouslySetInnerHTML={{__html: content}}></section>
                {
                    !!profile &&
                    <section className="profile">
                        <div className="profile__card">
                            <div className="profile__img">
                                <figure className="absolute-bg" style={{backgroundImage: profile.image&&"url("+profile.image+")"}}></figure>
                            </div>
                            <div className="profile__container">
                                <p itemProp="description" dangerouslySetInnerHTML={{__html: profile.contentHtml}}></p>
                                <ul className="profile__social">
                                    {
                                        Array.isArray(profile.icons) &&
                                        profile.icons.map(icon=>
                                            <li key={icon.key}>
                                                <a target={method} className={"fa fa-lg fa-"+icon.key} href={icon.url}></a>
                                            </li>
                                        )
                                    }
                                </ul>
                            </div>
                        </div>
                    </section>
                }
            </article>
        )
    }
}


export default Article;