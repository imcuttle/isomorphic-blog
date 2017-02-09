/**
 * Created by Moyu on 16/10/20.
 */
import React from 'react'
import fetch from 'isomorphic-fetch'

export const isBrowser = (() => !(typeof process === 'object' && typeof process.versions === 'object' && typeof process.versions.node !== 'undefined'))();


export const isTagsRootPath = (pathname) => /^\/?tags\/?$/.test(pathname)
export const isTagsPagesPath = (pathname) => /^\/?tags\/pages\/\d+$/.test(pathname)
export const isTagsPath = (pathname) => /^\/?tags\/.+$/.test(pathname)
export const isRootPath = pathname => pathname === '/'
export const isPostsPath = pathname => /^\/?posts\/?$/.test(pathname) || /^\/?posts\/\d+$/.test(pathname)
export const isArticlePath = pathname => /^\/?article\/.+$/.test(pathname)
export const isArchivePath = pathname => /^\/?archive\/?.*$/.test(pathname)


export const redirectPath = "/posts/1"

export const renderFrame = (childs) =>
    <main>
        <section className="previews">
            {
                React.Children.map(childs, function(child, i) {
                        return React.cloneElement(child, {
                            key: i
                        })
                    }
                )
            }
        </section>
    </main>


export const hashCode = str => {
    var hash = 0;
    if (!str) return hash;
    for (var i = 0; i < str.length; i++) {
        var char = str.charCodeAt(i);
        hash = ((hash<<5)-hash)+char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
}

export const positiveHashCode = str => Math.abs(hashCode(str))

var loadEl;

export const checkJsonThenLog = ({code, result}) => {
    if (code != 200) {
        process.env.NODE_ENV == 'development' && console.log(result);
        return false;
    }
    return true;
}

export const isIE = () => {
  var myNav = navigator.userAgent.toLowerCase();
  return (myNav.indexOf('msie') != -1) ? parseInt(myNav.split('msie')[1]) : false;
}

const transitionEvent = (function whichTransitionEvent() {
    var t,
        el = document.createElement('surface'),
        transitions = {
            'transition':'transitionend',
            'OTransition':'oTransitionEnd',
            'MozTransition':'transitionend',
            'WebkitTransition':'webkitTransitionEnd'
        }
    for(t in transitions) {
        if( el.style[t] !== undefined ){
            return transitions[t];
        }
    }
})()

export const loaded = () => {
    var isie = isIE();
    // if (!isBrowser) return;
    loadEl = loadEl || document.getElementById(isie?'loading':'loading-container');
    return new Promise((resolve) => {
        if(!transitionEvent)
            loadEl.style.display = 'none';
        else {
            loadEl.addEventListener(transitionEvent, function func(e) {
                e.target.removeEventListener(transitionEvent, func, false);
                loadEl.style.display = 'none';
                resolve();
            }, false);
            if(isie) {
                // ie, set loading element opacity, trigger transitionEnd event;
                loadEl.style.opacity = 0;
            } else {
                // not ie, loading-container height=0, fadeOuted , then children will hide
                // better performance
                loadEl.classList.add('fadeOut');
                setTimeout(resolve.bind(), 400);
            }
        }

    })

}
