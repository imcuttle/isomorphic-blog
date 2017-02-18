/**
 * Created by Moyu on 16/10/20.
 */
import React from 'react';
import {Link} from 'react-router'
import {Map} from 'immutable'


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
            publisher, author_img, author_name, author_url, summary, logo
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
                            <time itemProp="datePublished" dateTime={realDate} content={realDate && realDate.substr(0, 10)} >{date}</time>
                            <time itemProp="dateModified" dateTime={mDate} content={mDate} style={{display: 'none'}} >{mDate}</time>
                        </span>
                        <div itemType="//schema.org/Organization" itemScope style={{display: 'none'}} itemProp="publisher">
                            <span itemProp="name">{publisher}</span>
                            <meta itemProp="logo" content={logo} />
                        </div>
                        <div itemType="//schema.org/Person" itemScope style={{display: 'none'}} itemProp="author">
                            <span itemProp="name">{author_name}</span>
                            <span itemProp="url">{author_url}</span>
                            <span itemProp="image" itemScope itemType="//schema.org/imageObject">
                                <span itemProp="url">{author_img}</span>
                            </span>
                        </div>
                        <div itemType="//schema.org/imageObject" itemScope style={{display: 'none'}} itemProp="image">
                            <img itemProp="url" src={cover} title={title} alt={title} />
                            <span itemProp="width">500</span><span itemProp="height">500</span>
                        </div>
                        <div style={{display: 'none'}} itemProp="description">{summary}</div>
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